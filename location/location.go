package location

import (
	"errors"
	"math"
)

const (
	earthRadiusMiles float64 = 3959
	earthRadiusKm    float64 = 6371
)

// Bounds represesnts the bounds of a location search on one axis
type Bounds struct {
	Min float64
	Max float64
}

// GeoBounds represents the bounds of a location search
type GeoBounds struct {
	Latitude  Bounds
	Longitude Bounds
}

// Distancer represents a distance in either Miles or Kilometers
type Distancer interface {
	Degrees() float64
}

type Miles float64
type Kilometers float64

// converts miles from the context params (string) into coordinate degrees
func (m *Miles) Degrees() float64 {
	return m / earthRadiusMiles * float64(180) / math.Pi
}

// converts miles from the context params (string) into coordinate degrees
func (k *Kilometers) Degrees() float64 {
	return k / earthRadiusKm * float64(180) / math.Pi
}

func GeoBoundss(lat, long, rad float64) (bound GeoBounds, err error) {
	if rad > 90 {
		err = errors.New("Radius cannot be above 90")
	}

	// LATITUDE
	minLat = lat - rad
	maxLat = lat + rad
	if minLat > 90 {
		minLat = 90 - minLat
	} else if minLat < -90 {
		minLat = 90 + minLat
	}
	if maxLat > 90 {
		maxLat = 90 - maxLat
	} else if maxLat < -90 {
		maxLat = 90 + maxLat
	}

	// LONGITUDE
	minLong = long - rad
	maxLong = long + rad
	if minLong > 180 {
		minLong = 180 - minLong
	} else if minLong < -180 {
		minLong = 180 + minLong
	}
	if maxLong > 180 {
		maxLong = 180 - maxLong
	} else if maxLong < -180 {
		maxLong = 180 + maxLong
	}

	bound = GeoBounds{
		Latitude:  Bounds{minLat, maxLat},
		Longitude: Bounds{minLong, maxLong},
	}

	return
}
