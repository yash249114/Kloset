package outfit

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

// Outfit represents the outfits table
type Outfit struct {
	ID                  uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	SellerID            uuid.UUID      `gorm:"type:uuid;not null;index" json:"seller_id"`
	Title               string         `gorm:"size:200;not null" json:"title"`
	Slug                string         `gorm:"size:250;uniqueIndex" json:"slug"`
	Description         *string        `gorm:"type:text" json:"description"`
	AIDescription       *string        `gorm:"column:ai_description;type:text" json:"ai_description"`
	Category            string         `gorm:"type:outfit_category;not null" json:"category"`
	Occasions           pq.StringArray `gorm:"type:text[]" json:"occasions"`
	Colors              pq.StringArray `gorm:"type:text[]" json:"colors"`
	Fabric              *string        `gorm:"size:100" json:"fabric"`
	Sizes               pq.StringArray `gorm:"type:text[]" json:"sizes"`
	AccessoriesIncluded pq.StringArray `gorm:"type:text[]" json:"accessories_included"`
	City                *string        `gorm:"size:100" json:"city"`
	State               *string        `gorm:"size:100" json:"state"`
	Pincode             *string        `gorm:"size:10" json:"pincode"`
	Price1Day           *float64       `gorm:"column:price_1day;type:decimal(10,2)" json:"price_1day"`
	Price3Day           *float64       `gorm:"column:price_3day;type:decimal(10,2)" json:"price_3day"`
	Price7Day           *float64       `gorm:"column:price_7day;type:decimal(10,2)" json:"price_7day"`
	SecurityDeposit     *float64       `gorm:"type:decimal(10,2)" json:"security_deposit"`
	DeliveryAvailable   bool           `gorm:"default:false" json:"delivery_available"`
	DeliveryFee         float64        `gorm:"type:decimal(8,2);default:0" json:"delivery_fee"`
	Status              string         `gorm:"type:outfit_status;default:'draft'" json:"status"`
	RejectionReason     *string        `gorm:"type:text" json:"rejection_reason"`
	RatingAvg           float64        `gorm:"type:decimal(3,2);default:0" json:"rating_avg"`
	RatingCount         int            `gorm:"default:0" json:"rating_count"`
	ViewCount           int            `gorm:"default:0" json:"view_count"`
	WishlistCount       int            `gorm:"default:0" json:"wishlist_count"`
	BookingCount        int            `gorm:"default:0" json:"booking_count"`
	AITags              pq.StringArray `gorm:"type:text[]" json:"ai_tags"`
	CreatedAt           time.Time      `json:"created_at"`
	UpdatedAt           time.Time      `json:"updated_at"`
	DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Images []OutfitImage `gorm:"foreignKey:OutfitID" json:"images"`
	Seller *SellerInfo   `gorm:"foreignKey:ID;references:SellerID" json:"seller,omitempty"`
}

func (Outfit) TableName() string {
	return "outfits"
}

// OutfitImage represents the outfit_images table
type OutfitImage struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	OutfitID     uuid.UUID `gorm:"type:uuid;not null;index" json:"outfit_id"`
	URL          string    `gorm:"type:text;not null" json:"url"`
	CloudinaryID *string   `gorm:"size:200" json:"cloudinary_id"`
	IsPrimary    bool      `gorm:"default:false" json:"is_primary"`
	SortOrder    int       `gorm:"type:smallint;default:0" json:"sort_order"`
	CreatedAt    time.Time `json:"created_at"`
}

func (OutfitImage) TableName() string {
	return "outfit_images"
}

// SellerInfo is a lightweight user projection for outfit listings
type SellerInfo struct {
	ID         uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	Name       string    `json:"name"`
	AvatarURL  *string   `json:"avatar_url"`
	IsVerified bool      `json:"is_verified"`
	TrustScore int       `json:"trust_score"`
}

func (SellerInfo) TableName() string {
	return "users"
}

// Wishlist represents the wishlists table
type Wishlist struct {
	UserID    uuid.UUID `gorm:"type:uuid;primaryKey" json:"user_id"`
	OutfitID  uuid.UUID `gorm:"type:uuid;primaryKey" json:"outfit_id"`
	CreatedAt time.Time `json:"created_at"`
}

func (Wishlist) TableName() string {
	return "wishlists"
}
