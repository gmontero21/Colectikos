"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Lugar } from '../data/mockData';
import { useDictionary } from '../context/DictionaryContext';

interface SearchBarProps {
  lugares: Lugar[];
}

export default function SearchBar({ lugares }: SearchBarProps) {
  const dict = useDictionary();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Lugar[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Normaliza el texto para ignorar tildes, mayúsculas y minúsculas
  const normalizeText = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  // Efecto para filtrar los resultados en tiempo real
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const normalizedQuery = normalizeText(query);
    const filtered = lugares.filter((lugar) => {
      const normalizedName = normalizeText(lugar.nombre);
      const normalizedLocation = normalizeText(lugar.ubicacion);
      // Coincidencia parcial en nombre o ubicación
      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedLocation.includes(normalizedQuery)
      );
    });

    setResults(filtered);
    setIsOpen(true);
  }, [query, lugares]);

  // Cerrar el dropdown al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (lugarId: string) => {
    setIsOpen(false);
    setQuery('');
    
    // Smooth scroll al elemento seleccionado
    const element = document.getElementById(`lugar-${lugarId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Efecto sutil para resaltar el elemento encontrado
      element.classList.add('ring-4', 'ring-emerald-400', 'transition-all', 'duration-500');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-emerald-400');
      }, 2000);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs lg:max-w-sm">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-stone-400 pointer-events-none">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict?.navbar?.searchPlaceholder || "Buscar lugares..."}
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-stone-100 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-stone-700 placeholder:text-stone-400"
          onFocus={() => {
            if (query.trim() !== '') setIsOpen(true);
          }}
          suppressHydrationWarning
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full max-h-[60vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-stone-100 z-50">
          <ul className="py-2">
            {results.map((lugar) => (
              <li key={lugar.id}>
                <button
                  onClick={() => handleSelect(lugar.id)}
                  className="w-full text-left px-4 py-2 hover:bg-stone-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex flex-col overflow-hidden mr-2">
                    <span className="text-sm font-semibold text-stone-800 truncate group-hover:text-emerald-700 transition-colors">
                      {lugar.nombre}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1 truncate">
                      <MapPin size={10} className="shrink-0" />
                      <span className="truncate">{lugar.ubicacion}</span>
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    {lugar.categoria.replace(/_/g, ' ')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query.trim() !== '' && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-stone-100 z-50 p-4 text-center">
          <p className="text-sm text-stone-500">No encontramos "{query}" en tu álbum</p>
        </div>
      )}
    </div>
  );
}
