-- Migration 004: Payments / Transactions
-- Kloset Fashion Rental Marketplace

CREATE TYPE txn_type AS ENUM (
  'rental_payment', 'deposit_payment', 'platform_fee',
  'deposit_refund', 'rental_refund', 'seller_payout',
  'cancellation_refund'
);

CREATE TYPE txn_status AS ENUM ('pending','processing','completed','failed','reversed');

CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id),
  booking_id      UUID REFERENCES bookings(id),
  type            txn_type NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  status          txn_status DEFAULT 'pending',
  gateway         VARCHAR(20),
  gateway_txn_id  VARCHAR(150),
  gateway_data    JSONB,
  note            TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_txn_user ON transactions(user_id);
CREATE INDEX idx_txn_booking ON transactions(booking_id);
CREATE INDEX idx_txn_status ON transactions(status);
CREATE INDEX idx_txn_type ON transactions(type);
CREATE INDEX idx_txn_created ON transactions(created_at DESC);
