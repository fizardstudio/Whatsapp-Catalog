"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Search, Store, Coins, Ban, CheckCircle, RefreshCw } from "lucide-react";

interface StoreData {
  id: string;
  merchant_id: string;
  store_name: string;
  whatsapp_number: string;
  slug: string;
  coins: number;
  is_banned: boolean;
  merchants: {
    email: string;
  };
}

export default function AdminDashboard() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [filteredStores, setFilteredStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stores")
        .select(`
          id, 
          merchant_id, 
          store_name, 
          whatsapp_number, 
          slug, 
          coins, 
          is_banned,
          merchants ( email )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        setStores(data as any);
        setFilteredStores(data as any);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      alert("Gagal mengambil data toko.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStores(stores);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = stores.filter(
      (store) => 
        store.store_name.toLowerCase().includes(query) || 
        store.merchants?.email?.toLowerCase().includes(query) ||
        store.slug.toLowerCase().includes(query)
    );
    setFilteredStores(filtered);
  }, [searchQuery, stores]);

  const handleAction = async (action: string, storeId: string, merchantId: string, data?: any) => {
    setActionLoading(storeId + action);
    try {
      // Dapatkan token akses dari sesi yang aktif (localStorage)
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch("/api/admin/action", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({ action, storeId, merchantId, data })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Aksi gagal dijalankan");
      }

      // Refresh UI manually for snappiness
      if (action === "ADD_COINS") {
        setStores(stores.map(s => s.id === storeId ? { ...s, coins: s.coins + data.amount } : s));
      } else if (action === "TOGGLE_BAN") {
        setStores(stores.map(s => s.id === storeId ? { ...s, is_banned: data.is_banned } : s));
      }

    } catch (error: any) {
      alert(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Toko</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stores.length}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Store className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Koin Beredar</p>
            <p className="text-3xl font-black text-amber-600 dark:text-amber-500">
              {stores.reduce((sum, store) => sum + store.coins, 0)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari nama toko, slug, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
        <button 
          onClick={fetchStores}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </button>
      </div>

      {/* STORE CARDS (MOBILE FRIENDLY) */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading && stores.length === 0 ? (
          <div className="col-span-full py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            Toko tidak ditemukan.
          </div>
        ) : (
          filteredStores.map((store) => (
            <div 
              key={store.id} 
              className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border shadow-sm transition-all overflow-hidden relative ${
                store.is_banned 
                  ? "border-red-300 dark:border-red-900/50 opacity-80" 
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {store.is_banned && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">BANNED</div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="truncate pr-4">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate" title={store.store_name}>
                    {store.store_name || "Tanpa Nama"}
                  </h3>
                  <p className="text-xs text-slate-500 truncate" title={store.merchants?.email}>
                    {store.merchants?.email}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-1 w-max bg-blue-50 dark:bg-blue-900/20 px-1.5 rounded">
                    /{store.slug}
                  </p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xl text-slate-900 dark:text-white">{store.coins}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Sisa Koin</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6">
                <button
                  disabled={!!actionLoading}
                  onClick={() => handleAction("ADD_COINS", store.id, store.merchant_id, { amount: 50 })}
                  className="bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                >
                  {actionLoading === (store.id + "ADD_COINS") ? <Loader2 className="w-3 h-3 animate-spin"/> : "+50"}Koin
                </button>
                <button
                  disabled={!!actionLoading}
                  onClick={() => handleAction("ADD_COINS", store.id, store.merchant_id, { amount: 100 })}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors shadow-sm disabled:opacity-50"
                >
                  {actionLoading === (store.id + "ADD_COINS") ? <Loader2 className="w-3 h-3 animate-spin"/> : "+100"}Koin
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={!!actionLoading}
                  onClick={() => handleAction("TOGGLE_BAN", store.id, store.merchant_id, { is_banned: !store.is_banned })}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
                    store.is_banned 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200" 
                      : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
                  }`}
                >
                  {store.is_banned ? (
                    <><CheckCircle className="w-4 h-4" /> Buka Blokir (Unban)</>
                  ) : (
                    <><Ban className="w-4 h-4" /> Banned Toko Ini</>
                  )}
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
