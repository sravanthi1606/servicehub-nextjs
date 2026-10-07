package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Service struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string        `bson:"name" json:"name"`
	Description string        `bson:"description" json:"description"`
	Category    string        `bson:"category" json:"category"`
	Price       float64       `bson:"price" json:"price"`
	Duration    string        `bson:"duration" json:"duration"`
	ProviderID  bson.ObjectID `bson:"providerId" json:"providerId"`
	Status      string        `bson:"status" json:"status"`
	CreatedAt   time.Time     `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time     `bson:"updatedAt" json:"updatedAt"`
}
