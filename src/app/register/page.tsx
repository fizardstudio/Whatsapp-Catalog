"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
// --- KONTEKS UNTUK BANG FIRMAN ---
// Menambahkan import 'Store' dari lucide-react untuk logo Orderin
import { Loader2, Store } from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setSuccess(true);
        // Supabase might auto sign in depending on email confirmation settings
        // If auto sign in is enabled, redirect to dashboard in a few seconds
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors relative overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-green-500/20 dark:bg-green-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 text-center relative z-10 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Akun Anda berhasil dibuat. Mengarahkan ke dashboard...</p>
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-blue-600 dark:text-blue-400 h-6 w-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 relative z-10 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800">

        {/* --- KONTEKS UNTUK BANG FIRMAN --- */}
        {/* Bagian ini sudah diubah dari logo kotak 'F' menjadi logo Orderin by fizard */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-10 h-10 text-blue-600 dark:text-blue-500" />
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Order<span className="text-blue-600 dark:text-blue-500">in</span>
            </h1>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 dark:text-slate-500 ml-1 mb-4">
            by fizard
          </p>
          <p className="text-slate-500 dark:text-slate-400">Mulai buat katalog WhatsApp Anda sekarang</p>
        </div>
        {/* ----------------------------------------------- */}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="Budi Santoso"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Memproses...
              </>
            ) : (
              "Daftar Akun"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 text-center text-sm text-slate-500 dark:text-slate-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>

      {/* Footer Fizard Studio Infrastructure */}
      <div className="absolute bottom-6 w-full text-center pointer-events-none">
        <p className="text-slate-400 dark:text-slate-600 text-[10px] font-medium uppercase tracking-[0.2em]">
          Secured by Fizard Studio Infrastructure
        </p>
      </div>

    </div>
  );
}