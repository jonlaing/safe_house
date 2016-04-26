package models

import (
	"math"
	"safe_house/location"
	"sort"

	"github.com/jinzhu/gorm"
)

type MatchList struct {
	Latitude  float64
	Longitude float64
	Users     []User
}

func (m *MatchList) Len() int {
	return len(m.Users)
}

func (m *MatchList) Less(i, j int) bool {
	return m.Distance(m.Users[i]) < m.Distance(m.Users[j])
}

func (m *MatchList) Swap(i, j int) {
	m.Users[i], m.Users[j] = m.Users[j], m.Users[i]
}

func (m *MatchList) Distance(u User) float64 {
	return math.Sqrt(math.Pow(m.Longitude-u.Longitude, 2) + math.Pow(m.Latitude-u.Latitude, 2))
}

// GenDistances generates the Distance field for all of the users based on the current
// user's geolocation. It's mostly approximate.
func (m *MatchList) GenDistances(unit location.Unit) {
	for k, u := range m.Users {
		d := location.NewDistancerFromDegrees(m.Distance(u), unit)
		m.Users[k].Distance = d
	}
}

// ListMatches gets a list of users that are available and in the area
func ListMatches(capacity int, duration HousingDuration, lat, long float64, distance location.Distancer, page int, db *gorm.DB) (users []User, err error) {
	geoBounds, err := location.CalcGeoBounds(lat, long, distance.Degrees())
	if err != nil {
		return users, err
	}

	err = db.Where("latitude > ? AND latitude < ?", geoBounds.Latitude.Min, geoBounds.Latitude.Max).
		Where("longitude > ? AND longitude < ?", geoBounds.Longitude.Min, geoBounds.Longitude.Max).
		Where("type = ?", UTHousing).
		Where("status = ?", USAvailable).
		Where("duration >= ?", duration).
		Where("capacity >= ?", capacity).
		Limit(25).
		Offset(page * 25).
		Find(&users).
		Error

	if err == nil {
		// Sort by distance
		matches := MatchList{
			Latitude:  lat,
			Longitude: long,
			Users:     users,
		}
		matches.GenDistances(distance.Unit())

		sort.Sort(&matches)
		return matches.Users, nil
	}

	return
}
