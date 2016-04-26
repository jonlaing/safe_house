package main

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

// ParamID gets a resource id from the context and parses it to uint64
func ParamID(tag string, c *gin.Context) (uint64, error) {
	s := c.Param(tag)
	id, err := strconv.Atoi(s)
	if err != nil {
		return 0, ErrIDFormat
	}

	return uint64(id), nil
}
