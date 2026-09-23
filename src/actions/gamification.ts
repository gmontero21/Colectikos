"use server";

import prisma from '../lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

async function ensureDbUser(localUsername?: string) {
  let clerkId = null;
  let clerkUser = null;
  try {
    const authResult = await auth();
    clerkId = authResult.userId;
    if (clerkId) {
      clerkUser = await currentUser();
    }
  } catch (e) {
    console.warn("Clerk context not found.");
  }

  let dbUser = null;

  if (clerkId) {
    dbUser = await prisma.user.findFirst({ where: { username: clerkId } });
    if (!dbUser) {
      dbUser = await prisma.user.findUnique({ where: { id: clerkId } });
    }
  }

  const targetUsername = localUsername || clerkUser?.username || clerkId;

  if (!dbUser && targetUsername) {
    dbUser = await prisma.user.findUnique({ where: { username: targetUsername } });
  }

  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress;
  if (!dbUser && clerkEmail) {
    dbUser = await prisma.user.findUnique({ where: { email: clerkEmail } });
    
    // Auto-update username if it differs from the desired target
    if (dbUser && targetUsername && dbUser.username !== targetUsername) {
      try {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: { username: targetUsername }
        });
        console.log(`Username actualizado a ${targetUsername}`);
      } catch (e) {
        console.warn("No se pudo actualizar el username (posible colisión)", e);
      }
    }
  }

  // Lazy Sync: Si el usuario no existe en Prisma, lo creamos dinámicamente
  if (!dbUser && (clerkId || targetUsername)) {
    const fallbackUsername = targetUsername || `user_${Date.now()}`;
    const fallbackEmail = clerkEmail || `${fallbackUsername}@colectikos.local`;
    
    try {
      dbUser = await prisma.user.create({
        data: {
          id: clerkId || undefined,
          username: fallbackUsername,
          email: fallbackEmail,
          passwordHash: 'clerk_or_local_auth',
          name: clerkUser?.firstName || fallbackUsername,
          xp: 0,
          level: 1
        }
      });
      console.log(`Usuario ${fallbackUsername} sincronizado en Prisma.`);
    } catch (e) {
      console.error("Error al hacer Lazy Sync del usuario:", e);
      // Intentar recuperarlo de nuevo por si hubo carrera de concurrencia
      dbUser = await prisma.user.findUnique({ where: { username: fallbackUsername } });
    }
  }

  return dbUser;
}

/**
 * Registra la visita a un lugar y otorga XP según las reglas anti-farming y anti-speedrunners.
 * @param lugarId ID del lugar descubierto.
 * @param mode Modo de juego (Curioso, Nómada, Conquistador).
 * @param localUsername Nombre de usuario del local storage como fallback (opcional).
 */
export async function checkInAndAwardXP(lugarId: string, mode: string, localUsername?: string) {
  try {
    const dbUser = await ensureDbUser(localUsername);

    if (!dbUser) {
      return { success: false, error: 'Usuario no autenticado o imposible de sincronizar con BD' };
    }

    const userId = dbUser.id;

    // 2. Ejecutar Transacción Segura
    const result = await prisma.$transaction(async (tx: any) => {
      // Garantizar que el Lugar exista en la base de datos (Lazy Seed) para evitar error P2003
      const existingLugar = await tx.lugar.findUnique({ where: { id: lugarId } });
      if (!existingLugar) {
        await tx.lugar.create({
          data: {
            id: lugarId,
            nombre: `Lugar Local ${lugarId}`, // El UI usará mockLugares, esto solo satisface FK
            categoria: 'PROVINCIA', 
            descripcion: 'Auto-generado para satisfacer integridad referencial',
            ubicacion: 'Costa Rica',
            isVisible: false
          }
        });
      }

      // Verificar si ya existe en UserProgress
      const existingProgress = await tx.userProgress.findUnique({
        where: {
          userId_lugarId: {
            userId,
            lugarId
          }
        }
      });

      if (!existingProgress) {
        await tx.userProgress.create({
          data: {
            userId,
            lugarId,
            completado: true,
            fechaCompletado: new Date()
          }
        });
      }

      // Reglas Anti-Farming: Verificar si ya obtuvo XP por esta postal
      const existingLog = await tx.userActionLog.findFirst({
        where: {
          userId,
          actionType: 'UNLOCK_POSTCARD',
          targetId: lugarId
        }
      });

      if (existingLog) {
        // Ya ganó XP por este lugar antes
        return { success: true, xpAwarded: 0, newTotalXp: dbUser!.xp, newLevel: dbUser!.level, limitReached: false };
      }

      // Reglas Anti-Speedrunners: Contar cuantas postales ha desbloqueado HOY
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const unlocksToday = await tx.userActionLog.count({
        where: {
          userId,
          actionType: 'UNLOCK_POSTCARD',
          createdAt: { gte: startOfDay }
        }
      });

      let xpAwarded = 0;
      let limitReached = false;
      if (unlocksToday === 0 || unlocksToday === 1) {
        xpAwarded = 50; // 1era y 2da postal = 100%
      } else if (unlocksToday === 2) {
        xpAwarded = 25; // 3era postal = 50%
      } else {
        xpAwarded = 0; // 4ta en adelante = 0 XP
        limitReached = true;
      }

      let newTotalXp = dbUser!.xp;
      let newLevel = dbUser!.level;

      if (xpAwarded > 0) {
        newTotalXp += xpAwarded;
        // Fórmula básica temporal: cada 100 XP = 1 nivel
        newLevel = Math.floor(newTotalXp / 100) + 1;

        // Registrar Log
        await tx.userActionLog.create({
          data: {
            userId,
            actionType: 'UNLOCK_POSTCARD',
            targetId: lugarId,
            xpAwarded
          }
        });

        // Actualizar Usuario
        await tx.user.update({
          where: { id: userId },
          data: {
            xp: newTotalXp,
            level: newLevel
          }
        });
      }

      return { success: true, xpAwarded, newTotalXp, newLevel, limitReached };
    });

    return result;

  } catch (error: any) {
    console.error("Error en checkInAndAwardXP:", error);
    return { success: false, error: error.message || 'Ocurrió un error al registrar el progreso y XP' };
  }
}

export async function getUserGamification(localUsername?: string) {
  try {
    const dbUser = await ensureDbUser(localUsername);
    if (!dbUser) return { xp: 0, level: 1 };

    return { xp: dbUser.xp, level: dbUser.level };
  } catch (error) {
    return { xp: 0, level: 1 };
  }
}

/**
 * Registra una calificación de postal y otorga XP según las reglas.
 */
export async function rateAndAwardXP(lugarId: string, score: number, localUsername?: string) {
  try {
    const dbUser = await ensureDbUser(localUsername);
    if (!dbUser) {
      return { success: false, error: 'Usuario no autenticado o imposible de sincronizar con BD' };
    }

    const userId = dbUser.id;

    const result = await prisma.$transaction(async (tx: any) => {
      // Lazy Seed para lugarId por si acaso no existe (integridad referencial)
      const existingLugar = await tx.lugar.findUnique({ where: { id: lugarId } });
      if (!existingLugar) {
        await tx.lugar.create({
          data: {
            id: lugarId,
            nombre: `Lugar Local ${lugarId}`,
            categoria: 'PROVINCIA', 
            descripcion: 'Auto-generado para satisfacer integridad referencial',
            ubicacion: 'Costa Rica',
            isVisible: false
          }
        });
      }

      // Upsert Rating
      await tx.rating.upsert({
        where: {
          userId_placeId: {
            userId,
            placeId: lugarId
          }
        },
        update: { score },
        create: {
          userId,
          placeId: lugarId,
          score
        }
      });

      // Verificar si ya ganó XP por calificar esta postal específica
      const existingLog = await tx.userActionLog.findFirst({
        where: {
          userId,
          actionType: 'RATE_DESTINATION',
          targetId: lugarId
        }
      });

      if (existingLog) {
        // Ya ganó XP por calificar esto antes, o ya está registrado (re-calificación)
        return { success: true, xpAwarded: 0, newTotalXp: dbUser.xp, newLevel: dbUser.level, limitReached: false };
      }

      // Reglas Anti-Farming (Límites diarios de calificación con XP)
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const ratingsToday = await tx.userActionLog.count({
        where: {
          userId,
          actionType: 'RATE_DESTINATION',
          createdAt: { gte: startOfDay }
        }
      });

      let xpAwarded = 0;
      let limitReached = false;
      if (ratingsToday === 0 || ratingsToday === 1) {
        xpAwarded = 20; // 1era y 2da = 100%
      } else if (ratingsToday === 2) {
        xpAwarded = 10; // 3era = 50%
      } else {
        xpAwarded = 0; // 4ta en adelante = 0
        limitReached = true;
      }

      let newTotalXp = dbUser.xp;
      let newLevel = dbUser.level;

      if (xpAwarded > 0) {
        newTotalXp += xpAwarded;
        newLevel = Math.floor(newTotalXp / 100) + 1;

        await tx.userActionLog.create({
          data: {
            userId,
            actionType: 'RATE_DESTINATION',
            targetId: lugarId,
            xpAwarded
          }
        });

        await tx.user.update({
          where: { id: userId },
          data: { xp: newTotalXp, level: newLevel }
        });
      }

      return { success: true, xpAwarded, newTotalXp, newLevel, limitReached };
    });

    return result;

  } catch (error: any) {
    console.error("Error en rateAndAwardXP:", error);
    return { success: false, error: error.message || 'Ocurrió un error al registrar la calificación' };
  }
}

export async function recordDailyLogin(localUsername?: string) {
  try {
    const dbUser = await ensureDbUser(localUsername);
    if (!dbUser) return { success: false, error: 'Usuario no autenticado' };

    const userId = dbUser.id;
    
    // Convertir a Hora de Costa Rica (GMT-6)
    const getCRDateString = (date: Date) => {
      const crTime = new Date(date.getTime() - (6 * 60 * 60 * 1000));
      return crTime.toISOString().split('T')[0];
    };

    const now = new Date();
    const todayStr = getCRDateString(now);
    const lastLoginDate = dbUser.lastLoginDate;
    
    if (lastLoginDate) {
      const lastLoginStr = getCRDateString(lastLoginDate);
      if (todayStr === lastLoginStr) {
        // Ya registró su ingreso hoy
        return { success: true, xpAwarded: 0, currentStreak: dbUser.currentStreak };
      }
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("Usuario no encontrado");

      let newStreak = user.currentStreak;
      let xpAwarded = 10;
      let isConsecutive = false;

      if (user.lastLoginDate) {
        const lastLoginDateObj = new Date(user.lastLoginDate);
        const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        const yesterdayStr = getCRDateString(yesterday);
        const lastLoginStr = getCRDateString(lastLoginDateObj);

        if (lastLoginStr === yesterdayStr) {
          isConsecutive = true;
        }
      }

      if (isConsecutive) {
        newStreak += 1;
        // 10 base + 5 por cada día de racha (Max 50)
        xpAwarded = Math.min(10 + (newStreak * 5), 50);
      } else {
        newStreak = 1; // Se rompió la racha o primera vez
        xpAwarded = 10;
      }

      const newLongestStreak = Math.max(user.longestStreak, newStreak);
      const newTotalXp = user.xp + xpAwarded;
      const newLevel = Math.floor(newTotalXp / 100) + 1;

      await tx.userActionLog.create({
        data: {
          userId,
          actionType: 'DAILY_LOGIN',
          targetId: 'daily_login',
          xpAwarded
        }
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastLoginDate: now,
          xp: newTotalXp,
          level: newLevel
        }
      });

      return { 
        success: true, 
        xpAwarded, 
        currentStreak: newStreak, 
        newTotalXp, 
        newLevel 
      };
    });

    return result;

  } catch (error: any) {
    console.error("Error en recordDailyLogin:", error);
    return { success: false, error: error.message || 'Ocurrió un error al registrar el ingreso' };
  }
}
