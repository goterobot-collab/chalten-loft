-- ============================================================
-- CHALTÉN LOFT — Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor
-- ============================================================

-- 1. BOOKINGS — Reservas de todos los canales
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_slug TEXT NOT NULL,          -- 'chalten-loft-fitz-roy', etc.
  property_name TEXT NOT NULL,          -- 'Dpto 1 — Fitz Roy'
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count SMALLINT NOT NULL DEFAULT 1,
  nights SMALLINT GENERATED ALWAYS AS (check_out - check_in) STORED,
  source TEXT NOT NULL DEFAULT 'airbnb', -- 'airbnb', 'booking', 'direct', 'manual'
  external_id TEXT,                      -- Airbnb reservation ID
  status TEXT NOT NULL DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CLEANING_TASKS — Tareas de limpieza automáticas
CREATE TABLE cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  property_slug TEXT NOT NULL,
  property_name TEXT NOT NULL,
  task_date DATE NOT NULL,               -- Día de limpieza (= check_out del huésped)
  checkout_time TIME DEFAULT '10:00',
  checkout_guests SMALLINT DEFAULT 1,    -- Cuántos se van
  checkin_date DATE,                     -- Próximo check-in (NULL si no hay)
  checkin_time TIME DEFAULT '15:00',
  checkin_guests SMALLINT,               -- Cuántos llegan
  cleaner_name TEXT DEFAULT 'Tania',
  cleaner_phone TEXT DEFAULT '5492615402732',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'notified', 'in_progress', 'done'
  notified_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. EMAILS_LOG — Registro de emails enviados (evitar duplicados)
CREATE TABLE emails_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  email_type TEXT NOT NULL,              -- 'confirmation', 'pre_arrival', 'checkin_day', 'checkout', 'followup'
  recipient TEXT NOT NULL,               -- email del huésped
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'sent',   -- 'sent', 'failed', 'skipped'
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  error TEXT
);

-- 4. NOTIFICATIONS_LOG — WhatsApp/Telegram enviados
CREATE TABLE notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaning_task_id UUID REFERENCES cleaning_tasks(id),
  channel TEXT NOT NULL,                 -- 'whatsapp', 'telegram', 'email'
  recipient TEXT NOT NULL,               -- phone or email
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  error TEXT
);

-- INDEXES
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_property ON bookings(property_slug);
CREATE INDEX idx_cleaning_date ON cleaning_tasks(task_date);
CREATE INDEX idx_cleaning_status ON cleaning_tasks(status);
CREATE INDEX idx_emails_booking ON emails_log(booking_id, email_type);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

-- Policies: allow all for authenticated (admin) and service role
CREATE POLICY "Allow all for service role" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON cleaning_tasks FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON emails_log FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON notifications_log FOR ALL USING (true);
