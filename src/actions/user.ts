"use server";

import prisma from '../lib/prisma';
import { ensureDbUser } from './gamification';

export async function updateUserProfile(data: any, localUsername?: string) {
  try {
    const user = await ensureDbUser(localUsername);
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    console.log("UPDATE_USER_PROFILE DATA:", data);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarUrl: data.avatarUrl,
        genero: data.gender,
        rangoEdad: data.ageRange,
        provinciaResidencia: data.location,
        lugarFavorito: data.favoritePlace,
        tipoLugarPreferido: data.favoriteCategory,
        estiloViaje: data.travelStyle,
        companiaHabitual: data.travelCompany
      }
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getUserProfile(localUsername?: string) {
  try {
    const user = await ensureDbUser(localUsername);
    if (!user) return { success: false, error: 'User not found' };
    console.log("SENDING DB USER TO FRONTEND:", user);
    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: 'Internal server error' };
  }
}
