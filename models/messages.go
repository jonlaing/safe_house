package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

// Message is an P2P encrypted message
type Message struct {
	ID                uint64    `json:"id" gorm:"primary_key"`
	UserID            uint64    `json:"user_id"`
	ThreadID          uint64    `json:"thread_id" binding:"required"`
	EncryptedMessage  []byte    `json:"encrypted_message" binding:"required"`   // Encrypted with the recipient's public key
	SenderCopyMessage []byte    `json:"sender_copy_message" binding:"required"` // Encryped with the sender's public key
	Read              bool      `json:"-"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
	IsMe              bool      `json:"is_me" sql:"-"`
}

// GetMessagesAfter gets all the messages in a thread after a certain point
func GetMessagesAfter(userID, threadID uint64, after time.Time, db *gorm.DB) (msgs []Message, err error) {
	err = db.Where("thread_id = ? AND created_at >= ?::timestamp", threadID, after).Order("created_at DESC").Find(&msgs).Error

	if len(msgs) == 0 {
		return
	}

	for k := range msgs {
		msgs[k].IsMe = msgs[k].UserID == userID
	}

	return
}

// MarkAllMessagesRead marks all of the other user's messages read
func MarkAllMessagesRead(userID, threadID uint64, db *gorm.DB) error {
	return db.Table("messages").Where("user_id != ? AND thread_id = ?", userID, threadID).UpdateColumn("read", true).Error
}
