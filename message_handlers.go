package main

import (
	"net/http"
	"safe_house/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

// messages.GET("/", MessageThreadIndex)
// messages.POST("/", MessageThreadCreate)
// messages.GET("/:thread_id", MessageThreadShow)
// messages.PATCH("/:thread_id/accept", MessageThreadAccept)
// messages.PATCH("/:thread_id/close", MessageThreadClose)
// messages.PATCH("/:thread_id/block", MessageThreadBlock)
// messages.PATCH("/:thread_id/public_key", MessageThreadUserUpdate)
// messages.POST("/:thread_id", MessageCreate)

type threadCreateFields struct {
	UserID    uint64 `json:"user_id" binding:"required"`
	PublicKey string `json:"public_key" binding:"required"`
}

func MessageThreadIndex(c *gin.Context) {
	db := GetDB(c)

	user, err := CurrentUser(c)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	mts, err := models.GetMessageThreadsByUser(user, db)
	if err != nil {
		c.AbortWithError(http.StatusNotFound, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message_threads": mts})
}

func MessageThreadCreate(c *gin.Context) {
	db := GetDB(c)

	user, err := CurrentUser(c)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	var fields threadCreateFields
	if err := c.BindJSON(&fields); err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	// check if this user has already been blocked from requesting this chat
	if isBlocked, _ := models.UserIsBlocked(user, fields.UserID, db); isBlocked {
		c.AbortWithError(http.StatusUnauthorized, models.ErrUserBlocked)
		return
	}

	mt := models.MessageThread{}

	// Setting up the MessageThread
	mt.UserID = user.ID
	mt.Status = models.MTRequested
	mt.CreatedAt = time.Now()
	mt.UpdatedAt = time.Now()

	if err := db.Create(&mt).Error; err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	// Setting up the MessageThreadUser
	to, err := models.GetUserByID(fields.UserID, db)
	if err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	mtus := mt.NewMessageThreadUsers(user, to)
	if len(mtus) == 0 {
		c.AbortWithError(http.StatusNotAcceptable, models.ErrMessageThreadNoID)
		return
	}

	for k := range mtus {
		if err := db.Create(&mtus[k]).Error; err != nil {
			c.AbortWithError(http.StatusNotAcceptable, err)
			return
		}
	}

	c.JSON(http.StatusCreated, mt)
}

func MessageThreadShow(c *gin.Context) {
	db := GetDB(c)

	user, err := CurrentUser(c)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	threadID, err := ParamID("thread_id", c)
	if err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	mt, err := models.GetMessageThreadByID(threadID, db)
	if err != nil {
		c.AbortWithError(http.StatusNotFound, err)
		return
	}

	err = mt.GetRelatedUser(user.ID, db)
	if err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	// If we don't find any messages, that's fine, because there might
	// not be any messages in this thread. If it's a different error,
	// we need to abort.
	ms, err := mt.GetMessages(user.ID, db)
	if err != nil && err != gorm.ErrRecordNotFound {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
		// Continue if the records just weren't found
	}

	c.JSON(http.StatusOK, gin.H{"message_thread": mt, "messages": ms})
}

// MessageThreadStatus updates the user status. It's intended to be used in multiple
// enpoints. ex: `r.POST("/:thread_id/accept", MessageThreadStatus(models.MTOpened))`
func MessageThreadStatus(status models.ThreadStatus) gin.HandlerFunc {
	return func(c *gin.Context) {
		db := GetDB(c)

		user, err := CurrentUser(c)
		if err != nil {
			c.AbortWithError(http.StatusUnauthorized, err)
			return
		}

		threadID, err := ParamID("thread_id", c)
		if err != nil {
			c.AbortWithError(http.StatusNotAcceptable, err)
			return
		}

		mt, err := models.GetMessageThreadByID(threadID, db)
		if err != nil {
			c.AbortWithError(http.StatusNotFound, err)
			return
		}

		if err := mt.UpdateStatus(status, &user, db); err != nil {
			c.AbortWithError(http.StatusNotAcceptable, err)
			return
		}

		c.JSON(http.StatusOK, mt)
	}
}

func MessageCreate(c *gin.Context) {
	db := GetDB(c)

	user, err := CurrentUser(c)
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, err)
		return
	}

	threadID, err := ParamID("thread_id", c)
	if err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	mt, err := models.GetMessageThreadByID(threadID, db)
	if err != nil {
		c.AbortWithError(http.StatusNotFound, err)
		return
	}

	if !mt.CanMessage(user, db) {
		c.AbortWithError(http.StatusUnauthorized, models.ErrMessageThreadNotOpen)
		return
	}

	var message models.Message
	if err := c.BindJSON(&message); err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	message.ThreadID = mt.ID
	message.UserID = user.ID
	message.IsMe = true
	message.CreatedAt = time.Now()
	message.UpdatedAt = time.Now()

	if err := db.Create(&message).Error; err != nil {
		c.AbortWithError(http.StatusNotAcceptable, err)
		return
	}

	c.JSON(http.StatusCreated, message)
}
