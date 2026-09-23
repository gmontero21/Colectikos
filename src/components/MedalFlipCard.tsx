"use client";

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface MedalFlipCardProps {
  stat: any;
  dict: any;
}

export default function MedalFlipCard({ stat, dict }: MedalFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isLocked = stat.medalLevel === 'none';

  const getFrontFaceStyles = () => {
    if (stat.percentage < 25) {
      return 'bg-stone-50 border-stone-200 grayscale opacity-70 shadow-sm hover:shadow-md';
    }
    if (stat.percentage < 100) {
      return `${stat.medalBg} shadow-sm hover:shadow-md opacity-100 grayscale-0`;
    }
    // 100% Perfecto
    return 'bg-gradient-to-b from-white to-yellow-50/50 border border-yellow-200 ring-2 ring-yellow-400 shadow-md shadow-yellow-200/40 hover:shadow-lg hover:shadow-yellow-300/50 opacity-100 grayscale-0';
  };

  return (
    <div 
      className="relative w-full h-full min-h-[10rem] sm:min-h-[11rem] [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        
        {/* FRONT FACE (Medal) */}
        <div className={`absolute inset-0 [backface-visibility:hidden] rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-300
          ${getFrontFaceStyles()}
        `}>
          <div className="absolute top-3 right-3 text-stone-300 opacity-60">
            <RefreshCw size={14} />
          </div>
          <div className="text-4xl mb-3 relative">
            <span className="absolute -bottom-2 -right-2">
              <stat.MedalIcon className={`w-8 h-8 ${stat.medalColor} drop-shadow-sm`} />
            </span>
            {stat.icon}
          </div>
          <h3 className="font-bold text-stone-800 text-sm mb-1">{stat.label}</h3>
          <p className={`text-xs font-semibold ${isLocked ? 'text-stone-400' : stat.medalColor}`}>
            {isLocked ? (dict?.profile?.locked || 'Bloqueada') : stat.catTitle}
          </p>
          {stat.isPerfectScore && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
              {dict?.profile?.perfect || '¡Perfecto!'}
            </span>
          )}
        </div>

        {/* BACK FACE (Progress) */}
        <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow`}>
           <div className="absolute top-3 right-3 text-stone-300 opacity-60">
            <RefreshCw size={14} />
          </div>
          
          <div className="flex flex-col items-center text-center mb-3">
             <div className="text-3xl mb-1">{stat.icon}</div>
             <h3 className="font-bold text-stone-800 text-sm line-clamp-1">{stat.label}</h3>
          </div>
          
          <div className="flex justify-between items-end mb-2 w-full px-1">
            <p className="text-xs font-medium text-stone-500">
              {dict?.profile?.places 
                ? dict.profile.places.replace('{completed}', stat.completed.toString()).replace('{total}', stat.total.toString())
                : `${stat.completed} de ${stat.total}`}
            </p>
            <div className={`text-sm font-bold ${stat.percentage === 100 ? 'text-emerald-600' : 'text-stone-700'}`}>
              {stat.percentage}%
            </div>
          </div>
          
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${stat.color}`}
              style={{ width: `${stat.percentage}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}
