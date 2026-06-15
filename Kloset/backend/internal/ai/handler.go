package ai

import (
	"github.com/gofiber/fiber/v2"
	"github.com/kloset/backend/pkg/response"
)

// Handler handles AI-related HTTP endpoints
type Handler struct {
	service *Service
}

// NewHandler creates a new AI handler
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// Chat handles POST /ai/chat
func (h *Handler) Chat(c *fiber.Ctx) error {
	var req ChatRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if req.Message == "" {
		return response.BadRequest(c, "Message is required")
	}

	result, err := h.service.Chat(&req)
	if err != nil {
		return response.InternalError(c, "AI service error: "+err.Error())
	}

	return response.Success(c, "AI response generated", result)
}

// Describe handles POST /ai/describe
func (h *Handler) Describe(c *fiber.Ctx) error {
	var req DescribeRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if req.Title == "" {
		return response.BadRequest(c, "Title is required")
	}

	result, err := h.service.Describe(&req)
	if err != nil {
		return response.InternalError(c, "AI description generation failed: "+err.Error())
	}

	return response.Success(c, "Description generated", result)
}

// Recommend handles POST /ai/recommend
func (h *Handler) Recommend(c *fiber.Ctx) error {
	var req RecommendRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	result, err := h.service.Recommend(&req)
	if err != nil {
		return response.InternalError(c, "AI recommendation failed: "+err.Error())
	}

	return response.Success(c, "Recommendations generated", result)
}

// RegisterRoutes registers AI routes
func (h *Handler) RegisterRoutes(api fiber.Router, authMw fiber.Handler) {
	ai := api.Group("/ai")
	ai.Post("/chat", h.Chat)                  // Public — anyone can use AI stylist
	ai.Post("/recommend", h.Recommend)        // Public — styling advisor
	ai.Post("/describe", authMw, h.Describe) // Authenticated — for sellers generating descriptions
}
