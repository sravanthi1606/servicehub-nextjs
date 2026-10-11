package controllers

import (
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
