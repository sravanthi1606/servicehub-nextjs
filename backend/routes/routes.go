package routes

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/sravanthi1606/servicehub-api/controllers"
)

func SetupRoutes(router *gin.Engine, mongoClient *mongo.Client) {

	auth := router.Group("/api/auth")

	{
		auth.POST("/register", func(c *gin.Context) {
			controllers.Register(c, mongoClient)
		})
	}
}
