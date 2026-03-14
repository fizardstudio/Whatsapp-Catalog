-- ==============================================================================
-- Supabase SQL Script: Update view 'stores' agar memiliki kolom 'coins'
-- ==============================================================================

-- Karena kita memanggil `supabase.from('stores').select('..., coins')` di Frontend,
-- dan kemungkinan besar 'stores' adalah sebuah VIEW yang menggabungkan tabel,
-- kita harus merekonstruksi VIEW-nya agar ikut menyertakan kolom coins dari tabel utamanya.

-- 1. Hapus VIEW Lama
DROP VIEW IF EXISTS public.stores;

-- 2. Buat Ulang VIEW dengan menambahkan M.coins
-- (Asumsi: View ini menggabungkan tabel `merchants` sebagai profil toko)
CREATE OR REPLACE VIEW public.stores AS
SELECT 
  M.id,
  M.store_name,
  M.slug,
  M.description,
  M.address,
  M.whatsapp_number,
  M.allow_pickup,
  M.allow_delivery,
  M.allow_app_delivery,
  M.delivery_info,
  M.coins, -- <=== INI TAMBAHANNYA AGAR ERROR HILANG
  M.created_at
FROM 
  public.merchants M;

-- CATATAN: 
-- Jika Abang dulunya membuat tabel `stores` terpisah (bukan view dari `merchants`),
-- maka jalankan perintah ini ke tabel `stores` langsung:
-- ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS coins INTEGER NOT NULL DEFAULT 10;
