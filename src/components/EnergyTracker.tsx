'use client';

import React from 'react';
import { Ticket } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useDictionary } from '../context/DictionaryContext';

export default function EnergyTracker() {
  const { estampillas } = (useProgress() as any);
  const dict = useDictionary();

  const isEnglish = dict?.categories?.ALL === 'All';
  const label = isEnglish ? 'Stamps' : 'Estampillas';

  // We can render 3 small tickets to represent the energy
  const maxStamps = 3;

  return (
    <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 shadow-sm" title={`${estampillas} ${label} restantes hoy`}>
      <div className="flex -space-x-1">
        {[...Array(maxStamps)].map((_, i) => (
          <Ticket 
            key={i} 
            size={16} 
            className={`transition-colors ${i < estampillas ? 'text-amber-500 fill-amber-100 drop-shadow-sm' : 'text-stone-300 fill-stone-100'}`} 
          />
        ))}
      </div>
      <span className="text-xs font-bold text-stone-700">
        {estampillas}/{maxStamps}
      </span>
    </div>
  );
}
