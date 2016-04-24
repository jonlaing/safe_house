package models

import "errors"

var (
	ErrUserNotFound  = errors.New("Couldn't find specified user")
	ErrWrongPassword = errors.New("Password doesn't match")
	ErrNoPassword    = errors.New("Password hash couldn't be generated because the password was blank")
)
