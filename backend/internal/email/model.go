package email

import (
	"time"

	"github.com/google/uuid"
)

type EmailLog struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	ToEmail   string    `gorm:"size:255;not null;index" json:"to_email"`
	Subject   string    `gorm:"size:255;not null" json:"subject"`
	HTML      string    `gorm:"type:text;not null" json:"html"`
	Status    string    `gorm:"size:50;not null;index;default:'sent'" json:"status"` // sent, failed, retry_pending
	Attempts  int       `gorm:"type:integer;not null;default:0" json:"attempts"`
	LastError *string   `gorm:"type:text" json:"last_error"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (EmailLog) TableName() string {
	return "email_logs"
}
