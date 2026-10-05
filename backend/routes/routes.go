package routes

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/sravanthi1606/servicehub-api/controllers"
	"github.com/sravanthi1606/servicehub-api/middleware"
)

func SetupRoutes(router *gin.Engine, mongoClient *mongo.Client) {

	// Public routes
	auth := router.Group("/api/auth")

	{
		auth.POST("/register", func(c *gin.Context) {
			controllers.Register(c, mongoClient)
		})

		auth.POST("/login", func(c *gin.Context) {
			controllers.Login(c, mongoClient)
		})
	}

	// Authentication required
	protected := router.Group("/api")

	protected.Use(middleware.AuthMiddleware())

	{
		// Any logged-in user
		protected.GET("/test-auth", func(c *gin.Context) {

			userID, _ := c.Get("userId")
			role, _ := c.Get("role")

			c.JSON(200, gin.H{
				"success": true,
				"message": "Authentication successful",
				"userId":  userID,
				"role":    role,
			})
		})

		// Customer only
		customer := protected.Group("/customer")

		customer.Use(middleware.RoleMiddleware("CUSTOMER"))

		{
			customer.GET("/test", func(c *gin.Context) {

				c.JSON(200, gin.H{
					"success": true,
					"message": "Customer API accessed successfully",
				})
			})
		}

		// Provider only
		provider := protected.Group("/provider")

		provider.Use(middleware.RoleMiddleware("PROVIDER"))

		{
			provider.GET("/test", func(c *gin.Context) {

				c.JSON(200, gin.H{
					"success": true,
					"message": "Provider API accessed successfully",
				})
			})
		}

		// Admin only
		admin := protected.Group("/admin")

		admin.Use(middleware.RoleMiddleware("ADMIN"))

		{
			admin.GET("/test", func(c *gin.Context) {

				c.JSON(200, gin.H{
					"success": true,
					"message": "Admin API accessed successfully",
				})
			})
		}
	}
}
