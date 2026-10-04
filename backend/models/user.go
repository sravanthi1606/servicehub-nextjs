package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Address struct {
	Country   string  `bson:"country"   json:"country"`
	State     string  `bson:"state"     json:"state"`
	City      string  `bson:"city"      json:"city"`
	Pincode   string  `bson:"pincode"   json:"pincode"`
	Area      string  `bson:"area"      json:"area"`
	Latitude  float64 `bson:"latitude"  json:"latitude"`
	Longitude float64 `bson:"longitude" json:"longitude"`
}

type User struct {
	ID            bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Name          string        `bson:"name"           json:"name"`
	Email         string        `bson:"email"          json:"email"`
	Phone         string        `bson:"phone"          json:"phone"`
	Password      string        `bson:"password"       json:"-"`
	Role          string        `bson:"role"           json:"role"`
	Address       Address       `bson:"address"        json:"address"`
	EmailVerified bool          `bson:"emailVerified"  json:"emailVerified"`
}
