package review

import (
	"time"

	"github.com/google/uuid"
)

type Review struct {
	ID         uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	BookingID  uuid.UUID `gorm:"type:uuid;uniqueIndex;not null" json:"booking_id"`
	ReviewerID uuid.UUID `gorm:"type:uuid;not null;index" json:"reviewer_id"`
	OutfitID   uuid.UUID `gorm:"type:uuid;not null;index" json:"outfit_id"`
	SellerID   uuid.UUID `gorm:"type:uuid;not null;index" json:"seller_id"`
	Rating     int       `gorm:"type:smallint;not null" json:"rating"`
	Comment    *string   `gorm:"type:text" json:"comment"`
	Photos     *string   `gorm:"type:text[]" json:"photos"` // comma-separated or JSON list
	IsVisible  bool      `gorm:"default:true;index" json:"is_visible"`
	CreatedAt  time.Time `json:"created_at"`

	// Relational preloads
	Reviewer *UserProjection `gorm:"foreignKey:ID;references:ReviewerID" json:"reviewer,omitempty"`
}

func (Review) TableName() string {
	return "reviews"
}

type UserProjection struct {
	ID        uuid.UUID `gorm:"type:uuid" json:"id"`
	Name      string    `json:"name"`
	AvatarURL *string   `json:"avatar_url"`
}

func (UserProjection) TableName() string {
	return "users"
}
