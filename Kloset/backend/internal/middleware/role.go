package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/kloset/backend/pkg/response"
)

// RoleGuard restricts access to specific roles
func RoleGuard(allowedRoles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userRole, ok := c.Locals("user_role").(string)
		if !ok || userRole == "" {
			return response.Unauthorized(c, "Authentication required")
		}

		for _, role := range allowedRoles {
			if userRole == role {
				return c.Next()
			}
		}

		return response.Forbidden(c, "You don't have permission to access this resource")
	}
}

// SellerOnly restricts to seller role
func SellerOnly() fiber.Handler {
	return RoleGuard("seller", "admin")
}

// AdminOnly restricts to admin role
func AdminOnly() fiber.Handler {
	return RoleGuard("admin")
}

// RenterOnly restricts to renter role
func RenterOnly() fiber.Handler {
	return RoleGuard("renter", "admin")
}
