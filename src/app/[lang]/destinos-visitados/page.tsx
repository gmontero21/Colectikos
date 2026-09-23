"use client";

import React, { useState } from 'react';
import CategoryFilter from '../../../components/CategoryFilter';
import PlaceCard from '../../../components/PlaceCard';

import { mockLugares } from '../../../data/mockData';
import { useProgress } from '../../../context/ProgressContext';
import { useDictionary } from '../../../context/DictionaryContext';
import { mapLugaresByLocale, getProvincesForLugar } from '../../../utils/getLugares';

export default function DestinosVisitadosPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeProvince, setActiveProvince] = useState<string | null>(null);

  const { completedPlaces, handleCheckIn } = useProgress();
  const dict = useDictionary();
  const lang = dict?.lang || 'es';
  const localizedLugares = mapLugaresByLocale(mockLugares, lang);

  // Filter places based on completed places, category, and province
  const filteredLugares = localizedLugares.filter(l => {
    if (l.categoria === 'PROVINCIA') return false; // We just show normal destinations
    if (!completedPlaces.includes(l.id)) return false; // Only unlocked places

    const matchCategory = activeCategory === 'ALL' || l.categoria === activeCategory;
    const matchProvince = !activeProvince || getProvincesForLugar(l.id).includes(activeProvince);
    
    return matchCategory && matchProvince;
  });

  // Calculate progress for the UI (we can reuse the same logic as the home page)
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 mb-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight drop-shadow-md bg-white/60 inline-block px-6 py-2 rounded-2xl backdrop-blur-sm flex items-center gap-3 w-fit">
          <span className="text-emerald-500">✅</span> {dict?.home?.visitedDestinationsTitle || 'Mis Destinos Visitados'}
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-2 scroll-mt-32 relative z-10">
        <CategoryFilter 
          activeCategory={activeCategory} 
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setActiveProvince(null); 
          }} 
        />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-2">
        <div className="bg-stone-50 rounded-xl p-4 md:p-6 border border-stone-200/60 shadow-inner">
          <div className="mb-4 flex flex-col gap-2">
            <h3 className="text-base md:text-lg font-bold text-stone-700 tracking-tight">
              {dict?.home?.filterByProvince || 'Filtra por Provincia'}
            </h3>
            
            <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible md:whitespace-normal pb-4 pt-2 scrollbar-hide whitespace-nowrap mb-2 px-1">
              {[
                { id: null, label: lang === 'en' ? 'All' : 'Todas' },
                { id: 'SAN JOSE', label: lang === 'en' ? 'San Jose' : 'San José' },
                { id: 'ALAJUELA', label: 'Alajuela' },
                { id: 'CARTAGO', label: 'Cartago' },
                { id: 'HEREDIA', label: 'Heredia' },
                { id: 'GUANACASTE', label: 'Guanacaste' },
                { id: 'PUNTARENAS', label: 'Puntarenas' },
                { id: 'LIMON', label: lang === 'en' ? 'Limon' : 'Limón' },
              ].map(prov => {
                const isActive = activeProvince === prov.id;
                return (
                  <button
                    key={prov.id || 'all'}
                    onClick={() => setActiveProvince(prov.id)}
                    className={`rounded-full px-4 py-2 md:px-6 md:py-2 text-sm font-semibold transition-all duration-300 ease-in-out cursor-pointer shadow-sm border ${
                      isActive 
                        ? 'bg-emerald-500 text-white shadow-md border-emerald-500 scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {prov.label}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredLugares.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl mb-4 block opacity-50">🏔️</span>
              <p className="text-stone-500 font-medium italic text-lg">
                {dict?.home?.emptyVisitedDestinations || 'Aún no has visitado destinos... Sal a explorar y desbloquea postales.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
              {filteredLugares.map((lugar, index) => {
                // Since this place is guaranteed to be in completedPlaces, we can assert isCompleted=true
                const provinceName = getProvincesForLugar(lugar.id).join(' / ');
                const progress = progressData[getProvincesForLugar(lugar.id)[0]]?.percentage || 0; // fallback just for card rendering
                
                return (
                  <div 
                    key={`visited-${lugar.id}`}
                    className="animate-fade-in-up opacity-0 rounded-sm cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                    style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
                  >
                    <PlaceCard 
                      lugar={lugar}
                      isCompleted={true}
                      onCheckIn={handleCheckIn}
                      progressPercentage={progress}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
