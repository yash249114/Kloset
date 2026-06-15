package database

import (
	"fmt"

	"github.com/kloset/backend/internal/config"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// ConnectPostgres establishes a connection to PostgreSQL via GORM
func ConnectPostgres(cfg *config.DBConfig) (*gorm.DB, error) {
	dsn := cfg.DSN()

	logLevel := logger.Warn
	if cfg.Host == "localhost" {
		logLevel = logger.Info
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger:                 logger.Default.LogMode(logLevel),
		PrepareStmt:            true,
		SkipDefaultTransaction: true,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}

	// Configure connection pool for production readiness
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)

	log.Info().Str("host", cfg.Host).Str("db", cfg.Name).Msg("Connected to PostgreSQL")

	return db, nil
}
