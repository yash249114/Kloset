package payment

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

func (h *Handler) VerifyPayment(c *fiber.Ctx) error {
	var req VerifyPaymentRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	booking, err := h.service.VerifyPayment(&req)
	if err != nil {
		return response.BadRequest(c, "Payment verification failed: "+err.Error())
	}

	return response.Success(c, "Payment verified and booking confirmed", booking)
}

func (h *Handler) Webhook(c *fiber.Ctx) error {
	signature := c.Get("X-Razorpay-Signature")
	payload := c.Body()

	if err := h.service.HandleWebhook(payload, signature); err != nil {
		return response.BadRequest(c, "Webhook processing failed")
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) RegisterRoutes(router fiber.Router, authMiddleware fiber.Handler) {
	payments := router.Group("/payments")
	payments.Post("/verify", authMiddleware, h.VerifyPayment)
	payments.Post("/webhook", h.Webhook) // webhooks are public (called by Razorpay)
}
