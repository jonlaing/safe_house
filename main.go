package main

import (
	"log"
	"net/http"
	"os"
	"safe_house/models"
	"time"

	"github.com/gin-gonic/gin"
)

func init() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
}

func main() {
	r := gin.Default()
	r.Use(DB())
	// recover from panics with a 500
	r.Use(func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				c.AbortWithStatus(http.StatusInternalServerError)
				log.Println("Recovered Panic (main.go):", r)
			}
		}()

		c.Next()
	})

	// AUTH ROUTES
	{
		r.POST("login", LoginHandler)
		r.GET("logout", LogoutHandler)
		r.POST("signup", UserCreate)
	}

	user := r.Group("user")
	user.Use(Auth())
	{
		user.GET("/", UserShow) // Show the current user
		user.PATCH("/", UserUpdate)
		user.DELETE("/", UserDelete)
	}

	matches := r.Group("matches")
	matches.Use(Auth())
	{
		matches.POST("/", MatchesList)
		matches.POST("/:user_id", MatchesShow)
	}

	threads := r.Group("threads")
	threads.Use(Auth())
	{
		threads.GET("/", MessageThreadIndex)
		threads.POST("/", MessageThreadCreate)
		threads.GET("/:user_id", MessageThreadShow)
		threads.PATCH("/:thread_id/accept", MessageThreadStatus(models.MTOpened))
		threads.PATCH("/:thread_id/close", MessageThreadStatus(models.MTClosed))
		threads.PATCH("/:thread_id/block", MessageThreadStatus(models.MTBlocked))
		threads.PATCH("/:thread_id/public_key", MessageThreadStatus(models.MTPubKeyChange))
	}

	messages := r.Group("messages")
	messages.Use(Auth())
	{
		messages.GET("/:thread_id", MessageIndex)
		messages.POST("/:thread_id", MessageCreate)
		messages.GET("/:thread_id/subscribe", MessageThreadSubscribe)
	}

	Database.AutoMigrate(
		&models.User{},
		&models.MessageThread{},
		&models.MessageThreadUser{},
		&models.Message{},
	)

	s := &http.Server{
		Addr:           ":" + os.Getenv("PORT"),
		Handler:        r,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   3 * time.Minute,
		MaxHeaderBytes: 1 << 20,
	}
	s.ListenAndServe()
}
