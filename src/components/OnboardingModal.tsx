'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { 
  X, 
  Map, 
  User, 
  BookOpen, 
  Unlock, 
  Gamepad2, 
  LayoutGrid, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb,
  Settings,
  Trophy,
  Sparkles
} from 'lucide-react';

const getSteps = (isEnglish: boolean, username: string) => [
  {
    id: 1,
    title: isEnglish ? `Welcome to Colectikos${username ? `, ${username}` : ''}!` : `¡Bienvenido a Colectikos${username ? `, ${username}` : ''}!`,
    desc: isEnglish ? 'Your interactive album to explore Costa Rica. Here is a quick tour to help you get the most out of your collection.' : 'Tu álbum interactivo para explorar Costa Rica. Aquí tienes un tour rápido para que le saques el máximo provecho a tu colección.',
    tip: isEnglish ? 'Takes less than 1 minute' : 'Toma menos de 1 minuto',
    icon: <Map className="w-8 h-8 text-blue-600" />,
    iconBg: 'bg-blue-100'
  },
  {
    id: 2,
    title: isEnglish ? 'Your Collector Profile' : 'Tu Perfil de Coleccionista',
    desc: isEnglish ? 'Create your Collector profile to save your progress. After entering the Album, finish personalizing it with your avatar and travel preferences.' : 'Crea tu perfil de Coleccionista para guardar tu progreso. Luego de ingresar al Álbum, termina de personalizarlo con tu ávatar y preferencias de viaje',
    tip: isEnglish ? 'Click on Settings to edit your profile' : 'Haz clic en Configuración para editar tu perfil',
    tipIcon: <Settings className="w-4 h-4 text-pink-500" />,
    tipClassName: 'bg-pink-50 text-pink-700 border-pink-100',
    icon: <User className="w-8 h-8 text-purple-600" />,
    iconBg: 'bg-purple-100'
  },
  {
    id: 3,
    title: isEnglish ? 'Navigate the Album' : 'Navegar el Álbum',
    desc: isEnglish ? 'Explore the 100 free stickers with 93 popular tourist destinations and the 7 provinces. Use the filters to search by province or category.' : 'Explorá las 100 postales gratuitas con 93 destinos turísticos populares y las 7 provincias. Usá los filtros para buscar por provincia o categoría',
    tip: isEnglish ? 'You can also use the search bar' : 'También podés usar la barra de búsqueda',
    icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
    iconBg: 'bg-emerald-100'
  },
  {
    id: 4,
    title: isEnglish ? 'Unlock Stickers' : 'Desbloquear Postales',
    desc: isEnglish ? 'Unlock the stickers of the destinations you have seen or visited. The province stickers will be colored in bronze, silver, or gold, depending on your progress.' : 'Desbloqueá las postales de los destinos que hayas visto o visitado. Las postales de las provincias se irán coloreando de bronce, plata u oro, dependiendo de tu avance',
    tip: isEnglish ? 'Every sticker brings you closer to 100%!' : '¡Cada postal te acerca al 100%!',
    icon: <Unlock className="w-8 h-8 text-amber-600" />,
    iconBg: 'bg-amber-100'
  },
  {
    id: 5,
    title: isEnglish ? '3 Game Modes' : '3 Modos de Juego',
    desc: isEnglish ? 'Choose how to collect: Curious Mode (if you just want to see the sticker), Nomad Mode (if you passed by) or Conqueror Mode (if you fully experienced the place).' : 'Elegí cómo coleccionar: Modo Curioso (si solo querés ver la postal), Modo Nómada (si lo viste de pasadita) o Modo Conquistador (si viviste el lugar a pleno)',
    tip: isEnglish ? 'Choose how you experienced the destination when unlocking each sticker' : 'Elige cómo viviste el destino al desbloquear cada postal',
    icon: <Gamepad2 className="w-8 h-8 text-rose-600" />,
    iconBg: 'bg-rose-100'
  },
  {
    id: 6,
    title: isEnglish ? 'Menus and Tools' : 'Menús y Herramientas',
    desc: isEnglish ? 'Use the main menu to access My Next Destinations, view the local recommendations directory, and check your ranking.' : 'Usá el menú principal para acceder a Mis Próximos Destinos, ver el directorio de recomendaciones locales y consultar tu ranking.',
    tip: isEnglish ? 'Everything at a tap away' : 'Todo a un toque de distancia',
    icon: <LayoutGrid className="w-8 h-8 text-indigo-600" />,
    iconBg: 'bg-indigo-100'
  },
  {
    id: 7,
    title: isEnglish ? 'Your Progress and Passport' : 'Tu Progreso y Pasaporte',
    desc: isEnglish ? 'Click on your explorer name, see your general and category progress, observe your province progress on the map.' : 'Dale clic a tu nombre de explorador, mirá tu progreso general y por categoría, observá tu progreso por provincia en el mapa',
    tip: isEnglish ? 'Export your Colectikos passport and show off your progress' : 'Exportá tu pasaporte Colectikos y presumí tu progreso',
    icon: <Trophy className="w-8 h-8 text-orange-600" />,
    iconBg: 'bg-orange-100'
  },
  {
    id: 8,
    title: isEnglish ? 'Urban Legend' : 'Leyenda Urbana',
    desc: isEnglish ? 'Legend has it that the Colectikos Album will keep growing. New destinations, new stickers to collect, new categories, and lots of healthy competition for the top spots in the rankings. Best of all, the Community will choose which destinations deserve a sticker in the album.' : 'Dice la leyenda que el Álbum de Colectikos seguirá creciendo. Nuevos destinos, nuevas postales para coleccionar, nuevas categorías y mucha competencia sana por los puestos de honor en los rankings. Lo mejor de todo es que la Comunidad es la que escogerá cuáles destinos merecen una postal en el álbum.',
    tip: isEnglish ? 'On your marks... get set... go explore!' : 'En sus marcas... listos... ¡a pasear!',
    icon: <Sparkles className="w-8 h-8 text-yellow-600" />,
    iconBg: 'bg-yellow-100'
  },
  {
    id: 9,
    title: isEnglish ? 'Ready to explore!' : '¡Listo para explorar!',
    desc: isEnglish ? 'You are now ready to start filling your album and supporting national tourism. Let the adventure begin!' : 'Ya estás preparado para empezar a llenar tu álbum y apoyar el turismo nacional. ¡Que empiece la aventura!',
    tip: isEnglish ? 'Pura vida!' : '¡Pura vida!',
    icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    iconBg: 'bg-green-100'
  }
];

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const username = user?.username || '';

  useEffect(() => {
    setIsMounted(true);
    if (typeof navigator !== 'undefined') {
      const isEnglishBrowser = navigator.language.startsWith('en');
      setIsEnglish(isEnglishBrowser);
    }
    const hasSeenTour = localStorage.getItem('hasSeenTicos100Tour');
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenTicos100Tour', 'true');
  };

  const steps = getSteps(isEnglish, username);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isMounted || !isOpen || pathname?.includes('/login') || !user) return null;

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md bg-emerald-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Imagen sutil de Otico */}
        <div className="absolute top-20 right-6 w-24 h-24 pointer-events-none opacity-80 z-0">
          <Image 
            src={isEnglish ? '/images/Imagenes_Pagina/otico_birrete_en.png' : '/images/Imagenes_Pagina/otico_birrete_es.png'}
            alt="Otico"
            fill
            className="object-contain"
          />
        </div>

        {/* Encabezado */}
        <div className="flex items-center justify-between p-6 pb-2 relative z-10">
          <span className="text-sm font-bold tracking-wider text-gray-400 uppercase">
            {isEnglish ? `Step ${currentStep + 1} of ${steps.length}` : `Paso ${currentStep + 1} de ${steps.length}`}
          </span>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label={isEnglish ? 'Close tour' : 'Cerrar tour'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 px-6 py-4 flex flex-col items-center text-center">
          <div className={`w-20 h-20 flex items-center justify-center rounded-3xl mb-6 shadow-sm ${step.iconBg}`}>
            {step.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {step.title}
          </h2>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            {step.desc}
          </p>
          
          <div className={`mt-auto mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${step.tipClassName || 'bg-slate-50 text-slate-700 border-slate-100'}`}>
            {/* @ts-ignore - tipIcon exists optionally on step */}
            {step.tipIcon || <Lightbulb className="w-4 h-4 text-amber-500" />}
            {step.tip}
          </div>
        </div>

        {/* Pie y navegación */}
        <div className="p-6 pt-2 bg-emerald-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex justify-center flex-1 gap-1.5">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-6 bg-emerald-600' 
                      : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors flex items-center justify-center border border-gray-200"
                aria-label={isEnglish ? 'Previous' : 'Anterior'}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-95 bg-emerald-600 hover:bg-emerald-500 shadow-md hover:shadow-lg"
            >
              {isFirstStep 
                ? (isEnglish ? 'Start Tour' : 'Comenzar Tour')
                : isLastStep 
                  ? (isEnglish ? "Let's Go!" : '¡Empezar!')
                  : (isEnglish ? 'Next' : 'Siguiente')}
              {!isLastStep && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
          
          {isFirstStep && (
            <button 
              onClick={handleClose}
              className="w-full mt-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isEnglish ? 'Skip tour' : 'Saltar tour'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
