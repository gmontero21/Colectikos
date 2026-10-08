"use server";

import prisma from '../lib/prisma';
import { ensureDbUser } from './gamification';

export async function updateUserProgressNote(lugarId: string, note: string, localUsername?: string, fallbackClerkId?: string) {
  try {
    const user = await ensureDbUser(localUsername, fallbackClerkId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lugarId: {
          userId: user.id,
          lugarId: lugarId,
        }
      },
      update: {
        notas: note,
      },
      create: {
        userId: user.id,
        lugarId: lugarId,
        notas: note,
        completado: true,
      }
    });

    return { success: true, progress };
  } catch (error) {
    console.error("Error updating progress note:", error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getUserProgress(localUsername?: string, fallbackClerkId?: string) {
  try {
    const user = await ensureDbUser(localUsername, fallbackClerkId);
    if (!user) return { success: false, error: 'User not found' };
    
    const checkins = await prisma.userProgress.findMany({
      where: { userId: user.id }
    });
    
    return { success: true, checkins };
  } catch (error) {
    console.error("Error fetching progress:", error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function removeUserProgress(lugarId: string, localUsername?: string, fallbackClerkId?: string) {
  try {
    const user = await ensureDbUser(localUsername, fallbackClerkId);
    if (!user) return { success: false, error: 'User not found' };

    // Check refund eligibility (1 per day)
    let refundedTicket = false;
    const now = new Date();
    const lastRefund = user.fechaDevolucionTicket ? new Date(user.fechaDevolucionTicket) : null;
    
    const canRefund = !lastRefund || 
      (lastRefund.getFullYear() !== now.getFullYear() || 
       lastRefund.getMonth() !== now.getMonth() || 
       lastRefund.getDate() !== now.getDate());

    let newTotalXp = user.xp;
    let newLevel = user.level;

    // Execute deletion and optional refund in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Delete user progress
      await tx.userProgress.delete({
        where: {
          userId_lugarId: {
            userId: user.id,
            lugarId: lugarId
          }
        }
      });

      // 2. Anti-Farming: Reverse XP if they earned any from this postcard
      const actionLog = await tx.userActionLog.findFirst({
        where: {
          userId: user.id,
          actionType: 'UNLOCK_POSTCARD',
          targetId: lugarId
        }
      });

      let xpToDeduct = 0;
      if (actionLog) {
        xpToDeduct = actionLog.xpAwarded || 0;
        await tx.userActionLog.delete({
          where: { id: actionLog.id }
        });
      }

      // 3. Update User (Refund ticket if applicable, and deduct XP)
      newTotalXp = Math.max(0, user.xp - xpToDeduct);
      newLevel = Math.floor(newTotalXp / 100) + 1;

      await tx.user.update({
        where: { id: user.id },
        data: {
          xp: newTotalXp,
          level: newLevel,
          ...(canRefund && {
            estampillasDisponibles: { increment: 1 },
            fechaDevolucionTicket: now
          })
        }
      });

      if (canRefund) {
        refundedTicket = true;
      }
    });

    return { success: true, refundedTicket, newTotalXp, newLevel };
  } catch (error) {
    console.error("Error removing progress:", error);
    return { success: false, error: 'Internal server error' };
  }
}
