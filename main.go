package main

import (
	"log"
	"net/http"
	"os"
	"safe_house/models"
	"time"

	"github.com/gin-gonic/gin"
)

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
		r.POST("signUp", UserCreate)
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
		matches.GET("/:user_id", MatchesShow)
	}

	messages := r.Group("messages")
	messages.Use(Auth())
	{
		messages.GET("/", MessageThreadIndex)
		messages.POST("/", MessageThreadCreate)
		messages.GET("/:thread_id", MessageThreadShow)
		messages.PATCH("/:thread_id", MessageThreadUpdate)
		messages.POST("/:thread_id", MessageCreate)
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
