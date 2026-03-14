import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Syarat & Ketentuan</h1>
          </div>
          
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
            Pembaruan Terakhir: 15 Maret 2026
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              <FileText className="w-5 h-5 text-slate-400" />
              1. Syarat Penggunaan Platform
            </h2>
            <p className="mb-4">
              Selamat datang di Orderin. Dengan mendaftar dan menggunakan layanan pembuatan katalog WhatsApp kami, Anda secara otomatis menyetujui seluruh syarat dan ketentuan yang tertulis di halaman ini. Orderin adalah platform *Software as a Service* (SaaS) yang menyediakan alat bagi UMKM untuk mempermudah calon pembeli mengirim spesifikasi pesanan melalui platform pihak ketiga (WhatsApp).
            </p>

            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              2. Batasan Tanggung Jawab (Disclaimer of Liability)
            </h2>
            <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6 text-amber-900 dark:text-amber-200 text-sm leading-relaxed">
              Orderin <strong>HANYA</strong> bertindak sebagai fasilitator (pembuat brosur/katalog digital). Kami <strong>TIDAK</strong> memproses pembayaran, mengelola stok, atau melakukan pengiriman barang. Oleh karena itu, Orderin terlepas dari segala bentuk tanggung jawab hukum apabila terjadi:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Sengketa atau perselisihan antara Toko (Penjual) dan Pelanggan (Pembeli).</li>
                <li>Tindak penipuan (Barang tidak dikirim, barang tidak sesuai, pemalsuan).</li>
                <li>Kerugian material atau finansial yang timbul akibat transaksi yang berawal dari platform kami.</li>
              </ul>
              Segala bentuk penyelesaian masalah adalah tanggung jawab mutlak antara Penjual dan Pembeli.
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              3. Sistem Koin (Pay-as-you-go) dan Pengembalian Dana
            </h2>
            <p className="mb-4">
              Orderin menggunakan sistem Koin untuk operasional toko. Satu (1) klik pemesanan yang sukses dimuat ke WhatsApp akan memotong satu (1) Koin dari Saldo Toko Anda. 
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>UMKM yang saldo koinnya habis (0) tidak akan dapat menerima pesanan baru melalui platform hingga melakukan pengisian ulang (Top-Up).</li>
              <li>Orderin menerapkan sistem filter perangkat (Anti-Spam) dalam jangka waktu tertentu untuk mencegah pemotongan koin yang berlebihan dari pembeli iseng, namun Orderin tidak menjamin 100% pesanan yang masuk ke WhatsApp akan selalu berujung pada transaksi riil.</li>
              <li><strong>Kebijakan Refund:</strong> Seluruh pembelian/top-up Koin yang telah berhasil diproses ke dalam akun Toko bersifat <strong>Final dan Tidak Dapat Dikembalikan (Non-refundable)</strong> dengan alasan apa pun, termasuk jika toko Anda ditutup atau diblokir akibat pelanggaran aturan keamanan.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              4. Aturan Konten dan Produk Terlarang
            </h2>
            <p className="mb-4">
              Sebagai Penjual, Anda dilarang keras untuk membuat katalog, memasarkan, atau memperjualbelikan produk/layanan yang melanggar hukum di Negara Kesatuan Republik Indonesia, termasuk namun tidak terbatas pada:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Narkotika, obat-obatan terlarang, dan zat adiktif tanpa izin resmi.</li>
              <li>Senjata api, senjata tajam ilegal, dan bahan peledak.</li>
              <li>Produk yang menampilkan konten pornografi atau asusila.</li>
              <li>Barang hasil tindak pencurian pangan atau kekayaan intelektual (pembajakan).</li>
            </ul>
            <p className="mb-4 font-semibold text-red-600 dark:text-red-400">
              Admin Orderin berhak penuh untuk melakukan pemblokiran secara sepihak dan penghapusan akun beserta seluruh saldonya secara permanen apabila ditemukan pelanggaran terhadap klausal ini.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              5. Privasi dan Keamanan Data
            </h2>
            <p className="mb-4">
              Orderin berkomitmen menjaga kerahasiaan nomor WhatsApp dan email pribadi yang Anda gunakan saat mendaftar. Kami berjanji tidak akan memperjualbelikan data Anda kepada pihak ketiga (Pengepul Data / Pengiklan Spam). Adapun segala jenis gambar produk dan deskripsi toko yang diunggah ke Orderin adalah milik ruang publik (dapat dilihat oleh siapa saja) dan sepenuhnya merupakan tanggung jawab Penjual.
            </p>
            
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Terima kasih telah membaca dan menyetujui pedoman ini. Semoga sukses selalu dengan bisnis Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
