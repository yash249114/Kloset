package logging

import (
	"time"

	"github.com/google/uuid"
)

type SystemLog struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	Timestamp time.Time `gorm:"index" json:"timestamp"`
	Actor     string    `gorm:"size:100" json:"actor"`
	Action    string    `gorm:"type:text" json:"action"`
	IPAddress string    `gorm:"size:50" json:"ipAddress"`
	Severity  string    `gorm:"size:20" json:"severity"` // info, warn, error, fatal
}

func (SystemLog) TableName() string {
	return "system_logs"
}
