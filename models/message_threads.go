package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

// ThreadStatus indicates the availability of a MessageThread
type ThreadStatus int

const (
	// MTUnopened - Chat has not been initialized
	MTUnopened ThreadStatus = iota
	// MTRequested - User requested chat with another
	MTRequested
	// MTOpened - Both users have agreed to chat and the chat is open
	MTOpened
	// MTPubKeyChange - One or both users has a new public key
	MTPubKeyChange
	// MTClosed - One or both users closed the chat
	MTClosed
	// MTBlocked - One or both users blocked the chat
	MTBlocked
)

// statuses that can be seen by users
var visibleThreadStatuses []ThreadStatus

func init() {
	visibleThreadStatuses = []ThreadStatus{MTRequested, MTOpened, MTClosed, MTPubKeyChange}
}

// MessageThread holds a chat and public keys for a conversation
type MessageThread struct {
	ID        uint64       `json:"id" gorm:"primary_key"`
	UserID    uint64       `json:"user_id"` // The user who requested the chat
	Status    ThreadStatus `json:"status"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
}

// GetMessageThreadByID gets the thread based on id
func GetMessageThreadByID(threadID uint64, db *gorm.DB) (mt MessageThread, err error) {
	err = db.Where("id = ?", threadID).Find(&mt).Error
	return
}

// GetMessageThreadsByUser gets all the threads associated with a user
func GetMessageThreadsByUser(u User, db *gorm.DB) (mts []MessageThread, err error) {
	err = db.Joins("left join message_thread_users on message_thread_users.thread_id = message_thread.id").
		Where("message_thread_users.user_id = ?", u.ID).
		Where("message_threads.status IN (?)", visibleThreadStatuses). // no blocked chats
		Find(&mts).
		Error
	return
}

// HasUser determines whether a particular user is part of a chat
func (mt *MessageThread) HasUser(u User, db *gorm.DB) bool {
	var count int
	db.Table("message_thread_users").Where("user_id = ?", u.ID).Count(&count)
	return count > 0
}

// CanMessage determines whether a user is allowed to message a thread
func (mt *MessageThread) CanMessage(u User, db *gorm.DB) bool {
	if mt.Status != MTOpened {
		return false
	}

	return mt.HasUser(u, db)
}

// CanChangeStatus returns whether a user is allowed to change a thread's status to a particular status
func (mt *MessageThread) CanChangeStatus(u User, status ThreadStatus, db *gorm.DB) bool {
	// Can't change it if you're not one of the users in the chat
	if hasUser := mt.HasUser(u, db); !hasUser {
		return false
	}

	if status == MTOpened {
		return mt.UserID != u.ID
	}

	if status == MTBlocked {
		return false
	}

	return true
}

// NewMessageThreadUsers initializes new message thread users based on the current thread. This DOES NOT save them to the database.
func (mt *MessageThread) NewMessageThreadUsers(fromID, toID uint64, publicKey PublicKey) (mtus []MessageThreadUser) {
	if mt.ID == 0 {
		return
	}

	mtus = append(mtus, MessageThreadUser{
		UserID:    fromID,
		ThreadID:  mt.ID,
		PublicKey: publicKey,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	})

	mtus = append(mtus, MessageThreadUser{
		UserID:    toID,
		ThreadID:  mt.ID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	})

	return
}

// GetUsers gets the MessageThreadUsers associated with a thread
func (mt *MessageThread) GetUsers(db *gorm.DB) (mtus []MessageThreadUser, err error) {
	err = db.Where("thread_id = ?", mt.ID).Find(&mtus).Error
	return
}

// GetUser returns the MessageThreadUser of the specified user
func (mt *MessageThread) GetUser(userID uint64, db *gorm.DB) (mtu MessageThreadUser, err error) {
	err = db.Where("thread_id = ? AND user_id = ?", mt.ID, userID).Find(&mtu).Error
	return
}

// GetOtherUser returns the MessageThreadUser of the other user in the chat
func (mt *MessageThread) GetOtherUser(userID uint64, db *gorm.DB) (mtu MessageThreadUser, err error) {
	err = db.Where("thread_id = ? AND user_id != ?", mt.ID, userID).Find(&mtu).Error
	return
}

// IsReady returns whether a chat is open and ready
func (mt *MessageThread) IsReady() bool {
	return mt.Status == MTOpened
}

// UpdateStatus updates the status of message thread
func (mt *MessageThread) UpdateStatus(status ThreadStatus, u User, k PublicKey, db *gorm.DB) error {
	if !mt.CanChangeStatus(u, status, db) {
		return ErrMessageThreadStatus
	}

	if status == MTPubKeyChange {
		mtu, err := mt.GetUser(u.ID, db)
		if err != nil {
			return err
		}

		return mtu.UpdatePublicKey(k, mt, db)
	}

	mt.Status = status
	mt.UpdatedAt = time.Now()

	return db.Save(&mt).Error
}
