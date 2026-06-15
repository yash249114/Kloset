package dispute

import (
	"time"

	"github.com/google/uuid"
)

type Dispute struct {
	ID             uuid.UUID  `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	BookingID      uuid.UUID  `gorm:"type:uuid;not null;index" json:"booking_id"`
	RaisedBy       uuid.UUID  `gorm:"type:uuid;not null;index" json:"raised_by"`
	Against        uuid.UUID  `gorm:"type:uuid;not null" json:"against"`
	Reason         string     `gorm:"size:100" json:"reason"`
	Description    string     `gorm:"type:text;not null" json:"description"`
	EvidencePhotos *string    `gorm:"type:text[]" json:"evidence_photos"`
	Status         string     `gorm:"type:dispute_status;default:'open';index" json:"status"`
	Resolution     *string    `gorm:"type:dispute_resolution" json:"resolution"`
	ResolutionNote *string    `gorm:"type:text" json:"resolution_note"`
	RefundAmount   *float64   `gorm:"type:decimal(10,2)" json:"refund_amount"`
	ResolvedBy     *uuid.UUID `gorm:"type:uuid" json:"resolved_by"`
	ResolvedAt     *time.Time `json:"resolved_at"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`

	// Relational preloads
	Booking *BookingProjection `gorm:"foreignKey:ID;references:BookingID" json:"booking,omitempty"`
}

func (Dispute) TableName() string {
	return "disputes"
}

type BookingProjection struct {
	ID         uuid.UUID `gorm:"type:uuid" json:"id"`
	BookingRef string    `json:"booking_ref"`
}

func (BookingProjection) TableName() string {
	return "bookings"
}
