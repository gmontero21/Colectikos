"use server";
import prisma from '../lib/prisma';

export async function getDbLugares() {
  try {
    const lugares = await prisma.lugar.findMany({
      where: { isVisible: true },
      select: {
        id: true,
        nombre: true,
        nombre_en: true,
        categoria: true,
        descripcion: true,
        descripcion_en: true,
        ubicacion: true,
        imagenUrl: true,
        grupo_variante: true,
      },
      orderBy: { nombre: 'asc' }
    });
    return lugares.map(l => ({
      ...l,
      imagenUrl: l.imagenUrl || '',
      grupo_variante: l.grupo_variante || undefined,
      nombre_en: l.nombre_en || undefined,
      descripcion_en: l.descripcion_en || undefined,
      ubicacion_en: undefined,
    }));
  } catch (error) {
    console.error("Error fetching places from DB:", error);
    return [];
  }
}
