package http

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/max-weis/plantdiary/internal/database"
)

// RegisterStatusRoutes registers the status endpoints
func RegisterStatusRoutes(e *echo.Echo) {
	e.GET("/health", getHealth)
}

// getHealth is a simple health check endpoint
func getHealth(c echo.Context) error {
	db := database.FromContext(c.Request().Context())
	if err := db.Ping(); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"status": "error",
		})
	}
	
	return c.JSON(http.StatusOK, map[string]string{
		"status": "ok",
	})
}
