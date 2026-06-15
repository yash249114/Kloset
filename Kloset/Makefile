.PHONY: dev dev-backend dev-frontend build test migrate seed

# ─── Development ────────────────────────────
dev: dev-backend dev-frontend

dev-backend:
	cd backend && go run cmd/server/main.go

dev-frontend:
	cd frontend && npm run dev

# ─── Build ──────────────────────────────────
build-backend:
	cd backend && go build -o bin/server cmd/server/main.go

build-frontend:
	cd frontend && npm run build

build: build-backend build-frontend

# ─── Database ───────────────────────────────
migrate:
	@echo "Run migrations against your Supabase database"
	@echo "Use the Supabase SQL editor to run migration files in order"
	@echo "Files are in backend/internal/database/migrations/"

seed:
	cd backend && go run cmd/seed/main.go

# ─── Docker ─────────────────────────────────
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# ─── Dependencies ───────────────────────────
deps-backend:
	cd backend && go mod tidy

deps-frontend:
	cd frontend && npm install

deps: deps-backend deps-frontend

# ─── Clean ──────────────────────────────────
clean:
	cd backend && rm -rf bin/
	cd frontend && rm -rf .next/ out/
