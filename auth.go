package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"safe_house/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/nu7hatch/gouuid"
)

const hmacKeyPath = "keys/hmac.key"

var hmacKey []byte

func init() {
	var err error
	hmacKey, err = ioutil.ReadFile(hmacKeyPath)
	if err != nil {
		// hmac doesn't exist, let's create one!
		secret, err := uuid.NewV4()
		if err != nil {
			panic(fmt.Sprintf("Couldn't generate hmac key: %v", err))
		}

		h := hmac.New(sha256.New, []byte(secret.String()))

		// create the file to write to
		file, err := os.Create(hmacKeyPath)
		if err != nil {
			panic(fmt.Sprintf("Couldn't open hmac key file for writing: %v", err))
		}
		defer file.Close() // definitely make sure to close it

		// write the hash to the file
		if _, err := io.Copy(h, file); err != nil {
			panic(fmt.Sprintf("Couldn't write hmac key to file: %v", err))
		}

		// try reading again, if not, we fucked up
		hmacKey, err = ioutil.ReadFile(hmacKeyPath)
		if err != nil {
			panic("couldn't read hmac file")
		}
	}
}

// Auth is middleware for authenticating users requests
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokn := c.Request.Header.Get("X-Auth-Token")

		if len(tokn) <= 0 {
			// this might be a websocket request, so check the get variables
			t, ok := c.GetQuery("token")
			if !ok {
				c.AbortWithError(http.StatusUnauthorized, ErrNoTokenHeader)
				return
			}

			// for whatever reason, Go won't let me set tokn above, some sort
			// of scoping issue, so I have to do this crap
			tokn = t
		}

		// parsingKey is a func defined further down in this file
		token, err := jwt.Parse(tokn, parsingKey)
		if err != nil {
			c.AbortWithError(http.StatusUnauthorized, ErrParseToken)
			return
		}

		// Check this is the right user with correct API key
		db := GetDB(c)
		k := token.Claims["api_key"].(string)
		user, err := models.GetUserByAPIKey(k, db)
		if err != nil {
			c.AbortWithError(http.StatusUnauthorized, err)
			return
		}

		// Update the expiration time
		if err := user.UpdateAPIKey(); err != nil {
			c.AbortWithError(http.StatusNotAcceptable, err)
			return
		}

		if err := db.Save(&user).Error; err != nil {
			c.AbortWithError(http.StatusNotAcceptable, err)
			return
		}

		c.Set("user", user)
		c.Next() // continue on to next endpoint
	}
}

// Login a user
func Login(user *models.User, c *gin.Context) (tokenString string, err error) {
	db := GetDB(c)
	// Get the APIKey, or generate a new one. Update the expiration time
	if err := user.UpdateAPIKey(); err != nil {
		return "", err
	}

	// Save the user
	if err := db.Save(&user).Error; err != nil {
		return "", err
	}

	// Make the token
	token := jwt.New(jwt.SigningMethodHS256)

	// Set some claims
	token.Claims["api_key"] = user.APIKey

	// Sign and get the complete encoded token as a string
	tokenString, err = token.SignedString(hmacKey)
	if err != nil {
		err = ErrAuthToken
	}

	return
}

// CurrentUser gets the current user from the context
func CurrentUser(c *gin.Context) (u models.User, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = ErrNoUser
		}
	}()

	user, ok := c.Get("user")
	if !ok {
		err = ErrNoUser
		return
	}

	u = user.(models.User)

	return
}

// returns the signing key to parse the token
func parsingKey(token *jwt.Token) (interface{}, error) {
	// Don't forget to validate the alg is what you expect:
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, ErrUnexpectedSigningMethod{token.Header["alg"]}
	}

	return hmacKey, nil
}
