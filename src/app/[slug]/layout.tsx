import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const { data: store } = await supabase
    .from('stores')
    .select('store_name, description')
    .eq('slug', slug)
    .single();

  if (!store) {
    return {
      title: 'Toko Tidak Ditemukan | Orderin',
      description: 'Toko yang Anda cari tidak dapat ditemukan.',
    };
  }

  const title = `${store.store_name} | Orderin`;
  const description = store.description || `Pesan menu dari ${store.store_name} dengan mudah via WhatsApp.`;
  // Using an external default thumbnail for MVP as we don't handle photo uploads yet. 
  // NextJS handles app-level og-images natively if placed in the app directory, but for specific 
  // stores we can define a generic placeholder or dynamic API route later. For now we use the main site URL.
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Orderin',
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function StoreLayout({ children }: Props) {
  return <>{children}</>;
}
