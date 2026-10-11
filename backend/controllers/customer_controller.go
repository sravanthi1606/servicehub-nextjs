package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/sravanthi1606/servicehub-api/services"
)

func GetCustomerServices(c *gin.Context, db *mongo.Database) {

	customerServices, err := services.GetCustomerServices(
		c.Request.Context(),
		db,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch services",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    customerServices,
	})
}
