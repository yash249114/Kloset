package middleware

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/kloset/backend/pkg/response"
	"github.com/redis/go-redis/v9"
)

// RateLimiter implements a Redis-backed sliding window rate limiter
func RateLimiter(rdb *redis.Client, maxRequests int, window time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// If Redis is not available, skip rate limiting
		if rdb == nil {
			return c.Next()
		}

		// Use IP as key, or user_id if authenticated
		key := c.IP()
		if userID, ok := c.Locals("user_id").(string); ok && userID != "" {
			key = userID
		}

		rateLimitKey := fmt.Sprintf("ratelimit:%s:%s", c.Path(), key)
		ctx := context.Background()

		// Increment counter
		count, err := rdb.Incr(ctx, rateLimitKey).Result()
		if err != nil {
			// If Redis fails, allow the request
			return c.Next()
		}

		// Set expiry on first request in window
		if count == 1 {
			rdb.Expire(ctx, rateLimitKey, window)
		}

		// Check limit
		if count > int64(maxRequests) {
			c.Set("X-RateLimit-Limit", fmt.Sprintf("%d", maxRequests))
			c.Set("X-RateLimit-Remaining", "0")
			c.Set("Retry-After", fmt.Sprintf("%d", int(window.Seconds())))
			return response.TooManyRequests(c, "Rate limit exceeded. Please try again later.")
		}

		// Set rate limit headers
		c.Set("X-RateLimit-Limit", fmt.Sprintf("%d", maxRequests))
		c.Set("X-RateLimit-Remaining", fmt.Sprintf("%d", int64(maxRequests)-count))

		return c.Next()
	}
}
