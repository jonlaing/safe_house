package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"partisan/models"
	"strconv"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
)

const hmacKeyPath = "keys/hmac.key"

var hmacKey []byte

func init() {
	var err error
	hmacKey, err = ioutil.ReadFile(hmacKeyPath)
	if err != nil {
		panic(err)
	}
}

// Auth is middleware for authenticating users requests
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		sess := sessions.Default(c)
		tokn, ok := c.Request.Header["X-Auth-Token"]

		if !ok {
			c.AbortWithError(http.StatusUnauthorized, ErrNoTokenHeader)
			return
		}

		var userID int

		// parsingKey is a func defined further down in this file
		token, err := jwt.Parse(tokn[0], parsingKey)
		if err != nil {
			c.AbortWithError(http.StatusUnauthorized, ErrParseToken)
			return
		}

		userID, err = strconv.Atoi(fmt.Sprintf("%.f", token.Claims["user_id"]))
		if err != nil {
			c.AbortWithError(http.StatusUnauthorized, err)
			return
		}

		// Check this is the right user with correct API key
		db := GetDB(c)
		user, err := models.GetUserByID(userID)
		if err != nil {
			c.AbortWithError(http.StatusUnauthorized, models.ErrUserNotFound)
			return
		}

		c.Set("user", user)
		c.Next() // continue on to next endpoint
	}
}

// Login a user
func Login(user m.User, c *gin.Context) (tokenString string, err error) {
	token := jwt.New(jwt.SigningMethodHS256)

	// Set some claims
	token.Claims["user_id"] = user.ID
	token.Claims["api_key"] = user.APIKey

	// Sign and get the complete encoded token as a string
	tokenString, err = token.SignedString(hmacKey)
	if err != nil {
		err = ErrAuthToken
	}

	return
}

// CurrentUser gets the current user from the context
func CurrentUser(c *gin.Context) (u m.User, err error) {
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

	u = user.(m.User)

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
