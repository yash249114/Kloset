package support

import (
	"time"
)

type SupportTicket struct {
	ID          string    `gorm:"primaryKey;size:50" json:"id"`
	RenterName  string    `gorm:"size:100" json:"renterName"`
	RenterEmail string    `gorm:"size:255;index" json:"renterEmail"`
	Subject     string    `gorm:"size:255" json:"subject"`
	Description string    `gorm:"type:text" json:"description"`
	Priority    string    `gorm:"size:50" json:"priority"`
	Status      string    `gorm:"size:50" json:"status"`
	ChatHistory string    `gorm:"type:text" json:"chatHistory"` // JSON array string
	CreatedAt   time.Time `json:"createdAt"`
}

func (SupportTicket) TableName() string {
	return "support_tickets"
}
