package dispute

import (
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

	var req RaiseDisputePayload
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	dispute, err := h.service.RaiseDispute(userID, &req)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Created(c, "Dispute raised successfully", dispute)
}

func (h *Handler) GetByID(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	id := c.Params("id")
	dispute, err := h.service.GetDispute(id, userID)
	if err != nil {
		return response.NotFound(c, err.Error())
	}

	return response.Success(c, "Dispute retrieved", dispute)
}

func (h *Handler) RegisterRoutes(router fiber.Router, authMiddleware fiber.Handler) {
	disputes := router.Group("/disputes", authMiddleware)
	disputes.Post("/", h.Create)
	disputes.Get("/:id", h.GetByID)
}
