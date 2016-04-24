package main

import (
	"log"
	"safe_house/models"

	"github.com/gin-gonic/gin"
)

// UserShow reponds with the current user
func UserShow(c *gin.Context) {
	currentUser, err := CurrentUser(c)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	c.JSON(http.OK, currentUser)
}

// UserCreate takes a JSON representation of a user and tries to create one.
// It validates, generates coordinates, and if everything goes well, it returns
// the full user and an authentication token
func UserCreate(c *gin.Context) {
	db, err := GetDB(c)
	if err != nil {
		log.Println("Error finding database", err)
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.AbortWithError(http.StatusUnacceptable, err)
		return
	}

	if errs := user.Validate(); len(errs) > 0 {
		c.JSON(http.StatusUnacceptable, gin.H{"validation_errors": errs.ToMap()})
		return
	}

	// Only generate coordinates if this user is offering housing
	if user.Type == models.UTHousing {
		if err := user.GenCoordinates(); err != nil {
			c.AbortWithError(http.StatusUnacceptable, err)
			return
		}
	}

	if err := db.Create(&user).Error; err != nil {
		c.AbortWithError(http.StatusUnacceptable, err)
		return
	}

	// We should be all good, so log in the user
	token, err := Login(user)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"token": token, "user": user})
}

// UserUpdate takes a JSON representation of a user, merges it with the current user,
// validates and saves.
func UserUpdate(c *gin.Context) {
	db, err := GetDB(c)
	if err != nil {
		log.Println("Error finding database", err)
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	currentUser, err := CurrentUser(c)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.AbortWithError(http.StatusUnacceptable, err)
		return
	}

	currentUser.Merge(user)
	if errs := currentUser.Validate(); len(errs) > 0 {
		c.JSON(http.StatusUnacceptable, gin.H{"validation_errors": errs.ToMap()})
		return
	}

	// If the user updated their postal code, regenerate coordinates
	if user.PostalCode != "" && currentUser.Type == models.UTHousing {
		if err := currentUser.GenCoordinates(); err != nil {
			c.AbortWithError(http.StatusUnacceptable, err)
			return
		}
	}

	if err := db.Save(&currentUser).Error; err != nil {
		c.AbortWithError(http.StatusUnacceptable, err)
		return
	}

	c.JSON(http.StatusOK, currentUser)
}

// UserDelete deletes the current user
func UserDelete(c *gin.Context) {
	db, err := GetDB(c)
	if err != nil {
		log.Println("Error finding database", err)
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	currentUser, err := CurrentUser(c)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	if err := db.Delete(&currentUser).Error; err != nil {
		c.AbortWithError(http.StatusUnacceptable, err)
		return
	}

	c.Status(http.StatusOK)
}
