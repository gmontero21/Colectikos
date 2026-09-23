export interface I18nLugar {
  id: string;
  nombre: string;
  nombre_en?: string | null;
  categoria: string;
  descripcion: string;
  descripcion_en?: string | null;
  ubicacion: string;
  imagenUrl: string | null;
  // Agrega otros campos si son necesarios
  [key: string]: any;
}

export function mapLugaresByLocale<T extends I18nLugar>(lugares: T[], locale: 'es' | 'en') {
  return lugares.map(lugar => {
    // Si el idioma es inglés, usamos los campos _en si existen. 
    // Si no existen (están vacíos o null), usamos el español por defecto (Fallback)
    const nombre = locale === 'en' && lugar.nombre_en ? lugar.nombre_en : lugar.nombre;
    const descripcion = locale === 'en' && lugar.descripcion_en ? lugar.descripcion_en : lugar.descripcion;

    // Retornamos un nuevo objeto con las propiedades mapeadas y omitiendo las originales en inglés
    const mappedLugar = {
      ...lugar,
      nombre,
      descripcion,
    };
    
    delete mappedLugar.nombre_en;
    delete mappedLugar.descripcion_en;

    return mappedLugar;
  });
}

import { mockLugares } from '../data/mockData';

export const getProvincesForLugar = (lugarId: string): string[] => {
  const original = mockLugares.find(m => m.id === lugarId);
  if (!original) return ['DESCONOCIDO'];
  
  // Las primeras 7 tarjetas son las provincias mismas
  const provinceIds: Record<string, string> = {
    '1': 'SAN JOSE',
    '2': 'ALAJUELA',
    '3': 'CARTAGO',
    '4': 'HEREDIA',
    '5': 'PUNTARENAS',
    '6': 'LIMON',
    '7': 'GUANACASTE'
  };
  if (provinceIds[lugarId]) return [provinceIds[lugarId]];

  const u = original.ubicacion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const foundProvinces: string[] = [];

  if (u.includes('SAN JOSE')) foundProvinces.push('SAN JOSE');
  if (u.includes('ALAJUELA')) foundProvinces.push('ALAJUELA');
  if (u.includes('CARTAGO')) foundProvinces.push('CARTAGO');
  if (u.includes('HEREDIA')) foundProvinces.push('HEREDIA');
  if (u.includes('GUANACASTE')) foundProvinces.push('GUANACASTE');
  if (u.includes('PUNTARENAS') || u.includes('OSA') || u.includes('GARABITO')) foundProvinces.push('PUNTARENAS');
  if (u.includes('LIMON') || u.includes('TALAMANCA') || u.includes('CAHUITA')) foundProvinces.push('LIMON');
  
  if (foundProvinces.length === 0) return ['DESCONOCIDO'];
  
  return foundProvinces;
};
