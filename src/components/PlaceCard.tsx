"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useDictionary } from '../context/DictionaryContext';
import { useProgress } from '../context/ProgressContext';
import { Lugar } from '../data/mockData';
import { MapPin, CheckCircle2, Navigation2, XCircle, Lock, BookOpen, Flag, PawPrint, X, Info, Eye, Navigation, Award } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import UnlockModal from './UnlockModal';


interface PlaceCardProps {
  lugar: Lugar;
  isCompleted: boolean;
  onCheckIn: (id: string) => void;
  isDerivedState?: boolean;
  progressPercentage?: number;
  rotationClass?: string;
}

const getProvinceImage = (provinceId: string, progressPercentage: number) => {
  if (progressPercentage >= 75) {
    return `/images/Postales_Provincias/Postales-provincias-${provinceId}-golden.png`;
  }
  if (progressPercentage >= 50) {
    return `/images/Postales_Provincias/Postales-provincias-${provinceId}-silver.png`;
  }
  if (progressPercentage >= 25) {
    return `/images/Postales_Provincias/Postales-provincias-${provinceId}-bronze.png`;
  }
  return `/images/Postales_Provincias/Postales-provincias-${provinceId}.png`;
};

export default function PlaceCard({ lugar, isCompleted, onCheckIn, isDerivedState, progressPercentage, rotationClass = '' }: PlaceCardProps) {
  const dict = useDictionary();
  const { placeDetails, updatePlaceDetails, bucketList, toggleBucketList, unlockModes, handleCheckInWithMode, handleRate } = (useProgress() as any);

  const currentDetails = placeDetails[lugar.id] || { date: '', note: '' };
  const isInBucketList = bucketList?.includes(lugar.id);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState(currentDetails.note);
  const [draftDate, setDraftDate] = useState(currentDetails.date);
  const [rating, setRating] = useState<number>(0);
  
  // Extraer el communityRating del contexto global (ya fue pre-cargado)
  // @ts-ignore - En caso de que communityRatings no exista temporalmente en la interface (aunque ya lo agregamos)
  const allRatings = (useProgress() as any).communityRatings || {};
  const communityRating = allRatings[lugar.id] !== undefined ? allRatings[lugar.id] : null;

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSelectMode = (mode: 'Curioso' | 'Nómada' | 'Conquistador') => {
    if (handleCheckInWithMode) {
      handleCheckInWithMode(lugar.id, mode);
    } else {
      onCheckIn(lugar.id);
    }
    setIsUnlockModalOpen(false);
  };
  
  useEffect(() => {
    if (!isEditingNote) {
      setDraftNote(currentDetails.note);
      setDraftDate(currentDetails.date);
    }
  }, [currentDetails, isEditingNote]);



  const handleSaveNote = () => {
    updatePlaceDetails(lugar.id, draftDate, draftNote);
    setIsEditingNote(false);
    toast.success(dict?.placeCard?.savedSuccessfully || '¡Guardado!');
  };

  const isEnglish = dict?.categories?.ALL === 'All';
  const nameToUse = isEnglish && lugar.nombre_en ? lugar.nombre_en : lugar.nombre;
  const descToUse = isEnglish && lugar.descripcion_en ? lugar.descripcion_en : lugar.descripcion;
  const ubicacionToUse = isEnglish && (lugar as any).ubicacion_en ? (lugar as any).ubicacion_en : lugar.ubicacion;

  // Limpiar el nombre para quitar redundancias
  const cleanName = nameToUse
    .replace(/^Parque Nacional /i, '')
    .replace(/^Volcán /i, '')
    .replace(/ National Park$/i, '')
    .replace(/ Volcano$/i, '');
    
  // Formatear la categoría para mostrarla como etiqueta
  const categoryKey = lugar.categoria as keyof typeof dict.categories;
  const categoryLabel = dict?.categories?.[categoryKey] || lugar.categoria.replace(/_/g, ' ');

  // Generar un slug a partir del nombre para la imagen local (ej: "volcan-miravalles")
  const imageSlug = lugar.nombre
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // Determinar la imagen a mostrar basándose en la categoría y el progreso
  const isProv = lugar.categoria === 'PROVINCIA';
  const displayImage = isProv && progressPercentage !== undefined
    ? getProvinceImage(imageSlug, progressPercentage)
    : lugar.imagenUrl;

  const mode = unlockModes?.[lugar.id];
  let borderClass = 'border-gray-100';
  let badgeColor = 'border-white bg-white/20 text-white';
  
  let ModeIcon = null;
  let modeLabel = '';
  let modeBadgeClass = '';

  if (mode === 'Curioso') {
    borderClass = 'border-[#cd7f32] shadow-[#cd7f32]/20';
    badgeColor = 'border-[#cd7f32] bg-[#cd7f32]/80 text-white';
    ModeIcon = Eye;
    modeLabel = dict?.unlockModal?.curioso || 'Curioso';
    modeBadgeClass = 'text-[#cd7f32] bg-[#cd7f32]/10 border-[#cd7f32]/20';
  } else if (mode === 'Nómada') {
    borderClass = 'border-[#c0c0c0] shadow-[#c0c0c0]/20';
    badgeColor = 'border-[#c0c0c0] bg-[#c0c0c0]/80 text-stone-800';
    ModeIcon = Navigation;
    modeLabel = dict?.unlockModal?.nomada || 'Nómada';
    modeBadgeClass = 'text-stone-500 bg-stone-100 border-stone-200';
  } else if (mode === 'Conquistador') {
    borderClass = 'border-[#ffd700] shadow-[#ffd700]/40';
    badgeColor = 'border-[#ffd700] bg-[#ffd700]/90 text-stone-900';
    ModeIcon = Award;
    modeLabel = dict?.unlockModal?.conquistador || 'Conquistador';
    modeBadgeClass = 'text-amber-600 bg-amber-50 border-amber-200/60';
  }

  const communityRatingBlock = (
    <div className="pt-1 sm:pt-2 pb-0.5 px-0.5 sm:px-1 flex justify-between items-center w-full mt-0.5 overflow-hidden gap-1">
      <span className="text-[7px] sm:text-[9px] font-extrabold uppercase tracking-widest text-stone-400 truncate">
        {dict?.placeCard?.community_rating || 'Comunidad:'}
      </span>
      
      {/* Distintivo Visual de Modo */}
      {isCompleted && mode && ModeIcon && (
        <div className="flex-1 flex justify-center items-center shrink-0">
          <div className={`flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-0.5 rounded-full border border-b-2 shadow-sm ${modeBadgeClass} transform -rotate-2 hover:rotate-0 transition-transform`}>
            <ModeIcon size={8} className="sm:w-2.5 sm:h-2.5" strokeWidth={2.5} />
            <span className="text-[6.5px] sm:text-[8px] font-black uppercase tracking-wider truncate max-w-[45px] sm:max-w-none">{modeLabel}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200 shadow-inner">
        <span className="text-[11px] font-bold text-stone-600">
          {communityRating === null ? '--' : communityRating.toFixed(1)}
        </span>
        <PawPrint size={10} className="text-emerald-500 fill-emerald-500" />
      </div>
    </div>
  );

  if (isCompleted) {
    return (
      <div ref={cardRef} id={`lugar-${lugar.id}`} className={`bg-white p-1.5 sm:p-2.5 pb-1 sm:pb-2 rounded-sm shadow-lg border-2 ${borderClass} flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative ${rotationClass} hover:rotate-0 hover:scale-105 hover:z-10`}>
        
        {/* Remove Button Badge */}
        {!isDerivedState && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCheckIn(lugar.id);
            }}
            className={`absolute -top-2 -right-2 z-40 flex items-center justify-center w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-all hover:scale-110 border-2 border-white sm:pointer-events-auto sm:group-hover:opacity-100 ${isMobileExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            title={dict?.placeCard?.removeFromAlbum || 'Quitar del Álbum'}
          >
            <X size={14} strokeWidth={3} />
          </button>
        )}

        {/* Mobile Info Hint (Hidden on sm) */}
        <div className={`absolute top-2 left-2 z-30 sm:hidden transition-opacity duration-300 ${isMobileExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-none'}`}>
           <div className="bg-stone-900/60 backdrop-blur-md rounded-full p-1.5 shadow-md flex items-center gap-1">
             <Info size={12} className="text-white" />
             <span className="text-[9px] font-bold text-white uppercase px-1 leading-none">Toca</span>
           </div>
        </div>

        <div 
          className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 border-2 border-stone-100 flex flex-col shrink-0"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
        >
          
          <Image 
            src={displayImage} 
            alt={nameToUse}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top text-transparent transition-transform duration-700 group-hover:scale-105" 
          />
          
          {/* Stamp of Conquest */}
          <div className="absolute bottom-3 right-3 z-20 opacity-90 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
            <div className={`w-14 h-14 border-[3px] rounded-full flex flex-col items-center justify-center rotate-12 shadow-md backdrop-blur-sm ${badgeColor}`}>
              <CheckCircle2 size={20} className="drop-shadow-md" />
              <span className="text-[8px] font-extrabold uppercase mt-0.5 drop-shadow-md text-center leading-none">{dict?.placeCard?.conquered || 'Visitado'}</span>
            </div>
          </div>
          
          {/* Information Overlay on Hover/Tap */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/95 to-stone-900/40 transition-all duration-500 z-10 flex flex-col justify-end sm:pointer-events-auto sm:group-hover:opacity-100 ${isMobileExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`transform transition-transform duration-500 ease-out p-4 md:p-5 overflow-y-auto max-h-full w-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full sm:group-hover:translate-y-0 ${isMobileExpanded ? 'translate-y-0' : 'translate-y-8'}`}>
              {/* Mobile Close Area Hint */}
              <div 
                className="absolute top-2 right-2 sm:hidden p-2 text-white/50 active:text-white/80"
                onClick={() => setIsMobileExpanded(false)}
              >
                <X size={16} />
              </div>
              <span className="inline-block px-2.5 py-1 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider rounded mb-2">
                {categoryLabel}
              </span>
              <h3 className="font-bold text-white text-xl leading-tight mb-1" title={nameToUse}>
                {cleanName}
              </h3>
              <p className="text-stone-300 text-xs font-medium mb-3 flex items-center gap-1.5 truncate">
                <MapPin size={14} className="text-cyan-400 shrink-0" /> 
                <span className="truncate">{ubicacionToUse}</span>
              </p>
              
              <p className="text-stone-200 text-sm mb-3 leading-relaxed font-serif italic">
                "{descToUse}"
              </p>
              
              {/* Simulated Traveler Note */}
              <div className="bg-white/10 p-3 rounded mb-3 border-l-2 border-emerald-400 relative">
                <div className="text-stone-400 text-[9px] uppercase font-bold tracking-widest mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><BookOpen size={10} /> {dict?.placeCard?.albumNotes || 'Notas del Álbum'}</span>
                  {!isEditingNote && (currentDetails.note || currentDetails.date) && (
                    <button onClick={() => setIsEditingNote(true)} className="text-emerald-400 hover:text-emerald-300 text-[9px]">{dict?.placeCard?.edit || 'Editar'}</button>
                  )}
                </div>
                
                {isEditingNote ? (
                  <div className="flex flex-col gap-2">
                    <input 
                      type="date" 
                      value={draftDate} 
                      onChange={(e) => setDraftDate(e.target.value)}
                      className="bg-stone-900/50 border border-stone-600 rounded px-2 py-1 text-xs text-stone-200 outline-none focus:border-emerald-500 w-full [color-scheme:dark]"
                      title={dict?.placeCard?.visitDate || 'Fecha de visita'}
                    />
                    <textarea 
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                      placeholder={dict?.placeCard?.myNotes || 'Mis recuerdos...'}
                      className="bg-stone-900/50 border border-stone-600 rounded px-2 py-1 text-xs text-stone-200 outline-none focus:border-emerald-500 w-full min-h-[60px] resize-none"
                    />
                    <div className="flex justify-end gap-2 mt-1">
                      <button onClick={() => setIsEditingNote(false)} className="text-stone-400 hover:text-stone-300 text-[10px] px-2 py-1">Cancelar</button>
                      <button onClick={handleSaveNote} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-3 py-1 rounded font-bold">{dict?.placeCard?.save || 'Guardar'}</button>
                    </div>
                  </div>
                ) : (currentDetails.note || currentDetails.date) ? (
                  <div className="text-stone-200 text-xs italic font-serif">
                    {currentDetails.date && <p className="text-emerald-300/80 mb-1 text-[10px] font-sans not-italic font-bold">{currentDetails.date}</p>}
                    <p>{currentDetails.note}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-stone-300/70 text-xs italic font-serif">{dict?.placeCard?.albumNotesDesc || 'Un destino increíble...'}</p>
                    <button onClick={() => setIsEditingNote(true)} className="text-emerald-400 hover:text-emerald-300 text-[10px] border border-emerald-400/30 px-2 py-0.5 rounded flex items-center gap-1">+ {dict?.placeCard?.addMemory || 'Añadir recuerdo'}</button>
                  </div>
                )}
              </div>
              {/* Rating Section */}
              {!isProv && (
                <div className="bg-white/5 p-3 rounded mb-3 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-stone-300 text-[10px] font-bold uppercase tracking-wider">{dict?.placeCard?.my_rating || 'Mi calificación:'}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={async (e) => { 
                            e.stopPropagation(); 
                            const newRating = rating === star ? 0 : star;
                            setRating(newRating); 
                            if (newRating > 0 && handleRate) {
                              await handleRate(lugar.id, newRating);
                            }
                          }}
                          className="transition-transform hover:scale-110 focus:outline-none relative z-20 p-1 -m-1"
                          title={dict?.placeCard?.[`rating_${star}` as keyof typeof dict.placeCard]}
                        >
                          <PawPrint 
                            size={16} 
                            className={`pointer-events-none ${star <= rating ? "text-emerald-500 fill-emerald-500" : "text-stone-500"}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  {rating > 0 && (
                    <p className="text-xs text-stone-500 text-right">
                      {dict?.placeCard?.[`rating_${rating}` as keyof typeof dict.placeCard]}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {communityRatingBlock}
      </div>
    );
  }

  // Estado No Completado (Postal Pendiente)
  return (
    <div ref={cardRef} id={`lugar-${lugar.id}`} className={`bg-white p-1.5 sm:p-2.5 pb-1 sm:pb-2 rounded-sm shadow-lg border border-gray-100 flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative ${rotationClass} hover:rotate-0 hover:scale-105 hover:z-10`}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-200 border-2 border-stone-100 flex flex-col shrink-0">
        
        {/* Dynamic Image with conditional grayscale */}
        <Image 
          src={displayImage} 
          alt={nameToUse}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover object-top text-transparent transition-all duration-700 group-hover:scale-105 ${
            isProv && progressPercentage !== undefined && progressPercentage >= 25
              ? 'grayscale-0 opacity-100 brightness-100' // Sin filtros para los bronces o superiores en estado "Por Coleccionar"
              : 'filter grayscale sepia-[0.2] brightness-50 opacity-70 group-hover:brightness-[0.6]' // Estado gris por defecto
          }`} 
        />

        {/* Flag Icon (Bucket List) */}
        {!isDerivedState && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (toggleBucketList) toggleBucketList(lugar.id);
            }}
            className="absolute top-2 right-2 z-30 p-1.5 transition-all duration-300 hover:scale-110"
            title={dict?.home?.bucketListTitle || "Mis Próximos Destinos"}
          >
            <Flag 
              size={24} 
              className={`transition-colors duration-300 drop-shadow-md ${
                isInBucketList 
                  ? 'text-red-500 fill-current' 
                  : 'text-white/80 fill-transparent stroke-[2] hover:text-white'
              }`} 
            />
          </button>
        )}
        
        {/* Lock icon / Stamp overlay */}
        {!(isProv && progressPercentage !== undefined && progressPercentage >= 25) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="w-16 h-16 border-2 border-dashed border-stone-300 rounded-full flex flex-col items-center justify-center mb-3 opacity-60 rotate-[-15deg]">
               <Lock className="text-stone-300 mb-1" size={20} />
            </div>
            <p className="text-stone-300 font-bold uppercase tracking-widest text-[10px] bg-stone-900/60 px-3 py-1 rounded backdrop-blur-sm">{dict?.placeCard?.toCollect || 'Por Coleccionar'}</p>
          </div>
        )}

        {/* Metadata at the bottom */}
        <div className="absolute bottom-0 inset-x-0 p-2 sm:p-5 bg-gradient-to-t from-stone-950 via-stone-900/95 to-transparent z-20">
          <span className="inline-block px-1.5 sm:px-2.5 py-0.5 bg-stone-700/50 border border-stone-500/30 text-stone-300 text-[7px] sm:text-[9px] font-bold uppercase tracking-wider rounded mb-1 sm:mb-2">
            {categoryLabel}
          </span>
          <h3 className="font-bold text-stone-100 text-[11px] sm:text-lg leading-tight line-clamp-2">{cleanName}</h3>
          
          <p className="text-stone-400 text-[8px] sm:text-xs font-medium mt-0.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5 truncate">
            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-500 shrink-0" /> <span className="truncate">{ubicacionToUse}</span>
          </p>
          
          <p className="text-stone-300 text-[8px] sm:text-xs leading-snug italic font-serif mt-1 sm:mt-2.5 hidden sm:-webkit-box sm:line-clamp-3">
            "{descToUse}"
          </p>
          
          {!isDerivedState && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsUnlockModalOpen(true);
              }} 
              className="mt-1.5 sm:mt-4 w-full flex justify-center items-center gap-1 sm:gap-2 text-[9px] sm:text-sm leading-tight font-bold px-1 sm:px-4 py-1.5 sm:py-2 rounded text-white transition-all shadow-md hover:shadow-lg bg-emerald-700 hover:bg-emerald-600"
            >
              <Navigation2 className="w-2.5 h-2.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate hidden sm:inline">{dict?.placeCard?.addToAlbum || 'Pegar Postal'}</span>
              <span className="truncate sm:hidden">{dict?.placeCard?.add || 'Pegar'}</span>
            </button>
          )}
        </div>
      </div>
      {communityRatingBlock}
      <UnlockModal 
        isOpen={isUnlockModalOpen} 
        onClose={() => setIsUnlockModalOpen(false)} 
        onSelectMode={handleSelectMode} 
      />
    </div>
  );
}
