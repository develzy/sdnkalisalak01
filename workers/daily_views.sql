-- Daily views tracking table
CREATE TABLE IF NOT EXISTS daily_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  view_date TEXT NOT NULL UNIQUE, -- Format: YYYY-MM-DD
  count INTEGER DEFAULT 0
);
