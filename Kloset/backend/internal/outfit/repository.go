package outfit

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

// Repository handles database operations for outfits
type Repository struct {
	db *gorm.DB
}

// NewRepository creates a new outfit repository
func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

// Create inserts a new outfit
func (r *Repository) Create(outfit *Outfit) error {
	return r.db.Create(outfit).Error
}

// FindByID finds an outfit by UUID with images and seller info
func (r *Repository) FindByID(id uuid.UUID) (*Outfit, error) {
	var outfit Outfit
	err := r.db.
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		Preload("Seller").
		Where("id = ? AND deleted_at IS NULL", id).
		First(&outfit).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &outfit, nil
}

// FindBySlug finds an outfit by its URL slug
func (r *Repository) FindBySlug(slug string) (*Outfit, error) {
	var outfit Outfit
	err := r.db.
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		Preload("Seller").
		Where("slug = ? AND deleted_at IS NULL", slug).
		First(&outfit).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &outfit, nil
}

// Browse returns paginated outfits with filters
func (r *Repository) Browse(filters *OutfitFilters) ([]Outfit, int64, error) {
	var outfits []Outfit
	var total int64

	query := r.db.Model(&Outfit{}).Where("outfits.status = 'active' AND outfits.deleted_at IS NULL")

	// Full-text search
	if filters.Query != "" {
		query = query.Where("outfits.search_vector @@ plainto_tsquery('english', ?)", filters.Query)
	}

	// City filter
	if filters.City != "" {
		query = query.Where("outfits.city ILIKE ?", "%"+filters.City+"%")
	}

	// Category filter
	if filters.Category != "" {
		query = query.Where("outfits.category = ?", filters.Category)
	}

	// Size filter
	if filters.Size != "" {
		query = query.Where("? = ANY(outfits.sizes)", filters.Size)
	}

	// Price range
	if filters.MinPrice > 0 {
		query = query.Where("outfits.price_1day >= ?", filters.MinPrice)
	}
	if filters.MaxPrice > 0 {
		query = query.Where("outfits.price_1day <= ?", filters.MaxPrice)
	}

	// Occasion filter
	if filters.Occasion != "" {
		query = query.Where("? = ANY(outfits.occasions)", filters.Occasion)
	}

	// Count total
	query.Count(&total)

	// Sorting
	switch filters.Sort {
	case "price_asc":
		query = query.Order("outfits.price_1day ASC")
	case "price_desc":
		query = query.Order("outfits.price_1day DESC")
	case "rating":
		query = query.Order("outfits.rating_avg DESC")
	case "newest":
		query = query.Order("outfits.created_at DESC")
	case "popular":
		query = query.Order("outfits.booking_count DESC")
	default:
		query = query.Order("outfits.created_at DESC")
	}

	// Pagination
	page := filters.Page
	if page < 1 {
		page = 1
	}
	perPage := filters.PerPage
	if perPage < 1 || perPage > 50 {
		perPage = 20
	}
	offset := (page - 1) * perPage

	err := query.
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		Preload("Seller").
		Offset(offset).Limit(perPage).
		Find(&outfits).Error

	return outfits, total, err
}

// FindBySellerID returns outfits owned by a specific seller
func (r *Repository) FindBySellerID(sellerID uuid.UUID, offset, limit int) ([]Outfit, int64, error) {
	var outfits []Outfit
	var total int64

	query := r.db.Model(&Outfit{}).Where("seller_id = ? AND deleted_at IS NULL", sellerID)
	query.Count(&total)

	err := query.
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		Offset(offset).Limit(limit).
		Order("created_at DESC").
		Find(&outfits).Error

	return outfits, total, err
}

// Update updates an outfit
func (r *Repository) Update(id uuid.UUID, updates map[string]interface{}) error {
	return r.db.Model(&Outfit{}).Where("id = ?", id).Updates(updates).Error
}

// SoftDelete soft deletes an outfit
func (r *Repository) SoftDelete(id, sellerID uuid.UUID) error {
	return r.db.Where("id = ? AND seller_id = ?", id, sellerID).Delete(&Outfit{}).Error
}

// AddImage adds an image to an outfit
func (r *Repository) AddImage(image *OutfitImage) error {
	// Count existing images
	var count int64
	r.db.Model(&OutfitImage{}).Where("outfit_id = ?", image.OutfitID).Count(&count)
	if count >= 6 {
		return fmt.Errorf("maximum of 6 images per outfit reached")
	}

	// If it's the first image, make it primary
	if count == 0 {
		image.IsPrimary = true
	}
	image.SortOrder = int(count)

	return r.db.Create(image).Error
}

// DeleteImage removes an image
func (r *Repository) DeleteImage(imageID, outfitID uuid.UUID) error {
	return r.db.Where("id = ? AND outfit_id = ?", imageID, outfitID).Delete(&OutfitImage{}).Error
}

// SetPrimaryImage sets an image as primary and unsets others
func (r *Repository) SetPrimaryImage(imageID, outfitID uuid.UUID) error {
	tx := r.db.Begin()
	tx.Model(&OutfitImage{}).Where("outfit_id = ?", outfitID).Update("is_primary", false)
	tx.Model(&OutfitImage{}).Where("id = ? AND outfit_id = ?", imageID, outfitID).Update("is_primary", true)
	return tx.Commit().Error
}

// GetImageCount returns the number of images for an outfit
func (r *Repository) GetImageCount(outfitID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.Model(&OutfitImage{}).Where("outfit_id = ?", outfitID).Count(&count).Error
	return count, err
}

// IncrementViewCount increments the view counter
func (r *Repository) IncrementViewCount(id uuid.UUID) error {
	return r.db.Model(&Outfit{}).Where("id = ?", id).
		UpdateColumn("view_count", gorm.Expr("view_count + 1")).Error
}

// IsWishlisted checks if a user has wishlisted an outfit
func (r *Repository) IsWishlisted(userID, outfitID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.Model(&Wishlist{}).Where("user_id = ? AND outfit_id = ?", userID, outfitID).Count(&count).Error
	return count > 0, err
}

// AddToWishlist adds an outfit to a user's wishlist
func (r *Repository) AddToWishlist(userID, outfitID uuid.UUID) error {
	wishlist := &Wishlist{
		UserID:   userID,
		OutfitID: outfitID,
	}
	result := r.db.Create(wishlist)
	if result.Error != nil {
		return result.Error
	}
	// Increment wishlist count
	r.db.Model(&Outfit{}).Where("id = ?", outfitID).
		UpdateColumn("wishlist_count", gorm.Expr("wishlist_count + 1"))
	return nil
}

// RemoveFromWishlist removes an outfit from a user's wishlist
func (r *Repository) RemoveFromWishlist(userID, outfitID uuid.UUID) error {
	result := r.db.Where("user_id = ? AND outfit_id = ?", userID, outfitID).Delete(&Wishlist{})
	if result.RowsAffected > 0 {
		r.db.Model(&Outfit{}).Where("id = ?", outfitID).
			UpdateColumn("wishlist_count", gorm.Expr("GREATEST(wishlist_count - 1, 0)"))
	}
	return result.Error
}

// GetWishlist returns a user's wishlisted outfits
func (r *Repository) GetWishlist(userID uuid.UUID, offset, limit int) ([]Outfit, int64, error) {
	var outfits []Outfit
	var total int64

	subQuery := r.db.Model(&Wishlist{}).Select("outfit_id").Where("user_id = ?", userID)

	r.db.Model(&Outfit{}).Where("id IN (?)", subQuery).Count(&total)

	err := r.db.
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		Where("id IN (?)", subQuery).
		Offset(offset).Limit(limit).
		Order("created_at DESC").
		Find(&outfits).Error

	return outfits, total, err
}

// FindTrending returns trending outfits
func (r *Repository) FindTrending(limit int) ([]Outfit, error) {
	var outfits []Outfit
	err := r.db.
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		Preload("Seller").
		Where("status = 'active' AND deleted_at IS NULL").
		Order("(view_count * 0.3 + wishlist_count * 0.5 + booking_count * 1.0) DESC").
		Limit(limit).
		Find(&outfits).Error
	return outfits, err
}

// FindPendingApproval returns outfits waiting for admin approval
func (r *Repository) FindPendingApproval(offset, limit int) ([]Outfit, int64, error) {
	var outfits []Outfit
	var total int64

	query := r.db.Model(&Outfit{}).Where("status = 'pending_approval' AND deleted_at IS NULL")
	query.Count(&total)

	err := query.
		Preload("Images").
		Preload("Seller").
		Offset(offset).Limit(limit).
		Order("created_at ASC").
		Find(&outfits).Error

	return outfits, total, err
}

// SlugExists checks if a slug already exists
func (r *Repository) SlugExists(slug string) (bool, error) {
	var count int64
	err := r.db.Model(&Outfit{}).Where("slug = ?", slug).Count(&count).Error
	return count > 0, err
}

// ensure pq import is used
var _ = pq.StringArray{}
