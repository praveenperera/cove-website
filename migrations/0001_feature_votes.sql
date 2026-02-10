CREATE TABLE IF NOT EXISTS feature_vote_events (
  checkout_id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  settled_sats INTEGER NOT NULL CHECK (settled_sats > 0),
  checkout_status TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  raw_checkout_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS feature_vote_totals (
  product_id TEXT PRIMARY KEY,
  total_sats INTEGER NOT NULL DEFAULT 0 CHECK (total_sats >= 0),
  vote_count INTEGER NOT NULL DEFAULT 0 CHECK (vote_count >= 0),
  last_vote_at TEXT
);

CREATE TRIGGER IF NOT EXISTS trg_feature_vote_events_after_insert
AFTER INSERT ON feature_vote_events
BEGIN
  INSERT INTO feature_vote_totals (product_id, total_sats, vote_count, last_vote_at)
  VALUES (NEW.product_id, NEW.settled_sats, 1, NEW.recorded_at)
  ON CONFLICT(product_id) DO UPDATE SET
    total_sats = total_sats + NEW.settled_sats,
    vote_count = vote_count + 1,
    last_vote_at = NEW.recorded_at;
END;

CREATE INDEX IF NOT EXISTS idx_feature_vote_totals_total_sats
  ON feature_vote_totals(total_sats DESC);
