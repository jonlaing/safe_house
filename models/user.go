package models

import (
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

// UserType is the type of user
type UserType int

const (
	// UTLooking is a user that is looking for a safe house
	UTLooking UserType = iota
	// UTHousing is a user that is offering housing
	UTHousing
)

// UserStatus indicates whether a user has housing available
type UserStatus int

const (
	// USNotHousing indicates that this user is not offering housing
	USNotHousing UserStatus = iota
	// USNotAvailable indicates that this user is not available or at capacity
	USNotAvailable
	// USAvailable indicates that this user has housing available
	USAvailable
)

// HousingDuration indicates approx. how long a user can house people
type HousingDuration int

const (
	// UHDNone indicates that a user cannot house
	UHDNone HousingDuration = iota
	// UHDShortTerm indicates that a user can house people for a short period of time
	UHDShortTerm
	// UHDMediumTerm inidicates that a user can house people for something between short and long
	UHDMediumTerm
	// UHDLongTerm indicates that a user can house people for a long period of time
	UHDLongTerm
)

// User represents any user. Their type, status, and duration indicates their usage
type User struct {
	ID              uint64          `json:"id" gorm:"primary_key"`
	Username        string          `json:"username" sql:"not null;unique_index"`
	Type            UserType        `json:"type"`
	Status          UserStatus      `json:"status"`
	Capacity        int             `json:"capacity"` // How many people a housing user can take in
	HousingDuration HousingDuration `json:"duration"`
	PostalCode      string          `json:"postal_code"`
	// Only for those that are housing, this is not their exact location.
	// It's an approximation based on their PostalCode
	Latitude float64 `json:"latitude"`
	// Only for those that are housing, this is not their exact location.
	// It's an approximation based on their PostalCode
	Longitude       float64 `json:"longitude"`
	Profile         string  `json:"profile"`
	Languages       string  `json:"languages"` // comma-separated list of languages the user speaks
	PasswordHash    []byte  `json:"-"`
	Password        string  `json:"password" sql:"-"`
	PasswordConfirm string  `json:"confirm" sql:"-"`
}

// GetUserByID finds a user based on their ID
func GetUserByID(id uint64, db *gorm.DB) (user User, err error) {
	if err = db.Where("user_id = ?", id).Find(&user).Error; err != nil {
		err = ErrUserNotFound
	}

	return
}

func GetUserByName(username string, db *gorm.DB) (user User, err error) {
	if err = db.Where("username = ?", username).Find(&user).Error; err != nil {
		err = ErrUserNotFound
	}

	return
}

func (u *User) Authenticate(password string) error {
	if err := bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(password)); err != nil {
		return ErrWrongPassword
	}

	return nil
}
