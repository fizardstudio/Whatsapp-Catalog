-- ==============================================================================
-- Supabase SQL Script: Sistem Koin (Pay-as-you-go) untuk Orderin
-- Cara Pakai:
-- 1. Buka Supabase Dashboard -> SQL Editor
-- 2. Paste kode di bawah ini lalu klik RUN
-- ==============================================================================

-- 1. Tambahkan kolom 'coins' ke tabel merchants jika belum ada
ALTER TABLE public.merchants
ADD COLUMN IF NOT EXISTS coins INTEGER NOT NULL DEFAULT 10;

-- 2. Buat tabel untuk mencatat riwayat lalu lintas koin
CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Positif untuk Top Up, Negatif untuk dipotong (Pesanan)
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Atur keamanan RLS agar merchant cuma bisa melihat log transaksinya sendiri
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchant can view their own coin transactions"
ON public.coin_transactions
FOR SELECT
USING (auth.uid() = merchant_id);

-- (Opsional) Policy khusus service role agar admin bisa INSERT transaksi otomatis
CREATE POLICY "Service Role can insert transactions"
ON public.coin_transactions
FOR INSERT
WITH CHECK (true);

-- ==============================================================================
-- 3. TRIGGER: Beri Koin Awal Otomatis Saat Merchant Baru Dibuat
-- Logika: 50 Merchant pertama dapat 50 koin (Early Bird Promo). Sisanya 10 koin.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.give_initial_coins()
RETURNS TRIGGER AS $$
DECLARE
  current_merchant_count INT;
  initial_coin_amount INT;
BEGIN
  -- Hitung berapa jumlah merchant yang sudah ada sekarang
  SELECT count(*) INTO current_merchant_count FROM public.merchants;
  
  -- Promo Early Bird: 50 merchant pertama dapat 50 koin (Modal Gratis Lebih Besar)
  -- Jika sudah lebih dari 50 merchant, dapat standar 10 koin.
  IF current_merchant_count < 50 THEN
    initial_coin_amount := 50;
  ELSE
    initial_coin_amount := 10;
  END IF;

  -- Update koin merchant yang baru saja masuk
  UPDATE public.merchants 
  SET coins = initial_coin_amount 
  WHERE id = NEW.id;

  -- (Opsional) Catat hadiah koin pertama ini ke log transaksi
  INSERT INTO public.coin_transactions (merchant_id, amount, description)
  VALUES (NEW.id, initial_coin_amount, 'Bonus Mendaftar Koin Awal');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger ini SETELAH profil merchant baru ter-insert ke tabel public.merchants
DROP TRIGGER IF EXISTS trigger_give_initial_coins ON public.merchants;

CREATE TRIGGER trigger_give_initial_coins
  AFTER INSERT ON public.merchants
  FOR EACH ROW EXECUTE PROCEDURE public.give_initial_coins();

-- ==============================================================================
-- PENTING UNTUK MIGRATION LAMA:
-- Hapus juga trigger limit kuota 10 orang lama (jika masih nyala) 
-- agar merchant ke-11 dst bisa tetap daftar (dengan koin trial 10)
-- ==============================================================================
DROP TRIGGER IF EXISTS enforce_user_limit ON auth.users;
