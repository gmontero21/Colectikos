'use client';

import React, { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { generateCrossInsight } from './actions';

export default function InsightClient({ initialInsight }: { initialInsight: string }) {
  const [insight, setInsight] = useState(initialInsight);
  const [loading, setLoading] = useState(false);
  const [timeText, setTimeText] = useState('Hace un momento');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const newInsight = await generateCrossInsight();
      setInsight(newInsight);
      setTimeText('Hace un momento');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl shadow-sm p-6 md:p-10 flex flex-col border border-slate-800 relative overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-500 opacity-5 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-yellow-400 shadow-sm">
          <Lightbulb size={28} className={loading ? 'animate-bounce' : 'animate-pulse'} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide">
            Motor de Insights Comunitarios
          </h2>
          <p className="text-slate-400 font-medium mt-1">Generación de estadísticas cruzadas para marketing y redes sociales</p>
        </div>
      </div>
      
      <button 
        onClick={handleGenerate}
        disabled={loading}
        className="relative z-10 w-full md:w-auto self-start px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:text-emerald-300 text-white font-bold rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg mb-8"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : 'Generar Estadística Cruzada'}
      </button>

      {/* Cuadro de resultados / Cita */}
      <div className="bg-slate-800/80 p-8 rounded-3xl border-l-4 border-emerald-500 relative shadow-inner z-10 backdrop-blur-sm min-h-[160px] flex flex-col justify-center transition-all duration-500">
        <div className="absolute top-4 right-8 text-slate-700 opacity-40 text-7xl font-serif select-none">"</div>
        <p className={`text-slate-200 text-xl md:text-2xl font-medium leading-relaxed relative z-10 italic pr-8 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {insight}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <span className="px-4 py-1.5 bg-slate-700/80 text-emerald-400 text-xs font-black rounded-xl uppercase tracking-wider">
            Insight Generado
          </span>
          <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> {timeText}
          </span>
        </div>
      </div>
    </div>
  );
}
