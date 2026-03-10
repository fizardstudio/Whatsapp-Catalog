"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Edit2, Trash2, ShieldAlert, PackageOpen } from "lucide-react";
import Link from "next/link";
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useTheme } from "next-themes";

interface Store {
  id: string;
  store_name: string;
}

interface Product {
  id: string;
  store_id: string;
  name: string;
  price: number;
  emoji: string;
  is_available: boolean;
  description?: string;
}

export default function ProductsPage() {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, resolvedTheme } = useTheme();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formEmoji, setFormEmoji] = useState("🍔");
  const [formDescription, setFormDescription] = useState("");
  const [formAvailable, setFormAvailable] = useState(true);

  useEffect(() => {
    fetchStoreAndProducts();
  }, []);

  const fetchStoreAndProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch store
      const { data: storeData, error: storeError } = await supabase
        .from("stores")
        .select("id, store_name")
        .eq("merchant_id", user.id)
        .single();

      if (storeError && storeError.code !== "PGRST116") {
        throw storeError;
      }

      if (storeData) {
        setStore(storeData);
        
        // Fetch products for this store
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", storeData.id)
          .order("created_at", { ascending: false });
          
        if (productsError) throw productsError;
        if (productsData) setProducts(productsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormName("");
    setFormPrice("");
    setFormEmoji("🍔");
    setFormDescription("");
    setFormAvailable(true);
    setIsModalOpen(true);
    setShowEmojiPicker(false);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormEmoji(product.emoji);
    setFormDescription(product.description || "");
    setFormAvailable(product.is_available);
    setIsModalOpen(true);
    setShowEmojiPicker(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    
    setIsSaving(true);
    
    const productData = {
      store_id: store.id,
      name: formName,
      price: parseFloat(formPrice),
      emoji: formEmoji,
      description: formDescription,
      is_available: formAvailable
    };

    try {
      if (editingId) {
        // Update
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId)
          .select()
          .single();
          
        if (error) throw error;
        setProducts(products.map(p => p.id === editingId ? data : p));
      } else {
        // Insert
        const { data, error } = await supabase
          .from("products")
          .insert([productData])
          .select()
          .single();
          
        if (error) throw error;
        setProducts([data, ...products]);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Gagal menyimpan produk");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-10 border border-slate-100 dark:border-slate-800">
        <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Toko Belum Diatur</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Anda harus mengatur informasi toko terlebih dahulu sebelum dapat menambahkan produk ke katalog.
        </p>
        <Link 
          href="/dashboard/settings" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-md shadow-blue-500/20"
        >
          Lengkapi Pengaturan Toko
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Katalog Produk</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola menu dan produk untuk {store.store_name}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors flex items-center shadow-md shadow-blue-500/20"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Tambah Produk
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Belum ada produk</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Mulai tambahkan produk pertama ke katalog Anda.</p>
            <button
              onClick={openAddModal}
              className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
            >
              + Tambah sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 font-medium">Produk</th>
                  <th className="px-6 py-4 font-medium">Harga</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl bg-slate-100 dark:bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl">
                          {product.emoji}
                        </span>
                        <div>
                          <span className="font-medium text-slate-900 dark:text-slate-100 block">{product.name}</span>
                          {product.description && (
                            <span className="text-sm text-slate-500 dark:text-slate-400 block line-clamp-1 mt-0.5">{product.description}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.is_available 
                          ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" 
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {product.is_available ? "Tersedia" : "Habis"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 py-10">
            <div className="glass-card rounded-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 relative">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Produk" : "Tambah Produk"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="Contoh: Burger Keju"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="25000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ikon / Emoji <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="text-3xl leading-none">{formEmoji}</span>
                    </button>
                    
                    {showEmojiPicker && (
                      <div className="absolute z-50 mt-2 right-0 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800">
                        <EmojiPicker 
                          onEmojiClick={(emojiData: EmojiClickData) => {
                            setFormEmoji(emojiData.emoji);
                            setShowEmojiPicker(false);
                          }}
                          autoFocusSearch={false}
                          width={280}
                          height={350}
                          theme={(theme === "dark" || resolvedTheme === "dark") ? Theme.DARK : Theme.LIGHT}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Deskripsi Produk (Opsional)
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="Contoh: Burger sapi dengan keju leleh dan saus spesial"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formAvailable}
                    onChange={(e) => setFormAvailable(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 dark:peer-focus:ring-blue-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {formAvailable ? "Produk Tersedia" : "Produk Habis"}
                </span>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center shadow-md shadow-blue-500/20 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
