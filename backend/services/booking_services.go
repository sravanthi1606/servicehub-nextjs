package services

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/sravanthi1606/servicehub-api/dto"
	"github.com/sravanthi1606/servicehub-api/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func CreateBooking(
	ctx context.Context,
	db *mongo.Database,
	customerID string,
	req dto.CreateBookingRequest,
) (*models.Booking, error) {

	// 1. Validate customer ID
	customerObjectID, err := bson.ObjectIDFromHex(customerID)
	if err != nil {
		return nil, errors.New("invalid customer ID")
	}

	// 2. Validate service ID
	serviceObjectID, err := bson.ObjectIDFromHex(req.ServiceID)
	if err != nil {
		return nil, errors.New("invalid service ID")
	}

	// 3. Validate required fields
	if strings.TrimSpace(req.BookingDate) == "" ||
		strings.TrimSpace(req.BookingTime) == "" ||
		strings.TrimSpace(req.Pincode) == "" ||
		strings.TrimSpace(req.Area) == "" {
		return nil, errors.New(
			"booking date, time, pincode, and area are required",
		)
	}

	// 4. Parse booking date
	bookingDate, err := time.Parse("2006-01-02", req.BookingDate)
	if err != nil {
		return nil, errors.New("booking date must use YYYY-MM-DD format")
	}

	// 5. Validate booking time
	if _, err := time.Parse("15:04", req.BookingTime); err != nil {
		return nil, errors.New("booking time must use HH:MM format")
	}

	// 6. Reject past booking dates
	today := time.Now().In(time.Local)
	bookingDay := bookingDate.Format("2006-01-02")
	todayDate := today.Format("2006-01-02")

	if bookingDay < todayDate {
		return nil, errors.New("booking date cannot be in the past")
	}

	// 7. Confirm the service exists and is active
	var service models.Service

	err = db.Collection("services").FindOne(
		ctx,
		bson.M{
			"_id":    serviceObjectID,
			"status": "ACTIVE",
		},
	).Decode(&service)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("service not found or is inactive")
		}
		return nil, err
	}

	// 8. Create the booking
	now := time.Now()

	booking := models.Booking{
		CustomerID:  customerObjectID,
		ProviderID:  nil,
		ServiceID:   serviceObjectID,
		BookingDate: bookingDate,
		BookingTime: req.BookingTime,
		Address: models.BookingAddress{
			Country:        req.Country,
			State:          req.State,
			District:       req.District,
			City:           req.City,
			Pincode:        req.Pincode,
			Area:           req.Area,
			BuildingNumber: req.BuildingNumber,
			BuildingName:   req.BuildingName,
			FlatNumber:     req.FlatNumber,
			Block:          req.Block,
			Street:         req.Street,
			Landmark:       req.Landmark,
			Latitude:       req.Latitude,
			Longitude:      req.Longitude,
		},
		Price:     service.Price,
		Status:    "OPEN",
		Notes:     req.Notes,
		CreatedAt: now,
		UpdatedAt: now,
	}

	result, err := db.Collection("bookings").InsertOne(ctx, booking)
	if err != nil {
		return nil, err
	}

	booking.ID = result.InsertedID.(bson.ObjectID)

	return &booking, nil
}

func GetCustomerBookings(
	ctx context.Context,
	db *mongo.Database,
	customerID string,
) ([]models.Booking, error) {

	var bookings []models.Booking

	collection := db.Collection("bookings")

	customerObjectID, err := bson.ObjectIDFromHex(customerID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{
		"customerId": customerObjectID,
	}

	// Add logs here, before collection.Find()
	fmt.Println("Query customer ID:", customerID)
	fmt.Printf("Query filter: %#v\n", filter)

	opts := options.Find().
		SetSort(bson.D{
			{Key: "createdAt", Value: -1},
		})

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &bookings); err != nil {
		return nil, err
	}

	if bookings == nil {
		bookings = []models.Booking{}
	}

	return bookings, nil
}

func GetOpenProviderBookings(
	ctx context.Context,
	db *mongo.Database,
) ([]models.Booking, error) {

	var bookings []models.Booking

	collection := db.Collection("bookings")

	filter := bson.M{
		"status": "OPEN",
		"$or": []bson.M{
			{"providerId": bson.M{"$exists": false}},
			{"providerId": nil},
		},
	}

	opts := options.Find().SetSort(bson.D{
		{Key: "createdAt", Value: -1},
	})

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &bookings); err != nil {
		return nil, err
	}

	if bookings == nil {
		bookings = []models.Booking{}
	}

	return bookings, nil
}

func AcceptProviderBooking(
	ctx context.Context,
	db *mongo.Database,
	providerID string,
	bookingID string,
) (*models.Booking, error) {

	providerObjectID, err := bson.ObjectIDFromHex(providerID)
	if err != nil {
		return nil, errors.New("invalid provider ID")
	}

	bookingObjectID, err := bson.ObjectIDFromHex(bookingID)
	if err != nil {
		return nil, errors.New("invalid booking ID")
	}

	collection := db.Collection("bookings")
	now := time.Now()

	// Atomically accept only an unassigned OPEN booking.
	filter := bson.M{
		"_id":    bookingObjectID,
		"status": "OPEN",
		"$or": []bson.M{
			{"providerId": bson.M{"$exists": false}},
			{"providerId": nil},
		},
	}

	update := bson.M{
		"$set": bson.M{
			"providerId": providerObjectID,
			"status":     "ACCEPTED",
			"updatedAt":  now,
		},
	}

	opts := options.FindOneAndUpdate().
		SetReturnDocument(options.After)

	var booking models.Booking

	err = collection.FindOneAndUpdate(
		ctx,
		filter,
		update,
		opts,
	).Decode(&booking)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New(
				"booking not found or already accepted by another provider",
			)
		}

		return nil, err
	}

	return &booking, nil
}

func GetProviderBookings(
	ctx context.Context,
	db *mongo.Database,
	providerID string,
) ([]models.Booking, error) {

	providerObjectID, err := bson.ObjectIDFromHex(providerID)
	if err != nil {
		return nil, errors.New("invalid provider ID")
	}

	collection := db.Collection("bookings")

	filter := bson.M{
		"$or": []bson.M{
			{
				"status":     "OPEN",
				"providerId": nil,
			},
			{
				"providerId": providerObjectID,
			},
		},
	}

	opts := options.Find().SetSort(
		bson.D{{Key: "createdAt", Value: -1}},
	)

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var bookings []models.Booking

	if err := cursor.All(ctx, &bookings); err != nil {
		return nil, err
	}

	if bookings == nil {
		bookings = []models.Booking{}
	}

	return bookings, nil
}

var ErrProviderBookingNotFound = errors.New(
	"booking not found or not assigned to this provider",
)

func GetProviderBookingByID(
	ctx context.Context,
	db *mongo.Database,
	providerID string,
	bookingID string,
) (*models.Booking, error) {

	providerObjectID, err := bson.ObjectIDFromHex(providerID)
	if err != nil {
		return nil, errors.New("invalid provider ID")
	}

	bookingObjectID, err := bson.ObjectIDFromHex(bookingID)
	if err != nil {
		return nil, errors.New("invalid booking ID")
	}

	filter := bson.M{
		"_id":        bookingObjectID,
		"providerId": providerObjectID,
	}

	var booking models.Booking

	err = db.Collection("bookings").
		FindOne(ctx, filter).
		Decode(&booking)

	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, ErrProviderBookingNotFound
	}

	if err != nil {
		return nil, err
	}

	return &booking, nil
}
