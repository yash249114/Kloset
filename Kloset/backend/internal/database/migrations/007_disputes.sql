-- Migration 007: Disputes
-- Kloset Fashion Rental Marketplace

CREATE TYPE dispute_status AS ENUM ('open','in_review','resolved','closed');

CREATE TYPE dispute_resolution AS ENUM (
  'full_refund_renter','full_release_seller','split','dismissed'
);

CREATE TABLE disputes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id      UUID NOT NULL REFERENCES bookings(id),
  raised_by       UUID NOT NULL REFERENCES users(id),
  against         UUID NOT NULL REFERENCES users(id),
  reason          VARCHAR(100),
  description     TEXT NOT NULL,
  evidence_photos TEXT[],
  status          dispute_status DEFAULT 'open',
  resolution      dispute_resolution,
  resolution_note TEXT,
  refund_amount   DECIMAL(10,2),
  resolved_by     UUID REFERENCES users(id),
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_disputes_booking ON disputes(booking_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_raised_by ON disputes(raised_by);
