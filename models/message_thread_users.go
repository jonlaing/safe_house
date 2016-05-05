package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

// MessageThreadUser is a joining table between MessageThread, User, and Chat
type MessageThreadUser struct {
	ID        uint64    `json:"id" gorm:"primary_key"`
	ThreadID  uint64    `json:"thread_id" binding:"required"`
	UserID    uint64    `json:"user_id"`
	User      User      `json:"user" sql:"-"`
	PublicKey string    `json:"public_key" sql:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// UserIsBlocked determines whether a user has been blocked from a thread
func UserIsBlocked(u User, toID uint64, db *gorm.DB) (bool, error) {
	// first get all the thread ids for the "to" user
	var mtIDs []uint64
	err := db.Table("message_thread_users").
		Where("user_id = ?", toID).
		Pluck("thread_id", &mtIDs).
		Error
	if err != nil {
		return false, err
	}

	var count int
	err = db.Table("message_threads").
		Joins("left join message_thread_users on message_thread_users.thread_id = message_thread.id").
		Where("message_threads.id IN (?)", mtIDs).
		Where("message_threads.status = ?", MTBlocked).
		Where("message_thread_users.user_id = ?", u.ID).
		Count(&count).
		Error

	return count > 0, err
}

// GetThread get's the thread of a particular chat user
func (mtu *MessageThreadUser) GetThread(db *gorm.DB) (mt MessageThread, err error) {
	err = db.Where("id = ?", mtu.ThreadID).Find(&mt).Error
	return
}

// GetUser gets the associated user
func (mtu *MessageThreadUser) GetUser(db *gorm.DB) (u User, err error) {
	err = db.Where("id = ?", mtu.UserID).Find(&u).Error
	return
}

// GetOtherUser returns the MessageThreadUser of the other user in the chat
func (mtu *MessageThreadUser) GetOtherUser(db *gorm.DB) (other MessageThreadUser, err error) {
	err = db.Where("thread_id = ? AND user_id != ?", mtu.ThreadID, mtu.UserID).Find(&other).Error
	if err != nil {
		return
	}

	k, err := GetPublicKey(other.ID, db)
	if err != nil {
		return
	}

	other.PublicKey = k
	return
}

// // UpdatePublicKey updates a public key for a user, zeros out the other user's public key,
// // and updates the status of the message thread. The public key gets zeroed out, because
// // the other user needs to accept the chat again for security purposes. When the user accepts
// // the chat again, we will update their public key too.
// func (mtu *MessageThreadUser) UpdatePublicKey(k string, u *User, mt *MessageThread, db *gorm.DB) error {
// 	other, err := mtu.GetOtherUser(db)
// 	if err != nil {
// 		return err
// 	}

// 	mtu.PublicKey = k
// 	u.PublicKey = k
// 	mtu.UpdatedAt = time.Now()
// 	u.UpdatedAt = time.Now()

// 	other.PublicKey = ""
// 	other.UpdatedAt = time.Now()

// 	mt.Status = MTPubKeyChange
// 	mt.UpdatedAt = time.Now()

// 	if err := db.Save(mtu).Error; err != nil {
// 		return err
// 	}

// 	if err := db.Save(&other).Error; err != nil {
// 		return err
// 	}

// 	if err := db.Save(mt).Error; err != nil {
// 		return err
// 	}

// 	return nil
// }
