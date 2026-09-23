"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Extract the current lang from the pathname (e.g., "/es/login" -> "es")
  const currentLang = pathname.split('/')[1] || 'es';

  const switchLanguage = (newLang: string) => {
    if (newLang === currentLang) return;
    
    // Set the cookie so proxy.ts respects the manual choice
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`; // 1 year
    
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <div className={`fixed z-[100] flex items-center gap-2 bg-white/75 backdrop-blur-md border border-white/60 p-2 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] ${className || 'top-6 right-6'}`}>
      <button
        onClick={() => switchLanguage('es')}
        className={`px-4 py-2 rounded-full font-bold text-[0.9rem] transition-all ${
          currentLang === 'es' 
            ? 'bg-emerald-500 text-white shadow-sm' 
            : 'text-stone-700 hover:bg-white/40'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-4 py-2 rounded-full font-bold text-[0.9rem] transition-all ${
          currentLang === 'en' 
            ? 'bg-emerald-500 text-white shadow-sm' 
            : 'text-stone-700 hover:bg-white/40'
        }`}
      >
        EN
      </button>
    </div>
  );
}
