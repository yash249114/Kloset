package logging

import (
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type Service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{db: db}
}

func (s *Service) LogEvent(actor, action, ip, severity string) {
	sysLog := SystemLog{
		ID:        uuid.New(),
		Timestamp: time.Now(),
		Actor:     actor,
		Action:    action,
		IPAddress: ip,
		Severity:  severity,
	}

	// Always print to console logger
	switch severity {
	case "error":
		log.Error().Str("actor", actor).Str("ip", ip).Msg(action)
	case "warn":
		log.Warn().Str("actor", actor).Str("ip", ip).Msg(action)
	case "fatal":
		log.Fatal().Str("actor", actor).Str("ip", ip).Msg(action)
	default:
		log.Info().Str("actor", actor).Str("ip", ip).Msg(action)
	}

	// Save to DB asynchronously to not block operational requests
	go func() {
		if err := s.db.Create(&sysLog).Error; err != nil {
			log.Error().Err(err).Msg("Failed to write SystemLog to database")
		}
	}()
}

func (s *Service) ListLogs() ([]SystemLog, error) {
	var logs []SystemLog
	err := s.db.Order("timestamp DESC").Limit(100).Find(&logs).Error
	return logs, err
}
