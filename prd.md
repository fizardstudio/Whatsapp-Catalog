PRD — Dokumen Persyaratan Proyek: Fizard Katalog ke WA

<!--
Konteks: PRD ini mendefinisikan ruang lingkup, fitur, alur pengguna, dan arsitektur
untuk aplikasi SaaS "Katalog to WhatsApp". Dirancang khusus untuk dibaca oleh
Agen AI (seperti Google Antigravity) dan tim pengembang manusia.
-->

1. Ringkasan (Overview)

Aplikasi ini bertujuan untuk mendigitalkan katalog produk dan proses pemesanan bagi UMKM (penjual) yang saat ini masih mengandalkan obrolan WhatsApp manual. Masalah utama yang diselesaikan adalah format pesanan yang berantakan dan keengganan pelanggan yang harus bertanya-tanya soal menu atau harga secara manual.

Tujuan utamanya adalah menyediakan platform SaaS berbasis web yang sederhana di mana Penjual (Merchant) dapat mengelola informasi toko dan daftar produk mereka, memungkinkan Pelanggan untuk menelusuri produk, mengelola keranjang belanja, dan mengirim pesanan yang diformat dengan sangat rapi langsung ke WhatsApp penjual.

2. Persyaratan Utama (Requirements)

Persyaratan tingkat tinggi untuk pengembangan sistem:

Aksesibilitas: Web Browser (Diutamakan tampilan Mobile untuk pelanggan yang melihat katalog, responsif desktop/mobile untuk penjual yang mengelola dashboard).

Pengguna (Multi-tenant): Sistem dirancang untuk banyak penjual yang independen. Setiap penjual mengelola tokonya masing-masing.

Input Data: Input data dilakukan secara manual oleh penjual melalui Dashboard untuk pengaturan toko dan daftar produk.

Mekanisme Pesanan: Tidak memerlukan payment gateway (gerbang pembayaran) untuk versi MVP. Proses checkout murni mengarahkan pengguna ke API WhatsApp (wa.me) dengan teks URL yang sudah dienkripsi.

URL Toko: Setiap toko mendapatkan URL publik yang unik berdasarkan slug (contoh: fizard.shop/[slug]).

3. Fitur Inti (Core Features)

Fitur-fitur kunci yang wajib ada dalam versi MVP (Minimum Viable Product):

Autentikasi & Onboarding

Pendaftaran (Register) dan Masuk (Login) khusus untuk Penjual.

Manajemen sesi keamanan yang solid.

Dashboard Penjual (Merchant Dashboard)

Pengaturan Toko: Menentukan Nama Toko, Slug unik, dan Nomor WhatsApp tujuan.

Manajemen Produk: Operasi CRUD (Buat, Baca, Perbarui, Hapus) untuk menu/katalog.

Kolom wajib: Nama Produk, Harga, Emoji (sebagai pengganti gambar agar ringan), dan Toggle Ketersediaan (Tersedia/Habis).

Toko Publik (Sisi Pelanggan)

Rendering halaman dinamis berdasarkan slug toko.

Menampilkan nama toko penjual dan produk-produk yang sedang berstatus tersedia.

Sistem Keranjang & Checkout

State management lokal untuk keranjang belanja (tambah/kurang item, sesuaikan jumlah).

Kalkulasi otomatis untuk total item dan total harga.

WhatsApp Generator: Memformat data keranjang menjadi teks struk belanja yang rapi dan mengarahkan pelanggan ke WhatsApp penjual.

4. Alur Pengguna (User Flow)

Alur kerja sederhana untuk Penjual dan Pelanggan:

A. Alur Penjual (Setup Toko)

Login: Penjual mendaftar/masuk menggunakan email dan password.

Buat Toko: Penjual masuk ke Dashboard, memasukkan Nama Toko, Slug, dan Nomor WhatsApp.

Setup Menu: Penjual masuk ke menu Produk, menambahkan item (contoh: "Burger Keju", "25000", "🍔").

Bagikan: Penjual membagikan tautan unik mereka (/fizard-burger) di bio Instagram/WhatsApp mereka.

B. Alur Pelanggan (Pemesanan)

Kunjungan: Pelanggan mengklik tautan penjual dan membuka web katalog.

Pilih & Tambah: Pelanggan melihat produk dan mengklik tombol "Tambah" (+ / -).

Review: Pelanggan mengklik tombol "Checkout WA" yang melayang di bawah layar.

Checkout: Sistem otomatis membuka aplikasi WhatsApp dengan pesan pesanan terperinci yang sudah terisi otomatis.

5. Arsitektur (Architecture)

Aliran data teknis untuk fitur utama (checkout):

sequenceDiagram
    participant Pelanggan as Pelanggan (Browser)
    participant UI as Toko Publik (Next.js)
    participant DB as Database (Supabase)
    participant WA as API WhatsApp

    Note over Pelanggan, WA: Proses Belanja & Checkout

    Pelanggan->>UI: Mengunjungi /[slug]
    UI->>DB: Ambil detail Toko berdasarkan slug
    DB-->>UI: Kembalikan data Toko (termasuk No WA)
    UI->>DB: Ambil Produk berdasarkan ID Toko
    DB-->>UI: Kembalikan Produk yang aktif
    UI-->>Pelanggan: Render UI Katalog
    
    Pelanggan->>UI: Tambah item ke Keranjang (Lokal)
    Pelanggan->>UI: Klik "Checkout WA"
    UI->>UI: Hitung total & format teks pesan
    UI->>UI: Encode pesan ke URL
    UI->>WA: Redirect ke [https://wa.me/](https://wa.me/){nomor_wa}?text={pesan_encoded}
    WA-->>Pelanggan: Buka aplikasi WhatsApp dengan teks siap kirim


6. Skema Database (Database Schema)

Entity Relationship Diagram (ERD) yang mendefinisikan struktur inti Supabase:

erDiagram
    users {
        uuid id PK "Supabase Auth ID"
        string email
    }

    merchants {
        uuid id PK "Referensi ke auth.users.id"
        string full_name
        string email
        datetime created_at
    }

    stores {
        uuid id PK
        uuid merchant_id FK
        string store_name
        string slug "Harus Unik"
        string whatsapp_number
        string description
        datetime created_at
    }

    products {
        uuid id PK
        uuid store_id FK
        string name
        numeric price
        string emoji
        boolean is_available
        datetime created_at
    }

    users ||--o| merchants : "melengkapi"
    merchants ||--o| stores : "memiliki satu (utk MVP)"
    stores ||--o{ products : "memiliki banyak"


Tabel

Deskripsi

merchants

Profil tambahan untuk pengguna yang sudah terautentikasi (Penjual).

stores

Menyimpan detail toko publik, slug unik untuk URL, dan nomor WA tujuan.

products

Data master untuk menu/katalog. Terikat pada satu toko spesifik.

7. Batasan Desain & Teknis (Design & Technical Constraints)

Panduan wajib untuk implementasi AI Agent & Developer:

Aturan Bahasa (SANGAT PENTING):

Seluruh antarmuka pengguna (UI), placeholder, pesan error, notifikasi (toast), dan teks hasil generate pesanan WhatsApp HARUS menggunakan Bahasa Indonesia yang sopan dan profesional.

Teknologi Utama:

Framework: Next.js 15 (App Router) untuk pengembangan UI cepat dan dynamic routing.

Database/Auth: Supabase (PostgreSQL) menggunakan @supabase/supabase-js. Terapkan Row Level Security (RLS) dengan ketat agar penjual hanya bisa mengedit datanya sendiri.

Styling: Tailwind CSS v4 (@import "tailwindcss";).

Aturan UI & Tipografi (Standar Fizard Studio):

Estetika premium, bersih, dan modern.

Jarak (padding/margin) yang luas (contoh: p-4, p-6) dan sudut membulat (rounded-xl, rounded-2xl).

Gunakan bayangan (shadow-sm, shadow-md) untuk kedalaman visual elemen.

Warna: Gunakan slate untuk teks netral/background, blue untuk aksi utama (tombol), dan red/green untuk aksi destruktif/sukses.

Input Form: Kolom input wajib menggunakan text-slate-900 untuk teks yang diketik dan placeholder-slate-400 untuk teks petunjuk agar kontras dan mudah dibaca.