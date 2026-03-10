"use client";

import { useCartStore, CartState } from "../lib/store";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface FloatingCheckoutProps {
  storeName: string;
  whatsappNumber: string;
  allowPickup: boolean;
  allowDelivery: boolean;
  allowAppDelivery: boolean;
  deliveryInfo: string | null;
}

export default function FloatingCheckout({ 
  storeName, 
  whatsappNumber, 
  allowPickup, 
  allowDelivery,
  allowAppDelivery,
  deliveryInfo 
}: FloatingCheckoutProps) {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Custom form state
  const [customerName, setCustomerName] = useState("");
  // Default to delivery if allowed, else pickup
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery" | "app_delivery">(
    allowDelivery && !allowPickup ? "delivery" : 
    allowAppDelivery && !allowPickup && !allowDelivery ? "app_delivery" : "pickup"
  );
  const [address, setAddress] = useState("");

  const items = useCartStore((state: CartState) => state.items);
  const getTotalItems = useCartStore((state: CartState) => state.getTotalItems);
  const getTotalPrice = useCartStore((state: CartState) => state.getTotalPrice);
  const clearCart = useCartStore((state: CartState) => state.clearCart);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    const header = `Halo *${storeName}*, saya ingin memesan:\n\n`;
    
    const itemsList = items.map((item, index) => {
      const subtotal = item.quantity * item.product.price;
      const noteText = item.note ? `\n   Catatan: ${item.note}` : '';
      return `${index + 1}. ${item.product.emoji} ${item.product.name}${noteText}\n   ${item.quantity} x Rp ${item.product.price.toLocaleString("id-ID")} = Rp ${subtotal.toLocaleString("id-ID")}`;
    }).join("\n\n");
    
    let methodName = "";
    if (deliveryMethod === "pickup") methodName = "Ambil Sendiri (Pickup)";
    else if (deliveryMethod === "delivery") methodName = "Pesan Antar (Internal)";
    else methodName = "Ojek Online (Gojek/Grab)";

    let customerInfo = `\n\n*Nama Pemesan:* ${customerName}\n*Metode:* ${methodName}`;
    
    if (deliveryMethod === "delivery" || deliveryMethod === "app_delivery") {
      customerInfo += `\n*Alamat:* ${address}`;
    }

    const ongkirText = deliveryMethod === "pickup" ? "_(Tanpa ongkir)_" : "_(Belum termasuk ongkir)_";
    const footer = `\n\n*Subtotal Produk: Rp ${totalPrice.toLocaleString("id-ID")}*\n${ongkirText}\n\nTerima kasih!`;

    const message = encodeURIComponent(header + itemsList + customerInfo + footer);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Clear cart upon successful forward to WA
    setShowModal(false);
    clearCart();
    window.open(waUrl, "_blank");
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-2xl p-4 flex items-center justify-between transition-transform active:scale-[0.98]"
        >
          <div className="flex flex-col items-start">
            <span className="text-green-100 text-sm font-medium">
              {totalItems} item di keranjang
            </span>
            <span className="font-bold text-lg">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-green-700/50 py-2 px-4 rounded-xl font-medium">
            <span>Lanjut Checkout</span>
            <MessageCircle className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>

    {/* Customer Details Modal */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="glass-card rounded-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Detail Pemesan
            </h3>
            <button 
              onClick={() => setShowModal(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleCheckout} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nama Anda <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                placeholder="Contoh: Budi"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            {(allowPickup || allowDelivery || allowAppDelivery) && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Metode Pengiriman <span className="text-red-500">*</span>
                </label>
                <div className={`grid gap-3 ${
                  [allowPickup, allowDelivery, allowAppDelivery].filter(Boolean).length === 3 
                    ? "grid-cols-1 sm:grid-cols-3" 
                    : "grid-cols-2"
                }`}>
                  {allowPickup && (
                    <label className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${
                      deliveryMethod === "pickup" 
                        ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" 
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}>
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        value="pickup"
                        checked={deliveryMethod === "pickup"}
                        onChange={() => setDeliveryMethod("pickup")}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm text-slate-900 dark:text-slate-200 block">Pickup</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">Ambil Sendiri</span>
                    </label>
                  )}
                  {allowDelivery && (
                    <label className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${
                      deliveryMethod === "delivery" 
                        ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" 
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}>
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        value="delivery"
                        checked={deliveryMethod === "delivery"}
                        onChange={() => setDeliveryMethod("delivery")}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm text-slate-900 dark:text-slate-200 block">Delivery</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">Pesan Antar</span>
                    </label>
                  )}
                  {allowAppDelivery && (
                    <label className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${
                      deliveryMethod === "app_delivery" 
                        ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" 
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}>
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        value="app_delivery"
                        checked={deliveryMethod === "app_delivery"}
                        onChange={() => setDeliveryMethod("app_delivery")}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm text-slate-900 dark:text-slate-200 block">Ojek Online</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">Gojek/Grab</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {(deliveryMethod === "delivery" || deliveryMethod === "app_delivery") && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                
                {deliveryInfo && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl">
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium whitespace-pre-line">
                      ℹ️ Info Ongkir: {deliveryInfo}
                    </p>
                  </div>
                )}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                  placeholder="Detail jalan, patokan, rt/rw..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center shadow-md active:scale-[0.98]"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Kirim via WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}
