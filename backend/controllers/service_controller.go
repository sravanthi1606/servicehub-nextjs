package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/sravanthi1606/servicehub-api/dto"
	"github.com/sravanthi1606/servicehub-api/services"
)

func CreateService(c *gin.Context, db *mongo.Database) {

	var req dto.CreateServiceRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
		})
		return
	}

	// Get provider ID from JWT
	userIDValue, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User ID not found",
		})
		return
	}

	providerID, ok := userIDValue.(string)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid provider ID",
		})
		return
	}

	service, err := services.CreateService(
		c.Request.Context(),
		db,
		providerID,
		req,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Service created successfully",
		"data":    service,
	})
}

func GetProviderServices(c *gin.Context, db *mongo.Database) {

	userIDValue, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User ID not found",
		})
		return
	}

	providerID, ok := userIDValue.(string)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid provider ID",
		})
		return
	}

	servicesList, err := services.GetProviderServices(
		c.Request.Context(),
		db,
		providerID,
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
		"message": "Services fetched successfully",
		"data":    servicesList,
	})
}

func UpdateService(c *gin.Context, db *mongo.Database) {

	serviceID := c.Param("id")

	var req dto.UpdateServiceRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
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

	providerID, ok := userIDValue.(string)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid provider ID",
		})
		return
	}

	service, err := services.UpdateService(
		c.Request.Context(),
		db,
		providerID,
		serviceID,
		req,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Service updated successfully",
		"data":    service,
	})
}

func UpdateServiceStatus(c *gin.Context, db *mongo.Database) {

	serviceID := c.Param("id")

	var req dto.UpdateServiceStatusRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Status must be ACTIVE or INACTIVE",
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

	providerID, ok := userIDValue.(string)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid provider ID",
		})
		return
	}

	service, err := services.UpdateServiceStatus(
		c.Request.Context(),
		db,
		providerID,
		serviceID,
		req.Status,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Service status updated successfully",
		"data":    service,
	})
}
