-- Migration 009: Composite Performance Indexes
-- Kloset Fashion Rental Marketplace

-- Outfit discovery: active outfits filtered by city/category
CREATE INDEX idx_outfits_discovery ON outfits(status, city, category)
  WHERE status = 'active' AND deleted_at IS NULL;

-- Booking overlap check: prevent double-booking
CREATE INDEX idx_bookings_overlap_check ON bookings(outfit_id, pickup_date, return_date)
  WHERE status NOT IN ('cancelled', 'completed');

-- Price range filtering
CREATE INDEX idx_outfits_price_range ON outfits(price_1day, price_3day)
  WHERE status = 'active';

-- Recent bookings per seller (for dashboard)
CREATE INDEX idx_bookings_seller_recent ON bookings(seller_id, created_at DESC);

-- User order history
CREATE INDEX idx_bookings_renter_recent ON bookings(renter_id, created_at DESC);

-- Active outfit count per seller
CREATE INDEX idx_outfits_seller_active ON outfits(seller_id)
  WHERE status = 'active' AND deleted_at IS NULL;

-- Notification badge count
CREATE INDEX idx_notif_unread ON notifications(user_id)
  WHERE is_read = false;
