package notification

import (
	"time"

	"github.com/google/uuid"
)

type Notification struct {
	ID        uuid.UUID  `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	UserID    uuid.UUID  `gorm:"type:uuid;not null;index" json:"user_id"`
	Type      string     `gorm:"type:notif_type;not null" json:"type"`
	Title     string     `gorm:"size:200" json:"title"`
	Body      string     `gorm:"type:text" json:"body"`
	Data      *string    `gorm:"type:jsonb" json:"data"`
	Channels  string     `gorm:"type:notif_channel[];default:'{in_app}'" json:"channels"`
	IsRead    bool       `gorm:"default:false;index" json:"is_read"`
	SentAt    *time.Time `json:"sent_at"`
	CreatedAt time.Time  `json:"created_at"`
}

func (Notification) TableName() string {
	return "notifications"
}
