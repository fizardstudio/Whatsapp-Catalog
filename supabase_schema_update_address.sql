-- Menambahkan kolom alamat (address) untuk Merchant pada tabel stores
ALTER TABLE stores ADD COLUMN IF NOT EXISTS address TEXT;
