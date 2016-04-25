package main

import (
	"safe_house/location"
	"safe_house/models"
	"strconv"

	"net/http"

	"github.com/gin-gonic/gin"
)

type searchParams struct {
	Latitude  float64                `json:"latitude"`
	Longitude float64                `json:"longitude"`
	Unit      location.Unit          `json:"unit"`
	Distance  float64                `json:"distance"`
	Capacity  int                    `json:"capacity"`
	Duration  models.HousingDuration `json:"duration"`
	Page      int                    `json:"page"`
}

// MatchesList takes a JSON post and searches for matches based on those parameters.
// It is a POST request for security purposes. Otherwise, geolocation data would be sent
// as GET request variables and could possibly be sniffed on by nefarious types
func MatchesList(c *gin.Context) {
	db := GetDB(c)

	currentUser, err := CurrentUser(c)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	var search searchParams
	if err := c.BindJSON(&search); err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	distance := location.NewDistancer(search.Distance, search.Unit)

	users, err := models.ListMatches(currentUser.Capacity, search.Duration, search.Latitude, search.Longitude, distance, search.Page, db)
	if err != nil {
		c.AbortWithError(http.StatusNotFound, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}

// MatchesShow essentially shows a user's "profile"
func MatchesShow(c *gin.Context) {
	db := GetDB(c)

	userParam := c.Param("user_id")
	userID, err := strconv.Atoi(userParam)
	if err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	user, err := models.GetUserByID(uint64(userID), db)
	if err != nil {
		c.AbortWithError(http.StatusNotFound, err)
		return
	}

	c.JSON(http.StatusOK, user)
}
