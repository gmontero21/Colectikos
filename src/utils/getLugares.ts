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

export const getProvincesForLugar = (lugarId: string, lugares: any[]): string[] => {
  const original = lugares.find(m => m.id === lugarId);
  if (!original) return ['DESCONOCIDO'];
  
  // Las primeras 7 tarjetas son las provincias mismas
  // (Asumiendo que las provincias todavía usan IDs específicos o sus nombres son provincias)
  const provinceIds: Record<string, string> = {
    '1': 'SAN JOSE',
    '2': 'ALAJUELA',
    '3': 'CARTAGO',
    '4': 'HEREDIA',
    '5': 'PUNTARENAS',
    '6': 'LIMON',
    '7': 'GUANACASTE',
    '02fc1b3b-b760-4147-8b83-e399ebb37d6d': 'ALAJUELA',
    '07df42c0-6718-4f55-8117-0bfbaac31f52': 'CARTAGO',
    '11da2126-5b32-4e46-bb18-2e06f236e7a2': 'PUNTARENAS',
    '831a297e-cc7e-490d-b4b3-c1573887b471': 'HEREDIA',
    '95781a7b-e7b3-406a-a28a-c603a15dc45d': 'SAN JOSE',
    'ca1a7872-9cc9-4504-8da0-afb8da3724c0': 'LIMON',
    'd8cdaef3-99d8-4f24-bc71-12ec3d1a8e27': 'GUANACASTE'
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
