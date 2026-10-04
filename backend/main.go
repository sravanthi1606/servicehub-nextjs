package main

import (
	"fmt"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/sravanthi1606/servicehub-api/config"
	"github.com/sravanthi1606/servicehub-api/database"
	"github.com/sravanthi1606/servicehub-api/routes"
)

func main() {

	err := config.LoadConfig()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	mongoClient, err := database.ConnectMongoDB(
		config.GetMongoURI(),
	)

	if err != nil {
		log.Fatal("MongoDB connection failed:", err)
	}

	router := gin.Default()

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "ServiceHub API is running",
		})
	})

	routes.SetupRoutes(router, mongoClient)

	port := config.GetPort()

	fmt.Println("ServiceHub API running on http://localhost:" + port)

	router.Run(":" + port)
}
