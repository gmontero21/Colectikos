"use client";

import React, { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import CommunityPlaceCard from './CommunityPlaceCard';
import { mockLugares } from '../data/mockData';
import { mapLugaresByLocale, getProvincesForLugar } from '../utils/getLugares';
import { useDictionary } from '../context/DictionaryContext';
//import { CommunityPost } from '@prisma/client';

interface CommunityClientProps {
  posts: any[];
}

export default function CommunityClient({ posts }: CommunityClientProps) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeProvince, setActiveProvince] = useState<string | null>(null);
  
  const dict = useDictionary();
  const lang = dict?.lang || 'es';
  const localizedLugares = mapLugaresByLocale(mockLugares, lang);

  // Filter places
  const filteredLugares = localizedLugares.filter(l => {
    const matchCategory = activeCategory === 'ALL' || l.categoria === activeCategory;
    const matchProvince = !activeProvince || getProvincesForLugar(l.id).includes(activeProvince);
    return matchCategory && matchProvince;
  });

  const rotations = ['-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1', 'rotate-0', '-rotate-[1.5deg]', 'rotate-[1.5deg]'];
  const isEnglish = lang === 'en';

  return (
    <>
      <CategoryFilter 
        activeCategory={activeCategory} 
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveProvince(null);
        }} 
      />
      
      <div className="mb-2 flex flex-col gap-2 mt-6">
        <h3 className="text-base md:text-lg font-bold text-stone-700 tracking-tight">
          {dict?.home?.filterByProvince || 'Filtra por Provincia'}
        </h3>
        
        {/* Pill Navigation para Provincias */}
        <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible md:whitespace-normal pb-4 pt-2 scrollbar-hide whitespace-nowrap mb-4 px-1">
          {[
            { id: null, label: isEnglish ? 'All' : 'Todas' },
            { id: 'SAN JOSE', label: isEnglish ? 'San Jose' : 'San José' },
            { id: 'ALAJUELA', label: 'Alajuela' },
            { id: 'CARTAGO', label: 'Cartago' },
            { id: 'HEREDIA', label: 'Heredia' },
            { id: 'GUANACASTE', label: 'Guanacaste' },
            { id: 'PUNTARENAS', label: 'Puntarenas' },
            { id: 'LIMON', label: isEnglish ? 'Limon' : 'Limón' },
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
        {filteredLugares.map((lugar, index) => {
          // Buscamos si hay un CommunityPost cuyo caption coincide (ignorando mayúsculas) con el nombre original o en inglés
          // Dado que el usuario o nosotros subimos la foto, el caption indicará el destino
          const matchedPost = posts.find(p => {
             if (!p.caption) return false;
             const cap = p.caption.toLowerCase();
             const nomES = lugar.nombre.toLowerCase();
             const nomEN = lugar.nombre_en?.toLowerCase() || nomES;
             return cap.includes(nomES) || cap.includes(nomEN);
          });
          
          const nameToUse = isEnglish && lugar.nombre_en ? lugar.nombre_en : lugar.nombre;
          // Clean the name similar to Home album
          const cleanName = nameToUse
            .replace(/^Parque Nacional /i, '')
            .replace(/^Volcán /i, '')
            .replace(/ National Park$/i, '')
            .replace(/ Volcano$/i, '');

          const randomRotation = rotations[index % rotations.length];
          const globalIndex = mockLugares.findIndex(m => m.id === lugar.id); // for consistent panini numbers

          return (
            <div 
              key={lugar.id} 
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${(index % 10) * 75}ms`, animationFillMode: 'forwards' }}
            >
              <CommunityPlaceCard 
                lugar={lugar}
                post={matchedPost}
                nameToUse={cleanName}
                index={globalIndex}
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
    </>
  );
}
