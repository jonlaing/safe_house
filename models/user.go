package models

import (
	"math"
	"regexp"
	"safe_house/location"
	"time"

	"github.com/jasonmoo/geo"
	"github.com/jinzhu/gorm"
	"github.com/nu7hatch/gouuid"
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
	// UTAdmin is a user that has verification abilities
	UTAdmin
	// UTSuperUser is a user who can promote users to Admin status
	UTSuperUser
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
	Longitude       float64            `json:"longitude"`
	Profile         string             `json:"profile"`
	Locale          string             `json:"locale"`
	PublicKey       string             `json:"public_key" binding:"required"`
	PasswordHash    []byte             `json:"-"`
	Password        string             `json:"password" sql:"-"`
	PasswordConfirm string             `json:"password_confirm" sql:"-"`
	Distance        location.Distancer `json:"distance" sql:"-"` // For displaying distances of matches
	APIKey          string             `json:"-" sql:"unique_index"`
	APIKeyExpire    time.Time          `json:"-"`
}

// GetUserByID finds a user based on their ID
func GetUserByID(id uint64, db *gorm.DB) (user User, err error) {
	if err = db.Where("id = ?", id).Find(&user).Error; err != nil {
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

// GetUserByAPIKey finds a user based on their APIKey
func GetUserByAPIKey(k string, db *gorm.DB) (u User, err error) {
	if err = db.Where("api_key = ?", k).Find(&u).Error; err != nil {
		err = ErrUserNotFound
	}

	if time.Now().After(u.APIKeyExpire) {
		err = ErrAPIKeyExpired
	}

	return
}

// GetPublicKey gets a public key based on user id
func GetPublicKey(userID uint64, db *gorm.DB) (string, error) {
	var keys []string
	err := db.Table("users").Where("id = ?", userID).Pluck("public_key", &keys).Error
	if err == nil && len(keys) == 0 {
		return "", ErrNoPublicKey
	}

	return keys[0], err
}

// Authenticate compares a password with the hash stored in the database
func (u *User) Authenticate(password string) error {
	if err := bcrypt.CompareHashAndPassword(u.PasswordHash, []byte(password)); err != nil {
		return ErrWrongPassword
	}

	return nil
}

// GenPasswordHash generates a hash from the provided password. It does not save to the database.
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

// GenAPIKey generates a UUID for user authentication, as well as an expiration time
func (u *User) GenAPIKey() error {
	k, err := uuid.NewV4()
	if err == nil {
		u.APIKey = k.String()
		u.GenAPIKeyExpire()
	}

	return err
}

// GenAPIKeyExpire sets a new expiration time for the user's APIKey
func (u *User) GenAPIKeyExpire() {
	u.APIKeyExpire = time.Now().Add(168 * time.Hour) // Expire after a week of inactivity
}

// UpdateAPIKey checks if the APIKey is set, and whether it has expired. If it's been set, and it's
// not expired, then update the expiration time. If it hasn't been set, or it has expired, then
// generate a new key and expiration time
func (u *User) UpdateAPIKey() error {
	if u.APIKey == "" || time.Now().After(u.APIKeyExpire) {
		return u.GenAPIKey()
	}

	u.GenAPIKeyExpire()
	return nil
}

// GenCoordinates converts a postal code into coordinates
func (u *User) GenCoordinates() error {
	address, err := geo.Geocode(u.PostalCode)
	if err != nil {
		return err
	}

	u.Latitude = address.Lat
	u.Longitude = address.Lng

	if u.Latitude == 0 || u.Longitude == 0 {
		return ErrGeolocation
	}

	return nil
}

// GenDistance returns the distance of a user from a particular geolocation
func (u *User) GenDistance(lat, long float64, unit location.Unit) {
	deg := math.Sqrt(math.Pow(long-u.Longitude, 2) + math.Pow(lat-u.Latitude, 2))
	u.Distance = location.NewDistancerFromDegrees(deg, unit)
}

// Validate checks to make sure all the user fields are appropriate values
func (u *User) Validate() (errors ValidationErrors) {
	usernameRegex := regexp.MustCompile("(?i)^[a-z0-9-_]+$")
	if !usernameRegex.MatchString(u.Username) {
		errors = append(errors, UsernameValidationError{})
	}

	if u.Type < 0 || u.Type > UTHousing {
		// Can't create admins or super users this way
		errors = append(errors, UserTypeValidationError{})
	}

	if (u.Type == UTLooking && u.Status > USNotHousing) ||
		(u.Type == UTHousing && u.Status == USNotHousing) {
		errors = append(errors, UserTypeStatusValidationError{})
	}

	if u.Status < 0 || u.Status > USAvailable {
		errors = append(errors, UserStatusValidationError{})
	}

	if u.Type == UTHousing && u.Capacity < 1 {
		errors = append(errors, UserTypeCapacityValidationError{})
	}

	if (u.Type == UTLooking && u.Duration > UHDNoDuration) ||
		(u.Type == UTHousing && u.Duration == UHDNoDuration) {
		errors = append(errors, UserTypeDurationValidationError{})
	}

	if u.Type == UTHousing && u.PostalCode == "" {
		errors = append(errors, UserTypePostalCodeValidationError{})
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

func (u *User) UpdatePublicKey(k string, db *gorm.DB) error {
	u.PublicKey = k
	if err := db.Save(u).Error; err != nil {
		return err
	}

	// Sucks but I have to do this in three queries, at least until
	// I figure out to do a join and an update in the same statement
	var threadIDs []uint64

	if err := db.Table("message_threads").
		Joins("left join message_thread_users on message_thread_users.thread_id = message_threads.id").
		Where("message_thread_users.user_id = ?", u.ID).
		Pluck("message_threads.id", &threadIDs).Error; err != nil {
		return err
	}

	if err := db.Table("message_threads").
		Where("id IN (?)", threadIDs).
		Where("user_id = ?", u.ID).
		Where("status = ?", MTOpened). // only change the status if they're actively talking
		UpdateColumn("status", MTPubKeyChange).
		UpdateColumn("status_changed_by", MTSInitiator).Error; err != nil {
		return err
	}

	err := db.Table("message_threads").
		Where("id IN (?)", threadIDs).
		Where("user_id != ?", u.ID).
		Where("status = ?", MTOpened).
		UpdateColumn("status", MTPubKeyChange).
		UpdateColumn("status_changed_by", MTSAccepter).Error

	return err
}
