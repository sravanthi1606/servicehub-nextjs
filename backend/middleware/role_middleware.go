package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {

		roleValue, exists := c.Get("role")

		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "User role not found",
			})
			c.Abort()
			return
		}

		role, ok := roleValue.(string)

		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Invalid user role",
			})
			c.Abort()
			return
		}

		for _, allowedRole := range allowedRoles {
			if role == allowedRole {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"message": "You are not authorized to access this resource",
		})

		c.Abort()
	}
}
