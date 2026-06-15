package support

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
	supportGroup := router.Group("/support", authMw)
	
	// Renter/Seller routes
	supportGroup.Post("/tickets", h.CreateTicket)
	supportGroup.Get("/tickets", h.GetMyTickets)

	// Admin routes
	adminSupport := router.Group("/admin/support", authMw, adminMw)
	adminSupport.Get("/tickets", h.GetAllTickets)
	adminSupport.Put("/tickets/:id/status", h.UpdateStatus)
	adminSupport.Post("/tickets/:id/reply", h.AddAgentReply)
}

func (h *Handler) CreateTicket(c *fiber.Ctx) error {
	userEmail, _ := c.Locals("user_email").(string)
	
	var req struct {
		RenterName  string `json:"renterName"`
		RenterEmail string `json:"renterEmail"`
		Subject     string `json:"subject"`
		Description string `json:"description"`
		Priority    string `json:"priority"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(response.APIResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	// Fallback to token email if body email is empty
	email := req.RenterEmail
	if email == "" {
		email = userEmail
	}

	ticket := &SupportTicket{
		RenterName:  req.RenterName,
		RenterEmail: email,
		Subject:     req.Subject,
		Description: req.Description,
		Priority:    req.Priority,
	}

	if err := h.service.CreateTicket(ticket); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(response.APIResponse{
			Success: false,
			Error:   "Failed to create support ticket: " + err.Error(),
		})
	}

	return c.JSON(response.APIResponse{
		Success: true,
		Data:    ticket,
	})
}

func (h *Handler) GetMyTickets(c *fiber.Ctx) error {
	userEmail, ok := c.Locals("user_email").(string)
	if !ok || userEmail == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(response.APIResponse{
			Success: false,
			Error:   "Unauthorized",
		})
	}

	tickets, err := h.service.ListUserTickets(userEmail)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(response.APIResponse{
			Success: false,
			Error:   "Failed to retrieve tickets: " + err.Error(),
		})
	}

	return c.JSON(response.APIResponse{
		Success: true,
		Data:    tickets,
	})
}

func (h *Handler) GetAllTickets(c *fiber.Ctx) error {
	tickets, err := h.service.ListAllTickets()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(response.APIResponse{
			Success: false,
			Error:   "Failed to retrieve tickets: " + err.Error(),
		})
	}

	return c.JSON(response.APIResponse{
		Success: true,
		Data:    tickets,
	})
}

func (h *Handler) UpdateStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	
	var req struct {
		Status string `json:"status"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(response.APIResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	ticket, err := h.service.UpdateStatus(id, req.Status)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(response.APIResponse{
			Success: false,
			Error:   "Failed to update status: " + err.Error(),
		})
	}

	return c.JSON(response.APIResponse{
		Success: true,
		Data:    ticket,
	})
}

func (h *Handler) AddAgentReply(c *fiber.Ctx) error {
	id := c.Params("id")

	var req struct {
		Text string `json:"text"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(response.APIResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	ticket, err := h.service.AddAgentReply(id, req.Text)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(response.APIResponse{
			Success: false,
			Error:   "Failed to add reply: " + err.Error(),
		})
	}

	return c.JSON(response.APIResponse{
		Success: true,
		Data:    ticket,
	})
}
