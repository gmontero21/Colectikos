"use server";

import prisma from '../lib/prisma';
import { mockLugares } from '../data/mockData';

import { getProvincesForLugar } from '../utils/getLugares';

export async function getCommunityRating(placeId: string, isProvincia: boolean) {
  try {
    if (isProvincia) {
      // 1. Encontrar todos los IDs de lugares que pertenecen a esta provincia
      const provinceName = getProvincesForLugar(placeId)[0];
      const placesInProvince = mockLugares.filter(
        lugar => lugar.categoria !== 'PROVINCIA' && getProvincesForLugar(lugar.id).includes(provinceName)
      ).map(l => l.id);

      if (placesInProvince.length === 0) return null;

      // 2. Obtener todas las calificaciones de esos lugares
      const ratings = await prisma.rating.findMany({
        where: {
          placeId: { in: placesInProvince }
        },
        select: { score: true }
      });

      if (ratings.length === 0) return null;

      const avg = ratings.reduce((acc: number, curr: any) => acc + curr.score, 0) / ratings.length;
      return Number(avg.toFixed(1));
    } else {
      // Calificación de un lugar específico
      const ratings = await prisma.rating.findMany({
        where: { placeId },
        select: { score: true }
      });

      if (ratings.length === 0) return null;

      const avg = ratings.reduce((acc: number, curr: any) => acc + curr.score, 0) / ratings.length;
      return Number(avg.toFixed(1));
    }
  } catch (error) {
    // Si la tabla no existe o hay error de conexión, devolvemos null para usar el mock
    return null;
  }
}

export async function getAllCommunityRatings(): Promise<Record<string, number>> {
  try {
    const allRatings = await prisma.rating.findMany({
      select: { placeId: true, score: true }
    });
    
    if (allRatings.length === 0) return {};

    const ratingMap: Record<string, number> = {};
    const sumMap: Record<string, {sum: number, count: number}> = {};
    const provSumMap: Record<string, {sum: number, count: number}> = {};

    const provIds: Record<string, string> = {
      'SAN JOSE': '1', 'ALAJUELA': '2', 'CARTAGO': '3', 
      'HEREDIA': '4', 'PUNTARENAS': '5', 'LIMON': '6', 'GUANACASTE': '7'
    };

    allRatings.forEach((r: any) => {
      // Agrupar por lugar específico
      if (!sumMap[r.placeId]) sumMap[r.placeId] = { sum: 0, count: 0 };
      sumMap[r.placeId].sum += r.score;
      sumMap[r.placeId].count += 1;

      // Agrupar por provincia
      const provNames = getProvincesForLugar(r.placeId);
      provNames.forEach(provName => {
        if (provName !== 'DESCONOCIDO' && provIds[provName]) {
          const provId = provIds[provName];
          if (!provSumMap[provId]) provSumMap[provId] = { sum: 0, count: 0 };
          provSumMap[provId].sum += r.score;
          provSumMap[provId].count += 1;
        }
      });
    });

    Object.keys(sumMap).forEach(id => {
      ratingMap[id] = Number((sumMap[id].sum / sumMap[id].count).toFixed(1));
    });

    Object.keys(provSumMap).forEach(id => {
      ratingMap[id] = Number((provSumMap[id].sum / provSumMap[id].count).toFixed(1));
    });

    return ratingMap;
  } catch (error) {
    return {};
  }
}
