package payment

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Transaction struct {
	ID           uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	UserID       uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_id"`
	BookingID    *uuid.UUID     `gorm:"type:uuid;index" json:"booking_id"`
	Type         string         `gorm:"type:txn_type;not null" json:"type"`
	Amount       float64        `gorm:"type:decimal(10,2);not null" json:"amount"`
	Status       string         `gorm:"type:txn_status;default:'pending'" json:"status"`
	Gateway      *string        `gorm:"size:20" json:"gateway"`
	GatewayTxnID *string        `gorm:"size:150" json:"gateway_txn_id"`
	GatewayData  *string        `gorm:"type:jsonb" json:"gateway_data"`
	Note         *string        `gorm:"type:text" json:"note"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Transaction) TableName() string {
	return "transactions"
}
