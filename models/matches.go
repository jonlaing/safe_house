package models

import (
	"safe_house/location"

	"github.com/jinzhu/gorm"
)

// ListMatches gets a list of users that are available and in the area
func ListMatches(capacity int, duration HousingDuration, lat, long float64, distance location.Distancer, db *gorm.DB) (users []User, err error) {
	geoBounds, err := location.GeoBounds(lat, long, distance.Degrees())
	if err != nil {
		return users, err
	}

	err = db.Where("latitude > ? AND latitude < ?", geoBounds.Latitude.Min, geoBounds.Latitude.Max).
		Where("longitude > ? AND longitude < ?", geoBounds.Longitude.Min, geoBounds.Longitude.Max).
		Where("type = ?", UTHousing).
		Where("status = ?", USAvailable).
		Where("housing_duration = ?", duration).
		Where("capacity >= ?", capacity).
		Find(&users).
		Error

	return
}
