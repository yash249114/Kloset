# Kloset Render Deployment Failure Audit

## 1. Where FRONTEND_URL is Loaded
The `FRONTEND_URL` is loaded in `backend/internal/config/config.go` inside the `Load()` function:
```go
FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),
```

## 2. Where CORSMiddleware(...) is Called
It is called in `backend/cmd/server/main.go` inside the `main()` function:
```go
app.Use(middleware.CORSMiddleware(cfg.App.FrontendURL))
```

## 3. Exact Value Passed to CORSMiddleware on Render
The Fiber CORS middleware panics specifically when `AllowOrigins` is set to `"*"` (a wildcard) while `AllowCredentials` is `true`. Because this panic occurred, the value of `cfg.App.FrontendURL` being passed into `CORSMiddleware` on Render must be **`"*"`**.

## 4. Environment Variable Condition
* **Is FRONTEND_URL empty/missing?** No. If it were empty or missing, `getEnv` would fall back to `"http://localhost:3000"`. `http://localhost:3000` is not a wildcard, so it would not trigger the panic.
* **Does it fall back to `*`?** No, there is no code that falls back to `*`.
* **Conclusion**: The Render environment variables are explicitly setting `FRONTEND_URL=*`.

## 5. Exact Code Fix Required
To prevent crashes even if the environment variable is misconfigured, we must sanitize `frontendURL` in `CORSMiddleware` before passing it to Fiber.

**File:** `backend/internal/middleware/cors.go`
```go
package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// CORSMiddleware configures CORS for the API
func CORSMiddleware(frontendURL string) fiber.Handler {
	// Security fallback: Prevent wildcard when AllowCredentials is true
	if frontendURL == "" || frontendURL == "*" {
		frontendURL = "http://localhost:3000" // Safe fallback to prevent crash
	}

	return cors.New(cors.Config{
		AllowOrigins:     frontendURL,
		AllowMethods:     "GET,POST,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization,X-Requested-With",
		AllowCredentials: true,
		ExposeHeaders:    "Content-Length,Content-Type",
		MaxAge:           86400,
	})
}
```

## 6. Exact Render Environment Variables Required
In the Render dashboard for the Backend Web Service, update the environment variables to your actual frontend domain:

```env
FRONTEND_URL=https://kloset-frontend.vercel.app
ALLOWED_ORIGINS=https://kloset-frontend.vercel.app
```
*(Replace `https://kloset-frontend.vercel.app` with the actual Vercel/production frontend URL. Do not use `*` or leave it empty).*
