package services

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/sravanthi1606/servicehub-api/dto"
	"github.com/sravanthi1606/servicehub-api/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type BookingProviderDetails struct {
	Name  string `bson:"name" json:"name"`
	Phone string `bson:"phone" json:"phone"`
	Email string `bson:"email" json:"email"`
}

type CustomerBookingWithService struct {
	models.Booking `bson:",inline"`
	ServiceName    string                  `bson:"serviceName" json:"serviceName"`
	Provider       *BookingProviderDetails `bson:"provider,omitempty" json:"provider,omitempty"`
}

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
) ([]CustomerBookingWithService, error) {

	customerObjectID, err := bson.ObjectIDFromHex(customerID)
	if err != nil {
		return nil, errors.New("invalid customer ID")
	}

	pipeline := mongo.Pipeline{
		// Find bookings belonging to this customer.
		bson.D{{Key: "$match", Value: bson.D{
			{Key: "customerId", Value: customerObjectID},
		}}},

		// Join the service document.
		bson.D{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "services"},
			{Key: "localField", Value: "serviceId"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "serviceDetails"},
		}}},

		bson.D{{Key: "$unwind", Value: bson.D{
			{Key: "path", Value: "$serviceDetails"},
			{Key: "preserveNullAndEmptyArrays", Value: true},
		}}},

		// Add the service name.
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "serviceName", Value: bson.D{
				{Key: "$ifNull", Value: bson.A{
					"$serviceDetails.name",
					"",
				}},
			}},
		}}},

		// Join the assigned provider from users.
		bson.D{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "users"},
			{Key: "localField", Value: "providerId"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "providerDetails"},
		}}},

		bson.D{{Key: "$unwind", Value: bson.D{
			{Key: "path", Value: "$providerDetails"},
			{Key: "preserveNullAndEmptyArrays", Value: true},
		}}},

		// Include only public provider contact fields.
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "provider", Value: bson.D{
				{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$ifNull", Value: bson.A{
						"$providerDetails._id",
						false,
					}}},
					bson.D{
						{Key: "name", Value: "$providerDetails.name"},
						{Key: "phone", Value: "$providerDetails.phone"},
						{Key: "email", Value: "$providerDetails.email"},
					},
					nil,
				}},
			}},
		}}},

		// Remove the joined documents from the response.
		bson.D{{Key: "$project", Value: bson.D{
			{Key: "serviceDetails", Value: 0},
			{Key: "providerDetails", Value: 0},
		}}},

		// Latest bookings first.
		bson.D{{Key: "$sort", Value: bson.D{
			{Key: "createdAt", Value: -1},
		}}},
	}

	cursor, err := db.Collection("bookings").Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	bookings := []CustomerBookingWithService{}

	if err := cursor.All(ctx, &bookings); err != nil {
		return nil, err
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

func UpdateProviderBookingStatus(
	ctx context.Context,
	db *mongo.Database,
	providerID string,
	bookingID string,
	newStatus string,
) (*models.Booking, error) {

	providerObjectID, err := bson.ObjectIDFromHex(providerID)
	if err != nil {
		return nil, errors.New("invalid provider ID")
	}

	bookingObjectID, err := bson.ObjectIDFromHex(bookingID)
	if err != nil {
		return nil, errors.New("invalid booking ID")
	}

	var allowedPreviousStatus string

	switch newStatus {
	case "IN_PROGRESS":
		allowedPreviousStatus = "ACCEPTED"
	case "COMPLETED":
		allowedPreviousStatus = "IN_PROGRESS"
	default:
		return nil, errors.New("invalid booking status transition")
	}

	filter := bson.M{
		"_id":        bookingObjectID,
		"providerId": providerObjectID,
		"status":     allowedPreviousStatus,
	}

	update := bson.M{
		"$set": bson.M{
			"status":    newStatus,
			"updatedAt": time.Now(),
		},
	}

	opts := options.FindOneAndUpdate().
		SetReturnDocument(options.After)

	var booking models.Booking

	err = db.Collection("bookings").
		FindOneAndUpdate(ctx, filter, update, opts).
		Decode(&booking)

	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New(
			"booking not found, not assigned to you, or status transition not allowed",
		)
	}

	if err != nil {
		return nil, err
	}

	return &booking, nil
}

func CancelCustomerBooking(
	ctx context.Context,
	db *mongo.Database,
	customerID string,
	bookingID string,
) (*models.Booking, error) {

	// 1. Validate customer ID
	customerObjectID, err := bson.ObjectIDFromHex(customerID)
	if err != nil {
		return nil, errors.New("invalid customer ID")
	}

	// 2. Validate booking ID
	bookingObjectID, err := bson.ObjectIDFromHex(bookingID)
	if err != nil {
		return nil, errors.New("invalid booking ID")
	}

	// 3. Cancel only this customer's OPEN or ACCEPTED booking.
	filter := bson.M{
		"_id":        bookingObjectID,
		"customerId": customerObjectID,
		"status": bson.M{
			"$in": []string{"OPEN", "ACCEPTED"},
		},
	}

	update := bson.M{
		"$set": bson.M{
			"status":    "CANCELLED",
			"updatedAt": time.Now(),
		},
	}

	opts := options.FindOneAndUpdate().
		SetReturnDocument(options.After)

	var booking models.Booking

	err = db.Collection("bookings").
		FindOneAndUpdate(ctx, filter, update, opts).
		Decode(&booking)

	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New(
			"booking not found, not owned by you, or cannot be cancelled",
		)
	}

	if err != nil {
		return nil, err
	}

	return &booking, nil
}
