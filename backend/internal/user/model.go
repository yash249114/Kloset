package user

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// UserAddress represents the user_addresses table
type UserAddress struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	UserID      uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`
	Label       string    `gorm:"size:50" json:"label"`
	FullAddress string    `gorm:"type:text;not null" json:"full_address"`
	City        string    `gorm:"size:100" json:"city"`
	State       string    `gorm:"size:100" json:"state"`
	Pincode     string    `gorm:"size:10" json:"pincode"`
	Lat         *float64  `gorm:"type:decimal(10,8)" json:"lat"`
	Lng         *float64  `gorm:"type:decimal(11,8)" json:"lng"`
	IsDefault   bool      `gorm:"default:false" json:"is_default"`
	CreatedAt   time.Time `json:"created_at"`
}

func (UserAddress) TableName() string {
	return "user_addresses"
}

// User reuses the auth.User model but adds address relation
type User struct {
	ID            uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	Name          string         `gorm:"size:100" json:"name"`
	Email         string         `gorm:"size:255" json:"email"`
	Phone         string         `gorm:"size:15" json:"phone"`
	PasswordHash  string         `gorm:"size:255" json:"-"`
	Role          string         `gorm:"type:user_role" json:"role"`
	AvatarURL     *string        `json:"avatar_url"`
	IsActive      bool           `json:"is_active"`
	IsVerified    bool           `json:"is_verified"`
	KYCStatus     string         `json:"kyc_status"`
	WalletBalance float64        `gorm:"type:decimal(12,2)" json:"wallet_balance"`
	TrustScore    int            `json:"trust_score"`
	LastLogin     *time.Time     `json:"last_login"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
	Addresses     []UserAddress  `gorm:"foreignKey:UserID" json:"addresses,omitempty"`
}

func (User) TableName() string {
	return "users"
}
