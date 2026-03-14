"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Coins, Receipt, ArrowUpRight, ArrowDownLeft, Wallet, AlertCircle } from "lucide-react";

interface CoinTransaction {
  id: string;
  amount: number;
  description: string;
  created_at: string;
}

export default function CoinsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [currentCoins, setCurrentCoins] = useState<number>(0);
  const [storeName, setStoreName] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<"coba" | "laris" | null>(null);

  const packages = {
    coba: { name: "Paket Coba-Coba", coins: 50, price: 25000 },
    laris: { name: "Paket Laris Manis", coins: 100, price: 50000 },
  };

  useEffect(() => {
    fetchCoinData();
  }, []);

  const fetchCoinData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Fetch current coins and store name
      const { data: storeData } = await supabase
        .from("stores")
        .select("coins, store_name")
        .eq("merchant_id", userId)
        .single();
        
      if (storeData) {
        setCurrentCoins(storeData.coins);
        setStoreName(storeData.store_name);
      }

      // Fetch transaction history
      const { data: txData, error: txError } = await supabase
        .from("coin_transactions")
        .select("*")
        .eq("merchant_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!txError && txData) {
        setTransactions(txData);
      }
    } catch (error) {
      console.error("Error fetching coin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUpWhatsApp = () => {
    if (!selectedPackage) {
      alert("Silakan pilih paket koin terlebih dahulu!");
      return;
    }
    
    const pkg = packages[selectedPackage];
    const message = encodeURIComponent(`Halo Admin Orderin, \n\nSaya ingin Top-Up *${pkg.name} (${pkg.coins} Koin)* seharga *Rp ${pkg.price.toLocaleString("id-ID")}*.\nSaya sudah melakukan transfer. Berikut saya lampirkan bukti transfernya.\n\nNama Toko: *${storeName || "Toko Saya"}*`);
    window.open(`https://wa.me/6285777551485?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Koin & Tagihan</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola saldo koin pendaftaran pesanan toko Anda.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Wallet Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-5 -mb-5"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between opacity-90 mb-4">
              <span className="font-medium text-amber-50">Sisa Koin Anda</span>
              <Wallet className="w-6 h-6" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black tracking-tight">{currentCoins}</span>
              <span className="font-medium text-amber-100">Koin</span>
            </div>
            
            {currentCoins <= 5 && (
              <div className="mt-4 bg-red-500/80 backdrop-blur-sm px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-400/50 text-white">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Koin hampir habis! Toko Anda tidak bisa menerima pesanan jika saldo 0.</span>
              </div>
            )}
            
            <button 
              onClick={handleTopUpWhatsApp}
              className="mt-6 w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-3 rounded-xl transition-colors shadow-sm active:scale-95"
            >
              Top Up Koin Sekarang
            </button>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            Informasi Harga Top-Up
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            Orderin menggunakan sistem adil (Pay-as-you-go). Koin Anda HANYA dipotong 1x (-Rp 500) saat pembeli mengirimkan format pesanan checkout ke WhatsApp Anda. Bebas biaya langganan bulanan!
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Paket Coba-Coba */}
            <button 
              onClick={() => setSelectedPackage("coba")}
              className={`text-left p-4 rounded-2xl flex items-center justify-between transition-all border-2 ${
                selectedPackage === "coba" 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md ring-4 ring-blue-500/10" 
                  : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-200 dark:hover:border-blue-800"
              }`}
            >
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Paket Coba-Coba</div>
                <div className="text-xs text-slate-500 mt-0.5">Dapat 50 Koin</div>
              </div>
              <div className="font-bold text-blue-600 dark:text-blue-400">Rp 25.000</div>
            </button>
            
            {/* Paket Laris Manis */}
            <button 
              onClick={() => setSelectedPackage("laris")}
              className={`text-left p-4 rounded-2xl flex items-center justify-between relative overflow-hidden transition-all border-2 ${
                selectedPackage === "laris"
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md ring-4 ring-amber-500/10"
                  : "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10 hover:border-amber-300 dark:hover:border-amber-700/50"
              }`}
            >
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">TERLARIS</div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Paket Laris Manis</div>
                <div className="text-xs text-slate-500 mt-0.5">Dapat 100 Koin</div>
              </div>
              <div className="font-bold text-amber-600 dark:text-amber-500">Rp 50.000</div>
            </button>
          </div>

          {/* Instruksi Transfer Bank */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800/50">
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-2">Cara Top-Up Koin:</h3>
            <ol className="text-xs text-blue-800 dark:text-blue-300 space-y-2 mb-4 list-decimal pl-4">
              <li>Pilih paket koin yang ingin dibeli.</li>
              <li>Transfer dana sesuai harga paket ke rekening berikut:</li>
            </ol>
            
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Bank BCA</div>
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-white tracking-widest mt-0.5">1234 567 890</div>
                <div className="text-xs text-slate-500">a.n. Firman Orderin</div>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText("1234567890")}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                Salin Rekening
              </button>
            </div>

            <p className="text-xs text-blue-800 dark:text-blue-300">
              3. Setelah transfer, klik tombol <strong>"Top Up Koin Sekarang"</strong> di atas untuk mengirim bukti transfer via WhatsApp ke Admin. Sebutkan nama toko Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-400" />
            Riwayat Pemakaian Koin
          </h2>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            Belum ada riwayat transaksi koin.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.amount > 0 
                      ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400" 
                      : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                  }`}>
                    {tx.amount > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-slate-900 dark:text-white">{tx.description}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {new Date(tx.created_at).toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${
                  tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-white"
                }`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
