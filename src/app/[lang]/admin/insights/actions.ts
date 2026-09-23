'use server';

import prisma from '@/lib/prisma';

export async function generateCrossInsight() {
  try {
    // Buscar la combinación más popular de provincia y preferencia
    const crossData = await prisma.user.groupBy({
      by: ['provinciaResidencia', 'tipoLugarPreferido'],
      _count: {
        id: true,
      },
      where: {
        provinciaResidencia: { not: null },
        tipoLugarPreferido: { not: null },
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10, // Tomamos varios para poder devolver uno aleatorio entre los principales
    });

    if (!crossData || crossData.length === 0) {
      return "¿Sabías que aún no hemos recolectado suficientes datos demográficos para generar este insight? ¡Pronto lo sabremos!";
    }

    // Seleccionamos uno aleatorio de entre los top 3 para dar variedad
    const randomIndex = Math.floor(Math.random() * Math.min(3, crossData.length));
    const selectedInsight = crossData[randomIndex];
    
    const count = selectedInsight._count.id;
    const provincia = selectedInsight.provinciaResidencia;
    const preferencia = selectedInsight.tipoLugarPreferido;

    // Calculamos qué porcentaje representa esto dentro de esa misma provincia
    const totalInProvince = await prisma.user.count({
      where: { provinciaResidencia: provincia },
    });

    const percentage = totalInProvince > 0 ? Math.round((count / totalInProvince) * 100) : 0;

    return `¿Sabías que el ${percentage}% de los usuarios de Colectikos que residen en ${provincia} prefieren principalmente destinos de ${preferencia}?`;
  } catch (error) {
    console.error("Error generating insight:", error);
    return "Ups, ocurrió un error al analizar la comunidad. Intenta de nuevo.";
  }
}
