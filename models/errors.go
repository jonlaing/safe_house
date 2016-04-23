package models

import "errors"

const (
	ErrUserNotFound  = errors.New("Couldn't find specified user")
	ErrWrongPassword = errors.New("Password doesn't match")
)
