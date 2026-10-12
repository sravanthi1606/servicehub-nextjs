package controllers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/sravanthi1606/servicehub-api/dto"
	"github.com/sravanthi1606/servicehub-api/services"
)

func CreateBooking(c *gin.Context, db *mongo.Database) {
	var req dto.CreateBookingRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid booking request",
		})
		return
	}

	userIDValue, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User ID not found",
		})
		return
	}

	customerID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid customer ID",
		})
		return
	}

	booking, err := services.CreateBooking(
		c.Request.Context(),
		db,
		customerID,
		req,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Booking created successfully",
		"data":    booking,
	})
}

func GetCustomerBookings(c *gin.Context, db *mongo.Database) {
	// Get the logged-in customer's ID from the JWT middleware
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Customer ID not found",
		})
		return
	}

	customerID, ok := userID.(string)
	if !ok || customerID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid customer ID",
		})
		return
	}

	fmt.Println("Logged-in customer ID:", customerID)

	// Fetch bookings belonging to this customer
	bookings, err := services.GetCustomerBookings(
		c.Request.Context(),
		db,
		customerID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch customer bookings",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    bookings,
	})
}

func GetProviderOpenBookings(c *gin.Context, db *mongo.Database) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Provider ID not found",
		})
		return
	}

	providerID, ok := userID.(string)
	if !ok || providerID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid provider ID",
		})
		return
	}

	bookings, err := services.GetOpenProviderBookings(
		c.Request.Context(),
		db,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch open bookings",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    bookings,
	})
}

func AcceptProviderBooking(c *gin.Context, db *mongo.Database) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Provider ID not found",
		})
		return
	}

	providerID, ok := userID.(string)
	if !ok || providerID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid provider ID",
		})
		return
	}

	bookingID := c.Param("id")

	booking, err := services.AcceptProviderBooking(
		c.Request.Context(),
		db,
		providerID,
		bookingID,
	)
	if err != nil {
		statusCode := http.StatusInternalServerError

		if err.Error() == "invalid provider ID" ||
			err.Error() == "invalid booking ID" {
			statusCode = http.StatusBadRequest
		} else if err.Error() ==
			"booking not found or already accepted by another provider" {
			statusCode = http.StatusConflict
		}

		c.JSON(statusCode, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Booking accepted successfully",
		"data":    booking,
	})
}

func GetProviderBookings(c *gin.Context, db *mongo.Database) {
	providerID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Provider ID not found in token",
		})
		return
	}

	providerIDString, ok := providerID.(string)
	if !ok || providerIDString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid provider ID",
		})
		return
	}

	bookings, err := services.GetProviderBookings(
		c.Request.Context(),
		db,
		providerIDString,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    bookings,
	})
}

func GetProviderBookingByID(c *gin.Context, db *mongo.Database) {
	providerIDValue, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Provider ID not found in token",
		})
		return
	}

	providerID, ok := providerIDValue.(string)
	if !ok || providerID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid provider ID",
		})
		return
	}

	bookingID := c.Param("id")

	booking, err := services.GetProviderBookingByID(
		c.Request.Context(),
		db,
		providerID,
		bookingID,
	)

	if errors.Is(err, services.ErrProviderBookingNotFound) {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    booking,
	})
}
