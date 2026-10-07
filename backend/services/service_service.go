package services

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"

	"github.com/sravanthi1606/servicehub-api/dto"
	"github.com/sravanthi1606/servicehub-api/models"
)

func CreateService(
	ctx context.Context,
	db *mongo.Database,
	providerID string,
	req dto.CreateServiceRequest,
) (*models.Service, error) {

	providerObjectID, err := bson.ObjectIDFromHex(providerID)

	if err != nil {
		return nil, errors.New("invalid provider ID")
	}

	service := models.Service{
		ID:          bson.NewObjectID(),
		Name:        req.Name,
		Description: req.Description,
		Category:    req.Category,
		Price:       req.Price,
		Duration:    req.Duration,
		ProviderID:  providerObjectID,
		Status:      "ACTIVE",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	_, err = db.Collection("services").InsertOne(ctx, service)

	if err != nil {
		return nil, err
	}

	return &service, nil
}

func GetProviderServices(
	ctx context.Context,
	db *mongo.Database,
	providerID string,
) ([]models.Service, error) {

	providerObjectID, err := bson.ObjectIDFromHex(providerID)

	if err != nil {
		return nil, errors.New("invalid provider ID")
	}

	cursor, err := db.Collection("services").Find(
		ctx,
		bson.M{
			"providerId": providerObjectID,
		},
	)

	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	var servicesList []models.Service

	if err := cursor.All(ctx, &servicesList); err != nil {
		return nil, err
	}

	return servicesList, nil
}

func UpdateService(
	ctx context.Context,
	db *mongo.Database,
	providerID string,
	serviceID string,
	req dto.UpdateServiceRequest,
) (*models.Service, error) {

	providerObjectID, err := bson.ObjectIDFromHex(providerID)

	if err != nil {
		return nil, errors.New("invalid provider ID")
	}

	serviceObjectID, err := bson.ObjectIDFromHex(serviceID)

	if err != nil {
		return nil, errors.New("invalid service ID")
	}

	filter := bson.M{
		"_id":        serviceObjectID,
		"providerId": providerObjectID,
		"status":     "ACTIVE",
	}

	update := bson.M{
		"$set": bson.M{
			"name":        req.Name,
			"description": req.Description,
			"category":    req.Category,
			"price":       req.Price,
			"duration":    req.Duration,
			"updatedAt":   time.Now(),
		},
	}

	result := db.Collection("services").FindOneAndUpdate(
		ctx,
		filter,
		update,
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	)

	var service models.Service

	if err := result.Decode(&service); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New(
				"service not found or you are not authorized to edit this service",
			)
		}

		return nil, err
	}

	return &service, nil
}

func UpdateServiceStatus(
	ctx context.Context,
	db *mongo.Database,
	providerID string,
	serviceID string,
	status string,
) (*models.Service, error) {

	providerObjectID, err := bson.ObjectIDFromHex(providerID)

	if err != nil {
		return nil, errors.New("invalid provider ID")
	}

	serviceObjectID, err := bson.ObjectIDFromHex(serviceID)

	if err != nil {
		return nil, errors.New("invalid service ID")
	}

	// A service with an active booking cannot be deactivated
	if status == "INACTIVE" {
		activeBookingStatuses := []string{
			"OPEN",
			"ACCEPTED",
		}

		var booking bson.M

		err = db.Collection("bookings").FindOne(
			ctx,
			bson.M{
				"serviceId": serviceObjectID,
				"status": bson.M{
					"$in": activeBookingStatuses,
				},
			},
		).Decode(&booking)

		if err == nil {
			return nil, errors.New(
				"service cannot be deactivated because it has an active booking",
			)
		}

		if err != mongo.ErrNoDocuments {
			return nil, err
		}
	}

	result := db.Collection("services").FindOneAndUpdate(
		ctx,
		bson.M{
			"_id":        serviceObjectID,
			"providerId": providerObjectID,
		},
		bson.M{
			"$set": bson.M{
				"status":    status,
				"updatedAt": time.Now(),
			},
		},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	)

	var service models.Service

	if err := result.Decode(&service); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New(
				"service not found or you are not authorized to update this service",
			)
		}

		return nil, err
	}

	return &service, nil
}
