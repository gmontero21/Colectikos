"use client";

import React, { useState, useMemo } from 'react';
import { useDictionary } from '../../../../context/DictionaryContext';
import SponsorCard from '../../../../components/SponsorCard';

export default function ComplementosClient({ sponsors }: { sponsors: any[] }) {
  const dict = useDictionary();
  const lang = dict?.lang || 'es';
  
  const [activeProvince, setActiveProvince] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const provinces = [
    { id: null, label: lang === 'en' ? 'All' : 'Todas' },
    { id: 'SAN JOSE', label: lang === 'en' ? 'San Jose' : 'San José' },
    { id: 'ALAJUELA', label: 'Alajuela' },
    { id: 'CARTAGO', label: 'Cartago' },
    { id: 'HEREDIA', label: 'Heredia' },
    { id: 'GUANACASTE', label: 'Guanacaste' },
    { id: 'PUNTARENAS', label: 'Puntarenas' },
    { id: 'LIMON', label: lang === 'en' ? 'Limon' : 'Limón' },
  ];

  const categories = [
    { id: 'ALL', icon: '🌍', label: lang === 'en' ? 'All' : 'Todos' },
    { id: 'HOSPEDAJE', icon: '🏨', label: lang === 'en' ? 'Lodging' : 'Hospedaje' },
    { id: 'ALIMENTACION', icon: '🍽️', label: lang === 'en' ? 'Food' : 'Alimentación' },
    { id: 'TOURS', icon: '🧭', label: 'Tours' },
    { id: 'TRANSPORTE', icon: '🚗', label: lang === 'en' ? 'Transport' : 'Transporte' },
    { id: 'SOUVENIRS', icon: '🛍️', label: 'Souvenirs' },
  ];

  // FILTRAR PATROCINADORES
  const filteredSponsors = useMemo(() => {
    return sponsors.filter(sponsor => {
      // Normalizar datos de la BD (ignorar mayúsculas/minúsculas y tildes)
      const cat = sponsor.categoria ? sponsor.categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() : '';
      const prov = sponsor.provincia ? sponsor.provincia.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() : '';

      const matchCategory = activeCategory === 'ALL' || cat === activeCategory;
      const matchProvince = !activeProvince || prov === activeProvince;
      return matchCategory && matchProvince;
    });
  }, [activeCategory, activeProvince, sponsors]);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-emerald-800 text-white py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md">
            {lang === 'en' ? 'Ride Add-ons' : 'Complementos de tu ride'}
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            {lang === 'en' 
              ? 'Discover local businesses that will make your trip unforgettable. See what postcards are nearby!' 
              : 'Descubrí negocios locales que harán de tu viaje algo inolvidable. ¡Mirá qué postales tienen cerca!'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provincias */}
        <div className="mb-6">
          <h3 className="text-base md:text-lg font-bold text-stone-700 tracking-tight mb-3">
            {lang === 'en' ? 'Filter by Province' : 'Filtra por Provincia'}
          </h3>
          <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible md:whitespace-normal pb-4 pt-2 scrollbar-hide whitespace-nowrap mb-2 px-1">
            {provinces.map((prov) => {
              const isActive = activeProvince === prov.id;
              return (
                <button
                  key={prov.id || 'all'}
                  onClick={() => setActiveProvince(prov.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm border
                    ${isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-200 ring-offset-1'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100 hover:border-emerald-300'
                    }
                  `}
                >
                  {prov.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-8">
          <h3 className="text-base md:text-lg font-bold text-stone-700 tracking-tight mb-3">
            {lang === 'en' ? 'Filter by Category' : 'Filtra por Categoría'}
          </h3>
          <div className="flex gap-3 overflow-x-auto md:flex-wrap md:overflow-visible md:whitespace-normal pb-4 pt-2 scrollbar-hide whitespace-nowrap mb-2 px-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-in-out border
                    ${isActive 
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-md transform scale-105 cursor-default' 
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-zinc-100 hover:border-emerald-200 hover:-translate-y-1 hover:shadow-md'
                    }
                  `}
                >
                  <span className="text-lg md:text-xl">{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Patrocinadores */}
        {filteredSponsors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSponsors.map(sponsor => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} lang={lang} variant="compact" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-stone-700 mb-2">
              {lang === 'en' ? 'No sponsors found' : 'No encontramos patrocinadores'}
            </h2>
            <p className="text-stone-500">
              {lang === 'en' 
                ? 'Try changing the province or category filters.' 
                : 'Intenta cambiar los filtros de provincia o categoría.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
