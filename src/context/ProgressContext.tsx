"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import LevelUpModal from '../components/LevelUpModal';
import NudgeToast from '../components/NudgeToast';
import { calcularNivel } from '../utils/gamification';
import { mockLugares } from '../data/mockData';
import { getAllCommunityRatings } from '../actions/ratings';
import { checkInAndAwardXP, rateAndAwardXP, getUserGamification, recordDailyLogin } from '../actions/gamification';
import { toast as sonnerToast } from 'sonner';
import { useUser } from '@clerk/nextjs';

interface ProgressContextType {
  completedPlaces: string[];
  placeDetails: Record<string, { date: string; note: string }>;
  unlockModes: Record<string, string>;
  handleCheckIn: (id: string) => void;
  handleCheckInWithMode: (id: string, mode: string) => void;
  updatePlaceDetails: (id: string, date: string, note: string) => void;
  bucketList: string[];
  toggleBucketList: (id: string) => void;
  communityRatings: Record<string, number>;
  xp: number;
  level: number;
  currentStreak: number;
  handleRate: (id: string, score: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

import { useDictionary } from './DictionaryContext';

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedPlaces, setCompletedPlaces] = useState<string[]>([]);
  const [placeDetails, setPlaceDetails] = useState<Record<string, { date: string; note: string }>>({});
  const [unlockModes, setUnlockModes] = useState<Record<string, string>>({});
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [communityRatings, setCommunityRatings] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newRankTitle, setNewRankTitle] = useState('');
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeMessage, setNudgeMessage] = useState('');
  const [pendingNudge, setPendingNudge] = useState<string | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);

  const { user, isLoaded: clerkLoaded } = useUser();
  const dict = useDictionary();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!clerkLoaded) return;
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadProgress = async () => {
      // 1. Cargar rápido de localStorage (UI instantánea)
      try {
        const saved = localStorage.getItem('tico100_progress');
        if (saved) {
          setCompletedPlaces(JSON.parse(saved));
        }
        const savedDetails = localStorage.getItem('tico100_place_details');
        if (savedDetails) {
          setPlaceDetails(JSON.parse(savedDetails));
        }
        const savedBucketList = localStorage.getItem('tico100_bucket_list');
        if (savedBucketList) {
          setBucketList(JSON.parse(savedBucketList));
        }
        const savedUnlockModes = localStorage.getItem('tico100_unlock_modes');
        if (savedUnlockModes) {
          setUnlockModes(JSON.parse(savedUnlockModes));
        }
      } catch (e) {
        console.error("Error accessing localStorage", e);
      }

      // 2. Sincronizar con la Base de Datos (PostgreSQL) si hay usuario logueado
      const token = localStorage.getItem('token');
      
      let localUsername = user?.username || undefined;
      const profileData = localStorage.getItem('userProfileData');
      if (profileData) {
        try {
          const parsed = JSON.parse(profileData);
          if (parsed.username) localUsername = parsed.username;
        } catch (e) {}
      }

      try {
        const gamificationData = await getUserGamification(localUsername);
        if (gamificationData) {
          setXp(gamificationData.xp);
          setLevel(gamificationData.level);
        }
      } catch (e) {
        console.error("Error fetching gamification data", e);
      }

      if (token) {
        try {
          const res = await fetch('http://192.168.86.99:5001/api/progress/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.checkins) {
              const dbCompleted: string[] = [];
              const dbDetails: Record<string, { date: string; note: string }> = {};
              
              data.checkins.forEach((item: any) => {
                dbCompleted.push(item.lugarId);
                if (item.notas || item.fechaCompletado) {
                  dbDetails[item.lugarId] = {
                    date: item.fechaCompletado ? new Date(item.fechaCompletado).toISOString().split('T')[0] : '',
                    note: item.notas || ''
                  };
                }
              });

              setCompletedPlaces(dbCompleted);
              setPlaceDetails(dbDetails);
            }
          }
        } catch (e) {
          console.error("Error fetching progress from backend", e);
        }
      }
      
      // 3. Obtener calificaciones de la comunidad para todos los lugares de un solo golpe (Lazy Bulk Fetch)
      try {
        const ratings = await getAllCommunityRatings();
        if (ratings) {
          setCommunityRatings(ratings);
        }
      } catch (e) {
        console.error("Error fetching community ratings", e);
      }
      
      // 4. Registrar Ingreso Diario (Daily Login Streak)
      if (token || localUsername) {
        try {
          const loginRes = await recordDailyLogin(localUsername);
          if (loginRes?.success) {
            setCurrentStreak(loginRes.currentStreak || 0);
            
            if (loginRes.xpAwarded && loginRes.xpAwarded > 0) {
              if ('newTotalXp' in loginRes && loginRes.newTotalXp !== undefined) {
                setXp(loginRes.newTotalXp);
              }
              if ('newLevel' in loginRes && loginRes.newLevel !== undefined) {
                setLevel(loginRes.newLevel);
              }
              
              sonnerToast.success(`¡Bienvenido de vuelta! Racha de ${loginRes.currentStreak} días 🔥. +${loginRes.xpAwarded} XP ganados`, {
                position: 'top-center',
                duration: 5000,
              });
            }
          }
        } catch (e) {
          console.error("Error al registrar daily login", e);
        }
      }

      setIsLoaded(true);
    };

    loadProgress();
  }, [clerkLoaded, user]);

  useEffect(() => {
    // Guardar en localStorage cuando cambie, solo después de cargar
    if (isLoaded) {
      localStorage.setItem('tico100_progress', JSON.stringify(completedPlaces));
      localStorage.setItem('tico100_place_details', JSON.stringify(placeDetails));
      localStorage.setItem('tico100_bucket_list', JSON.stringify(bucketList));
      localStorage.setItem('tico100_unlock_modes', JSON.stringify(unlockModes));
    }
  }, [completedPlaces, placeDetails, bucketList, unlockModes, isLoaded]);

  const toggleBucketList = (id: string) => {
    setBucketList(prev => {
      if (prev.includes(id)) {
        return prev.filter(placeId => placeId !== id);
      }
      if (prev.length >= 4) {
        toast.error(dict?.toast?.bucketListLimit || 'Solo puedes tener 4 próximos destinos en tu lista. Desmarca uno para agregar este.', { id: 'bucket-limit' });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleCheckInWithMode = (id: string, mode: string) => {
    setUnlockModes(prev => ({ ...prev, [id]: mode }));
    handleCheckIn(id, mode);
  };

  const handleRate = async (id: string, score: number) => {
    try {
      let localUsername = user?.username || undefined;
      const profileData = localStorage.getItem('userProfileData');
      if (profileData) {
        try {
          const parsed = JSON.parse(profileData);
          if (parsed.username) localUsername = parsed.username;
        } catch (e) {}
      }
      if (!localUsername) {
        localUsername = localStorage.getItem('localUsername') || undefined;
      }

      const res = await rateAndAwardXP(id, score, localUsername);
      
      if (res.success && 'xpAwarded' in res) {
        if (res.xpAwarded && res.xpAwarded > 0) {
          setXp(res.newTotalXp || xp);
          setLevel(res.newLevel || level);
          sonnerToast.success(`¡Calificación registrada! +${res.xpAwarded} XP`, {
            description: `Tu XP total: ${res.newTotalXp} (Nivel ${res.newLevel})`
          });
        } else if (res.limitReached) {
          sonnerToast.info(dict?.gamification?.toastRatingLimit || "¡Qué gran aporte a la comunidad! 🗣️ Ya ganaste todo el XP posible por tus 3 primeras calificaciones de hoy. Podés seguir dejando tus estrellas para recomendar lugares, pero los XP regresarán hasta mañana.", {
            duration: 8000
          });
        } else {
          // Ya lo había calificado hoy (no da puntos) pero fue exitoso
          sonnerToast.success('¡Calificación guardada!', {
            description: 'Las actualizaciones de calificación no otorgan XP extra.'
          });
        }
      } else if (!res.success && 'error' in res) {
        console.error("rateAndAwardXP Error:", res.error);
        sonnerToast.error(`Error: ${res.error}`);
      }
    } catch (error) {
      console.error('Error al calificar lugar:', error);
      sonnerToast.error('No se pudo guardar la calificación.');
    }
  };

  const handleCheckIn = async (id: string, customMode?: string) => {
    const isRemoving = completedPlaces.includes(id);
    const newState = isRemoving 
      ? completedPlaces.filter(placeId => placeId !== id)
      : [...completedPlaces, id];

    // Animaciones de recompensa solo cuando se añade un lugar nuevo
    if (!isRemoving) {
      // Remover del bucket list si está presente
      setBucketList(prev => prev.filter(placeId => placeId !== id));

      // Extraer género para textos dinámicos (Tico/Tica)
      let userGender = 'MASCULINO';
      try {
        const profileData = localStorage.getItem('userProfileData');
        if (profileData) {
          const parsed = JSON.parse(profileData);
          if (parsed.gender && parsed.gender.toUpperCase() === 'FEMENINO') {
            userGender = 'FEMENINO';
          }
        }
      } catch (e) {}
      
      const ticoLabel = userGender === 'FEMENINO' ? 'Tica' : 'Tico';

      // Lógica de Primera Postal (Global y por Categoría)
      const currentPlace = mockLugares.find(l => l.id === id);
      
      if (currentPlace) {
        const cat = currentPlace.categoria;
        const placesInCat = mockLugares.filter(l => l.categoria === cat);
        const completedInCat = placesInCat.filter(l => completedPlaces.includes(l.id));

        if (completedPlaces.length === 0) {
          const rawMsg = dict?.toast?.firstGlobal || `¡Felicidades! Has iniciado tu colección 100% {tico}. 🎉`;
          toast.success(rawMsg.replace('{tico}', ticoLabel), { icon: '🇨🇷', id: 'first-global' });
        } else if (completedInCat.length === 0) {
          const label = dict?.categories?.[cat] || cat;
          const toastMsg = dict?.toast?.firstCat?.replace('{category}', label) || `¡Primer paso en ${label}! Has iniciado esta categoría. 🌟`;
          toast.success(toastMsg, { icon: '🏆', id: `first-${cat}` });
        }
      }

      // Detectar subida de nivel
      const baseLugares = mockLugares.filter(l => l.categoria !== 'PROVINCIA');
      const totalGlobal = baseLugares.length;
      const oldPercentage = Math.round((baseLugares.filter(l => completedPlaces.includes(l.id)).length / totalGlobal) * 100) || 0;
      const newPercentage = Math.round((baseLugares.filter(l => newState.includes(l.id)).length / totalGlobal) * 100) || 0;
      
      const { titulo: oldTitle } = calcularNivel(oldPercentage, userGender, dict?.levels);
      const { titulo: newTitle } = calcularNivel(newPercentage, userGender, dict?.levels);

      let willShowLevelUp = false;
      if (newTitle !== oldTitle) {
        setNewRankTitle(newTitle);
        setShowLevelUp(true);
        willShowLevelUp = true;
      }

      // Nudge variant logic
      if (currentPlace && currentPlace.grupo_variante) {
        const twin = mockLugares.find(l => l.grupo_variante === currentPlace.grupo_variante && l.id !== currentPlace.id);
        if (twin && !newState.includes(twin.id)) { // only suggest if twin is NOT collected yet
          const twinCategoryLabel = dict?.categories?.[twin.categoria] || twin.categoria;
          let nudgeMsg = dict?.toast?.nudgeVariant || "¡Felicidades! Si hiciste una visita completa, recuerda que también puedes desbloquear la postal de este destino en la categoría {Categoria_Gemela}.";
          nudgeMsg = nudgeMsg.replace("{Categoria_Gemela}", twinCategoryLabel);
          
          if (willShowLevelUp) {
            setPendingNudge(nudgeMsg);
          } else {
            setNudgeMessage(nudgeMsg);
            setShowNudge(true);
          }
        }
      }
      
      // DISPARAR SERVER ACTION XP Y BD
      try {
        let localUsername = user?.username || undefined;
        const profileData = localStorage.getItem('userProfileData');
        if (profileData) {
          try {
            const parsed = JSON.parse(profileData);
            if (parsed.username) localUsername = parsed.username;
          } catch (e) {}
        }

        const modeToSave = customMode || unlockModes[id] || 'CURIOSO';
        const res = await checkInAndAwardXP(id, modeToSave, localUsername);
        
        if (res.success && 'xpAwarded' in res) {
          if (res.xpAwarded && res.xpAwarded > 0) {
            setXp(res.newTotalXp || xp);
            setLevel(res.newLevel || level);
            const titleRaw = dict?.toast?.destinationDiscovered || `¡Destino descubierto! +{xp} XP`;
            const descRaw = dict?.toast?.totalXp || `Tu XP total: {total} (Nivel {level})`;
            const finalTitle = titleRaw.replace('{xp}', res.xpAwarded.toString());
            const finalDesc = descRaw
              .replace('{total}', res.newTotalXp.toString())
              .replace('{level}', res.newLevel.toString());

            sonnerToast.success(finalTitle, {
              description: finalDesc,
            });
          } else if (res.limitReached) {
            sonnerToast.info(dict?.gamification?.toastPostcardLimit || "¡Llevala suave y disfruta el paisaje! 🌴 Ya alcanzaste el límite de XP de hoy. A partir de tu cuarta postal ya no sumás XP, pero podés seguir coleccionando y sumando descubrimientos a tu álbum. ¡Mañana recargamos el XP!", {
              duration: 8000
            });
          }
        } else if (!res.success && 'error' in res) {
          console.error("checkInAndAwardXP Error:", res.error);
          sonnerToast.error(`Error: ${res.error}`);
        }
      } catch (err) {
        console.error("Error llamando a checkInAndAwardXP:", err);
        sonnerToast.error(`Excepción: ${err}`);
      }
    }

    setCompletedPlaces(newState);
  };

  const updatePlaceDetails = async (id: string, date: string, note: string) => {
    // 1. Actualización optimista en el estado local (UI instantánea)
    setPlaceDetails(prev => ({
      ...prev,
      [id]: { date, note }
    }));

    // 2. Persistencia asíncrona en la Base de Datos
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Failsafe para usuarios no logueados (se guarda en local)
      
      const res = await fetch(`http://192.168.86.99:5001/api/progress/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notas: note })
      });

      if (!res.ok) {
        console.error('Error al persistir la bitácora en la BD');
      }
    } catch (e) {
      console.error('Error de red al guardar la bitácora', e);
    }
  };

  return (
    <ProgressContext.Provider value={{ completedPlaces, placeDetails, unlockModes, bucketList, handleCheckIn, handleCheckInWithMode, updatePlaceDetails, toggleBucketList, communityRatings, xp, level, currentStreak, handleRate }}>
      {children}
      <LevelUpModal 
        isOpen={showLevelUp} 
        onClose={() => {
          setShowLevelUp(false);
          if (pendingNudge) {
            setTimeout(() => {
              setNudgeMessage(pendingNudge);
              setShowNudge(true);
              setPendingNudge(null);
            }, 500);
          }
        }} 
        newRank={newRankTitle}
      />
      <NudgeToast 
        isVisible={showNudge} 
        message={nudgeMessage} 
        onClose={() => setShowNudge(false)} 
      />
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
