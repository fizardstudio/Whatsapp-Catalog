import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// === PENGATURAN SUPER ADMIN ===
const ADMIN_EMAIL = "fizard.studio@gmail.com";

export async function POST(request: Request) {
  try {
    // 1. Verifikasi Sesi & Email menggunakan cookie server (Mengecek Siapa yang Login)
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden: Admin access only" }, { status: 403 });
    }

    // 2. Parse Request Body
    const body = await request.json();
    const { action, storeId, merchantId, data } = body;

    if (!storeId || !merchantId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // === BYPASS RLS (Admin Client) ===
    // Karena kita tidak mematikan RLS di Supabase, permintaan tulis/ubah tetap butuh wewenang super.
    // Kita membuat client khusus "Service Role" yang kebal hukum RLS.
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 3. Eksekusi Aksi berdasarkan tipe meggunakan adminSupabase
    switch (action) {
      case "ADD_COINS":
        const amountToAdd = Number(data.amount);
        if (!amountToAdd || amountToAdd <= 0) {
          return NextResponse.json({ error: "Invalid coin amount" }, { status: 400 });
        }

        // Ambil koin sekarang (Bebas RLS)
        const { data: storeCurrent, error: fetchError } = await adminSupabase
          .from("stores")
          .select("coins")
          .eq("id", storeId)
          .single();

        if (fetchError || !storeCurrent) {
          throw new Error("Store not found");
        }

        // Tambah koin (Bebas RLS)
        const { error: updateCoinError } = await adminSupabase
          .from("stores")
          .update({ coins: storeCurrent.coins + amountToAdd })
          .eq("id", storeId);

        if (updateCoinError) throw updateCoinError;

        // Catat di Coin Transactions (Bebas RLS)
        const { error: txError } = await adminSupabase
          .from("coin_transactions")
          .insert({
            merchant_id: merchantId, 
            amount: amountToAdd,
            description: `Top-Up (+${amountToAdd} Koin) oleh Sistem Admin`
          });

        if (txError) throw txError;
        break;

      case "TOGGLE_BAN":
        const { is_banned } = data;
        
        // Update menggunakan adminSupabase (Bebas RLS)
        const { error: banError } = await adminSupabase
          .from("stores")
          .update({ is_banned: is_banned })
          .eq("id", storeId);
          
        if (banError) throw banError;
        break;

      default:
        return NextResponse.json({ error: "Action not recognized" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Action executed successfully" });

  } catch (error: any) {
    console.error("Admin Action API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
