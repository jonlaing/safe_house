package main

import (
	"net/http"
	"safe_house/models"

	"github.com/gin-gonic/gin"
)

// LoginFields represent a JSON binding format for login requests
type LoginFields struct {
	Username  string `json:"username" binding:"required"`
	Password  string `json:"password" binding:"required"`
	PublicKey string `json:"public_key" binding:"required"`
}

// LoginHandler takes a JSON request, authenticates the user, then responds with the user info and a token
func LoginHandler(c *gin.Context) {
	db := GetDB(c)

	var login LoginFields
	if err := c.BindJSON(&login); err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	user, err := models.GetUserByName(login.Username, db)
	if err != nil {
		c.AbortWithError(http.StatusNotFound, err)
		return
	}

	if err := user.Authenticate(login.Password); err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	token, err := Login(&user, c)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	if login.PublicKey != user.PublicKey {
		if err := user.UpdatePublicKey(login.PublicKey, db); err != nil {
			c.AbortWithError(http.StatusNotAcceptable, err)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}

func LogoutHandler(c *gin.Context) {
}
