-- Migration 006: Notifications
-- Kloset Fashion Rental Marketplace

CREATE TYPE notif_channel AS ENUM ('in_app','push','sms','email');

CREATE TYPE notif_type AS ENUM (
  'booking_request','booking_confirmed','booking_declined',
  'pickup_reminder','return_reminder','return_initiated',
  'deposit_refunded','payment_released','new_review',
  'dispute_raised','dispute_resolved','kyc_verified',
  'listing_approved','listing_rejected','welcome'
);

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        notif_type NOT NULL,
  title       VARCHAR(200),
  body        TEXT,
  data        JSONB,
  channels    notif_channel[] DEFAULT '{in_app}',
  is_read     BOOLEAN DEFAULT false,
  sent_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notif_type ON notifications(type);
