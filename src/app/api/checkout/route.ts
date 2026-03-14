import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Must use service role to bypass RLS for deduction

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { storeId, storeName } = await request.json();

    if (!storeId) {
      return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
    }

    // --- 1. RATE LIMITING (Basic Anti-Spam based on Cookies) ---
    const cookieStore = await cookies();
    const limiterKey = `checkout_limit_${storeId}`;
    const lastCheckout = cookieStore.get(limiterKey)?.value;
    
    // Allow 1 checkout per 5 minutes per store from the same browser
    if (lastCheckout) {
      const timePassed = Date.now() - parseInt(lastCheckout);
      if (timePassed < 5 * 60 * 1000) {
        return NextResponse.json({ 
          error: "Tunggu sebentar sebelum mengirim pesanan baru ke toko ini." 
        }, { status: 429 });
      }
    }

    // --- 2. VERIFY COINS ---
    const { data: store, error: fetchError } = await supabase
      .from("stores")
      .select("merchant_id, coins")
      .eq("id", storeId)
      .single();

    if (fetchError || !store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (store.coins <= 0) {
      return NextResponse.json({ 
        error: "Mohon maaf, toko sedang tidak dapat menerima pesanan saat ini." 
      }, { status: 403 });
    }

    // --- 3. DEDUCT COIN & LOG TRANSACTION ---
    // Decrease by 1
    const { error: updateError } = await supabase
      .from("merchants")
      .update({ coins: store.coins - 1 })
      .eq("id", store.merchant_id);

    if (updateError) {
      throw updateError;
    }

    // Log to transactions
    await supabase.from("coin_transactions").insert({
      merchant_id: store.merchant_id,
      amount: -1,
      description: `Pesanan diterima dari katalog (${storeName})`,
    });

    // --- 4. SET RATE LIMIT COOKIE ---
    // NextJS 15 cookies.set is synchronous now, but we await the whole cookieStore if it's async in this ver
    cookieStore.set(limiterKey, Date.now().toString(), { 
      maxAge: 5 * 60, // 5 minutes
      httpOnly: true,
      path: '/'
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Checkout Deduction Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses pesanan." },
      { status: 500 }
    );
  }
}
