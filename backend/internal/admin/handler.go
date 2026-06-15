package admin

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/kloset/backend/pkg/response"
)

type Handler struct {
	service  *Service
	validate *validator.Validate
}

type RejectKYCPayload struct {
	Reason string `json:"reason" validate:"required"`
}

type ResolveDisputePayload struct {
	Resolution   string  `json:"resolution" validate:"required,oneof=full_refund_renter full_release_seller split dismissed"`
	Note         string  `json:"note" validate:"required"`
	RefundAmount float64 `json:"refund_amount" validate:"min=0"`
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service:  service,
		validate: validator.New(),
	}
}

func (h *Handler) GetStats(c *fiber.Ctx) error {
	stats, err := h.service.GetStats()
	if err != nil {
		return response.InternalError(c, err.Error())
	}
	return response.Success(c, "Platform stats retrieved", stats)
}

func (h *Handler) GetKYCQueue(c *fiber.Ctx) error {
	queue, err := h.service.ListKYCQueue()
	if err != nil {
		return response.InternalError(c, err.Error())
	}
	return response.Success(c, "KYC queue retrieved", queue)
}

func (h *Handler) ApproveKYC(c *fiber.Ctx) error {
	userID := c.Params("userId")
	if err := h.service.ApproveKYC(userID); err != nil {
		return response.BadRequest(c, err.Error())
	}
	return response.Success(c, "KYC verified and merchant activated", nil)
}

func (h *Handler) RejectKYC(c *fiber.Ctx) error {
	userID := c.Params("userId")
	var req RejectKYCPayload
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	if err := h.service.RejectKYC(userID, req.Reason); err != nil {
		return response.BadRequest(c, err.Error())
	}
	return response.Success(c, "KYC status updated to rejected", nil)
}

func (h *Handler) GetDisputes(c *fiber.Ctx) error {
	disputes, err := h.service.ListDisputes()
	if err != nil {
		return response.InternalError(c, err.Error())
	}
	return response.Success(c, "Disputes list retrieved", disputes)
}

func (h *Handler) ResolveDispute(c *fiber.Ctx) error {
	adminID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	id := c.Params("id")
	var req ResolveDisputePayload
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	if err := h.service.ResolveDispute(id, req.Resolution, req.Note, req.RefundAmount, adminID); err != nil {
		return response.BadRequest(c, err.Error())
	}
	return response.Success(c, "Dispute resolved successfully", nil)
}

func (h *Handler) GetPendingOutfits(c *fiber.Ctx) error {
	outfits, err := h.service.ListPendingOutfits()
	if err != nil {
		return response.InternalError(c, err.Error())
	}
	return response.Success(c, "Pending outfits retrieved", outfits)
}

func (h *Handler) ApproveOutfit(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.service.ApproveOutfit(id); err != nil {
		return response.BadRequest(c, err.Error())
	}
	return response.Success(c, "Outfit listing approved and active", nil)
}

func (h *Handler) RejectOutfit(c *fiber.Ctx) error {
	id := c.Params("id")
	var req RejectKYCPayload
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	if err := h.service.RejectOutfit(id, req.Reason); err != nil {
		return response.BadRequest(c, err.Error())
	}
	return response.Success(c, "Outfit listing rejected", nil)
}

func (h *Handler) GetAIOps(c *fiber.Ctx) error {
	stats, err := h.service.GetAIOpsStats()
	if err != nil {
		return response.InternalError(c, err.Error())
	}
	return response.Success(c, "AIOps intelligence retrieved", stats)
}

func (h *Handler) BanUser(c *fiber.Ctx) error {
	userID := c.Params("userId")
	if err := h.service.BanUser(userID); err != nil {
		return response.BadRequest(c, err.Error())
	}
	return response.Success(c, "User ban status toggled successfully", nil)
}

func (h *Handler) RegisterRoutes(router fiber.Router, authMiddleware fiber.Handler, adminMiddleware fiber.Handler) {
	admin := router.Group("/admin", authMiddleware, adminMiddleware)
	admin.Get("/stats", h.GetStats)
	admin.Get("/aiops", h.GetAIOps)
	admin.Get("/kyc", h.GetKYCQueue)
	admin.Put("/kyc/:userId/approve", h.ApproveKYC)
	admin.Put("/kyc/:userId/reject", h.RejectKYC)
	admin.Get("/outfits", h.GetPendingOutfits)
	admin.Put("/outfits/:id/approve", h.ApproveOutfit)
	admin.Put("/outfits/:id/reject", h.RejectOutfit)
	admin.Get("/disputes", h.GetDisputes)
	admin.Put("/disputes/:id/resolve", h.ResolveDispute)
	admin.Post("/users/:userId/ban", h.BanUser)
}
