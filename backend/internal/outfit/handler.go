package outfit

import (
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/kloset/backend/pkg/response"
)

// Handler handles HTTP requests for outfits
type Handler struct {
	service  *Service
	validate *validator.Validate
}

// NewHandler creates a new outfit handler
func NewHandler(service *Service) *Handler {
	return &Handler{
		service:  service,
		validate: validator.New(),
	}
}

// Browse handles GET /outfits
func (h *Handler) Browse(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	perPage, _ := strconv.Atoi(c.Query("per_page", "20"))
	minPrice, _ := strconv.ParseFloat(c.Query("min_price", "0"), 64)
	maxPrice, _ := strconv.ParseFloat(c.Query("max_price", "0"), 64)

	filters := &OutfitFilters{
		Query:    c.Query("q"),
		City:     c.Query("city"),
		Category: c.Query("category"),
		Size:     c.Query("size"),
		MinPrice: minPrice,
		MaxPrice: maxPrice,
		Occasion: c.Query("occasion"),
		Sort:     c.Query("sort"),
		Page:     page,
		PerPage:  perPage,
	}

	outfits, total, err := h.service.Browse(filters)
	if err != nil {
		return response.InternalError(c, "Failed to fetch outfits")
	}

	return response.Paginated(c, outfits, page, perPage, total)
}

// GetByID handles GET /outfits/:id
func (h *Handler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")

	var userID *string
	if uid, ok := c.Locals("user_id").(string); ok {
		userID = &uid
	}

	outfit, err := h.service.GetByID(id, userID)
	if err != nil {
		return response.NotFound(c, err.Error())
	}

	return response.Success(c, "Outfit retrieved", outfit)
}

// Create handles POST /outfits
func (h *Handler) Create(c *fiber.Ctx) error {
	sellerID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	var req CreateOutfitRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, "Validation failed: "+err.Error())
	}

	outfit, err := h.service.Create(sellerID, &req)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Created(c, "Outfit created", outfit)
}

// Update handles PUT /outfits/:id
func (h *Handler) Update(c *fiber.Ctx) error {
	sellerID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	outfitID := c.Params("id")

	var req UpdateOutfitRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	if err := h.service.Update(outfitID, sellerID, &req); err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Success(c, "Outfit updated", nil)
}

// Delete handles DELETE /outfits/:id
func (h *Handler) Delete(c *fiber.Ctx) error {
	sellerID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	outfitID := c.Params("id")

	if err := h.service.Delete(outfitID, sellerID); err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Success(c, "Outfit deleted", nil)
}

// GetTrending handles GET /outfits/trending
func (h *Handler) GetTrending(c *fiber.Ctx) error {
	limit, _ := strconv.Atoi(c.Query("limit", "12"))

	outfits, err := h.service.GetTrending(limit)
	if err != nil {
		return response.InternalError(c, "Failed to fetch trending outfits")
	}

	return response.Success(c, "Trending outfits", outfits)
}

// SubmitForApproval handles PUT /outfits/:id/submit
func (h *Handler) SubmitForApproval(c *fiber.Ctx) error {
	sellerID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	outfitID := c.Params("id")

	if err := h.service.SubmitForApproval(outfitID, sellerID); err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Success(c, "Outfit submitted for approval", nil)
}

// TrackView handles POST /outfits/:id/view
func (h *Handler) TrackView(c *fiber.Ctx) error {
	// Already tracked in GetByID, this is for explicit tracking
	return response.Success(c, "View tracked", nil)
}

// AddToWishlist handles POST /wishlist/:outfitId
func (h *Handler) AddToWishlist(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	outfitID := c.Params("outfitId")

	if err := h.service.AddToWishlist(userID, outfitID); err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Success(c, "Added to wishlist", nil)
}

// RemoveFromWishlist handles DELETE /wishlist/:outfitId
func (h *Handler) RemoveFromWishlist(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	outfitID := c.Params("outfitId")

	if err := h.service.RemoveFromWishlist(userID, outfitID); err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Success(c, "Removed from wishlist", nil)
}

// GetWishlist handles GET /wishlist
func (h *Handler) GetWishlist(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	perPage, _ := strconv.Atoi(c.Query("per_page", "20"))

	outfits, total, err := h.service.GetWishlist(userID, page, perPage)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Paginated(c, outfits, page, perPage, total)
}

// GetSellerOutfits handles GET /seller/outfits
func (h *Handler) GetSellerOutfits(c *fiber.Ctx) error {
	sellerID, ok := c.Locals("user_id").(string)
	if !ok {
		return response.Unauthorized(c, "Authentication required")
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	perPage, _ := strconv.Atoi(c.Query("per_page", "20"))

	outfits, total, err := h.service.GetSellerOutfits(sellerID, page, perPage)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	return response.Paginated(c, outfits, page, perPage, total)
}

// RegisterRoutes sets up outfit routes
func (h *Handler) RegisterRoutes(router fiber.Router, authMw fiber.Handler, optionalAuthMw fiber.Handler, sellerMw fiber.Handler) {
	// Public routes
	outfits := router.Group("/outfits")
	outfits.Get("/", optionalAuthMw, h.Browse)
	outfits.Get("/trending", h.GetTrending)
	outfits.Get("/:id", optionalAuthMw, h.GetByID)
	outfits.Post("/:id/view", h.TrackView)

	// Seller routes
	outfits.Post("/", authMw, sellerMw, h.Create)
	outfits.Put("/:id", authMw, sellerMw, h.Update)
	outfits.Delete("/:id", authMw, sellerMw, h.Delete)
	outfits.Put("/:id/submit", authMw, sellerMw, h.SubmitForApproval)

	// Wishlist routes
	wishlist := router.Group("/wishlist", authMw)
	wishlist.Get("/", h.GetWishlist)
	wishlist.Post("/:outfitId", h.AddToWishlist)
	wishlist.Delete("/:outfitId", h.RemoveFromWishlist)

	// Seller outfit management
	seller := router.Group("/seller", authMw, sellerMw)
	seller.Get("/outfits", h.GetSellerOutfits)
}
