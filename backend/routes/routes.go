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
		// Get available services
		customer.GET("/services", func(c *gin.Context) {
			controllers.GetCustomerServices(c, db)
		})

		// Create a booking
		customer.POST("/bookings", func(c *gin.Context) {
			controllers.CreateBooking(c, db)
		})

		// Get bookings for the logged-in customer
		customer.GET("/bookings", func(c *gin.Context) {
			controllers.GetCustomerBookings(c, db)
		})
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

		// Get available bookings and bookings assigned to this provider.
		provider.GET("/bookings", func(c *gin.Context) {
			controllers.GetProviderBookings(c, db)
		})

		// Accept an available booking.
		provider.PATCH("/bookings/:id/accept", func(c *gin.Context) {
			controllers.AcceptProviderBooking(c, db)
		})

		provider.GET("/bookings/:id", func(c *gin.Context) {
			controllers.GetProviderBookingByID(c, db)
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
