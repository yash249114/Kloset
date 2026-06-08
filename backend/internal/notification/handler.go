package notification

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/kloset/backend/pkg/response"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) ListNotifications(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	perPage, _ := strconv.Atoi(c.Query("per_page", "20"))

	notifs, total, unread, err := h.service.ListNotifications(userID, page, perPage)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Notifications retrieved",
		"data":    notifs,
		"meta": fiber.Map{
			"page":       page,
			"per_page":   perPage,
			"total":      total,
			"unread":     unread,
		},
	})
}

func (h *Handler) MarkAsRead(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	id := c.Params("id")
	if err := h.service.MarkAsRead(id, userID); err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Success(c, "Notification marked as read", nil)
}

func (h *Handler) MarkAllAsRead(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	if err := h.service.MarkAllAsRead(userID); err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Success(c, "All notifications marked as read", nil)
}

func (h *Handler) RegisterRoutes(router fiber.Router, authMiddleware fiber.Handler) {
	notifs := router.Group("/notifications", authMiddleware)
	notifs.Get("/", h.ListNotifications)
	notifs.Put("/read-all", h.MarkAllAsRead)
	notifs.Put("/:id/read", h.MarkAsRead)
}
