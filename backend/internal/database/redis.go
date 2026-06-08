package database

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog/log"
)

// ConnectRedis establishes a connection to Redis
func ConnectRedis(url string) (*redis.Client, error) {
	opt, err := redis.ParseURL(url)
	if err != nil {
		return nil, fmt.Errorf("failed to parse Redis URL: %w", err)
	}

	client := redis.NewClient(opt)

	// Test connection
	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err != nil {
		log.Warn().Err(err).Msg("Redis connection failed — running without cache")
		return nil, nil
	}

	log.Info().Msg("Connected to Redis")
	return client, nil
}
