package user

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/kloset/backend/pkg/response"
)

// Handler handles HTTP requests for user operations
type Handler struct {
	service  *Service
	validate *validator.Validate
}

// NewHandler creates a new user handler
func NewHandler(service *Service) *Handler {
	return &Handler{
		service:  service,
		validate: validator.New(),
	}
}

// GetProfile handles GET /users/profile
func (h *Handler) GetProfile(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	profile, err := h.service.GetProfile(userID)
	if err != nil {
		return response.NotFound(c, err.Error())
	}

	return response.Success(c, "Profile retrieved", profile)
}

// UpdateProfile handles PUT /users/profile
func (h *Handler) UpdateProfile(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	var req UpdateProfileRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.service.UpdateProfile(userID, &req); err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Success(c, "Profile updated successfully", nil)
}

// SubmitKYC handles POST /users/kyc
func (h *Handler) SubmitKYC(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	if err := h.service.SubmitKYC(userID); err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Success(c, "KYC status set to submitted successfully", nil)
}

// GetAddresses handles GET /users/addresses
func (h *Handler) GetAddresses(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	addresses, err := h.service.GetAddresses(userID)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Success(c, "Addresses retrieved", addresses)
}

// AddAddress handles POST /users/addresses
func (h *Handler) AddAddress(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	var req AddAddressRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	address, err := h.service.AddAddress(userID, &req)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Created(c, "Address added", address)
}

// DeleteAddress handles DELETE /users/addresses/:id
func (h *Handler) DeleteAddress(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	addressID := c.Params("id")
	if err := h.service.DeleteAddress(userID, addressID); err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Success(c, "Address deleted", nil)
}

// SetDefaultAddress handles PUT /users/addresses/:id/default
func (h *Handler) SetDefaultAddress(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	addressID := c.Params("id")
	if err := h.service.SetDefaultAddress(userID, addressID); err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Success(c, "Default address updated", nil)
}

// RegisterRoutes sets up user routes
func (h *Handler) RegisterRoutes(router fiber.Router, authMiddleware fiber.Handler) {
	users := router.Group("/users", authMiddleware)
	users.Get("/profile", h.GetProfile)
	users.Put("/profile", h.UpdateProfile)
	users.Post("/kyc", h.SubmitKYC)
	users.Get("/addresses", h.GetAddresses)
	users.Post("/addresses", h.AddAddress)
	users.Delete("/addresses/:id", h.DeleteAddress)
	users.Put("/addresses/:id/default", h.SetDefaultAddress)
}
