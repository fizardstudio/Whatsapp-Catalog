-- ==============================================================================
-- Supabase Schema Update: Delivery Methods
-- Dijalankan pada Supabase SQL Editor
-- ==============================================================================

-- Tambahkan kolom allow_pickup dan allow_delivery ke tabel stores
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS allow_pickup BOOLEAN DEFAULT true NOT NULL,
ADD COLUMN IF NOT EXISTS allow_delivery BOOLEAN DEFAULT false NOT NULL;
