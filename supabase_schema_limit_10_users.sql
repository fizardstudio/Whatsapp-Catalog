-- ==============================================================================
-- Supabase SQL Script: Membatasi Kuota Pendaftaran (Maksimal 10 Pengguna Pertama)
-- Cara Pakai:
-- 1. Buka Supabase Dashboard -> SQL Editor
-- 2. Paste kode di bawah ini lalu klik RUN
-- ==============================================================================

-- Membuat fungsi pencegah pendaftaran jika kuota penuh
CREATE OR REPLACE FUNCTION public.check_user_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_user_count INT;
BEGIN
  -- Menghitung jumlah merchant (UMKM) yang sudah terdaftar saat ini
  SELECT count(*) INTO current_user_count FROM public.merchants;
  
  -- Jika sudah mencapai 10 atau lebih, gagalkan proses registrasi
  IF current_user_count >= 10 THEN
    RAISE EXCEPTION 'Mohon maaf, kuota pendaftaran awal (10 toko pertama) sudah penuh.';
  END IF;

  -- Jika masih kurang dari 10, izinkan pendaftaran lanjut
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Memasang trigger (pelatuk) yang berjalan SEBELUM Supabase menyimpan user baru
DROP TRIGGER IF EXISTS enforce_user_limit ON auth.users;

CREATE TRIGGER enforce_user_limit
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.check_user_limit();

-- CATATAN UNTUK BANG FIRMAN:
-- Script ini akan otomatis memblokir pendaftaran (Register) dari frontend
-- dan memunculkan pesan error "Mohon maaf, kuota... sudah penuh" 
-- jika sudah ada 10 user di tabel merchants.
