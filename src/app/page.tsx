import { Store, MessageCircle, TrendingUp, ArrowRight, Zap, ShieldCheck, Wallet, Database, Smartphone, Sparkles, CheckCircle2, Coins } from 'lucide-react';

/**
 * CONTEXT FOR BANG FIRMAN (FIZARD STUDIO):
 * Landing Page ini telah ditambahkan bagian "Sistem Koin" (Pay-as-you-go).
 * Tombol CTA juga diubah fokusnya untuk memberikan "Modal 50 Koin Gratis" di awal,
 * agar lebih memancing UMKM untuk mendaftar tanpa rasa takut akan tagihan bulanan.
 * Date: March 2026
 */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-300 overflow-hidden">

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
            <a href="/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30">
              Buat Toko Gratis
            </a>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION WITH WHATSAPP MOCKUP */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Left Column: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-500/20">
            <Zap className="w-4 h-4" />
            <span>Revolusi Kasir WA UMKM 2026</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            Pesanan WA Rapi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">Uang Masuk 100% Utuh.</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Tinggalkan cara lama merekap pesanan manual. Buat katalog digital, sebar link, dan biarkan sistem merekap pesanan ke WA Anda otomatis. <strong>Tanpa biaya bulanan & potongan komisi sepeserpun!</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="/register" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all shadow-lg shadow-blue-500/30">
              Daftar & Klaim 50 Koin Gratis <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bebas Komisi 20%</div>
            <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bayar Hanya Jika Laris</div>
          </div>
        </div>

        {/* Right Column: Visual Proof (WhatsApp Mockup) */}
        <div className="flex-1 w-full max-w-md relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 to-blue-500/20 rounded-3xl blur-2xl transform rotate-3"></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-emerald-500 text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">👤</div>
              <div>
                <div className="font-semibold">Pembeli Baru</div>
                <div className="text-xs opacity-80">online</div>
              </div>
            </div>
            <div className="p-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-emerald-50/50 dark:bg-slate-950 h-80 flex flex-col justify-end">
              <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm ml-auto max-w-[85%] border border-slate-100 dark:border-slate-700">
                <p>Halo Kak, saya mau pesan:</p>
                <p className="font-mono text-xs mt-2 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                  2x 🍔 Burger Spesial (Rp 50.000)<br />
                  1x 🍟 Kentang Goreng (Rp 15.000)
                </p>
                <p className="mt-2 font-bold text-emerald-600 dark:text-emerald-400">Subtotal: Rp 65.000</p>
                <p className="text-xs mt-1 italic text-slate-500">Mohon info ongkirnya ya kak 🙏</p>
                <div className="text-[10px] text-right mt-1 text-slate-400">10:42 AM</div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 3. THE 6 KILLER VALUE PROPOSITIONS SECTION */}
      <section className="py-24 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Senjata Utama UMKM Menang Banyak</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Kami merancang Orderin khusus untuk menyelesaikan masalah terbesar Anda saat berjualan online.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Value 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">0% Bebas Potongan</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Jualan tanpa bayang-bayang potongan komisi 20%. Uang hasil keringat Anda masuk 100% utuh tanpa potongan aplikasi.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-6">
                <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Uang Langsung Cair</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Karena pembeli transfer langsung ke rekening Anda, uang cair detik itu juga. Putar kembali modal Anda untuk belanja besok pagi.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Bye-bye Rekap Manual</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Sistem menghitung totalan belanja dengan presisi, lalu mengubahnya menjadi format pesan WA yang sangat rapi. Anti salah hitung!
              </p>
            </div>

            {/* Value 4 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Kuasai Kontak Pelanggan</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Setiap transaksi otomatis masuk ke WA Anda. Simpan nomor mereka sebagai aset berharga untuk broadcast promo minggu depan.
              </p>
            </div>

            {/* Value 5 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Tanpa Download Aplikasi</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Hambatan pembeli adalah malas install aplikasi baru. Di sini, pembeli cukup klik link di bio IG Anda, belanja, dan langsung terhubung ke WA.
              </p>
            </div>

            {/* Value 6 */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Setup Super Ngebut</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Tidak punya foto produk? Gunakan ikon Emoji (🍕🍜) agar toko Anda tampil estetik dalam hitungan menit. Sangat ringan dikelola.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (Streamlined) */}
      <section id="cara-kerja" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-16">3 Langkah Mudah Jualan Laris</h2>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-start bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">1</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Daftar & Atur Toko Anda</h3>
                <p className="text-slate-600 dark:text-slate-400 text-base">Buat akun, masukkan nama toko kebanggaan Anda, dan tentukan nomor WhatsApp admin kasir yang aktif.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">2</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Masukkan Menu Unggulan</h3>
                <p className="text-slate-600 dark:text-slate-400 text-base">Ketikkan daftar harga Anda. Tanpa perlu ribet foto studio, Anda bisa menggunakan visual Emoji yang kekinian.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">3</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sebar Link & Tunggu WA Berbunyi</h3>
                <p className="text-slate-600 dark:text-slate-400 text-base">Taruh link toko Anda (misal: orderin.store/ayam-geprek) di bio Instagram, TikTok, atau grup perumahan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION BARU: SISTEM KOIN --- */}
      <section className="py-24 bg-blue-50/50 dark:bg-slate-950 border-y border-blue-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Bayar Hanya Jika Toko Anda Laris</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Tidak ada biaya bulanan yang mencekik. Kami menggunakan Sistem Koin yang 100% adil. Jika toko sedang sepi, Anda tidak perlu bayar apapun!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
                <Sparkles className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Daftar Dapat Modal</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Pengguna baru otomatis mendapatkan <strong className="text-slate-900 dark:text-slate-200">50 Koin Gratis</strong>. Silakan coba aplikasi kami sampai Anda benar-benar mendapatkan pesanan.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
                <Coins className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. Dipotong Hanya Saat Pembeli 'Klik' WA</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Sistem akan memotong 1 koin (-Rp 500) **tepat saat** pembeli menekan tombol 'Pesan via WhatsApp'. Tidak ada pesanan? Koin utuh selamanya.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Sistem Anti-Spam Pembeli Iseng</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Takut koin habis diklik orang iseng? Tenang, sistem kami mendeteksi IP/HP pembeli. Pesanan beruntun dari orang yang sama tidak akan memotong koin Anda berkali-kali!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA BOTTOM SECTION */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-blue-950 rounded-[3rem] p-12 text-center shadow-2xl overflow-hidden relative border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Kendalikan Penuh Bisnis Anda.</h2>
            <p className="text-blue-100/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Bergabunglah bersama puluhan UMKM cerdas lainnya. Berhenti membayar komisi aplikasi yang mencekik dan nikmati uang Anda 100% utuh hari ini.
            </p>
            <a href="/register" className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-5 rounded-2xl text-lg font-bold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)]">
              Klaim 50 Koin Pertamamu! <ArrowRight className="w-5 h-5" />
            </a>
            <p className="text-slate-400 text-sm mt-6">Sistem teradil untuk kemajuan UMKM Indonesia.</p>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 text-center transition-colors">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Store className="w-5 h-5 text-slate-400" />
          <span className="font-bold text-lg text-slate-700 dark:text-slate-300">Orderin</span>
        </div>
        <p className="text-slate-500 dark:text-slate-500 font-medium text-sm">
          Dibangun dengan ❤️ untuk UMKM Indonesia oleh Fizard Studio. © 2026.
        </p>
      </footer>

    </div>
  );
}