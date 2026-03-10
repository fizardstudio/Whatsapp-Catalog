"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh(); // Refresh the router to update server-side auth state if any
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Silakan masukkan alamat email Anda terlebih dahulu untuk mengirim ulang konfirmasi.");
      return;
    }
    
    setResending(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;
      setSuccess("Tautan konfirmasi baru telah dikirim! Silakan periksa kotak masuk (atau folder spam) Anda.");
    } catch (err: any) {
      if (err.status === 429) {
          setError("Tunggu beberapa saat sebelum meminta tautan konfirmasi baru.");
      } else {
        setError(err.message || "Gagal mengirim ulang email konfirmasi.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-3xl font-bold text-white">F</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Masuk ke Fizard</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola katalog dan pesanan WhatsApp Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-500/20">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-xl text-sm border border-green-100 dark:border-green-500/20">
            {success}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="••••••••"
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
              "Masuk ke Dashboard"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
             <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resending || loading}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4"
              >
                {resending ? "Mengirim ulang..." : "Belum menerima email konfirmasi? Kirim ulang"}
              </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 text-center text-sm text-slate-500 dark:text-slate-400">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline">
            Daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
