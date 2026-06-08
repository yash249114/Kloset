package outfit

import (
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"github.com/lib/pq"
)

// Service handles outfit business logic
type Service struct {
	repo *Repository
}

// NewService creates a new outfit service
func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

// Create creates a new outfit listing
func (s *Service) Create(sellerID string, req *CreateOutfitRequest) (*OutfitResponse, error) {
	sid, err := uuid.Parse(sellerID)
	if err != nil {
		return nil, errors.New("invalid seller ID")
	}

	// Generate unique slug
	outfitSlug := slug.Make(req.Title)
	exists, _ := s.repo.SlugExists(outfitSlug)
	if exists {
		outfitSlug = fmt.Sprintf("%s-%s", outfitSlug, uuid.New().String()[:8])
	}

	desc := req.Description
	images := make([]OutfitImage, len(req.Images))
	for i, img := range req.Images {
		cid := img.CloudinaryID
		images[i] = OutfitImage{
			URL:          img.URL,
			CloudinaryID: &cid,
			IsPrimary:    img.IsPrimary,
			SortOrder:    img.SortOrder,
		}
	}

	outfit := &Outfit{
		SellerID:            sid,
		Title:               req.Title,
		Slug:                outfitSlug,
		Description:         &desc,
		Category:            req.Category,
		Occasions:           pq.StringArray(req.Occasions),
		Colors:              pq.StringArray(req.Colors),
		Fabric:              &req.Fabric,
		Sizes:               pq.StringArray(req.Sizes),
		AccessoriesIncluded: pq.StringArray(req.AccessoriesIncluded),
		City:                &req.City,
		State:               &req.State,
		Pincode:             &req.Pincode,
		Price1Day:           &req.Price1Day,
		Price3Day:           &req.Price3Day,
		Price7Day:           &req.Price7Day,
		SecurityDeposit:     &req.SecurityDeposit,
		DeliveryAvailable:   req.DeliveryAvailable,
		DeliveryFee:         req.DeliveryFee,
		Status:              "draft",
		Images:              images,
	}

	if err := s.repo.Create(outfit); err != nil {
		return nil, errors.New("failed to create outfit")
	}

	return s.outfitToResponse(outfit, false), nil
}

// GetByID returns an outfit by its ID
func (s *Service) GetByID(id string, userID *string) (*OutfitResponse, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return nil, errors.New("invalid outfit ID")
	}

	outfit, err := s.repo.FindByID(uid)
	if err != nil {
		return nil, err
	}
	if outfit == nil {
		return nil, errors.New("outfit not found")
	}

	// Increment view count (don't fail on error)
	_ = s.repo.IncrementViewCount(uid)

	// Check if wishlisted by current user
	isWishlisted := false
	if userID != nil {
		if userUUID, err := uuid.Parse(*userID); err == nil {
			isWishlisted, _ = s.repo.IsWishlisted(userUUID, uid)
		}
	}

	return s.outfitToResponse(outfit, isWishlisted), nil
}

// Browse returns paginated outfit listings
func (s *Service) Browse(filters *OutfitFilters) ([]OutfitResponse, int64, error) {
	outfits, total, err := s.repo.Browse(filters)
	if err != nil {
		return nil, 0, err
	}

	result := make([]OutfitResponse, len(outfits))
	for i, o := range outfits {
		result[i] = *s.outfitToResponse(&o, false)
	}

	return result, total, nil
}

// GetSellerOutfits returns outfits owned by a seller
func (s *Service) GetSellerOutfits(sellerID string, page, perPage int) ([]OutfitResponse, int64, error) {
	sid, err := uuid.Parse(sellerID)
	if err != nil {
		return nil, 0, errors.New("invalid seller ID")
	}

	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 50 {
		perPage = 20
	}
	offset := (page - 1) * perPage

	outfits, total, err := s.repo.FindBySellerID(sid, offset, perPage)
	if err != nil {
		return nil, 0, err
	}

	result := make([]OutfitResponse, len(outfits))
	for i, o := range outfits {
		result[i] = *s.outfitToResponse(&o, false)
	}

	return result, total, nil
}

// Update updates an outfit
func (s *Service) Update(outfitID, sellerID string, req *UpdateOutfitRequest) error {
	oid, err := uuid.Parse(outfitID)
	if err != nil {
		return errors.New("invalid outfit ID")
	}

	// Verify ownership
	outfit, err := s.repo.FindByID(oid)
	if err != nil || outfit == nil {
		return errors.New("outfit not found")
	}
	if outfit.SellerID.String() != sellerID {
		return errors.New("you can only edit your own outfits")
	}

	updates := make(map[string]interface{})
	if req.Title != nil {
		updates["title"] = *req.Title
		updates["slug"] = slug.Make(*req.Title)
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.Category != nil {
		updates["category"] = *req.Category
	}
	if req.Occasions != nil {
		updates["occasions"] = pq.StringArray(*req.Occasions)
	}
	if req.Colors != nil {
		updates["colors"] = pq.StringArray(*req.Colors)
	}
	if req.Sizes != nil {
		updates["sizes"] = pq.StringArray(*req.Sizes)
	}
	if req.Price1Day != nil {
		updates["price_1day"] = *req.Price1Day
	}
	if req.Price3Day != nil {
		updates["price_3day"] = *req.Price3Day
	}
	if req.Price7Day != nil {
		updates["price_7day"] = *req.Price7Day
	}
	if req.SecurityDeposit != nil {
		updates["security_deposit"] = *req.SecurityDeposit
	}
	if req.City != nil {
		updates["city"] = *req.City
	}
	if req.State != nil {
		updates["state"] = *req.State
	}
	if req.DeliveryAvailable != nil {
		updates["delivery_available"] = *req.DeliveryAvailable
	}

	return s.repo.Update(oid, updates)
}

// Delete soft-deletes an outfit
func (s *Service) Delete(outfitID, sellerID string) error {
	oid, err := uuid.Parse(outfitID)
	if err != nil {
		return errors.New("invalid outfit ID")
	}
	sid, err := uuid.Parse(sellerID)
	if err != nil {
		return errors.New("invalid seller ID")
	}
	return s.repo.SoftDelete(oid, sid)
}

// SubmitForApproval changes status to pending_approval
func (s *Service) SubmitForApproval(outfitID, sellerID string) error {
	oid, err := uuid.Parse(outfitID)
	if err != nil {
		return errors.New("invalid outfit ID")
	}

	outfit, err := s.repo.FindByID(oid)
	if err != nil || outfit == nil {
		return errors.New("outfit not found")
	}
	if outfit.SellerID.String() != sellerID {
		return errors.New("you can only submit your own outfits")
	}
	if outfit.Status != "draft" {
		return errors.New("only draft outfits can be submitted for approval")
	}

	return s.repo.Update(oid, map[string]interface{}{
		"status": "pending_approval",
	})
}

// GetTrending returns trending outfits
func (s *Service) GetTrending(limit int) ([]OutfitResponse, error) {
	if limit < 1 || limit > 50 {
		limit = 12
	}
	outfits, err := s.repo.FindTrending(limit)
	if err != nil {
		return nil, err
	}

	result := make([]OutfitResponse, len(outfits))
	for i, o := range outfits {
		result[i] = *s.outfitToResponse(&o, false)
	}
	return result, nil
}

// AddToWishlist adds an outfit to the user's wishlist
func (s *Service) AddToWishlist(userID, outfitID string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return errors.New("invalid user ID")
	}
	oid, err := uuid.Parse(outfitID)
	if err != nil {
		return errors.New("invalid outfit ID")
	}
	return s.repo.AddToWishlist(uid, oid)
}

// RemoveFromWishlist removes an outfit from the user's wishlist
func (s *Service) RemoveFromWishlist(userID, outfitID string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return errors.New("invalid user ID")
	}
	oid, err := uuid.Parse(outfitID)
	if err != nil {
		return errors.New("invalid outfit ID")
	}
	return s.repo.RemoveFromWishlist(uid, oid)
}

// GetWishlist returns the user's wishlisted outfits
func (s *Service) GetWishlist(userID string, page, perPage int) ([]OutfitResponse, int64, error) {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, 0, errors.New("invalid user ID")
	}

	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 50 {
		perPage = 20
	}
	offset := (page - 1) * perPage

	outfits, total, err := s.repo.GetWishlist(uid, offset, perPage)
	if err != nil {
		return nil, 0, err
	}

	result := make([]OutfitResponse, len(outfits))
	for i, o := range outfits {
		result[i] = *s.outfitToResponse(&o, true)
	}

	return result, total, nil
}

// outfitToResponse converts an Outfit model to response DTO
func (s *Service) outfitToResponse(o *Outfit, isWishlisted bool) *OutfitResponse {
	images := make([]ImageResponse, len(o.Images))
	for i, img := range o.Images {
		images[i] = ImageResponse{
			ID:        img.ID.String(),
			URL:       img.URL,
			IsPrimary: img.IsPrimary,
			SortOrder: img.SortOrder,
		}
	}

	resp := &OutfitResponse{
		ID:                  o.ID.String(),
		SellerID:            o.SellerID.String(),
		Title:               o.Title,
		Slug:                o.Slug,
		Description:         o.Description,
		AIDescription:       o.AIDescription,
		Category:            o.Category,
		Occasions:           nullableSlice(o.Occasions),
		Colors:              nullableSlice(o.Colors),
		Fabric:              o.Fabric,
		Sizes:               nullableSlice(o.Sizes),
		AccessoriesIncluded: nullableSlice(o.AccessoriesIncluded),
		City:                o.City,
		State:               o.State,
		Price1Day:           o.Price1Day,
		Price3Day:           o.Price3Day,
		Price7Day:           o.Price7Day,
		SecurityDeposit:     o.SecurityDeposit,
		DeliveryAvailable:   o.DeliveryAvailable,
		DeliveryFee:         o.DeliveryFee,
		Status:              o.Status,
		RatingAvg:           o.RatingAvg,
		RatingCount:         o.RatingCount,
		ViewCount:           o.ViewCount,
		WishlistCount:       o.WishlistCount,
		Images:              images,
		IsWishlisted:        isWishlisted,
		CreatedAt:           o.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	if o.Seller != nil {
		resp.Seller = &SellerResponse{
			ID:         o.Seller.ID.String(),
			Name:       o.Seller.Name,
			AvatarURL:  o.Seller.AvatarURL,
			IsVerified: o.Seller.IsVerified,
			TrustScore: o.Seller.TrustScore,
		}
	}

	return resp
}

func nullableSlice(s []string) []string {
	if s == nil {
		return []string{}
	}
	return s
}

// ensure strings import is used
var _ = strings.Join
