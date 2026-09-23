"use client";

import React, { useState } from 'react';
import PlaceCard from '../../../components/PlaceCard';
import { mockLugares } from '../../../data/mockData';
import { useProgress } from '../../../context/ProgressContext';
import { useDictionary } from '../../../context/DictionaryContext';
import { mapLugaresByLocale, getProvincesForLugar } from '../../../utils/getLugares';
import { Calendar, Compass } from 'lucide-react'; 
import { Drawer } from 'vaul';

export default function ProximosDestinosPage() {
  const [activeDestinationId, setActiveDestinationId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { completedPlaces, handleCheckIn, bucketList } = useProgress();
  const dict = useDictionary();
  const lang = dict?.lang || 'es';
  const localizedLugares = mapLugaresByLocale(mockLugares, lang);

  const activeDestination = activeDestinationId 
    ? localizedLugares.find(l => l.id === activeDestinationId) 
    : null;

  // Calcular el progreso por provincia para el mapa / tarjetas
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
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight drop-shadow-md bg-white/60 inline-block px-6 py-2 rounded-2xl backdrop-blur-sm flex items-center gap-3 w-fit">
          <span className="text-red-500">🚩</span> {dict?.home?.bucketListTitle || 'Mis Próximos Destinos'}
        </h2>
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-2">
        <div className="bg-stone-50 rounded-xl p-4 md:p-6 border border-stone-200/60 shadow-inner">
          {(!bucketList || bucketList.length === 0) ? (
            <div className="text-center py-12">
              <span className="text-5xl mb-4 block opacity-50">🗺️</span>
              <p className="text-stone-500 font-medium italic text-lg">
                {dict?.home?.emptyBucketList || 'Aún no tienes próximos destinos... Usa la banderita en las postales bloqueadas para añadirlos.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
              {localizedLugares
                .filter(l => bucketList.includes(l.id))
                .map((lugar, index) => {
                  const provinceName = getProvincesForLugar(lugar.id).join(' / ');
                  const progress = progressData[provinceName]?.percentage || 0;
                  const isActive = activeDestinationId === lugar.id;
                  
                  return (
                    <div 
                      key={`bucket-${lugar.id}`}
                      className={`animate-fade-in-up opacity-0 rounded-sm cursor-pointer transition-all duration-300 ${isActive ? 'ring-4 ring-emerald-500 scale-[1.02] shadow-xl' : 'hover:scale-[1.01]'}`}
                      style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
                      onClick={() => {
                        setActiveDestinationId(lugar.id);
                        if (window.innerWidth < 1024) { // lg breakpoint
                          setIsDrawerOpen(true);
                        }
                      }}
                    >
                      <PlaceCard 
                        lugar={lugar}
                        isCompleted={false}
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

      {/* Esqueleto para la monetización (UI) - Solo Desktop */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 hidden lg:block">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Itinerario Sugerido Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-stone-200 shadow-sm relative overflow-hidden">
            {/* TODO: Inyectar dinámicamente itinerarios patrocinados aquí en el futuro */}
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-emerald-600" size={24} />
              <h3 className="text-xl font-bold text-stone-800">
                Itinerario Sugerido (1 Día / Fin de Semana) {activeDestination ? `- ${activeDestination.nombre}` : ''}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start opacity-60 animate-pulse">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex gap-4 items-start opacity-50 animate-pulse">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                  <div className="h-3 bg-stone-200 rounded w-2/5"></div>
                </div>
              </div>
              <div className="flex gap-4 items-start opacity-40 animate-pulse">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-stone-200 rounded w-4/5"></div>
                  <div className="h-3 bg-stone-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-8 pointer-events-none">
              <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
                Próximamente: Rutas Patrocinadas
              </span>
            </div>
          </div>

          {/* Recomendaciones Locales Placeholder */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm relative overflow-hidden">
            {/* TODO: Inyectar dinámicamente negocios patrocinadores aquí en el futuro */}
            <div className="flex items-center gap-3 mb-6">
              <Compass className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-stone-800">
                Recomendaciones en {activeDestination?.nombre || 'la Zona'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="h-24 bg-stone-200 rounded-lg animate-pulse opacity-60"></div>
              <div className="h-24 bg-stone-200 rounded-lg animate-pulse opacity-50"></div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-8 pointer-events-none">
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
                Restaurantes y Hoteles
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Drawer para Móvil (vaul) */}
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Drawer.Content className="bg-stone-50 flex flex-col rounded-t-[24px] h-[80vh] mt-24 fixed bottom-0 left-0 right-0 z-[60] focus:outline-none">
            <div className="p-5 bg-white rounded-t-[24px] flex-1 border-t border-stone-200">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-stone-300 mb-6" />
              
              <div className="max-w-md mx-auto h-full overflow-y-auto pb-6 scrollbar-hide">
                <h2 className="text-2xl font-bold text-stone-800 mb-6 px-1">
                  {activeDestination?.nombre || 'Detalles del Destino'}
                </h2>
                
                {/* Itinerario Sugerido Placeholder */}
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm relative overflow-hidden mb-5">
                  <div className="flex items-center gap-3 mb-5">
                    <Calendar className="text-emerald-600" size={20} />
                    <h3 className="text-lg font-bold text-stone-800">Itinerario Sugerido (1 Día)</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start opacity-60 animate-pulse">
                      <div className="w-10 h-10 bg-stone-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                        <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start opacity-50 animate-pulse">
                      <div className="w-10 h-10 bg-stone-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                        <div className="h-3 bg-stone-200 rounded w-2/5"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-6 pointer-events-none">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      Próximamente: Rutas Patrocinadas
                    </span>
                  </div>
                </div>

                {/* Recomendaciones Locales Placeholder */}
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-5">
                    <Compass className="text-blue-600" size={20} />
                    <h3 className="text-lg font-bold text-stone-800">Recomendaciones Locales</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-20 bg-stone-200 rounded-lg animate-pulse opacity-60"></div>
                    <div className="h-20 bg-stone-200 rounded-lg animate-pulse opacity-50"></div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-6 pointer-events-none">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      Restaurantes y Hoteles
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </main>
  );
}
