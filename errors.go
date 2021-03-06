package main

import (
	"errors"
	"fmt"
)

var (
	ErrNoTokenHeader = errors.New("X-Auth-Token must be in header")
	ErrAuthToken     = errors.New("Couldn't make token for specified user")
	ErrParseToken    = errors.New("Couldn't parse this user's token")
	ErrNoUser        = errors.New("Could not find current user")
	ErrIDFormat      = errors.New("Resource ID could not be converted to uint64")
)

type ErrUnexpectedSigningMethod struct {
	Method interface{} //legitimately not sure what type this should be
}

func (e ErrUnexpectedSigningMethod) Error() string {
	return fmt.Sprintf("Unexpected signing method: %v", e.Method)
}
