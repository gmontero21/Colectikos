"use client";

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import dynamic from 'next/dynamic';
import { useDictionary } from '../context/DictionaryContext';

// Importación dinámica del Tooltip para evitar errores de hidratación (hydration mismatch)
// que pueden "congelar" la aplicación en ciertos navegadores (como Safari).
const Tooltip = dynamic(() => import('react-tooltip').then(mod => mod.Tooltip), { ssr: false });

// Puedes descargar el archivo GeoJSON/TopoJSON de Costa Rica con divisiones provinciales
// desde sitios como: https://github.com/deldersveld/topojson/tree/master/countries
// y guardarlo en la carpeta public/data/ de tu proyecto.
const geoUrl = "/data/costa-rica-provinces.json";

// Mock de progreso por provincia (idealmente esto viene como prop)
interface ProgressData {
  [key: string]: { completed: number; total: number; percentage: number };
}

interface InteractiveMapProps {
  progressData: ProgressData;
  onProvinceClick?: (province: string) => void;
}

const PROVINCE_CENTERS: Record<string, [number, number]> = {
  'SAN JOSE': [-83.9, 9.6],
  'ALAJUELA': [-84.5, 10.5],
  'CARTAGO': [-83.7, 9.8],
  'HEREDIA': [-84.0, 10.3],
  'GUANACASTE': [-85.4, 10.4],
  'PUNTARENAS': [-83.6, 8.9],
  'LIMON': [-83.1, 10.0],
};

export default function InteractiveMap({ progressData, onProvinceClick }: InteractiveMapProps) {
  const [tooltipContent, setTooltipContent] = useState('');
  const dict = useDictionary();

  // Función para determinar el color de la provincia según el progreso
  const getProvinceColor = (provinceName: string) => {
    // Normalizar el nombre para evitar problemas de tildes o mayúsculas en el GeoJSON
    const normalizedName = provinceName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() || '';
    
    // Buscamos el progreso de esa provincia
    const progress = progressData[normalizedName];
    
    if (!progress || progress.percentage === 0) {
      return '#E5E7EB'; // Gris claro (0%)
    }
    
    if (progress.percentage === 100) {
      return '#059669'; // Verde vibrante (100% Completado) - emerald-600
    }
    
    // Parcialmente completado (Ej: 1-99%)
    // Calculamos la opacidad basada en el progreso
    const opacity = 0.2 + (progress.percentage / 100) * 0.6; // Rango de 0.2 a 0.8
    return `rgba(5, 150, 105, ${opacity})`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <h3 className="text-xl font-bold text-stone-800 mb-4 w-full text-left">{dict?.map?.title || 'Mapa de Progreso'}</h3>
      
      <div className="w-full h-[320px] relative bg-[#fafafa] rounded-lg border border-stone-100" data-tooltip-id="map-tooltip">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 7000,
            center: [-84.0, 9.7] // Coordenadas centrales de Costa Rica
          }}
          className="w-full h-full"
        >
          <ZoomableGroup center={[-84.0, 9.7]} zoom={1} minZoom={1} maxZoom={4}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // Ajusta 'NAME_1' según cómo se llame la propiedad de provincia en tu GeoJSON
                  const provinceName = geo.properties.NAME_1 || geo.properties.name || 'Desconocido';
                  const data = progressData[provinceName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()];
                  
                  const placesCountStr = dict?.map?.placesCount 
                    ? dict.map.placesCount.replace('{completed}', data?.completed?.toString() || '0').replace('{total}', data?.total?.toString() || '0') 
                    : `${data?.completed || 0}/${data?.total || 0} lugares`;
                  const zeroPlacesStr = dict?.map?.zeroPlaces || '0 lugares';
                  
                  const text = data ? `${provinceName}: ${placesCountStr}` : `${provinceName}: ${zeroPlacesStr}`;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => {
                        const normalized = provinceName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() || '';
                        if (onProvinceClick) onProvinceClick(normalized);
                      }}
                      onMouseEnter={() => {
                        setTooltipContent(text);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      style={{
                        default: {
                          fill: getProvinceColor(provinceName),
                          stroke: '#FFFFFF',
                          strokeWidth: 1,
                          outline: 'none',
                          transition: 'all 250ms ease'
                        },
                        hover: {
                          fill: '#10B981', // emerald-500 al hacer hover
                          stroke: '#FFFFFF',
                          strokeWidth: 2,
                          outline: 'none',
                          cursor: 'pointer',
                          transform: 'translateY(-2px)',
                        },
                        pressed: {
                          fill: '#047857', // emerald-700 al presionar
                          outline: 'none'
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Marcadores de Nodos (Centro de Provincias) */}
            {Object.entries(PROVINCE_CENTERS).map(([provName, coordinates]) => {
              const data = progressData[provName];
              if (!data) return null;
              
              const isPerfect = data.total > 0 && data.percentage === 100;
              
              return (
                <Marker 
                  key={provName} 
                  coordinates={coordinates} 
                  onClick={() => {
                    if (onProvinceClick) onProvinceClick(provName);
                  }}
                >
                  <foreignObject x="-14" y="-14" width="28" height="28" className="overflow-visible">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onProvinceClick) onProvinceClick(provName);
                      }}
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-bold cursor-pointer transition-all duration-300 hover:scale-125 shadow-sm
                        ${isPerfect 
                          ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 border border-yellow-200' 
                          : 'bg-white text-emerald-800 border-2 border-emerald-500'
                        }`}
                    >
                      {isPerfect ? '⭐' : `${data.completed}/${data.total}`}
                    </div>
                  </foreignObject>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
        
        <Tooltip id="map-tooltip" place="top" variant="dark" style={{ zIndex: 100, borderRadius: '8px', fontWeight: 'bold' }}>
          {tooltipContent}
        </Tooltip>
      </div>
    </div>
  );
}
