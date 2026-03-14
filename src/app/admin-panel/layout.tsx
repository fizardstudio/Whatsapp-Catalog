"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

// === PENGATURAN SUPER ADMIN ===
// Ganti email ini jika ingin memindahkan hak kepemilikan panel Admin.
const ADMIN_EMAIL = "fizard.studio@gmail.com";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // 1. Cek apakah user sudah login
      if (!session) {
        router.replace("/login");
        return;
      }

      // 2. Cek apakah email user yang login cocok dengan ADMIN_EMAIL
      if (session.user.email !== ADMIN_EMAIL) {
        // Jika bukan admin, tendang ke halaman beranda!
        console.warn("Akses Ditolak: User mencoba memasuki Admin Panel.");
        router.replace("/");
        return;
      }

      // 3. User lolos verifikasi, berikan akses
      setIsAuthorized(true);
      setLoading(false);
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-white h-8 w-8" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Mencegah kedipan UI sebelum direkomendasikan redirect
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span className="font-bold text-lg tracking-tight">Super Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700 hidden sm:block">
              {ADMIN_EMAIL}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
