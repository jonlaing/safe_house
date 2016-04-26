package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"safe_house/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/jinzhu/gorm"
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func MessageThreadSubscribe(c *gin.Context) {
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

	conn, err := wsupgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Failed to set websocket upgrade:", err)
		return
	}

	msg := make(chan string)
	quit := make(chan bool)

	go messageReadLoop(conn, msg, quit)
	go messageWriteLoop(user.ID, threadID, db, conn, msg, quit)
}

func messageReadLoop(c *websocket.Conn, send chan string, quit chan bool) {
	for {
		sMsgType, r, err := c.NextReader()
		if err != nil {
			c.Close()
			quit <- true
			return
		}

		if sMsgType == websocket.BinaryMessage {
			log.Println("MessageSocket message shouldn't be a binary")
		}

		stamp, err := ioutil.ReadAll(r)
		if err != nil {
			log.Println("couldn't read timestamp", r)
		}

		send <- string(stamp)
	}
}

func messageWriteLoop(userID, threadID uint64, db *gorm.DB, c *websocket.Conn, received chan string, quit chan bool) {
	for {
		select {
		case stamp := <-received:
			sec, err := strconv.Atoi(stamp)
			if err != nil {
				log.Println("bad timestamp:", string(stamp))
			}

			after := time.Unix(int64(sec), int64(0))

			msgs, err := models.GetMessagesAfter(userID, threadID, after, db)
			if err != nil {
				c.WriteJSON(gin.H{"messages": []models.Message{}})
			}

			if err := c.WriteJSON(gin.H{"messages": msgs}); err != nil {
				return
			}

			err = models.MarkAllMessagesRead(userID, uint64(threadID), db)
			if err != nil {
				log.Println("Error marking messages read:", userID, threadID, err)
			}
		case <-quit:
			return // kill the loop
		}
	}
}
