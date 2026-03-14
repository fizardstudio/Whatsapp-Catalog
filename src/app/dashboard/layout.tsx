"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Store, PackageSearch, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
      } else {
        // Fetch coin balance
        const { data: storeData } = await supabase
          .from("stores")
          .select("coins")
          .eq("merchant_id", session.user.id)
          .single();
          
        if (storeData) {
          setCoins(storeData.coins);
        }
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
      </div>
    );
  }

  const navItems = [
    { name: "Beranda Dashboard", href: "/dashboard", icon: Store },
    { name: "Katalog Produk", href: "/dashboard/products", icon: PackageSearch },
    { name: "Pengaturan Toko", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col transition-colors">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Orderin</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Merchant Panel</p>
          </div>
          <ThemeToggle />
        </div>
        
        {/* Coin Balance Widget */}
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl p-4 shadow-[inset_0_1px_rgba(255,255,255,0.4)] dark:shadow-none">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-amber-900 dark:text-amber-500">Saldo Koin Anda</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">Orderin</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight leading-none">{coins}</span>
              <span className="text-sm font-medium text-amber-700/70 dark:text-amber-500/70 mb-0.5">koin</span>
            </div>
            {coins <= 5 && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-2 animate-pulse">
                Hati-hati, koin hampir habis!
              </p>
            )}
            <Link 
              href="/dashboard/coins"
              className="mt-3 w-full block text-center py-2 px-3 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white dark:text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Top Up & Riwayat Koin
            </Link>
          </div>
        </div>
        
        <nav className="px-4 pb-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Help Button */}
          <button
            onClick={() => {
              const msg = encodeURIComponent("Halo Admin Orderin, saya butuh Bantuan / ingin lapor masalah terkait toko saya:");
              window.open(`https://wa.me/6285777551485?text=${msg}`, "_blank");
            }}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
          >
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Bantuan & Laporan</span>
          </button>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-red-700 dark:group-hover:text-red-400" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
