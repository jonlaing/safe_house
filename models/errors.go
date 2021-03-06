package models

import "errors"

var (
	ErrUserNotFound  = errors.New("Couldn't find specified user")
	ErrWrongPassword = errors.New("Password doesn't match")
	ErrNoPassword    = errors.New("Password hash couldn't be generated because the password was blank")
	ErrNoPublicKey   = errors.New("PublicKey wasn't set for this user")
	ErrAPIKeyExpired = errors.New("APIKey has expired for this user")

	ErrGeolocation = errors.New("Couldn't calculate location of user based on PostalCode")

	ErrUserBlocked           = errors.New("You are blocked from messaging this thread")
	ErrMessageThreadNoID     = errors.New("The specified MessageThread does not have an ID. Make sure it's been saved to the DB")
	ErrMessageThreadStatus   = errors.New("You can't change the status of this message thread")
	ErrMessageThreadNotOpen  = errors.New("This thread isn't open to creating messages")
	ErrMessageThreadUser     = errors.New("You are not a user of this thread")
	ErrMessageThreadNotFound = errors.New("Couldn't find specified message thread")
)
