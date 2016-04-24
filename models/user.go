package models

import (
	"regexp"

	"github.com/jasonmoo/geo"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

// UserType is the type of user
type UserType int

const (
	// UTNoType is the zero value
	UTNoType UserType = iota
	// UTLooking is a user that is looking for a safe house
	UTLooking
	// UTHousing is a user that is offering housing
	UTHousing
)

// UserStatus indicates whether a user has housing available
type UserStatus int

const (
	// USNoStatus is the zero value
	USNoStatus UserStatus = iota
	// USNotHousing indicates that this user is looking and thus not offering housing
	USNotHousing
	// USNotAvailable indicates that this user is not available or at capacity
	USNotAvailable
	// USAvailable indicates that this user has housing available
	USAvailable
)

// HousingDuration indicates approx. how long a user can house people
type HousingDuration int

const (
	// UHDNoDuration is the zero value
	UHDNoDuration HousingDuration = iota
	// UHDLooking indicates that a user is lookig thus cannot house
	UHDLooking
	// UHDShortTerm indicates that a user can house people for a short period of time
	UHDShortTerm
	// UHDMediumTerm inidicates that a user can house people for something between short and long
	UHDMediumTerm
	// UHDLongTerm indicates that a user can house people for a long period of time
	UHDLongTerm
)

// User represents any user. Their type, status, and duration indicates their usage
type User struct {
	ID         uint64          `json:"id" gorm:"primary_key"`
	Username   string          `json:"username" sql:"not null;unique_index"`
	Type       UserType        `json:"type"`
	Status     UserStatus      `json:"status"`
	Capacity   int             `json:"capacity"` // How many people a housing user can take in
	Duration   HousingDuration `json:"duration"`
	PostalCode string          `json:"postal_code"`
	// Only for those that are housing, this is not their exact location.
	// It's an approximation based on their PostalCode
	Latitude float64 `json:"latitude"`
	// Only for those that are housing, this is not their exact location.
	// It's an approximation based on their PostalCode
	Longitude       float64 `json:"longitude"`
	Profile         string  `json:"profile"`
	Locale          string  `json:"locale"`
	PasswordHash    []byte  `json:"-"`
	Password        string  `json:"password" sql:"-"`
	PasswordConfirm string  `json:"passworkd_confirm" sql:"-"`
}

// GetUserByID finds a user based on their ID
func GetUserByID(id uint64, db *gorm.DB) (user User, err error) {
	if err = db.Where("user_id = ?", id).Find(&user).Error; err != nil {
		err = ErrUserNotFound
	}

	return
}

// GetUserByName finds a user based on their Username
func GetUserByName(username string, db *gorm.DB) (user User, err error) {
	if err = db.Where("username = ?", username).Find(&user).Error; err != nil {
		err = ErrUserNotFound
	}

	return
}

// Authenticate compares a password with the hash stored in the database
func (u *User) Authenticate(password string) error {
	if err := bcrypt.CompareHashAndPassword(u.PasswordHash, []byte(password)); err != nil {
		return ErrWrongPassword
	}

	return nil
}

// GenPasswordHash generates a hash from the provided password
func (u *User) GenPasswordHash() error {
	if u.Password == "" {
		return ErrNoPassword
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.MinCost)
	if err == nil {
		u.PasswordHash = hash
	}

	return err
}

// GenCoordinates converts a postal code into coordinates
func (u *User) GenCoordinates() error {
	address, err := geo.Geocode(u.PostalCode)

	u.Latitude = address.Lat
	u.Longitude = address.Lng

	return err
}

// Validate checks to make sure all the user fields are appropriate values
func (u *User) Validate() (errors ValidationErrors) {
	usernameRegex := regexp.MustCompile("(?i)^[a-z0-9-_]+$")
	if !usernameRegex.MatchString(u.Username) {
		errors = append(errors, UsernameValidationError{})
	}

	if u.Type < 0 || u.Type > UTHousing {
		errors = append(errors, UserTypeValidationError{})
	}

	if (u.Type == UTLooking && u.Status > USNotHousing) ||
		(u.Type == UTHousing && u.Status == USNotHousing) {
		errors = append(errors, UserTypeStatusValidationError{})
	}

	if u.Status < 0 || u.Status > USAvailable {
		errors = append(errors, UserStatusValidationError{})
	}

	if (u.Type == UTLooking && u.Duration > UHDNoDuration) ||
		(u.Type == UTHousing && u.Duration == UHDNoDuration) {
		errors = append(errors, UserTypeDurationValidationError{})
	}

	if u.Duration > UHDLongTerm {
		errors = append(errors, UserDurationValidationError{})
	}

	if u.Password == "" || u.Password != u.PasswordConfirm {
		errors = append(errors, UserPasswordValidationError{})
	}

	return
}

// Merge is intended to merge a user from a BindJSON call into an existing user
// for updating the existing user
func (u *User) Merge(u2 User) {
	if u2.Type != UTNoType {
		u.Type = u2.Type
	}

	if u2.Status != USNoStatus {
		u.Status = u2.Status
	}

	if u2.Duration != UHDNoDuration {
		u.Duration = u2.Duration
	}

	if u2.Capacity > 0 {
		u.Capacity = u2.Capacity
	}

	if u2.PostalCode != "" {
		u.PostalCode = u2.PostalCode
	}

	if u2.Profile != "" {
		u.Profile = u2.Profile
	}

	if u2.Locale != "" {
		u.Locale = u2.Locale
	}
}
