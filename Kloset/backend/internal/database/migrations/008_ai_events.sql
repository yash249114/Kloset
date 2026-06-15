-- Migration 008: AI Events & Recommendations
-- Kloset Fashion Rental Marketplace

CREATE TYPE ai_event_type AS ENUM (
  'view','wishlist','click','search','book','review',
  'share','time_spent'
);

CREATE TABLE ai_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  outfit_id   UUID REFERENCES outfits(id) ON DELETE CASCADE,
  event_type  ai_event_type NOT NULL,
  metadata    JSONB,
  session_id  VARCHAR(64),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recommendation_cache (
  user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  outfit_ids    UUID[] NOT NULL,
  strategy      VARCHAR(50),
  computed_at   TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ
);

CREATE TABLE trending_outfits (
  outfit_id     UUID PRIMARY KEY REFERENCES outfits(id) ON DELETE CASCADE,
  score         DECIMAL(10,4) DEFAULT 0,
  period        VARCHAR(20) DEFAULT '7d',
  rank          INTEGER,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_events_user ON ai_events(user_id, created_at DESC);
CREATE INDEX idx_ai_events_outfit ON ai_events(outfit_id, event_type);
CREATE INDEX idx_ai_events_session ON ai_events(session_id);
CREATE INDEX idx_trending_score ON trending_outfits(score DESC);
