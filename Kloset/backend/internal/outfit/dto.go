package outfit

type ImageRequest struct {
	URL          string `json:"url" validate:"required"`
	CloudinaryID string `json:"cloudinary_id"`
	IsPrimary    bool   `json:"is_primary"`
	SortOrder    int    `json:"sort_order"`
}

// CreateOutfitRequest represents the outfit creation payload
type CreateOutfitRequest struct {
	Title               string         `json:"title" validate:"required,min=3,max=200"`
	Description         string         `json:"description"`
	Category            string         `json:"category" validate:"required"`
	Occasions           []string       `json:"occasions"`
	Colors              []string       `json:"colors"`
	Fabric              string         `json:"fabric"`
	Sizes               []string       `json:"sizes" validate:"required,min=1"`
	AccessoriesIncluded []string       `json:"accessories_included"`
	City                string         `json:"city" validate:"required"`
	State               string         `json:"state" validate:"required"`
	Pincode             string         `json:"pincode" validate:"required"`
	Price1Day           float64        `json:"price_1day" validate:"required,gt=0"`
	Price3Day           float64        `json:"price_3day" validate:"gt=0"`
	Price7Day           float64        `json:"price_7day" validate:"gt=0"`
	SecurityDeposit     float64        `json:"security_deposit" validate:"required,gt=0"`
	DeliveryAvailable   bool           `json:"delivery_available"`
	DeliveryFee         float64        `json:"delivery_fee"`
	Images              []ImageRequest `json:"images"`
}

// UpdateOutfitRequest represents the outfit update payload
type UpdateOutfitRequest struct {
	Title               *string   `json:"title" validate:"omitempty,min=3,max=200"`
	Description         *string   `json:"description"`
	Category            *string   `json:"category"`
	Occasions           *[]string `json:"occasions"`
	Colors              *[]string `json:"colors"`
	Fabric              *string   `json:"fabric"`
	Sizes               *[]string `json:"sizes"`
	AccessoriesIncluded *[]string `json:"accessories_included"`
	City                *string   `json:"city"`
	State               *string   `json:"state"`
	Pincode             *string   `json:"pincode"`
	Price1Day           *float64  `json:"price_1day"`
	Price3Day           *float64  `json:"price_3day"`
	Price7Day           *float64  `json:"price_7day"`
	SecurityDeposit     *float64  `json:"security_deposit"`
	DeliveryAvailable   *bool     `json:"delivery_available"`
	DeliveryFee         *float64  `json:"delivery_fee"`
}

// OutfitFilters holds query parameters for browsing outfits
type OutfitFilters struct {
	Query         string  `query:"q"`
	City          string  `query:"city"`
	Category      string  `query:"category"`
	Size          string  `query:"size"`
	MinPrice      float64 `query:"min_price"`
	MaxPrice      float64 `query:"max_price"`
	Occasion      string  `query:"occasion"`
	AvailableFrom string  `query:"available_from"`
	AvailableTo   string  `query:"available_to"`
	Sort          string  `query:"sort"`
	Page          int     `query:"page"`
	PerPage       int     `query:"per_page"`
}

// OutfitResponse is the public outfit representation
type OutfitResponse struct {
	ID                  string             `json:"id"`
	SellerID            string             `json:"seller_id"`
	Title               string             `json:"title"`
	Slug                string             `json:"slug"`
	Description         *string            `json:"description"`
	AIDescription       *string            `json:"ai_description"`
	Category            string             `json:"category"`
	Occasions           []string           `json:"occasions"`
	Colors              []string           `json:"colors"`
	Fabric              *string            `json:"fabric"`
	Sizes               []string           `json:"sizes"`
	AccessoriesIncluded []string           `json:"accessories_included"`
	City                *string            `json:"city"`
	State               *string            `json:"state"`
	Price1Day           *float64           `json:"price_1day"`
	Price3Day           *float64           `json:"price_3day"`
	Price7Day           *float64           `json:"price_7day"`
	SecurityDeposit     *float64           `json:"security_deposit"`
	DeliveryAvailable   bool               `json:"delivery_available"`
	DeliveryFee         float64            `json:"delivery_fee"`
	Status              string             `json:"status"`
	RatingAvg           float64            `json:"rating_avg"`
	RatingCount         int                `json:"rating_count"`
	ViewCount           int                `json:"view_count"`
	WishlistCount       int                `json:"wishlist_count"`
	Images              []ImageResponse    `json:"images"`
	Seller              *SellerResponse    `json:"seller,omitempty"`
	IsWishlisted        bool               `json:"is_wishlisted"`
	CreatedAt           string             `json:"created_at"`
}

// ImageResponse is the public image representation
type ImageResponse struct {
	ID        string `json:"id"`
	URL       string `json:"url"`
	IsPrimary bool   `json:"is_primary"`
	SortOrder int    `json:"sort_order"`
}

// SellerResponse is the lightweight seller representation
type SellerResponse struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	AvatarURL  *string `json:"avatar_url"`
	IsVerified bool    `json:"is_verified"`
	TrustScore int     `json:"trust_score"`
}
