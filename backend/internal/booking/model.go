package booking

import (
	"time"

	"github.com/google/uuid"
)

type Booking struct {
	ID                   uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	BookingRef           string         `gorm:"size:20;uniqueIndex;not null" json:"booking_ref"`
	OutfitID             uuid.UUID      `gorm:"type:uuid;not null;index" json:"outfit_id"`
	RenterID             uuid.UUID      `gorm:"type:uuid;not null;index" json:"renter_id"`
	SellerID             uuid.UUID      `gorm:"type:uuid;not null;index" json:"seller_id"`
	PickupDate           time.Time      `gorm:"type:date;not null" json:"pickup_date"`
	ReturnDate           time.Time      `gorm:"type:date;not null" json:"return_date"`
	RentalDays           int            `gorm:"not null" json:"rental_days"`
	SizeSelected         string         `gorm:"size:10" json:"size_selected"`
	Status               string         `gorm:"type:booking_status;default:'pending'" json:"status"`
	DeliveryType         string         `gorm:"type:delivery_type;default:'pickup'" json:"delivery_type"`
	DeliveryAddress      *string        `gorm:"type:jsonb" json:"delivery_address"`
	RentalAmount         float64        `gorm:"type:decimal(10,2)" json:"rental_amount"`
	SecurityDeposit      float64        `gorm:"type:decimal(10,2)" json:"security_deposit"`
	DeliveryFee          float64        `gorm:"type:decimal(8,2);default:0" json:"delivery_fee"`
	PlatformFee          float64        `gorm:"type:decimal(8,2)" json:"platform_fee"`
	TotalAmount          float64        `gorm:"type:decimal(10,2)" json:"total_amount"`
	PaymentStatus        string         `gorm:"size:20;default:'pending'" json:"payment_status"`
	RazorpayOrderID      *string        `gorm:"size:100" json:"razorpay_order_id"`
	RazorpayPaymentID    *string        `gorm:"size:100" json:"razorpay_payment_id"`
	ReturnPhotos         *string        `gorm:"type:text[]" json:"return_photos"` // stored as serialized comma separated or json array
	ReturnCondition      *string        `gorm:"size:50" json:"return_condition"`
	ReturnNotes          *string        `gorm:"type:text" json:"return_notes"`
	ReturnInitiatedAt    *time.Time     `json:"return_initiated_at"`
	ReturnedAt           *time.Time     `json:"returned_at"`
	DepositRefundAmount  *float64       `gorm:"type:decimal(10,2)" json:"deposit_refund_amount"`
	DepositRefundReason  *string        `gorm:"type:text" json:"deposit_refund_reason"`
	SellerAcceptedAt     *time.Time     `json:"seller_accepted_at"`
	SellerAcceptDeadline *time.Time     `json:"seller_accept_deadline"`
	CancellationReason   *string        `gorm:"type:text" json:"cancellation_reason"`
	CancelledBy          *uuid.UUID     `gorm:"type:uuid" json:"cancelled_by"`
	CreatedAt            time.Time      `json:"created_at"`
	UpdatedAt            time.Time      `json:"updated_at"`

	// Relational preloads
	Outfit *OutfitProjection `gorm:"foreignKey:ID;references:OutfitID" json:"outfit,omitempty"`
	Renter *UserProjection   `gorm:"foreignKey:ID;references:RenterID" json:"renter,omitempty"`
	Seller *UserProjection   `gorm:"foreignKey:ID;references:SellerID" json:"seller,omitempty"`
}

func (Booking) TableName() string {
	return "bookings"
}

type OutfitProjection struct {
	ID    uuid.UUID `gorm:"type:uuid" json:"id"`
	Title string    `json:"title"`
	Price1Day float64 `gorm:"column:price_1day" json:"price_1day"`
}

func (OutfitProjection) TableName() string {
	return "outfits"
}

type UserProjection struct {
	ID    uuid.UUID `gorm:"type:uuid" json:"id"`
	Name  string    `json:"name"`
	Email string    `json:"email"`
	Phone string    `json:"phone"`
}

func (UserProjection) TableName() string {
	return "users"
}
