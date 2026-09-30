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

    await prisma.userProgress.delete({
      where: {
        userId_lugarId: {
          userId: user.id,
          lugarId: lugarId
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error removing progress:", error);
    return { success: false, error: 'Internal server error' };
  }
}
