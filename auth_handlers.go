package main

import "github.com/gin-gonic/gin"

type LoginFields struct {
	Username
}

func LoginHandler(c *gin.Context) {
	token, err := Login()
}
