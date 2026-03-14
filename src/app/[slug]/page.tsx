"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Store as StoreIcon, PackageOpen } from "lucide-react";
import Link from "next/link";
import { useCartStore, CartState, CartItem } from "../../lib/store";
import FloatingCheckout from "../../components/FloatingCheckout";

interface Store {
  id: string;
  store_name: string;
  description: string | null;
  address: string | null;
  whatsapp_number: string;
  allow_pickup: boolean;
  allow_delivery: boolean;
  allow_app_delivery: boolean;
  delivery_info: string | null;
  coins: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description?: string;
}

export default function StorePublicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cart state access
  const addToCart = useCartStore((state: CartState) => state.addItem);
  const removeFromCart = useCartStore((state: CartState) => state.removeItem);
  const updateItemNote = useCartStore((state: CartState) => state.updateItemNote);
  const items = useCartStore((state: CartState) => state.items);

  useEffect(() => {
    if (slug) fetchStoreData();
  }, [slug]);

  const fetchStoreData = async () => {
    try {
      // Fetch store
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("id, store_name, description, address, whatsapp_number, allow_pickup, allow_delivery, allow_app_delivery, delivery_info, coins")
        .eq("slug", slug)
        .single();

      if (storeError) {
        if (storeError.code === "PGRST116") {
          throw new Error("Toko tidak ditemukan.");
        }
        throw storeError;
      }

      setStore(storeData);

      // Lock down the store if out of coins
      if (storeData.coins <= 0) {
        throw new Error("Toko ini sedang tidak menerima pesanan saat ini.");
      }

      // Fetch active products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id, name, price, emoji, description")
        .eq("store_id", storeData.id)
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat toko.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-400 h-10 w-10" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors text-center">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400 dark:text-slate-500">
          <StoreIcon className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Oops!</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
          {error || "Toko yang Anda cari tidak dapat ditemukan."}
        </p>
        <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-blue-500/20">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-32">
      {/* Header / Store Info */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm transition-colors">
        <div className="max-w-2xl mx-auto px-4 py-5 md:py-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-600/20 dark:to-blue-500/10 text-blue-700 dark:text-blue-400 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-sm">
              {store.store_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {store.store_name}
              </h1>
              {store.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {store.description}
                </p>
              )}
              {store.address && (
                <div className="flex items-start mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-2">{store.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="max-w-2xl mx-auto px-4 py-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 px-1">Menu Kami</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <PackageOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">Belum ada produk yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => {
              const cartItem = items.find((item: CartItem) => item.product.id === product.id);
              const quantity = cartItem?.quantity || 0;

              return (
                <div key={product.id} className="flex flex-col gap-2">
                  <div className="glass-card bg-white/70 dark:bg-slate-900/70 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-all hover:shadow-md dark:hover:border-slate-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 transition-colors">
                      {product.emoji}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-snug">
                          {product.description}
                        </p>
                      )}
                      <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      {quantity === 0 ? (
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors font-bold text-xl"
                        >
                          +
                        </button>
                      ) : (
                        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                          <button 
                            onClick={() => removeFromCart(product.id, cartItem?.note)}
                            className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-sm hover:text-red-600 dark:hover:text-red-400 transition-colors font-bold"
                          >
                            -
                          </button>
                          <span className="font-semibold text-sm w-4 text-center text-slate-900 dark:text-white">
                            {quantity}
                          </span>
                          <button 
                            onClick={() => addToCart(product, cartItem?.note)}
                            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm hover:bg-blue-700 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Note Section (Only show if item is in cart) */}
                  {quantity > 0 && (
                    <div className="pl-24 pr-4 pb-2 animate-in fade-in slide-in-from-top-2">
                      <input
                        type="text"
                        placeholder="Catatan restoran (opsional)..."
                        className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                        value={cartItem?.note || ""}
                        onChange={(e) => {
                          updateItemNote(product.id, e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Floating Checkout */}
      <FloatingCheckout 
        storeId={store.id}
        storeName={store.store_name} 
        whatsappNumber={store.whatsapp_number} 
        allowPickup={store.allow_pickup}
        allowDelivery={store.allow_delivery}
        allowAppDelivery={store.allow_app_delivery}
        deliveryInfo={store.delivery_info}
      />
    </div>
  );
}
