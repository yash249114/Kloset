package booking

import (
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/kloset/backend/pkg/response"
)

type Handler struct {
	service  *Service
	validate *validator.Validate
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service:  service,
		validate: validator.New(),
	}
}

func (h *Handler) Create(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	var req CreateBookingRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	booking, err := h.service.Create(userID, &req)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Created(c, "Booking created", booking)
}

func (h *Handler) GetByID(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	id := c.Params("id")
	booking, err := h.service.GetByID(id, userID)
	if err != nil {
		return response.NotFound(c, err.Error())
	}

	return response.Success(c, "Booking retrieved", booking)
}

func (h *Handler) ListMyBookings(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	perPage, _ := strconv.Atoi(c.Query("per_page", "10"))
	status := c.Query("status", "")

	bookings, total, err := h.service.ListMyBookings(userID, page, perPage, status)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Paginated(c, bookings, page, perPage, total)
}

func (h *Handler) ListSellerBookings(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	perPage, _ := strconv.Atoi(c.Query("per_page", "10"))
	status := c.Query("status", "")

	bookings, total, err := h.service.ListSellerBookings(userID, page, perPage, status)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Paginated(c, bookings, page, perPage, total)
}

func (h *Handler) UpdateStatus(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	id := c.Params("id")

	var req UpdateBookingStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	booking, err := h.service.UpdateStatus(id, userID, req.Status)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Success(c, "Booking status updated", booking)
}

func (h *Handler) Cancel(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	id := c.Params("id")

	var req CancelBookingRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	if err := h.service.Cancel(id, userID, req.Reason); err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Success(c, "Booking cancelled successfully", nil)
}

func (h *Handler) Extend(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	id := c.Params("id")

	var req ExtendBookingRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	booking, err := h.service.Extend(id, userID, req.ExtraDays)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Success(c, "Booking extended successfully", booking)
}

func (h *Handler) RegisterRoutes(router fiber.Router, authMiddleware fiber.Handler) {
	bookings := router.Group("/bookings", authMiddleware)
	bookings.Post("/", h.Create)
	bookings.Get("/mine", h.ListMyBookings)
	bookings.Get("/seller", h.ListSellerBookings)
	bookings.Get("/:id", h.GetByID)
	bookings.Patch("/:id/status", h.UpdateStatus)
	bookings.Post("/:id/cancel", h.Cancel)
	bookings.Patch("/:id/extend", h.Extend)
}
