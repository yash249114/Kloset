package logging

import (
	"github.com/gofiber/fiber/v2"
	"github.com/kloset/backend/pkg/response"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(router fiber.Router, authMw fiber.Handler, adminMw fiber.Handler) {
	adminRouter := router.Group("/admin", authMw, adminMw)
	adminRouter.Get("/logs", h.GetLogs)
}

func (h *Handler) GetLogs(c *fiber.Ctx) error {
	logs, err := h.service.ListLogs()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(response.APIResponse{
			Success: false,
			Error:   "Failed to load system audit logs",
		})
	}

	return c.JSON(response.APIResponse{
		Success: true,
		Data:    logs,
	})
}
