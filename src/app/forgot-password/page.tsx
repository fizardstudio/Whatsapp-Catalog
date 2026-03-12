"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Store, ArrowLeft } from "lucide-react";

// --- KONTEKS UNTUK BANG FIRMAN (FIZARD STUDIO) ---
// Perbaikan: Mengarahkan redirectTo ke /auth/callback agar sesi reset password
// tertangkap dengan benar oleh server (Next.js App Router).
// Link di email nantinya akan mampir ke callback dulu baru ke update-password.

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Ambil origin secara dinamis (localhost atau orderin.store)
            const origin = typeof window !== 'undefined' ? window.location.origin : '';

            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                // PERBAIKAN: Redirect ke rute khusus reset password tanpa parameter query
                redirectTo: `${origin}/auth/reset-callback`,
            });

            if (error) {
                throw error;
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Gagal mengirim email reset. Pastikan email terdaftar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors relative overflow-hidden">
            {/* Decorative gradient blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 relative z-10 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 transition-all">

                {/* Tombol Kembali */}
                <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 group">
                    <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Login
                </Link>

                {/* --- LOGO ORDERIN BY FIZARD --- */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                        <Store className="w-10 h-10 text-blue-600 dark:text-blue-500" />
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Order<span className="text-blue-600 dark:text-blue-500">in</span>
                        </h1>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 dark:text-slate-500 ml-1 mb-4">
                        by fizard
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Lupa Kata Sandi?</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-500/20 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center p-6 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-100 dark:border-green-500/20 animate-in zoom-in-95">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">Email Terkirim!</h3>
                        <p className="text-sm text-green-700 dark:text-green-500">
                            Silakan periksa kotak masuk (atau folder spam) email <strong>{email}</strong> untuk mengatur ulang sandi Anda.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Alamat Email
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Mengirim...
                                </>
                            ) : (
                                "Kirim Tautan Reset"
                            )}
                        </button>
                    </form>
                )}
            </div>

            <div className="absolute bottom-6 w-full text-center pointer-events-none">
                <p className="text-slate-400 dark:text-slate-600 text-[10px] font-medium uppercase tracking-[0.2em]">
                    Secured by Fizard Studio Infrastructure
                </p>
            </div>
        </div>
    );
}