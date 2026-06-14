package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// CORSMiddleware configures CORS for the API
func CORSMiddleware(frontendURL string) fiber.Handler {
	// Security: Fiber panics if AllowCredentials=true and AllowOrigins is "*" or empty.
	// Validate and fallback to a safe default to prevent deployment crashes.
	if frontendURL == "" || frontendURL == "*" {
		frontendURL = "http://localhost:3000"
	}

	return cors.New(cors.Config{
		AllowOrigins:     frontendURL,
		AllowMethods:     "GET,POST,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization,X-Requested-With",
		AllowCredentials: true,
		ExposeHeaders:    "Content-Length,Content-Type",
		MaxAge:           86400,
	})
}
