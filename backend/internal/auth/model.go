package auth

import (
	"crypto/sha256"
	"encoding/hex"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents the users table
type User struct {
	ID            uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	Name          string         `gorm:"size:100;not null" json:"name"`
	Email         string         `gorm:"size:255;uniqueIndex;not null" json:"email"`
	Phone         string         `gorm:"size:15;uniqueIndex;not null" json:"phone"`
	PasswordHash  string         `gorm:"size:255;not null" json:"-"`
	Role          string         `gorm:"type:user_role;not null;default:'renter'" json:"role"`
	AvatarURL     *string        `gorm:"type:text" json:"avatar_url"`
	IsActive      bool           `gorm:"default:true" json:"is_active"`
	IsVerified    bool           `gorm:"default:false" json:"is_verified"`
	KYCStatus     string         `gorm:"type:kyc_status;default:'pending'" json:"kyc_status"`
	AadhaarHash   *string        `gorm:"size:64" json:"-"`
	PanHash       *string        `gorm:"size:64" json:"-"`
	WalletBalance float64        `gorm:"type:decimal(12,2);default:0" json:"wallet_balance"`
	TrustScore    int            `gorm:"default:100" json:"trust_score"`
	FCMToken      *string        `gorm:"type:text" json:"-"`
	LastLogin     *time.Time     `json:"last_login"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName specifies the table name for User
func (User) TableName() string {
	return "users"
}

// RefreshToken represents the refresh_tokens table
type RefreshToken struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index"`
	TokenHash string    `gorm:"size:64;uniqueIndex;not null"`
	ExpiresAt time.Time `gorm:"not null"`
	CreatedAt time.Time
}

// TableName specifies the table name for RefreshToken
func (RefreshToken) TableName() string {
	return "refresh_tokens"
}

// HashToken creates a SHA-256 hash of a token string
func HashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}

// ToUserResponse converts a User model to the public response DTO
func (u *User) ToUserResponse() UserResponse {
	return UserResponse{
		ID:            u.ID.String(),
		Name:          u.Name,
		Email:         u.Email,
		Phone:         u.Phone,
		Role:          u.Role,
		AvatarURL:     u.AvatarURL,
		IsVerified:    u.IsVerified,
		KYCStatus:     u.KYCStatus,
		WalletBalance: u.WalletBalance,
		TrustScore:    u.TrustScore,
		CreatedAt:     u.CreatedAt.Format(time.RFC3339),
	}
}
