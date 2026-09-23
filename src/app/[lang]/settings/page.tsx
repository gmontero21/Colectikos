"use client";

import React, { useState, useEffect } from 'react';
import ProfileForm, { FormData } from '@/components/ProfileForm';
import { useUser } from '@clerk/nextjs';

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [initialData, setInitialData] = useState<Partial<FormData> | null>(null);

  useEffect(() => {
    // Intentar cargar de localStorage primero (simulando fetch a BD)
    try {
      const saved = localStorage.getItem('userProfileData');
      if (saved) {
        setInitialData(JSON.parse(saved));
        return;
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e);
    }
    if (!isLoaded) return;

    // Datos por defecto si es la primera vez
    setInitialData({
      avatarType: 'default',
      avatarUrl: '',
      username: user?.username || user?.firstName || '',
      gender: '',
      ageRange: '',
      location: '',
      favoritePlace: '',
      favoriteCategory: '',
      travelStyle: '',
      travelCompany: ''
    });
  }, [isLoaded, user]);

  if (!initialData || !isLoaded) {
    return <div className="min-h-screen bg-stone-50 py-12 flex justify-center items-center text-stone-500 font-medium">Cargando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <ProfileForm initialData={initialData} />
    </div>
  );
}
