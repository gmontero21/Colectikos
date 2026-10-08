"use client";
import React, { createContext, useContext } from 'react';

import { CategoriaLugar } from '@prisma/client';

// Using the same interface format
export interface LugarContextType {
  id: string;
  nombre: string;
  nombre_en?: string | null;
  categoria: CategoriaLugar;
  descripcion: string;
  descripcion_en?: string | null;
  ubicacion: string;
  ubicacion_en?: string | null;
  imagenUrl: string;
  grupo_variante?: string;
}

const LugaresContext = createContext<{ lugares: LugarContextType[] }>({ lugares: [] });

export const LugaresProvider = ({ children, lugares }: { children: React.ReactNode, lugares: LugarContextType[] }) => {
  return <LugaresContext.Provider value={{ lugares }}>{children}</LugaresContext.Provider>;
};

export const useLugaresData = () => useContext(LugaresContext).lugares;
