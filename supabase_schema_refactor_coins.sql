-- ==============================================================================
-- Supabase SQL Script: Refactor Koin ke Tabel 'stores'
-- ==============================================================================

-- 1. Tambahkan kolom 'coins' ke tabel stores
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS coins INTEGER NOT NULL DEFAULT 10;

-- 2. Pindahkan isi saldo koin dari merchants ke stores
-- (Ini penting agar yang tadinya punya 50 koin tidak kembali jadi 10)
UPDATE public.stores s
SET coins = m.coins
FROM public.merchants m
WHERE s.merchant_id = m.id;

-- 3. Copot Trigger lawas dari tabel merchants
DROP TRIGGER IF EXISTS trigger_give_initial_coins ON public.merchants;

-- 4. Bikin ulang Fungsi Trigger, kali ini untuk memantau 'stores' yang baru dibuat
CREATE OR REPLACE FUNCTION public.give_initial_coins()
RETURNS TRIGGER AS $$
DECLARE
  current_store_count INT;
  initial_coin_amount INT;
BEGIN
  -- Hitung berapa jumlah store yang sudah ada sekarang
  SELECT count(*) INTO current_store_count FROM public.stores;
  
  -- Promo Early Bird: 50 toko pertama dapat 50 koin
  IF current_store_count <= 50 THEN
    initial_coin_amount := 50;
  ELSE
    initial_coin_amount := 10;
  END IF;

  -- Update koin store yang baru saja dibuat
  UPDATE public.stores 
  SET coins = initial_coin_amount 
  WHERE id = NEW.id;

  -- Buat log ke coin_transactions (tetap pakai merchant_id untuk kemudahan Dashboard)
  INSERT INTO public.coin_transactions (merchant_id, amount, description)
  VALUES (NEW.merchant_id, initial_coin_amount, 'Bonus Pembuatan Toko (Koin Awal)');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Pasang Trigger ke tabel stores (bukan merchants lagi)
CREATE TRIGGER trigger_give_initial_coins
  AFTER INSERT ON public.stores
  FOR EACH ROW EXECUTE PROCEDURE public.give_initial_coins();

-- 6. Hapus kolom coins dari tabel merchants agar tidak ada redundansi / kebingungan
ALTER TABLE public.merchants
DROP COLUMN IF EXISTS coins;
