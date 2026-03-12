import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * KONTEKS UNTUK BANG FIRMAN (FIZARD STUDIO):
 * File ini adalah Route Handler (Server Side).
 * Berfungsi menukarkan 'auth code' dari email menjadi sesi aktif.
 */

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // Alamat tujuan setelah berhasil (default ke dashboard atau update-password)
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch (error) {
                            // Terjadi jika dipanggil dari Server Component, bisa diabaikan
                        }
                    },
                },
            }
        )

        // Tukarkan 'code' menjadi sesi aktif
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Jika berhasil, lempar user ke halaman tujuan (misal: /update-password)
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Jika gagal, kembalikan ke halaman login dengan pesan error
    return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}