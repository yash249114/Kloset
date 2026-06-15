# Backend Fixes Round 1

## Bugs Found & Fixed

### 1. Outfit Create — Missing 6-image server-side cap
**File**: `internal/outfit/service.go:38`
**Problem**: `cfg.MaxImagesPerOutfit = 6` was configured but never enforced during initial outfit creation. The `AddImage` method in `repository.go:180` had the check, but the `Create` method in `service.go` bypassed it by directly assigning `Images` to the outfit model.
**Fix**: Added explicit `len(req.Images) > 6` guard in `service.go` `Create()` before image processing — returns error `"maximum of 6 images per outfit allowed"`.

### 2. Booking Create — Race condition (concurrent double-booking)
**File**: `internal/booking/service.go` (old lines 73-79, 162-164)
**Problem**: The `HasOverlap` availability check and the `repo.Create(booking)` call were **not atomic**. Two concurrent requests for the same outfit+dates could both pass the overlap check and create overlapping bookings.
**Fix**: 
- Added `CreateIfAvailable()` to `internal/booking/repository.go` — wraps the overlap check (`SELECT COUNT ... FOR UPDATE` semantics via transaction) and `INSERT` in a single `db.Transaction`.
- Updated `service.go` `Create()` to call `CreateIfAvailable()` instead of separate `HasOverlap()` + `Create()`.

### 3. Admin GetStats — Unchecked DB errors
**File**: `internal/admin/service.go:45-52`
**Problem**: All 8 database queries (`Count`, `Scan`) silently ignored their `.Error` return values. If any query failed, zero values were returned without logging.
**Fix**: Changed each query to check `.Error` with `log.Error().Err(err).Msg(...)`.

### 4. Admin GetAIOpsStats — Unchecked DB errors
**File**: `internal/admin/service.go:348-471`
**Problem**: All ~15 database queries in `GetAIOpsStats()` silently ignored errors.
**Fix**: Same approach as #3 — each query now checks `.Error` with error logging. Results degrade gracefully to zero values on failure.

### 5. Missing Admin Ban/Unban Endpoint
**File**: `internal/admin/handler.go` (routes)
**Problem**: Frontend calls `POST /admin/users/:userId/ban` but no route existed in `RegisterRoutes()`.
**Fix**: Added `BanUser` handler + `BanUser` service method that toggles the `is_active` field on the user record. Route registered as `admin.Post("/users/:userId/ban", h.BanUser)`.

### 6. Booking Service — Unchecked user role queries
**File**: `internal/booking/service.go` — 3 locations (`GetByID`, `UpdateStatus`, `Cancel`)
**Problem**: `_ = s.repo.db.Table("users")...Scan(&userRole).Error` silently swallowed DB errors. On failure, `userRole` would be empty string (safe — "unauthorized" fallback), but the error was invisible.
**Fix**: Each role query now logs a warning via `log.Warn().Err(err)...` on failure.

## Verification
- `go build ./...` — 0 errors
- `go vet ./...` — 0 errors
