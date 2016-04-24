package models

import (
	"sort"
	"testing"
)

func TestDistanceComparison(t *testing.T) {
	u1 := User{Latitude: 1, Longitude: 1}
	u2 := User{Latitude: 2, Longitude: 2}

	ml := MatchList{0, 0, []User{}}

	if ml.Distance(u1) >= ml.Distance(u2) {
		t.Error("u1 should be closer than u2")
	}
}

func TestMatchListSwap(t *testing.T) {
	u1 := User{Latitude: 1, Longitude: 1}
	u2 := User{Latitude: 2, Longitude: 2}

	ml := MatchList{0, 0, []User{u1, u2}}

	ml.Swap(0, 1)

	if ml.Users[0].Latitude != 2 {
		t.Error("u1 should have been swapped with u2")
	}
}

func TestMatchListLess(t *testing.T) {
	u1 := User{Latitude: 1, Longitude: 1}
	u2 := User{Latitude: 2, Longitude: 2}

	ml := MatchList{0, 0, []User{u1, u2}}

	if !ml.Less(0, 1) {
		t.Error("u1 should be less than u2")
	}
}

func TestMatchListSorting(t *testing.T) {
	u1 := User{Latitude: 1, Longitude: 1}
	u2 := User{Latitude: 2, Longitude: 2}
	u3 := User{Latitude: -3, Longitude: -3}

	ml := MatchList{
		Latitude:  0,
		Longitude: 0,
		Users:     []User{u3, u1, u2}, // out of order
	}

	sort.Sort(&ml)

	if ml.Users[0].Latitude != 1 {
		t.Error("user 1 should be first")
	}

	if ml.Users[1].Latitude != 2 {
		t.Error("user 2 should be second")
	}

	if ml.Users[2].Latitude != -3 {
		t.Error("user 3 should be third")
	}
}
