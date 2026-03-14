import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// === PENGATURAN SUPER ADMIN ===
const ADMIN_EMAIL = "fizard.studio@gmail.com";

export async function POST(request: Request) {
  try {
    // 1. Verifikasi Sesi & Email menggunakan cookie server
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

    // 3. Eksekusi Aksi berdasarkan tipe
    switch (action) {
      case "ADD_COINS":
        const amountToAdd = Number(data.amount);
        if (!amountToAdd || amountToAdd <= 0) {
          return NextResponse.json({ error: "Invalid coin amount" }, { status: 400 });
        }

        // Ambil koin sekarang
        const { data: storeCurrent, error: fetchError } = await supabase
          .from("stores")
          .select("coins")
          .eq("id", storeId)
          .single();

        if (fetchError || !storeCurrent) {
          throw new Error("Store not found");
        }

        // Tambah koin
        const { error: updateCoinError } = await supabase
          .from("stores")
          .update({ coins: storeCurrent.coins + amountToAdd })
          .eq("id", storeId);

        if (updateCoinError) throw updateCoinError;

        // Catat di Coin Transactions
        const { error: txError } = await supabase
          .from("coin_transactions")
          .insert({
            merchant_id: merchantId, // Penting diikat ke UMKM pemilik toko
            amount: amountToAdd,
            description: `Top-Up (+${amountToAdd} Koin) oleh Sistem Admin`
          });

        if (txError) throw txError;
        break;

      case "TOGGLE_BAN":
        const { is_banned } = data;
        
        const { error: banError } = await supabase
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
