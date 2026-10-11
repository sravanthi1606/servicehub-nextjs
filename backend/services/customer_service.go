package services

import (
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/sravanthi1606/servicehub-api/models"
)

func GetCustomerServices(
	ctx context.Context,
	db *mongo.Database,
) ([]models.Service, error) {

	cursor, err := db.Collection("services").Find(
		ctx,
		bson.M{
			"status": "ACTIVE",
		},
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	services := make([]models.Service, 0)

	if err := cursor.All(ctx, &services); err != nil {
		return nil, err
	}

	return services, nil
}
