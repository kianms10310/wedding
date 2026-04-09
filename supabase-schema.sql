-- Supabase SQL Schema for Wedding Invitation
-- Run this in Supabase SQL Editor

-- RSVP Table
CREATE TABLE IF NOT EXISTS rsvps (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  side VARCHAR(10) NOT NULL CHECK (side IN ('groom', 'bride')),
  attendance BOOLEAN NOT NULL DEFAULT true,
  guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count >= 1 AND guest_count <= 10),
  meal_type VARCHAR(20),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Guestbook Table
CREATE TABLE IF NOT EXISTS guestbook (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow anonymous read/insert
CREATE POLICY "Allow anonymous read rsvps" ON rsvps FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert rsvps" ON rsvps FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read guestbook" ON guestbook FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert guestbook" ON guestbook FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_rsvps_created_at ON rsvps (created_at DESC);
CREATE INDEX idx_guestbook_created_at ON guestbook (created_at DESC);
CREATE INDEX idx_rsvps_side ON rsvps (side);
