-- ==============================================================================
-- Supabase SQL Script: Fitur Admin Panel (Blokir Toko)
-- ==============================================================================

-- 1. Tambahkan kolom 'is_banned' ke tabel stores
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false;

-- Keterangan:
-- BOOLEAN: Hanya bisa diisi TRUE atau FALSE.
-- NOT NULL DEFAULT false: Artinya secara bawaan semua toko berstatus 'Aman' (tidak diblokir).
-- Jika Admin mencegat masalah, admin akan mengeset is_banned toko menjadi TRUE.
