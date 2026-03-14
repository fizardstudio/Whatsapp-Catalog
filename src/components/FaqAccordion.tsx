"use client";

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Apa itu platform Orderin?",
    answer: "Orderin adalah pembuat brosur/katalog digital khusus UMKM yang mempermudah pelanggan Anda memilih barang, melihat total harga, dan mengirim format pesanan yang rapi langsung ke WhatsApp Anda."
  },
  {
    question: "Bagaimana sistem pemotongan Koin bekerja?",
    answer: "Kami menggunakan konsep Pay-as-you-go. Ketika pelanggan menekan tombol 'Pesan via WhatsApp' di katalog Anda, saldo Koin Anda akan terpotong 1 (-Rp 500). Jika toko sedang sepi pengunjung, koin Anda akan tetap utuh."
  },
  {
    question: "Apakah ada biaya langganan bulanan?",
    answer: "TIDAK ADA. Berbeda dengan aplikasi kasir lainnya, Orderin 100% bebas biaya bulanan dan bebas potongan komisi transaksi. Pelanggan mentransfer uang langsung ke rekening pribadi Anda."
  },
  {
    question: "Bagaimana cara menerima pesanan?",
    answer: "Setelah pelanggan menekan checkout, mereka akan diarahkan ke aplikasi WhatsApp dan mengirim pesan template berisi rincian pesanan. Anda cukup membalas pesan tersebut dari WhatsApp HP Anda sendiri untuk konfirmasi pembayaran dan pengiriman."
  },
  {
    question: "Bagaimana jika ada pelanggan iseng yang menekan klik pesan berkali-kali?",
    answer: "Tenang, sistem Orderin dilengkapi dengan pelindung Anti-Spam (Rate Limiting) per perangkat. Klik berulang kali dari satu HP pelanggan tidak akan memotong koin Anda lebih dari satu kali dalam jeda waktu tertentu."
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto w-full">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index}
            className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
              isOpen 
                ? "border-blue-500 bg-white dark:bg-slate-900 shadow-md ring-4 ring-blue-500/10" 
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-blue-300 dark:hover:border-blue-800"
            }`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className={`w-5 h-5 flex-shrink-0 ${isOpen ? "text-blue-500" : "text-slate-400"}`} />
                <span className={`font-semibold text-base sm:text-lg ${isOpen ? "text-blue-700 dark:text-blue-400" : "text-slate-800 dark:text-slate-200"}`}>
                  {faq.question}
                </span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : ""}`} 
              />
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-8 text-slate-600 dark:text-slate-400 py-1 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
