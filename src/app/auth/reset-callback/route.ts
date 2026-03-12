import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * Route Handler khusus untuk Reset Password.
 * Tidak memakai parameter query "?next=..." untuk mencegah error kehilangan parameter 
 * saat Supabase memproses token email.
 */

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    
    // Tujuan hardcode langsung ke halaman ganti sandi
    const next = '/update-password'

    if (code) {
        const supabase = await createClient()

        // Tukarkan 'code' menjadi sesi aktif
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Jika berhasil, lempar user ke halaman update-password
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Jika gagal, kembalikan ke halaman login dengan pesan error
    return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
