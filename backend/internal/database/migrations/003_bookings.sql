-- Migration 003: Bookings
-- Kloset Fashion Rental Marketplace

CREATE TYPE booking_status AS ENUM (
  'pending', 'confirmed', 'picked_up',
  'in_use', 'return_initiated', 'returned',
  'cleaning', 'completed', 'cancelled', 'disputed'
);

CREATE TYPE delivery_type AS ENUM ('pickup', 'delivery');

CREATE TABLE bookings (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref             VARCHAR(20) UNIQUE NOT NULL,
  outfit_id               UUID NOT NULL REFERENCES outfits(id),
  renter_id               UUID NOT NULL REFERENCES users(id),
  seller_id               UUID NOT NULL REFERENCES users(id),
  pickup_date             DATE NOT NULL,
  return_date             DATE NOT NULL,
  rental_days             INTEGER NOT NULL,
  size_selected           VARCHAR(10),
  status                  booking_status DEFAULT 'pending',
  delivery_type           delivery_type DEFAULT 'pickup',
  delivery_address        JSONB,
  rental_amount           DECIMAL(10,2),
  security_deposit        DECIMAL(10,2),
  delivery_fee            DECIMAL(8,2) DEFAULT 0,
  platform_fee            DECIMAL(8,2),
  total_amount            DECIMAL(10,2),
  payment_status          VARCHAR(20) DEFAULT 'pending',
  razorpay_order_id       VARCHAR(100),
  razorpay_payment_id     VARCHAR(100),
  return_photos           TEXT[],
  return_condition        VARCHAR(50),
  return_notes            TEXT,
  return_initiated_at     TIMESTAMPTZ,
  returned_at             TIMESTAMPTZ,
  deposit_refund_amount   DECIMAL(10,2),
  deposit_refund_reason   TEXT,
  seller_accepted_at      TIMESTAMPTZ,
  seller_accept_deadline  TIMESTAMPTZ,
  cancellation_reason     TEXT,
  cancelled_by            UUID REFERENCES users(id),
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_outfit ON bookings(outfit_id);
CREATE INDEX idx_bookings_renter ON bookings(renter_id);
CREATE INDEX idx_bookings_seller ON bookings(seller_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(pickup_date, return_date);
CREATE INDEX idx_bookings_ref ON bookings(booking_ref);
