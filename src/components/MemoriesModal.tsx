"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, BookOpen, PawPrint } from 'lucide-react';
import { useDictionary } from '../context/DictionaryContext';
import { Lugar } from '../data/mockData';
import toast from 'react-hot-toast';

interface MemoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lugar: Lugar;
  isProv: boolean;
  currentDetails: { date: string; note: string };
  updatePlaceDetails: (id: string, date: string, note: string) => void;
  handleRate?: (id: string, score: number) => Promise<void>;
  rating: number;
}

export default function MemoriesModal({ 
  isOpen, 
  onClose, 
  lugar, 
  isProv,
  currentDetails,
  updatePlaceDetails,
  handleRate,
  rating: initialRating
}: MemoriesModalProps) {
  const dict = useDictionary();
  const [mounted, setMounted] = useState(false);
  const [draftDate, setDraftDate] = useState(currentDetails.date);
  const [draftNote, setDraftNote] = useState(currentDetails.note);
  const [rating, setRating] = useState<number>(initialRating);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setDraftDate(currentDetails.date);
      setDraftNote(currentDetails.note);
      setRating(initialRating);
    }
  }, [isOpen, currentDetails, initialRating]);

  if (!isOpen || !mounted) return null;

  const handleSaveNote = () => {
    updatePlaceDetails(lugar.id, draftDate, draftNote);
    toast.success(dict?.placeCard?.savedSuccessfully || '¡Guardado!');
    onClose();
  };

  const nameToUse = dict?.categories?.ALL === 'All' && lugar.nombre_en ? lugar.nombre_en : lugar.nombre;
  const cleanName = nameToUse
    .replace(/^Parque Nacional /i, '')
    .replace(/^Volcán /i, '')
    .replace(/ National Park$/i, '')
    .replace(/ Volcano$/i, '');

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:px-4 bg-stone-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full sm:w-[420px] max-h-[90vh] rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 border-t border-white/40 sm:border sm:border-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="w-full flex justify-center pt-4 pb-2 sm:hidden">
          <div className="w-12 h-1.5 bg-stone-200 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="pt-2 sm:pt-8 pb-5 px-6 text-center relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hidden sm:block"></div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>

          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 shadow-sm border border-emerald-100 rotate-3">
            <Sparkles size={32} className="text-emerald-500" strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl font-black text-stone-800 tracking-tight">
            {dict?.placeCard?.albumNotes || 'Mis Notas'}
          </h2>
          <p className="text-stone-500 text-sm mt-2 font-medium leading-relaxed px-4">
            {cleanName}
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 pt-2 sm:pt-4 flex flex-col gap-4 overflow-y-auto bg-stone-50/80 border-t border-stone-100">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-stone-500 text-[10px] sm:text-xs uppercase font-bold tracking-widest flex items-center gap-1">
              <BookOpen size={12} /> {dict?.placeCard?.visitDate || 'Fecha de visita'}
            </label>
            <input 
              type="date" 
              value={draftDate} 
              onChange={(e) => setDraftDate(e.target.value)}
              className="bg-white border border-stone-200 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full shadow-sm"
              title={dict?.placeCard?.visitDate || 'Fecha de visita'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-stone-500 text-[10px] sm:text-xs uppercase font-bold tracking-widest flex items-center gap-1">
              {dict?.placeCard?.myNotes || 'Mis recuerdos...'}
            </label>
            <textarea 
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder={dict?.placeCard?.myNotes || 'Mis recuerdos...'}
              className="bg-white border border-stone-200 rounded-lg px-3 py-2 sm:py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full min-h-[100px] sm:min-h-[120px] resize-none shadow-sm"
            />
          </div>

          {!isProv && (
            <div className="flex flex-col gap-2 mt-2 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <span className="text-stone-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center mb-1">
                {dict?.placeCard?.my_rating || 'Mi calificación:'}
              </span>
              <div className="flex justify-center gap-3">
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
                    className="transition-transform hover:scale-110 focus:outline-none relative z-20 p-2 rounded-full hover:bg-stone-50"
                    title={dict?.placeCard?.[`rating_${star}` as keyof typeof dict.placeCard]}
                  >
                    <PawPrint 
                      size={28} 
                      className={`pointer-events-none ${star <= rating ? "text-emerald-500 fill-emerald-500" : "text-stone-300"}`} 
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-xs text-stone-500 text-center font-medium mt-1">
                  {dict?.placeCard?.[`rating_${rating}` as keyof typeof dict.placeCard]}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 pb-4 sm:pb-0">
            <button 
              onClick={handleSaveNote} 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
            >
              {dict?.placeCard?.save || 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
