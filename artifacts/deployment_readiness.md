# Kloset Production Deployment & Operations Manual

This document outlines the staging and production deployment protocols, failover systems, rollback strategies, and operational guides for launching the Kloset Fashion Rental Marketplace.

---

## 1. Production Environment Variables Checklist

Ensure these values are configured in the hosting environment (e.g. AWS ECS, Heroku, or GCP Cloud Run).

### A. Go Backend Service (.env)
```ini
# App Config
APP_NAME=Kloset
APP_ENV=production
APP_PORT=8080
APP_URL=https://api.kloset.in
FRONTEND_URL=https://kloset.in

# Database Credentials (PostgreSQL)
DB_HOST=rds-postgres-production.xxxx.rds.amazonaws.com
DB_PORT=5432
DB_USER=kloset_db_prod_user
DB_PASSWORD=YOUR_STRONG_DB_PASSWORD
DB_NAME=kloset_prod
DB_SSLMODE=require

# Redis Cache Service
REDIS_URL=redis://elasticache-redis-production.xxxx.cache.amazonaws.com:6379

# Security Credentials
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HEX
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=720h

# Payment Gateway (Razorpay LIVE keys)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_LIVE_WEBHOOK_SECRET

# Email Dispatcher (Resend API)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=alerts@kloset.in
RESEND_FROM_NAME=Kloset Couture

# Cloud Media Store (Cloudinary)
CLOUDINARY_CLOUD_NAME=kloset-prod-cloud
CLOUDINARY_API_KEY=xxxxxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
CLOUDINARY_UPLOAD_PRESET=kloset_production_uploads
```

### B. Next.js Frontend App (.env.production)
```ini
NEXT_PUBLIC_API_URL=https://api.kloset.in/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
```

---

## 2. Database Migration Protocols

Kloset manages DB schema upgrades using raw migrations located in `backend/internal/database/migrations/`.
1.  **Backup Existing DB**:
    Before running migrations, perform a database backup:
    ```bash
    pg_dump -h <db_host> -U <db_user> -d <db_name> -F c -b -v -f kloset_backup_$(date +%F).dump
    ```
2.  **Execute SQL Migrations**:
    Migrations are registered inside PostgreSQL using the migration script sequence. For migrations, connect to Postgres using psql or your CD runner:
    ```bash
    psql -h <db_host> -U <db_user> -d <db_name> -f internal/database/migrations/001_users.sql
    # Run the remaining 002 to 009 files sequentially.
    ```
3.  **Entity AutoMigrate**:
    Upon startup, GORM automatically checks and updates table columns for `Notification`, `SupportTicket`, `SystemLog`, and `EmailLog`.

---

## 3. Redis Failover Architecture

The backend rates limits and caches endpoints using Redis.
*   **Graceful Degradation**: If the Redis server experiences a connection outage, the rate limiter and token cache will print a console warning log and automatically fallback to allowing client operations without throwing 500 server crashes.
*   **Reconnection Logic**: The Redis driver automatically attempts backoff reconnections without requiring server restarts.

---

## 4. Razorpay Live Mode Cutover

To switch payments from Sandbox to Live operations:
1.  **Configure Live Keys**: Log into the Razorpay Admin dashboard, switch to **Live Mode**, and generate active API Credentials.
2.  **Setup Live Webhooks**:
    *   Add a new webhook destination targeting: `https://api.kloset.in/api/v1/payments/webhook`
    *   Subscribe to these events:
        *   `payment.captured`
        *   `payment.failed`
        *   `refund.processed`
    *   Set a secure webhook secret string and save it to the backend `RAZORPAY_WEBHOOK_SECRET` environment variable.

---

## 5. Rollback Procedures

In the event of critical staging/production anomalies:
1.  **Frontend Reversion**: Revert frontend deployments by redeploying the previous stable Git commit hash in the hosting provider (e.g. Vercel dashboard).
2.  **Backend Reversion**:
    *   Stop the failing container/instance.
    *   Revert to the previous docker container tag or pull/build the previous stable release.
    *   Start the stable backend services.
3.  **Database Rollback**:
    If a database migration corrupted tables, restore the backup taken prior to migration:
    ```bash
    pg_restore -h <db_host> -U <db_user> -d <db_name> --clean --no-acl --no-owner kloset_backup_xxx.dump
    ```

---

## 6. Pre-Launch Day Verification Checklist

Conduct these validations on staging before completing the production switch:
*   [ ] Run `/healthz` and `/readyz` endpoints; verify they return HTTP 200 `healthy`/`ready` states.
*   [ ] Trigger a rate limit window from a test browser client to ensure it returns HTTP 429 status code with retry limits.
*   [ ] Send a test email from the Resend console; verify it creates a log record inside the `email_logs` table.
*   [ ] Verify the SSL certificates of both frontend (`https://kloset.in`) and backend (`https://api.kloset.in`) domains.
