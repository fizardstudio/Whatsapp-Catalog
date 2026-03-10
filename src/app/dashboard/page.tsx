"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, PackageOpen, Settings, ExternalLink, Copy, CheckCircle2, TrendingUp, Store, Plus } from "lucide-react";
import Link from "next/link";

interface StoreData {
  id: string;
  store_name: string;
  slug: string;
}

export default function DashboardIndex() {
  const [store, setStore] = useState<StoreData | null>(null);
  const [productCount, setProductCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch store
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("id, store_name, slug")
        .eq("merchant_id", user.id)
        .single();

      if (storeError && storeError.code !== "PGRST116") {
        throw storeError;
      }

      if (storeData) {
        setStore(storeData);
        
        // Fetch product count
        const { count, error: countError } = await supabase
          .from("products")
          .select("*", { count: 'exact', head: true })
          .eq("store_id", storeData.id);
          
        if (countError) throw countError;
        if (count !== null) setProductCount(count);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!store) return;
    const url = `${window.location.origin}/${store.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Beranda
        </h1>
        <p className="text-slate-500 mt-1">
          Selamat datang kembali di panel manajemen {store?.store_name || "toko Anda"}.
        </p>
      </div>

      {!store ? (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          <Store className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Langkah Pertama: Atur Toko Anda</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Katalog Anda belum aktif. Masukkan nama toko dan nomor WhatsApp untuk mulai menerima pesanan.
          </p>
          <Link 
            href="/dashboard/settings" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm"
          >
            Buka Pengaturan Toko
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-start space-x-4">
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Status Toko</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Aktif</h3>
                <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Siap menerima pesanan
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-start space-x-4">
              <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <PackageOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Menu / Produk</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{productCount} Item</h3>
                <Link href="/dashboard/products" className="text-sm text-blue-600 font-medium mt-1 inline-flex items-center hover:underline">
                  Kelola Katalog &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Share Link Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2">Sebarkan Katalog Anda</h2>
              <p className="text-slate-300 mb-6 max-w-xl text-sm leading-relaxed">
                Bagikan link ini ke bio Instagram/TikTok atau kirimkan langsung ke chat pelanggan agar mereka bisa melihat menu Anda.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3">
                  <span className="text-sm font-mono text-slate-300 truncate select-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/${store.slug}` : `/${store.slug}`}
                  </span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="bg-white text-slate-900 hover:bg-slate-50 font-medium py-3 px-5 rounded-xl transition-colors flex items-center justify-center whitespace-nowrap"
                >
                  {copied ? (
                    <><CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Tersalin</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Salin Link</>
                  )}
                </button>
                <Link
                  href={`/${store.slug}`}
                  target="_blank"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-5 rounded-xl transition-colors flex items-center justify-center whitespace-nowrap shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Kunjungi
                </Link>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute left-1/4 bottom-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -mb-12 pointer-events-none"></div>
          </div>

          {/* Shortcut Actions */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 px-1">Pintasan Cepat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/products" className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-blue-50 group-hover:bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Tambah Menu Baru</h3>
                </div>
                <p className="text-sm text-slate-500 ml-13 pl-1">Akses cepat membuat produk ke katalog.</p>
              </Link>
              
              <Link href="/dashboard/settings" className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:border-slate-300 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-slate-50 group-hover:bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
                    <Settings className="w-5 h-5 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Ubah Nomor / Ongkir</h3>
                </div>
                <p className="text-sm text-slate-500 ml-13 pl-1">Perbarui detail toko, no WA, & opsi delivery.</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
