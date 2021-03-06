package location

import (
	"errors"
	"math"
)

const (
	earthRadiusMiles float64 = 3959
	earthRadiusKm    float64 = 6371
)

type Unit int

const (
	UKilometers Unit = iota
	UMiles
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
	Unit() Unit
}

type Miles float64
type Kilometers float64

func NewDistancer(v float64, unit Unit) Distancer {
	if unit == UMiles {
		return Miles(v)
	}

	return Kilometers(v)
}

func NewDistancerFromDegrees(v float64, unit Unit) Distancer {
	if unit == UMiles {
		return Miles(v * earthRadiusMiles * math.Pi / float64(180))
	}

	return Kilometers(v * earthRadiusKm * math.Pi / float64(180))
}

// Degrees converts miles from the context params (string) into coordinate degrees
func (m Miles) Degrees() float64 {
	return float64(m) / earthRadiusMiles * float64(180) / math.Pi
}

func (m Miles) Unit() Unit {
	return UMiles
}

// Degrees converts miles from the context params (string) into coordinate degrees
func (k Kilometers) Degrees() float64 {
	return float64(k) / earthRadiusKm * float64(180) / math.Pi
}

func (k Kilometers) Unit() Unit {
	return UKilometers
}

func CalcGeoBounds(lat, long, rad float64) (bounds GeoBounds, err error) {
	if rad > 90 {
		err = errors.New("Radius cannot be above 90")
	}

	// LATITUDE
	minLat := lat - rad
	maxLat := lat + rad
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
	minLong := long - rad
	maxLong := long + rad
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

	bounds = GeoBounds{
		Latitude:  Bounds{minLat, maxLat},
		Longitude: Bounds{minLong, maxLong},
	}

	return
}
