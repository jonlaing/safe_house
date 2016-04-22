package main

import (
	"errors"
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

func Auth(redirectPath string) gin.HandlerFunc {
	return func(c *gin.Context) {
		sess := sessions.Default(c)
		tokn, ok := c.Request.Header["X-Auth-Token"]

		if !ok {
			c.AbortWithError(http.StatusUnauthorized, errors.New("X-Auth-Token must be in header"))
			return
		}

		var userID int

		token, err := jwt.Parse(tokn[0], func(token *jwt.Token) (interface{}, error) {
			// Don't forget to validate the alg is what you expect:
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			return hmacKey, nil
		})

		if err != nil {
			c.AbortWithError(http.StatusUnauthorized, fmt.Errorf("Problems parsing token"))
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
			c.AbortWithError(http.StatusUnauthorized, fmt.Errorf("Couldn't find user: %d", userID))
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

	return
}
