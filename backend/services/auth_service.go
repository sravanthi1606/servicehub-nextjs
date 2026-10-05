package services

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/sravanthi1606/servicehub-api/models"
	"github.com/sravanthi1606/servicehub-api/utils"
)

func RegisterUser(
	ctx context.Context,
	mongoClient *mongo.Client,
	request models.RegisterRequest,
) (models.User, error) {

	// Get servicehub database
	db := mongoClient.Database("servicehub")

	// Get users collection
	usersCollection := db.Collection("users")

	// Check whether email already exists
	var existingUser models.User

	err := usersCollection.FindOne(
		ctx,
		bson.M{
			"email": request.Email,
		},
	).Decode(&existingUser)

	if err == nil {
		return models.User{}, errors.New("email already registered")
	}

	if err != mongo.ErrNoDocuments {
		return models.User{}, err
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(request.Password)

	if err != nil {
		return models.User{}, err
	}

	// Create user model
	user := models.User{
		Name:     request.Name,
		Email:    request.Email,
		Phone:    request.Phone,
		Password: hashedPassword,
		Role:     request.Role,
		Address:  request.Address,

		EmailVerified: false,
	}

	// Insert user
	result, err := usersCollection.InsertOne(ctx, user)

	if err != nil {
		return models.User{}, err
	}

	// Set MongoDB generated ID
	if objectID, ok := result.InsertedID.(bson.ObjectID); ok {
		user.ID = objectID
	}

	return user, nil
}

func LoginUser(
	ctx context.Context,
	mongoClient *mongo.Client,
	request models.LoginRequest,
) (models.User, string, error) {

	db := mongoClient.Database("servicehub")
	usersCollection := db.Collection("users")

	var user models.User

	// Find user by email
	err := usersCollection.FindOne(
		ctx,
		bson.M{
			"email": request.Email,
		},
	).Decode(&user)

	if err != nil {
		return models.User{}, "", errors.New("invalid email or password")
	}

	// Compare entered password with stored hashed password
	err = utils.CheckPassword(
		request.Password,
		user.Password,
	)

	if err != nil {
		return models.User{}, "", errors.New("invalid email or password")
	}

	// Generate JWT
	token, err := utils.GenerateToken(
		user.ID.Hex(),
		user.Role,
	)

	if err != nil {
		return models.User{}, "", err
	}

	return user, token, nil
}
