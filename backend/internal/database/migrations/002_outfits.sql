-- Migration 002: Outfits, Images, Wishlists, Full-Text Search
-- Kloset Fashion Rental Marketplace

CREATE TYPE outfit_status AS ENUM (
  'draft', 'pending_approval', 'active',
  'rented', 'cleaning', 'inactive', 'rejected'
);

CREATE TYPE outfit_category AS ENUM (
  'lehenga', 'saree', 'anarkali', 'sharara', 'gown',
  'sherwani', 'kurta_set', 'co_ord', 'western', 'other'
);

CREATE TABLE outfits (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id             UUID NOT NULL REFERENCES users(id),
  title                 VARCHAR(200) NOT NULL,
  slug                  VARCHAR(250) UNIQUE,
  description           TEXT,
  ai_description        TEXT,
  category              outfit_category NOT NULL,
  occasions             TEXT[],
  colors                TEXT[],
  fabric                VARCHAR(100),
  sizes                 TEXT[],
  accessories_included  TEXT[],
  city                  VARCHAR(100),
  state                 VARCHAR(100),
  pincode               VARCHAR(10),
  price_1day            DECIMAL(10,2),
  price_3day            DECIMAL(10,2),
  price_7day            DECIMAL(10,2),
  security_deposit      DECIMAL(10,2),
  delivery_available    BOOLEAN DEFAULT false,
  delivery_fee          DECIMAL(8,2) DEFAULT 0,
  status                outfit_status DEFAULT 'draft',
  rejection_reason      TEXT,
  rating_avg            DECIMAL(3,2) DEFAULT 0,
  rating_count          INTEGER DEFAULT 0,
  view_count            INTEGER DEFAULT 0,
  wishlist_count        INTEGER DEFAULT 0,
  booking_count         INTEGER DEFAULT 0,
  search_vector         TSVECTOR,
  ai_tags               TEXT[],
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

CREATE TABLE outfit_images (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outfit_id     UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  cloudinary_id VARCHAR(200),
  is_primary    BOOLEAN DEFAULT false,
  sort_order    SMALLINT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE outfit_availability_blocks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outfit_id     UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  blocked_from  DATE NOT NULL,
  blocked_to    DATE NOT NULL,
  reason        VARCHAR(100)
);

CREATE TABLE wishlists (
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  outfit_id   UUID REFERENCES outfits(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, outfit_id)
);

-- Full-text search trigger
CREATE OR REPLACE FUNCTION outfit_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description,'')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.occasions,' '),'')), 'C');
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER outfit_search_update
  BEFORE INSERT OR UPDATE ON outfits
  FOR EACH ROW EXECUTE FUNCTION outfit_search_vector_update();

CREATE INDEX idx_outfits_seller ON outfits(seller_id);
CREATE INDEX idx_outfits_status ON outfits(status);
CREATE INDEX idx_outfits_city ON outfits(city);
CREATE INDEX idx_outfits_category ON outfits(category);
CREATE INDEX idx_outfits_search ON outfits USING GIN(search_vector);
CREATE INDEX idx_outfits_ai_tags ON outfits USING GIN(ai_tags);
CREATE INDEX idx_outfit_images_outfit ON outfit_images(outfit_id);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_wishlists_outfit ON wishlists(outfit_id);
