# Kloset Database Architecture Decision Audit Report
**Production Readiness Schema Ownership Assessment**

---

## 1. Executive Summary

This audit evaluates the database schema management strategies of Kloset. Currently, schema control is split across a hybrid model: raw SQL migrations (`launch_schema.sql`) bootstrap the core relations and triggers, while GORM `AutoMigrate` runs dynamically on application startup to ensure helper tables are synchronized. 

This hybrid approach introduces **duplicate table ownership**, **constraint collisions**, and **index namespace conflicts**. To establish a startup-grade production-ready candidate, this report details the ownership mismatches and recommends **Option A: SQL Migrations Only** as the standard database architecture.

---

## 2. Table Ownership Audit

### A. Ownership Matrix

| Database Table | SQL Migration (`launch_schema.sql`) | GORM AutoMigrate (`main.go`) | Ownership Model |
| :--- | :---: | :---: | :--- |
| `users` | Yes | Yes | **Conflict (Duplicate)** |
| `user_addresses` | Yes | Yes | **Conflict (Duplicate)** |
| `refresh_tokens` | Yes | No | SQL Only |
| `outfits` | Yes | No | SQL Only |
| `outfit_images` | Yes | No | SQL Only |
| `wishlists` | Yes | No | SQL Only |
| `bookings` | Yes | No | SQL Only |
| `transactions` | Yes | No | SQL Only |
| `reviews` | Yes | No | SQL Only |
| `notifications` | Yes | Yes | **Conflict (Duplicate)** |
| `disputes` | Yes | No | SQL Only |
| `ai_events` | Yes | No | SQL Only |
| `otp_verifications` | Yes | Yes | **Conflict (Duplicate)** |
| `rate_limit_events` | Yes | Yes | **Conflict (Duplicate)** |
| `email_queue` | Yes | Yes | **Conflict (Duplicate)** |
| `ai_cache` | Yes | Yes | **Conflict (Duplicate)** |
| `system_logs` | Yes | Yes | **Conflict (Duplicate)** |
| `email_logs` | Yes | Yes | **Conflict (Duplicate)** |

---

## 3. Detailed Architecture Conflicts

### A. Duplicate Schema Definition Risks
* **Source of Truth Mismatch**: Changes to attributes inside backend Go models can diverge from SQL script definitions. If the model is updated but the SQL schema is not (or vice-versa), GORM tries to inject DDL alerts inline during startup.
* **Boot Failures**: In a clustered environment, multiple servers booting simultaneously executing GORM `AutoMigrate` will compete for schema alterations, potentially causing transaction deadlocks and application startup crashes.

### B. Unique Constraint Collisions
* **Naming Conventions**: By default, PostgreSQL maps inline table-level `UNIQUE` constraints (e.g., `email VARCHAR(255) UNIQUE`) to index constraint names like `users_email_key`.
* **GORM Expectations**: GORM assumes a strict naming structure of `uni_<table_name>_<field_name>` (e.g., `uni_users_email`). If GORM detects a column attribute change, it generates a drop constraint query targeting `uni_users_email`. This throws `SQLSTATE 42704 (constraint "uni_users_email" does not exist)` and halts backend server startup.

### C. Performance Index Namespace Clashes
* **Optimized Indexes**: SQL migration scripts create indexes optimized for standard search patterns (e.g., GIN indices on triggers, composite indices on compound fields).
* **Duplicate Indexes**: GORM does not dynamically introspect custom index expressions. It will attempt to create standard indices based on its tags, resulting in redundant indexes (wasting write IOPS) or database namespace violations.

---

## 4. Architecture Recommendation

### **Option A: SQL Migrations Only (Recommended)**

> [!IMPORTANT]
> **Production Recommendation**: We recommend adopting **Option A (SQL Migrations Only)** and disabling GORM Auto-Migration entirely in production envs.

### Rationale
1. **Deterministic Deployments**: Schema execution is run as a single step during the CI/CD deployment pipeline (e.g., before building or scaling containers). The application server never attempts to modify the database schema at runtime.
2. **PostgreSQL Expressiveness**: Custom data structures, schema triggers (such as `outfit_search_vector_update`), GIN search vectors, and partial conditional indices are fully defined and tested in pure SQL.
3. **Auditability**: Migration scripts checked into version control act as a clear historical ledger of database evolution, whereas GORM `AutoMigrate` runs implicitly.

---

## 5. Transition Path to Option A

1. **Model Tag Cleanup**: Remove all constraint and index tags from GORM models (e.g., `gorm:"uniqueIndex"` or `gorm:"unique"`), letting GORM treat fields as basic types.
2. **Disable Startup Migrations**: Replace the `db.AutoMigrate(...)` call in [main.go](file:///y:/swetha/Kloset/backend/cmd/server/main.go) with a schema validation/health check.
3. **Unified Migrations Runner**: Move all schema setup (including OTP, cache, and rate limit tables) exclusively to raw SQL migration files applied by the bootstrap migration runner or a dedicated tool (like `golang-migrate` or `dbmate`).
