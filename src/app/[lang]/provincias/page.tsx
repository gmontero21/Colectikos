"use client";

import React, { useRef } from 'react';
import PlaceCard from '../../../components/PlaceCard';
import { mockLugares } from '../../../data/mockData';
import { useProgress } from '../../../context/ProgressContext';
import { useDictionary } from '../../../context/DictionaryContext';
import { mapLugaresByLocale, getProvincesForLugar } from '../../../utils/getLugares';

export default function ProvinciasPage() {
  const galleryRef = useRef<HTMLElement>(null);
  
  const { completedPlaces, handleCheckIn } = useProgress();
  const dict = useDictionary();
  const lang = dict?.lang || 'es';
  const localizedLugares = mapLugaresByLocale(mockLugares, lang);

  const provincesCards = localizedLugares.filter(l => l.categoria === 'PROVINCIA');

  const progressData: Record<string, { completed: number; total: number; percentage: number }> = {};
  const provinces = ['SAN JOSE', 'ALAJUELA', 'CARTAGO', 'HEREDIA', 'GUANACASTE', 'PUNTARENAS', 'LIMON'];
  
  provinces.forEach(p => progressData[p] = { completed: 0, total: 0, percentage: 0 });
  
  localizedLugares.forEach(lugar => {
    if (lugar.categoria === 'PROVINCIA') return;

    const provincesForLugar = getProvincesForLugar(lugar.id);
    
    provincesForLugar.forEach(province => {
      if (progressData[province]) {
        progressData[province].total += 1;
        if (completedPlaces.includes(lugar.id)) {
          progressData[province].completed += 1;
        }
      }
    });
  });

  provinces.forEach(p => {
    if (progressData[p].total > 0) {
      progressData[p].percentage = Math.round((progressData[p].completed / progressData[p].total) * 100);
    }
  });

  return (
    <main 
      className="flex-1 w-full relative min-h-screen"
      style={{
        backgroundImage: 'url("/images/Imagenes_Pagina/fondo_pagina.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 mb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight drop-shadow-md bg-white/60 inline-block px-6 py-2 rounded-2xl backdrop-blur-sm">
          Postales de Provincias
        </h2>
      </div>

      <section ref={galleryRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 pt-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {provincesCards.map((lugar, index) => {
            const provinceName = getProvincesForLugar(lugar.id)[0];
            const progress = progressData[provinceName]?.percentage || 0;
            const isDerivedCompleted = progress >= 25;
            const rotations = ['-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1', 'rotate-0', '-rotate-[1.5deg]', 'rotate-[1.5deg]'];
            const randomRotation = rotations[index % rotations.length];
            
            return (
              <div 
                key={lugar.id} 
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
              >
                <PlaceCard 
                  lugar={lugar}
                  isCompleted={isDerivedCompleted}
                  isDerivedState={true}
                  onCheckIn={handleCheckIn}
                  progressPercentage={progress}
                  rotationClass={randomRotation}
                />
              </div>
            );
          })}
        </div>

        {provincesCards.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block opacity-50">🔍</span>
            <h3 className="text-lg font-semibold text-stone-500">No hay postales de provincias</h3>
          </div>
        )}
      </section>
    </main>
  );
}
