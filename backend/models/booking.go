package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type BookingAddress struct {
	Country        string  `bson:"country" json:"country"`
	State          string  `bson:"state" json:"state"`
	District       string  `bson:"district" json:"district"`
	City           string  `bson:"city" json:"city"`
	Pincode        string  `bson:"pincode" json:"pincode"`
	Area           string  `bson:"area" json:"area"`
	BuildingNumber string  `bson:"buildingNumber" json:"buildingNumber"`
	BuildingName   string  `bson:"buildingName" json:"buildingName"`
	FlatNumber     string  `bson:"flatNumber" json:"flatNumber"`
	Block          string  `bson:"block" json:"block"`
	Street         string  `bson:"street" json:"street"`
	Landmark       string  `bson:"landmark" json:"landmark"`
	Latitude       float64 `bson:"latitude" json:"latitude"`
	Longitude      float64 `bson:"longitude" json:"longitude"`
}

type Booking struct {
	ID          bson.ObjectID  `bson:"_id,omitempty" json:"id"`
	CustomerID  bson.ObjectID  `bson:"customerId" json:"customerId"`
	ProviderID  *bson.ObjectID `bson:"providerId,omitempty" json:"providerId"`
	ServiceID   bson.ObjectID  `bson:"serviceId" json:"serviceId"`
	BookingDate time.Time      `bson:"bookingDate" json:"bookingDate"`
	BookingTime string         `bson:"bookingTime" json:"bookingTime"`
	Address     BookingAddress `bson:"address" json:"address"`
	Price       float64        `bson:"price" json:"price"`
	Status      string         `bson:"status" json:"status"`
	Notes       string         `bson:"notes" json:"notes"`
	CreatedAt   time.Time      `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time      `bson:"updatedAt" json:"updatedAt"`
}
