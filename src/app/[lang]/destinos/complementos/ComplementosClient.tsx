"use client";

import React, { useState, useMemo } from 'react';
import { useDictionary } from '../../../../context/DictionaryContext';
import SponsorCard from '../../../../components/SponsorCard';
import { ChevronDown } from 'lucide-react';

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
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                {lang === 'en' ? "Province" : "Provincia"}
              </label>
              <div className="relative">
                <select 
                  value={activeProvince || 'Todas'} 
                  onChange={(e) => setActiveProvince(e.target.value === 'Todas' ? null : e.target.value)}
                  className="w-full appearance-none bg-stone-50 border border-stone-200 text-stone-700 py-2.5 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {provinces.map((prov) => (
                    <option key={prov.id || 'Todas'} value={prov.id || 'Todas'}>{prov.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={18} />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                {lang === 'en' ? "Category" : "Categoría"}
              </label>
              <div className="relative">
                <select 
                  value={activeCategory} 
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full appearance-none bg-stone-50 border border-stone-200 text-stone-700 py-2.5 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={18} />
              </div>
            </div>
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
