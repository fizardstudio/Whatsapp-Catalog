import { Store, MessageCircle, TrendingUp, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

// --- KONTEKS UNTUK BANG FIRMAN (FIZARD STUDIO) ---
// Landing Page ini telah di-upgrade untuk mendukung Dark Mode secara penuh.
// Semua elemen sekarang merespons preferensi tema sistem pelanggan.
// Date: March 2026

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-300">

      {/* 1. NAVBAR SECTION */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md fixed top-0 w-full z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Order<span className="text-blue-600 dark:text-blue-500">in</span></span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Masuk
            </a>
            <a href="/register" className="text-sm font-semibold bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-sm">
              Buat Toko Gratis
            </a>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-500/20">
          <Zap className="w-4 h-4" />
          <span>Solusi UMKM F&B Modern 2026</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mb-6">
          Terima Pesanan WhatsApp Lebih <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Rapi & Elegan.</span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Ubah cara Anda berjualan. Buat katalog digital dalam 5 menit, bagikan link, dan biarkan sistem kami merekap pesanan pelanggan langsung ke WhatsApp Anda. <strong className="text-slate-900 dark:text-slate-200">Tanpa potongan komisi sepeserpun!</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a href="/register" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all shadow-md hover:shadow-lg dark:shadow-blue-900/20">
            Mulai Sekarang - Gratis <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#cara-kerja" className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            Lihat Cara Kerja
          </a>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-20 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Mengapa UMKM Memilih Kami?</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Kami mengatasi masalah antrean chat yang panjang dan format pesanan yang membingungkan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">100% Bebas Komisi</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Tidak ada potongan 20% seperti aplikasi sebelah. Uang hasil jualan masuk utuh ke kantong Anda tanpa potongan sepeserpun.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Pesanan WA Otomatis Rapi</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Pelanggan tinggal klik, sistem akan menjumlahkan subtotal, ongkir, dan mengirim detail pesanan dalam format teks WA yang sangat rapi.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Naikkan Kelas Toko Anda</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Dapatkan link toko eksklusif (contoh: orderin.id/tokomu) yang bisa dipasang di bio Instagram. Terlihat mewah dan profesional!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="cara-kerja" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-16">Cuma Butuh 3 Langkah Mudah</h2>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">1</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Daftar & Atur Toko</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Buat akun gratis, masukkan nama toko, dan nomor WhatsApp admin yang akan menerima pesanan.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">2</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Atur Menu dengan Emoji Unik</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Tambahkan daftar produk Anda dengan pilihan emoji yang menarik. Sangat ringan, kencang, dan mudah dikelola tanpa perlu upload foto manual.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">3</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Bagikan Link & Terima Order</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Taruh link di bio sosmed. Pelanggan klik, pilih menu, dan notifikasi pesanan rapi akan langsung masuk ke WA Anda!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA BOTTOM SECTION */}
      <section className="py-20 px-6 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-5xl mx-auto bg-slate-900 dark:bg-slate-800 rounded-3xl p-10 text-center shadow-2xl overflow-hidden relative border border-slate-800 dark:border-slate-700">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Siap Mengubah Cara Berjualan Anda?</h2>
            <p className="text-slate-300 dark:text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Tinggalkan cara lama merekap pesanan. Bergabung dengan UMKM cerdas lainnya dan optimalkan penjualan Anda hari ini.
            </p>
            <a href="/register" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-colors shadow-lg">
              Buat Katalog Saya Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 text-center transition-colors">
        <p className="text-slate-500 dark:text-slate-500 font-medium">© 2026 Orderin. Dikembangkan oleh Fizard Studio.</p>
      </footer>

    </div>
  );
}