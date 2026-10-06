import prisma from './src/lib/prisma';

async function resetDailyUnlocks() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const result = await prisma.userActionLog.deleteMany({
    where: {
      actionType: { in: ['UNLOCK_POSTCARD', 'SOLVE_PUZZLE'] },
      createdAt: { gte: startOfDay }
    }
  });

  const usersUpdated = await prisma.user.updateMany({
    data: {
      estampillasDisponibles: 3,
      ultimaFechaEstampillas: startOfDay
    }
  });

  console.log(`Borrados ${result.count} registros de hoy. Estampillas reseteadas a 3 para ${usersUpdated.count} usuarios.`);
  console.log('Ya puedes probar desbloquear postales y jugar el rompecabezas desde cero.');
}

resetDailyUnlocks()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
