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

// ThreadStatusUpdatedBy indicates who changed the status of the message thread
type ThreadStatusUpdatedBy int

const (
	// MTSNone - No one updated the status
	MTSNone ThreadStatusUpdatedBy = iota
	// MTSInitiator - The user inidcated by MessageThread.UserID
	// updated the status
	MTSInitiator
	// MTSAccepter - The user not inidcated by MessageThread.UserID
	// updated the status
	MTSAccepter
	// MTSBoth - Both users updated the status
	MTSBoth
)

// statuses that can be seen by users
var visibleThreadStatuses []ThreadStatus

func init() {
	visibleThreadStatuses = []ThreadStatus{MTRequested, MTOpened, MTClosed, MTPubKeyChange}
}

// MessageThread holds a chat and public keys for a conversation
type MessageThread struct {
	ID              uint64                `json:"id" gorm:"primary_key"`
	UserID          uint64                `json:"user_id"` // The user who requested the chat
	Status          ThreadStatus          `json:"status"`
	StatusChangedBy ThreadStatusUpdatedBy `json:"status_changed_by"`
	CreatedAt       time.Time             `json:"created_at"`
	UpdatedAt       time.Time             `json:"updated_at"`
	User            User                  `json:"user" sql:"-"`
	LastMessage     Message               `json:"last_message" sql:"-"`
}

// GetMessageThreadByID gets the thread based on id
func GetMessageThreadByID(threadID uint64, db *gorm.DB) (mt MessageThread, err error) {
	err = db.Where("id = ?", threadID).Find(&mt).Error
	return
}

// GetMessageThreadsByUser gets all the threads associated with a user
func GetMessageThreadsByUser(u User, db *gorm.DB) (mts []MessageThread, err error) {
	err = db.Joins("left join message_thread_users on message_thread_users.thread_id = message_threads.id").
		Where("message_thread_users.user_id = ?", u.ID).
		Where("message_threads.status IN (?)", visibleThreadStatuses). // no blocked chats
		Order("updated_at DESC").
		Find(&mts).
		Error

	for k := range mts {
		mts[k].GetLastMessage(u.ID, db)
		mts[k].GetRelatedUser(u.ID, db)
	}

	return
}

// GetMessageThreadByUserID finds the thread ID common between two users. To be frank, I'm
// not totally satisfied with this, but it should work. Ideally, there won't be a large amount
// of threads for any particular user, so this should still be reasonably performant. Any
// suggestions to make this cleaner would be greatly appreciated.
func GetMessageThreadByUserID(u User, otherID uint64, db *gorm.DB) (MessageThread, MessageThreadUser, error) {
	// First get all message thread users for both users
	var mtus []MessageThreadUser
	err := db.Where("user_id IN (?)", []uint64{u.ID, otherID}).Find(&mtus).Error
	if err != nil {
		return MessageThread{}, MessageThreadUser{}, err
	}

	other, err := GetUserByID(otherID, db)
	if err != nil {
		return MessageThread{}, MessageThreadUser{}, err
	}

	// User MessageThreadUsers
	var umtus []MessageThreadUser
	// Other MessageThreadUsers
	var omtus []MessageThreadUser

	// collect them into separate arrays
	for _, mtu := range mtus {
		if mtu.UserID == u.ID {
			umtus = append(umtus, mtu)
		}

		if mtu.UserID == otherID {
			omtus = append(omtus, mtu)
		}
	}

	// find the one where they both have the same thread ID
	for _, umtu := range umtus {
		for _, omtu := range omtus {
			// if two message thread users have the same id, then go fetch it
			if umtu.ThreadID == omtu.ThreadID {
				mt, err := GetMessageThreadByID(umtu.ThreadID, db)
				omtu.PublicKey = other.PublicKey

				return mt, omtu, err
			}
		}
	}

	return MessageThread{}, MessageThreadUser{}, ErrMessageThreadNotFound
}

// HasUser determines whether a particular user is part of a chat
func (mt *MessageThread) HasUser(u User, db *gorm.DB) bool {
	var count int
	db.Table("message_thread_users").Where("thread_id = ?", mt.ID).Where("user_id = ?", u.ID).Count(&count)
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
func (mt *MessageThread) NewMessageThreadUsers(from, to User) (mtus []MessageThreadUser) {
	if mt.ID == 0 {
		return
	}

	mtus = append(mtus, MessageThreadUser{
		UserID:    from.ID,
		ThreadID:  mt.ID,
		PublicKey: from.PublicKey,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	})

	mtus = append(mtus, MessageThreadUser{
		UserID:    to.ID,
		ThreadID:  mt.ID,
		PublicKey: to.PublicKey,
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
	if err != nil {
		return
	}

	err = db.Where("id = ?", mtu.UserID).Find(&mtu.User).Error
	return
}

// IsReady returns whether a chat is open and ready
func (mt *MessageThread) IsReady() bool {
	return mt.Status == MTOpened
}

// UpdateStatus updates the status of message thread
func (mt *MessageThread) UpdateStatus(status ThreadStatus, u *User, db *gorm.DB) error {
	if !mt.CanChangeStatus(*u, status, db) {
		return ErrMessageThreadStatus
	}

	// if status == MTPubKeyChange {
	// 	mtu, err := mt.GetUser(u.ID, db)
	// 	if err != nil {
	// 		return err
	// 	}

	// 	if err := mtu.UpdatePublicKey(k, u, mt, db); err != nil {
	// 		return err
	// 	}
	// }

	mt.Status = status
	mt.UpdatedAt = time.Now()

	return db.Save(&mt).Error
}

func (mt *MessageThread) GetMessages(userID uint64, db *gorm.DB) (ms []Message, err error) {
	err = db.Where("thread_id = ?", mt.ID).Order("created_at DESC").Limit(25).Find(&ms).Error
	if err != nil {
		return
	}

	for i := range ms {
		ms[i].IsMe = ms[i].UserID == userID
	}

	return
}

// GetLastMessage fills in the last message of a message thread
func (mt *MessageThread) GetLastMessage(userID uint64, db *gorm.DB) error {
	err := db.Where("thread_id = ?", mt.ID).Order("created_at DESC").Find(&mt.LastMessage).Error
	mt.LastMessage.IsMe = mt.LastMessage.UserID == userID
	return err
}

// GetRelatedUser gets the other user of a message thread
func (mt *MessageThread) GetRelatedUser(userID uint64, db *gorm.DB) error {
	return db.Joins("left join message_thread_users on message_thread_users.user_id = users.id").
		Where("message_thread_users.thread_id = ?", mt.ID).
		Where("message_thread_users.user_id != ?", userID).
		Find(&mt.User).
		Error
}
