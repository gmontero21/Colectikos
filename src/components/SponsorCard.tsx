"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';

export interface SponsorType {
  id: string;
  nombre: string;
  provincia: string;
  categoria: string;
  direccion: string;
  telefono?: string;
  email?: string;
  sitioWeb?: string;
  descripcion: string;
  descripcion_en?: string;
  imagenUrl: string;
  fotoExtra1?: string;
  fotoExtra2?: string;
  imagenesExtra?: string[];
  latitude: number;
  longitude: number;
  nearbyPostcards?: any[];
}

interface SponsorCardProps {
  sponsor: SponsorType;
  lang: string;
  variant?: 'full' | 'compact';
}

export default function SponsorCard({ sponsor, lang, variant = 'full' }: SponsorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCompact = variant === 'compact';
  // Configurar emojis de categoría
  const getCategoryEmoji = (rawCat: string) => {
    const cat = rawCat ? rawCat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() : '';
    switch (cat) {
      case 'HOSPEDAJE': return '🏨';
      case 'ALIMENTACION': return '🍽️';
      case 'TOURS': return '🧭';
      case 'TRANSPORTE': return '🚗';
      case 'SOUVENIRS': return '🛍️';
      default: return '📍';
    }
  };
  
  const getCategoryLabel = (rawCat: string) => {
    const cat = rawCat ? rawCat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() : '';
    if (lang === 'en') {
      switch (cat) {
        case 'HOSPEDAJE': return 'Lodging';
        case 'ALIMENTACION': return 'Food';
        case 'TOURS': return 'Tours';
        case 'TRANSPORTE': return 'Transport';
        case 'SOUVENIRS': return 'Souvenirs';
        default: return rawCat;
      }
    } else {
      switch (cat) {
        case 'HOSPEDAJE': return 'Hospedaje';
        case 'ALIMENTACION': return 'Alimentación';
        case 'TOURS': return 'Tours';
        case 'TRANSPORTE': return 'Transporte';
        case 'SOUVENIRS': return 'Souvenirs';
        default: return rawCat;
      }
    }
  };

  const description = lang === 'en' && sponsor.descripcion_en ? sponsor.descripcion_en : sponsor.descripcion;

  return (
    <div className={`bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-200 flex flex-col hover:shadow-xl transition-all duration-300 ${isCompact ? 'h-auto' : ''}`}>
      {/* Hero Visual */}
      <div 
        className={`relative w-full ${isCompact ? 'h-24' : 'h-56'} bg-stone-200 ${isCompact ? 'cursor-pointer hover:opacity-95' : ''} transition-all duration-300 shrink-0`}
        onClick={() => isCompact && setIsExpanded(!isExpanded)}
      >
        <Image 
          src={sponsor.imagenUrl || '/images/Postales_Generales/Playas/Postales-playas-coyote.png'} // Usamos un fallback temporal o puedes poner uno gris
          alt={sponsor.nombre}
          fill
          className="object-cover"
        />
        <div className={`absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full ${isCompact ? 'text-[10px]' : 'text-xs'} font-bold text-stone-800 shadow-sm flex items-center gap-1.5`}>
          <span>{getCategoryEmoji(sponsor.categoria)}</span>
          {getCategoryLabel(sponsor.categoria)}
        </div>
        <div className={`absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full ${isCompact ? 'text-[10px]' : 'text-xs'} font-bold text-white shadow-sm`}>
          {sponsor.provincia}
        </div>
      </div>

      {/* Contenido principal */}
      <div className={`p-5 md:p-6 flex-1 flex flex-col`}>
        {/* Título y reseña */}
        <div 
          className={`mb-4 flex items-start justify-between gap-2 ${isCompact ? 'cursor-pointer select-none' : ''}`}
          onClick={() => isCompact && setIsExpanded(!isExpanded)}
        >
          <h2 className={`${isCompact ? 'text-xl' : 'text-2xl'} font-black text-emerald-900 leading-tight`}>{sponsor.nombre}</h2>
          {isCompact && (
            <button className="text-emerald-700 bg-emerald-50 p-1.5 rounded-full hover:bg-emerald-100 transition-colors shrink-0 mt-0.5">
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${isCompact && !isExpanded ? 'max-h-0 opacity-0 mb-0' : 'max-h-[2000px] opacity-100 mb-5'}`}>
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <p className="text-stone-600 text-sm leading-relaxed italic">"{description}"</p>
          </div>
        </div>

        {/* Contacto */}
        <div className={`space-y-2.5 mb-6 text-sm text-stone-700 transition-all duration-300 overflow-hidden ${isCompact && !isExpanded ? 'max-h-0 opacity-0 mb-0' : 'max-h-[500px] opacity-100 mb-6'}`}>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{sponsor.direccion}</span>
          </div>
          {sponsor.telefono && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{sponsor.telefono}</span>
            </div>
          )}
          {sponsor.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
              <a href={`mailto:${sponsor.email}`} className="hover:text-emerald-700 hover:underline">{sponsor.email}</a>
            </div>
          )}
          {sponsor.sitioWeb && (
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              <a href={sponsor.sitioWeb.startsWith('http') ? sponsor.sitioWeb : `https://${sponsor.sitioWeb}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 hover:underline break-all">
                {sponsor.sitioWeb.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            </div>
          )}
        </div>

        {/* Galería Secundaria (2 extra fotos) */}
        <div className={`transition-all duration-300 overflow-hidden ${isCompact && !isExpanded ? 'max-h-0 opacity-0 mb-0' : 'max-h-[500px] opacity-100 mb-6'}`}>
          {((sponsor.imagenesExtra && sponsor.imagenesExtra.length > 0) || sponsor.fotoExtra1 || sponsor.fotoExtra2) && (
            <div className="grid grid-cols-2 gap-3">
              {sponsor.fotoExtra1 && (
                <div className="relative h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <Image src={sponsor.fotoExtra1} alt={`Galería 1`} fill className="object-cover" />
                </div>
              )}
              {sponsor.fotoExtra2 && (
                <div className="relative h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <Image src={sponsor.fotoExtra2} alt={`Galería 2`} fill className="object-cover" />
                </div>
              )}
              {/* Fallback to array if explicit fields are not set but array has items */}
              {(!sponsor.fotoExtra1 && !sponsor.fotoExtra2 && sponsor.imagenesExtra) && sponsor.imagenesExtra.slice(0,2).map((img, index) => (
                <div key={index} className="relative h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <Image src={img} alt={`Galería ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Puente Gamificación (Mockups Postales) */}
        <div className="mt-auto">
          {sponsor.nearbyPostcards && sponsor.nearbyPostcards.length > 0 && (
            <div className="pt-5 border-t border-stone-100 bg-emerald-50/50 -mx-6 -mb-6 px-6 pb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {lang === 'en' ? 'Ideal for your ride to:' : 'Ideal para tu ride a:'}
              </h4>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {sponsor.nearbyPostcards.map((pc: any, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2.5 bg-white pr-3 p-1 rounded-full border border-emerald-100/80 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group cursor-default max-w-full"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden relative border border-stone-100 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                      <ImageIcon className="absolute inset-0 m-auto w-3 h-3 text-stone-300" />
                      {pc.imagenUrl && (
                        <div className="absolute inset-0 bg-stone-200 bg-cover bg-center" style={{ backgroundImage: `url(${pc.imagenUrl})` }}></div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-stone-800 leading-tight truncate">
                        {lang === 'en' && pc.nombre_en ? pc.nombre_en : pc.nombre}
                      </span>
                      <span className="text-[9px] font-medium text-emerald-600/90 uppercase tracking-wider">
                        {pc.distance === -1 ? (lang === 'en' ? 'On the way' : 'En ruta') : `A ${pc.distance.toFixed(1)} km`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
