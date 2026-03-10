"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [description, setDescription] = useState("");
  const [allowPickup, setAllowPickup] = useState(true);
  const [allowDelivery, setAllowDelivery] = useState(false);
  const [allowAppDelivery, setAllowAppDelivery] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("merchant_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setStoreId(data.id);
        setStoreName(data.store_name);
        setSlug(data.slug);
        setWhatsappNumber(data.whatsapp_number);
        setDescription(data.description || "");
        
        // Handle cases where existing stores might not have these columns yet before migration
        if (data.allow_pickup !== undefined) setAllowPickup(data.allow_pickup);
        if (data.allow_delivery !== undefined) setAllowDelivery(data.allow_delivery);
        if (data.allow_app_delivery !== undefined) setAllowAppDelivery(data.allow_app_delivery);
        if (data.delivery_info !== undefined) setDeliveryInfo(data.delivery_info || "");
        if (data.address !== undefined) setAddress(data.address || "");
      }
    } catch (error) {
      console.error("Error fetching store:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStoreName(val);
    if (!storeId && val) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const storeData = {
        merchant_id: user.id,
        store_name: storeName,
        slug: slug,
        whatsapp_number: whatsappNumber,
        description: description,
        allow_pickup: allowPickup,
        allow_delivery: allowDelivery,
        allow_app_delivery: allowAppDelivery,
        delivery_info: deliveryInfo,
        address: address,
      };

      if (storeId) {
        // Update existing store
        const { error } = await supabase
          .from("stores")
          .update(storeData)
          .eq("id", storeId);
        if (error) throw error;
      } else {
        // Insert new store
        const { data, error } = await supabase
          .from("stores")
          .insert([storeData])
          .select()
          .single();
        if (error) throw error;
        if (data) setStoreId(data.id);
      }

      setMessage({ type: "success", text: "Pengaturan toko berhasil disimpan!" });
    } catch (error: any) {
      console.error("Error saving store:", error);
      setMessage({ type: "error", text: error.message || "Gagal menyimpan pengaturan toko." });
    } finally {
      setSaving(false);
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Toko</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Atur informasi publik toko Anda yang akan dilihat pelanggan.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm border ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20' 
            : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nama Toko <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Contoh: Orderin Burger"
            value={storeName}
            onChange={handleNameChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            URL / Slug Unik <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 sm:text-sm">
              orderin.id/
            </span>
            <input
              type="text"
              required
              className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="orderin-burger"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Pelanggan akan mengunjungi toko Anda menggunakan URL ini. Pastikan unik.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nomor WhatsApp (Tujuan Pesanan) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Contoh: 628123456789"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, ""))}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Gunakan kode negara tanpa tanda plus (contoh: 62 untuk Indonesia). Ke nomor inilah pesanan akan dikirim.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Deskripsi Toko (Opsional)
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Jelaskan sedikit tentang toko Anda..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Alamat Toko (Opsional)
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Contoh: Jl. Sudirman No 123, Jakarta"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/50 pt-6">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">Metode Pengiriman yang Disediakan</h3>
          
          <div className="space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
                  checked={allowPickup}
                  onChange={(e) => setAllowPickup(e.target.checked)}
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-900 dark:text-slate-200">Pickup (Ambil Sendiri)</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">Pelanggan datang ke lokasi toko untuk mengambil pesanan.</span>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
                  checked={allowAppDelivery}
                  onChange={(e) => setAllowAppDelivery(e.target.checked)}
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-900 dark:text-slate-200">App Delivery (Ojek Online)</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">Pelanggan memesan via aplikasi kurir Gojek/Grab. Info ongkir dapat diinfokan menyusul.</span>
              </div>
            </label>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50 animate-in fade-in duration-300">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Informasi Ongkos Kirim (Opsional)
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="Contoh: Ongkir Rp 2.000/KM dihitung dr Alun-Alun"
              value={deliveryInfo}
              onChange={(e) => setDeliveryInfo(e.target.value)}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Informasi ini akan ditampilkan kepada pelanggan sebelum mereka klik tombol "Kirim via WhatsApp" jika mereka memilih opsi Delivery atau App Delivery.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving || !storeName || !slug || !whatsappNumber}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            ) : (
              <Save className="-ml-1 mr-2 h-5 w-5" />
            )}
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
