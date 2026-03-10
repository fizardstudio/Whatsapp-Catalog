-- ==============================================================================
-- Supabase Schema untuk Aplikasi Katalog-WhatsApp
-- Dijalankan pada Supabase SQL Editor
-- ==============================================================================

-- 1. Create table 'merchants' (Extended from auth.users)
-- Akan disinkronisasi ketika user baru register
CREATE TABLE merchants (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table 'stores'
-- Setiap merchant dapat memiliki 1 toko (Untuk MVP, 1-to-1)
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    whatsapp_number TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table 'products'
-- Menyimpan katalog produk untuk toko tertentu
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    emoji TEXT NOT NULL,
    is_available BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- KEBIAJAKAN MERCHANTS:
-- Merchant dapat melihat dan mengelola datanya sendiri
CREATE POLICY "Merchant can view own profile" 
    ON merchants FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Merchant can update own profile" 
    ON merchants FOR UPDATE 
    USING (auth.uid() = id);

-- KEBIAJAKAN STORES:
-- Publik dapat melihat semua store
CREATE POLICY "Public can view all stores" 
    ON stores FOR SELECT 
    USING (true);

-- Merchant dapat membuat, meng-update, dan menghapus store-nya sendiri
CREATE POLICY "Merchant can insert own store" 
    ON stores FOR INSERT 
    WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchant can update own store" 
    ON stores FOR UPDATE 
    USING (auth.uid() = merchant_id);

CREATE POLICY "Merchant can delete own store" 
    ON stores FOR DELETE 
    USING (auth.uid() = merchant_id);

-- KEBIAJAKAN PRODUCTS:
-- Publik dapat melihat semua produk yang aktif (atau semua)
CREATE POLICY "Public can view all products" 
    ON products FOR SELECT 
    USING (true);

-- Merchant dapat mengelola produknya jika produk tersebut adalah milik toko merchant tersebut
CREATE POLICY "Merchant can insert own products" 
    ON products FOR INSERT 
    WITH CHECK (store_id IN (SELECT id FROM stores WHERE merchant_id = auth.uid()));

CREATE POLICY "Merchant can update own products" 
    ON products FOR UPDATE 
    USING (store_id IN (SELECT id FROM stores WHERE merchant_id = auth.uid()));

CREATE POLICY "Merchant can delete own products" 
    ON products FOR DELETE 
    USING (store_id IN (SELECT id FROM stores WHERE merchant_id = auth.uid()));

-- ==============================================================================
-- TRIGGER FOR NEW USER REGISTRATION
-- Secara otomatis insert row ke tabel `merchants` ketika user mendaftar di auth.users
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.merchants (id, full_name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
