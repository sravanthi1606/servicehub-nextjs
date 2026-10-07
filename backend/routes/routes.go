package routes

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/sravanthi1606/servicehub-api/controllers"
	"github.com/sravanthi1606/servicehub-api/middleware"
)

func SetupRoutes(router *gin.Engine, mongoClient *mongo.Client) {

	// MongoDB database
	db := mongoClient.Database("servicehub")

	// =====================================================
	// PUBLIC ROUTES
	// =====================================================

	auth := router.Group("/api/auth")

	{
		auth.POST("/register", func(c *gin.Context) {
			controllers.Register(c, mongoClient)
		})

		auth.POST("/login", func(c *gin.Context) {
			controllers.Login(c, mongoClient)
		})
	}

	// =====================================================
	// PROTECTED ROUTES
	// =====================================================

	protected := router.Group("/api")

	protected.Use(middleware.AuthMiddleware())

	// =====================================================
	// CUSTOMER ROUTES
	// =====================================================

	customer := protected.Group("/customer")

	customer.Use(middleware.RoleMiddleware("CUSTOMER"))

	{
		// Customer routes will be added here
	}

	// =====================================================
	// PROVIDER ROUTES
	// =====================================================

	provider := protected.Group("/provider")
	provider.Use(middleware.RoleMiddleware("PROVIDER"))
	{
		provider.POST("/services", func(c *gin.Context) {
			controllers.CreateService(c, db)
		})

		provider.GET("/services", func(c *gin.Context) {
			controllers.GetProviderServices(c, db)
		})

		provider.PUT("/services/:id", func(c *gin.Context) {
			controllers.UpdateService(c, db)
		})

		provider.PATCH("/services/:id/status", func(c *gin.Context) {
			controllers.UpdateServiceStatus(c, db)
		})
	}

	// =====================================================
	// ADMIN ROUTES
	// =====================================================

	admin := protected.Group("/admin")

	admin.Use(middleware.RoleMiddleware("ADMIN"))

	{
		// Admin routes will be added here
	}
}
