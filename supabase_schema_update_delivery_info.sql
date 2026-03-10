-- ==============================================================================
-- Supabase Schema Update: App Delivery and Custom Delivery Info
-- Dijalankan pada Supabase SQL Editor
-- ==============================================================================

-- Tambahkan kolom allow_app_delivery dan delivery_info ke tabel stores
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS allow_app_delivery BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS delivery_info TEXT;
