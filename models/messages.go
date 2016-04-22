package models

import "time"

// ThreadStatus indicates the availability of a MessageThread
type ThreadStatus int

const (
	// MTUnopened - Chat has not been initialized
	MTUnopened ThreadStatus = iota
	// MTRequested - User requested chat with another
	MTRequested
	// MTOpened - Both users have agreed to chat and the chat is open
	MTOpened
	// MTClosed - One or both users closed the chat
	MTClosed
	// MTBlocked - One or both users blocked the chat
	MTBlocked
)

// MessageThread holds a chat and public keys for a conversation
type MessageThread struct {
	ID        uint64       `json:"id"`
	Status    ThreadStatus `json:"status"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
}

// MessageThreadUser is a joining table between MessageThread, User, and Chat
type MessageThreadUser struct {
	ID        uint64    `json:"id"`
	ThreadID  uint64    `json:"thread_id"`
	UserID    uint64    `json:"user_id"`
	PublicKey []byte    `json:"public_key"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Message is an P2P encrypted message
type Message struct {
	ID                uint64    `json:"id"`
	UserID            uint64    `json:"user_id"`
	ToID              uint64    `json:"to_id"`
	ThreadID          uint64    `json:"thread_id"`
	EncryptedMessage  []byte    `json:"encrypted_message"`   // Encrypted with the recipient's public key
	SenderCopyMessage []byte    `json:"sender_copy_message"` // Encryped with the sender's public key
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}
