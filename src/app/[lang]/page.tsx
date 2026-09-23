"use client";

import React, { useState, useRef } from 'react';
import Hero from '../../components/Hero';
import CategoryFilter from '../../components/CategoryFilter';
import PlaceCard from '../../components/PlaceCard';

import { mockLugares } from '../../data/mockData';
import { useProgress } from '../../context/ProgressContext';
import { useDictionary } from '../../context/DictionaryContext';
import { mapLugaresByLocale, getProvincesForLugar } from '../../utils/getLugares';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeProvince, setActiveProvince] = useState<string | null>(null);
  const [isMessyView, setIsMessyView] = useState(false);
  
  const galleryRef = useRef<HTMLElement>(null);

  const { completedPlaces, handleCheckIn, bucketList } = useProgress();
  const dict = useDictionary();
  const lang = dict?.lang || 'es';
  const localizedLugares = mapLugaresByLocale(mockLugares, lang);

  // Filter places
  const filteredLugares = localizedLugares.filter(l => {
    if (l.categoria === 'PROVINCIA') return false;
    const matchCategory = activeCategory === 'ALL' || l.categoria === activeCategory;
    const matchProvince = !activeProvince || getProvincesForLugar(l.id).includes(activeProvince);
    return matchCategory && matchProvince;
  });

  // Calcular el progreso por provincia para el mapa
  const progressData: Record<string, { completed: number; total: number; percentage: number }> = {};
  const provinces = ['SAN JOSE', 'ALAJUELA', 'CARTAGO', 'HEREDIA', 'GUANACASTE', 'PUNTARENAS', 'LIMON'];
  
  provinces.forEach(p => progressData[p] = { completed: 0, total: 0, percentage: 0 });
  
  localizedLugares.forEach(lugar => {
    // Para el cálculo de porcentaje, NO contamos a la propia provincia,
    // solo contamos los lugares que pertenecen a ella.
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


  // Excluir la categoría Provincias del progreso total general
  const baseLugares = localizedLugares.filter(l => l.categoria !== 'PROVINCIA');
  const baseTotalCount = baseLugares.length;
  const baseCompletedCount = baseLugares.filter(l => completedPlaces.includes(l.id)).length;

  return (
    <>
      
      <main 
        className="flex-1 w-full relative min-h-screen"
        style={{
          backgroundImage: 'url("/images/Imagenes_Pagina/fondo_pagina.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <Hero 
          completedCount={baseCompletedCount} 
          totalCount={baseTotalCount} 
        />

        <div id="seccion-logros" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 mb-4 scroll-mt-32">
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            {dict?.home?.yourStickers || 'Tus Postales'}
          </h2>
        </div>



        <CategoryFilter 
          activeCategory={activeCategory} 
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setActiveProvince(null); // Clear province filter to prevent empty results
          }} 
        />
        
        <section ref={galleryRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 pt-2">
          <div className="mb-2 flex flex-col gap-2">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="text-base md:text-lg font-bold text-stone-700 tracking-tight">
                {dict?.home?.filterByProvince || 'Filtra por Provincia'}
              </h3>
              
              <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-full shadow-inner">
                <span className="text-xs font-semibold text-stone-500 pl-2">Estilo de pegado:</span>
                <button 
                  onClick={() => setIsMessyView(false)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${!isMessyView ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  Perfecto
                </button>
                <button 
                  onClick={() => setIsMessyView(true)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${isMessyView ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  Desordenado
                </button>
              </div>
            </div>
            
            {/* Pill Navigation para Provincias */}
            <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible md:whitespace-normal pb-4 pt-2 scrollbar-hide whitespace-nowrap mb-4 px-1">
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
          <div 
            key={`${activeCategory}-${activeProvince || 'all'}`}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8"
          >
            {filteredLugares.map((lugar, index) => {
              const isProv = lugar.categoria === 'PROVINCIA';
              const provinceName = isProv ? lugar.id : getProvincesForLugar(lugar.id).join(' / ');
              const progress = progressData[provinceName]?.percentage || 0;
              const isDerivedCompleted = progress >= 25;
              const rotations = ['-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1', '-rotate-[1.5deg]', 'rotate-[1.5deg]', '-rotate-3', 'rotate-3'];
              const randomRotation = isMessyView ? rotations[index % rotations.length] : 'rotate-0';
              
              return (
                <div 
                  key={lugar.id} 
                  className="animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
                >
                  <PlaceCard 
                    lugar={lugar}
                    isCompleted={isProv ? isDerivedCompleted : completedPlaces.includes(lugar.id)}
                    isDerivedState={isProv}
                    onCheckIn={handleCheckIn}
                    progressPercentage={isProv ? progress : undefined}
                    rotationClass={randomRotation}
                  />
                </div>
              );
            })}
          </div>

          {filteredLugares.length === 0 && (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block opacity-50">🔍</span>
              <h3 className="text-lg font-semibold text-stone-500">{dict?.home?.noPlaces || 'No hay lugares en esta categoría'}</h3>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
