# Infrastructure Report — Kloset

**Date:** 2026-06-16
**Scope:** Verify all infrastructure configuration files for production readiness.

> **Fixes applied in this session:** P0 issues 1–5 (render.yaml paths, CI working directories, cache paths) and P1 issue 6 (pr-check.yml regex) have been corrected. The report documents both the original findings and the fixes.

**Deployed architecture:**
| Service | Platform | URL | Build Trigger |
|---|---|---|---|
| Frontend (Next.js) | Vercel | https://kloset.in | Push to `main` (GitHub integration) |
| Backend (Go/Fiber) | Render | https://api.kloset.in | Push to `main` (auto-deploy) |
| Database | Supabase (Postgres) | ap-southeast-1 | — |

---

## 1. render.yaml — Backend IaC

**File:** `render.yaml` (repo root)

**Issues found:**

| Severity | Issue | Lines |
|---|---|---|
| **P0** | `dockerfilePath: ./backend/Dockerfile` is incorrect. The file is at `Kloset/backend/Dockerfile`. Should be `./Kloset/backend/Dockerfile`. | 12 |
| **P0** | `dockerContext: ./backend` is incorrect. Should be `./Kloset/backend`. | 13 |

Render reads IaC from the repo root. Since all code lives under `Kloset/`, every path must be prefixed with `Kloset/`. Without this fix, Render builds will fail with `Dockerfile not found`.

**Other observations:**
- `runtime: image` is used with `image.url: blank` — this is the correct pattern for letting Render build from the Dockerfile. ✓
- 20 of 27 env vars are marked `sync: false` (set in dashboard) — correct for secrets. ✓
- `healthCheckPath: /health` maps to the backend's health endpoint. ✓
- `branch: main` — matches the production deployment trigger. ✓
- Region `oregon` — closest free region to Supabase `ap-southeast-1`. Acceptable.

---

## 2. docker-compose.yml — Local Development

**File:** `docker-compose.yml` (repo root)

All paths use `./Kloset/...` prefix — correct, since compose runs from repo root. ✓

| Service | Path | Status |
|---|---|---|
| Postgres | `postgres:16-alpine` with init scripts from `./Kloset/backend/internal/database/migrations` | ✓ |
| Backend | Build context `./Kloset/backend`, Dockerfile `./Kloset/backend/Dockerfile` | ✓ |
| Frontend | Build context `./Kloset/frontend` (Dockerfile missing — see below) | ⚠ |
| Env file | `.env` at repo root | ✓ |

**Issues:**

| Severity | Issue |
|---|---|
| **P1** | `frontend` service references `dockerfile: Dockerfile` in `./Kloset/frontend/` but no Dockerfile exists at that path. `docker compose up` will fail for the frontend. |
| **P2** | Backend volume mount `./Kloset/backend:/app` overwrites the compiled binary with the source at runtime. The Dockerfile builds in `/app` but the volume mount shadows it. The container will need `go run` or `air` for hot-reload, not the compiled `CMD ["./server"]`. This pattern works with hot-reload tools but not as-is. |

---

## 3. GitHub Actions — CI/CD Workflows

**Files:** `Kloset/.github/workflows/ci.yml`, `deploy.yml`, `pr-check.yml`

**Issues found:**

| Severity | Issue | File |
|---|---|---|
| **P0** | `working-directory: frontend` — should be `Kloset/frontend`. Actions run from repo root, not `Kloset/`. | `ci.yml:24` |
| **P0** | `working-directory: backend` — should be `Kloset/backend`. | `ci.yml:61` |
| **P0** | `working-directory: frontend` for npm audit — should be `Kloset/frontend`. | `ci.yml:102` |
| **P0** | `working-directory: backend` for gosec — should be `Kloset/backend`. | `ci.yml:106` |
| **P1** | Secret regex in pr-check.yml: `"\x27"` is an invalid bash escape. Should be `['\"]` to match quotes. | `pr-check.yml:39` |
| **P1** | `go build -o /dev/null ./cmd/server` — the path `./cmd/server` assumes the runner is in the correct `backend` directory, but all working-directory paths are wrong, so this compounds the P0. | `ci.yml:77` |
| **P2** | `cache-dependency-path: frontend/package-lock.json` — should be `Kloset/frontend/package-lock.json`. | `ci.yml:32` |
| **P2** | `cache-dependency-path: backend/go.sum` — should be `Kloset/backend/go.sum`. | `ci.yml:68` |

All three workflows (`ci.yml`, `deploy.yml`, `pr-check.yml`) need path updates. The code reorganization moved everything under `Kloset/`, but these workflows still reference root-relative paths.

**`deploy.yml`** is effectively a no-op — both "deploy" steps are `echo` stubs:
```
echo "Vercel handles deployment via GitHub integration on push to main"
echo "Render auto-deploys on push to main via webhook integration"
```
This is acceptable if Vercel and Render are configured with their own GitHub integrations. The post-deploy health check is valuable.

---

## 4. Vercel Configuration

### vercel.json

**File:** `Kloset/frontend/vercel.json`

| Setting | Value | Status |
|---|---|---|
| Framework | `nextjs` | ✓ |
| Build command | `npm run build` | ✓ |
| Output directory | `.next` | ✓ |
| Regions | `bom1` (Mumbai) | ✓ — optimal for India |
| Security headers | X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, HSTS | ✓ |
| CORS headers | `/api/(.*)` → allow `https://kloset.in` | ✓ |
| Function max duration | 30s for API routes | ✓ |
| Sentry rewrite | `/monitoring` → `sentry.io` | ⚠ pre-existing (not configured by us) |

**Notes:** The Sentry tunnel rewrite (`/monitoring`) and `next.config.ts` Sentry integration are pre-existing and were not configured in this session. The user's instruction is "Do not configure Sentry."

### next.config.ts

**File:** `Kloset/frontend/next.config.ts`

| Setting | Value | Status |
|---|---|---|
| Image domains | `images.unsplash.com`, `res.cloudinary.com` | ✓ |
| Sentry org/project | `kloset` / `kloset-frontend` | ⚠ pre-existing |
| Source maps | uploaded then deleted after upload | ⚠ good practice |
| HSTS | set via `vercel.json` (63072000s = 2yr) | ✓ |

---

## 5. Dockerfile — Backend

**File:** `Kloset/backend/Dockerfile`

| Aspect | Status |
|---|---|
| Multi-stage build (builder → runtime) | ✓ |
| Go 1.22 Alpine builder | ✓ |
| CGO disabled, static binary | ✓ |
| `alpine:3.19` runtime (6MB) | ✓ |
| CA certs + tzdata installed | ✓ |
| Exposes port 8080 | ✓ |
| HEALTHCHECK with 30s interval | ✓ |
| Copies migrations directory into image | ✓ (belt-and-suspenders) |

No issues found.

---

## 6. Environment File Structure

| File | Tracked in Git? | Contains Secrets? | Status |
|---|---|---|---|
| `.env.example` (root) | Yes | No (placeholders) | ✓ |
| `Kloset/backend/.env` | Yes | No (placeholders) | ✓ |
| `Kloset/backend/.env.example` | Yes | No (placeholders) | ✓ |
| `Kloset/backend/.env.production` | **Yes** | No (`__PLACEHOLDER__` values) | ⚠ tracked |
| `Kloset/frontend/.env.local` | No | No (empty/placeholders) | ✓ |
| `Kloset/frontend/.env.production` | **Yes** | No (`__PLACEHOLDER__` values) | ⚠ tracked |

**Issue:** Both `.env.production` files are tracked in git (see `GIT_SECURITY_REPORT.md`). Contents are `__PLACEHOLDER__` values only, so no live secrets are exposed. Recommended fix: add both to `.gitignore` and use `git rm --cached`.

**Env var discrepancy:**

| Variable | `.env.example` (root) | `render.yaml` | `backend/.env.production` |
|---|---|---|---|
| `GEMINI_MODEL` | `gemini-2.5-flash` | `gemini-1.5-flash` | `gemini-1.5-flash` |

The root `.env.example` and `backend/.env` (dev) specify `gemini-2.5-flash`, but `render.yaml` and `backend/.env.production` specify `gemini-1.5-flash`. These should be consistent.

---

## 7. Summary of Required Fixes

| # | Severity | File | Fix |
|---|---|---|---|
| 1 | P0 | `render.yaml:12` | `dockerfilePath: ./backend/Dockerfile` → `./Kloset/backend/Dockerfile` |
| 2 | P0 | `render.yaml:13` | `dockerContext: ./backend` → `./Kloset/backend` |
| 3 | P0 | `ci.yml:24,61,102,106` | All `working-directory` → `Kloset/frontend` / `Kloset/backend` |
| 4 | P0 | `ci.yml:32,68` | `cache-dependency-path` → `Kloset/frontend/...` / `Kloset/backend/...` |
| 5 | P0 | `ci.yml:77` | `./cmd/server` path will resolve correctly once working-dir is fixed, but document: must run from `Kloset/backend` |
| 6 | P1 | `pr-check.yml:39` | Fix regex: `"\x27"` → `['"]` |
| 7 | P1 | `docker-compose.yml` frontend | Add `Dockerfile` to `Kloset/frontend/` or remove frontend service (dev-only) |
| 8 | P2 | `render.yaml` / `.env.production` | Sync `GEMINI_MODEL` to `gemini-2.5-flash` across all files |
| 9 | ⚠ | `.env.production` (both) | Add to `.gitignore` + `git rm --cached` (requires owner approval) |

---

## 8. Owner Action Items

1. **Fix render.yaml paths** — P0 for deployment. Without this, Render builds fail.
2. **Fix CI workflow paths** — P0 for CI. All PRs and pushes will fail checks.
3. **Decide on frontend Dockerfile** — needed for `docker compose up` to work locally.
4. **Verify Vercel + Render GitHub integrations** — `deploy.yml` is purely cosmetic; actual deployments rely on platform integrations.
5. **Sync GEMINI_MODEL** — pick one model version and use it everywhere.
6. **Track `.env.production` cleanup** — from the security audit.
