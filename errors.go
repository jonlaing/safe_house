package main

import (
	"errors"
	"fmt"
)

const (
	ErrNoTokenHeader = errors.New("X-Auth-Token must be in header")
	ErrAuthToken     = errors.New("Couldn't make token for specified user")
	ErrParseToken    = errors.New("Couldn't parse this user's token")
	ErrNoUser        = errors.New("Could not find current user")
)

type ErrUnexpectedSigningMethod struct {
	Method interface{}
}

func (e ErrUnexpectedSigningMethod) Error() string {
	return fmt.Sprintf("Unexpected signing method: %v", e.Method)
}
