"use client";

import React from 'react';
import Image from 'next/image';
import { useDictionary } from '../context/DictionaryContext';

interface HeroProps {
  completedCount: number;
  totalCount: number;
}

export default function Hero({ completedCount, totalCount }: HeroProps) {
  const percentage = Math.round((completedCount / totalCount) * 100) || 0;
  const dict = useDictionary();

  return (
    <div className="relative w-full min-h-[60vh] lg:min-h-[75vh] xl:min-h-[600px] py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center rounded-b-3xl overflow-hidden shadow-lg mb-6 md:mb-8">
      {/* Background Image */}
      <Image
        src="/images/Imagenes_Pagina/hero-banner.jpeg"
        alt="Costa Rica landscape"
        fill
        className="object-cover object-center z-0"
        priority
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-6xl mx-auto mt-4 md:mt-8">
        
        {/* Logo and Slogan Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 text-center md:text-left w-full px-4 mb-8 md:mb-12">
          <Image 
            src="/images/Imagenes_Pagina/logo_colectikos_color.png" 
            alt="Logo Colectikos" 
            width={320} 
            height={320} 
            className="w-40 sm:w-48 md:w-56 lg:w-72 xl:w-80 shrink-0 h-auto object-contain drop-shadow-2xl"
            priority
          />
          <div>
            <h1 className="sr-only">100% Tico</h1>
            <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
              <span className="block">{dict?.home?.subtitleLine1 || 'Descubre Costa Rica'}</span>
              <span className="block">{dict?.home?.subtitleLine2 || 'Postal a Postal'}</span>
            </p>
          </div>
        </div>
        
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-7 rounded-2xl shadow-2xl border border-white/20">
          <p className="text-lg sm:text-xl text-white font-medium mb-4 drop-shadow">
            {dict?.home?.progressText 
              ? dict.home.progressText.replace('{completed}', completedCount.toString()).replace('{total}', totalCount.toString())
              : `Llevas ${completedCount} de ${totalCount} hitos conquistados`}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-5 bg-black/40 rounded-full overflow-hidden shadow-inner backdrop-blur-sm border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000 ease-out rounded-full shadow-[0_0_12px_rgba(52,211,153,0.6)]"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* CTA Button */}
        <a 
          href="#seccion-logros"
          className="mt-8 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
        >
          {dict?.home?.openAlbum || 'Abrir mi Álbum Virtual'}
        </a>
      </div>

      {/* Visual Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" 
          className="w-8 h-8 text-white/80 animate-bounce"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}
