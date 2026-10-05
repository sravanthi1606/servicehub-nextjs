package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/sravanthi1606/servicehub-api/models"
	"github.com/sravanthi1606/servicehub-api/services"
)

func Register(c *gin.Context, mongoClient *mongo.Client) {

	var request models.RegisterRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request",
			"error":   err.Error(),
		})
		return
	}

	user, err := services.RegisterUser(
		c.Request.Context(),
		mongoClient,
		request,
	)

	if err != nil {

		if err.Error() == "email already registered" {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"message": "Email already registered",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Unable to register user",
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Registration successful",
		"data": gin.H{
			"id":      user.ID,
			"name":    user.Name,
			"email":   user.Email,
			"phone":   user.Phone,
			"role":    user.Role,
			"address": user.Address,
		},
	})
}

func Login(c *gin.Context, mongoClient *mongo.Client) {

	var request models.LoginRequest

	// Read and validate request body
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request",
			"error":   err.Error(),
		})
		return
	}

	// Call login service
	user, token, err := services.LoginUser(
		c.Request.Context(),
		mongoClient,
		request,
	)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid email or password",
		})
		return
	}

	// Successful login
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login successful",
		"data": gin.H{
			"token": token,
			"user": gin.H{
				"id":    user.ID,
				"name":  user.Name,
				"email": user.Email,
				"phone": user.Phone,
				"role":  user.Role,
			},
		},
	})
}
