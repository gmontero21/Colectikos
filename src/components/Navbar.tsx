"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { Leaf, UserCircle, LogOut, Search, Menu, X, ChevronDown, Globe, Settings, Compass, HelpCircle } from 'lucide-react';
import { mockLugares } from '../data/mockData';
import { calcularNivel } from '../utils/gamification';
import { useProgress } from '../context/ProgressContext';
import SearchBar from './SearchBar';
import toast from 'react-hot-toast';

export default function Navbar({ dict, dictLevels }: { dict: any; dictLevels?: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const [username, setUsername] = useState<string>('Coleccionista');
  const [userGender, setUserGender] = useState<string>('Masculino');

  useEffect(() => {
    const loadAvatar = () => {
      try {
        const saved = localStorage.getItem('userProfileData');
        if (saved) {
          const data = JSON.parse(saved);
          if (data.avatarUrl) {
            setAvatarUrl(data.avatarUrl);
          }
          if (data.username) {
            setUsername(data.username);
          } else if (isLoaded && user?.username) {
            setUsername(user.username);
          }
          if (data.gender) {
            setUserGender(data.gender);
          }
        } else if (isLoaded && user?.username) {
          setUsername(user.username);
        }
      } catch (e) {
        console.error("Error loading profile from localStorage:", e);
      }
    };

    // Cargar al montar el componente
    loadAvatar();

    // Escuchar actualizaciones (cuando se guarda el formulario)
    window.addEventListener('profileUpdated', loadAvatar);
    return () => window.removeEventListener('profileUpdated', loadAvatar);
  }, [isLoaded, user]);

  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { completedPlaces, xp, level, currentStreak } = useProgress();
  const baseLugares = mockLugares.filter(l => l.categoria !== 'PROVINCIA');
  const totalGlobal = baseLugares.length;
  const completadosGlobal = baseLugares.filter(l => completedPlaces.includes(l.id)).length;
  const porcentajeGlobal = Math.round((completadosGlobal / totalGlobal) * 100) || 0;

  const { titulo: globalTitle } = calcularNivel(porcentajeGlobal, userGender.toUpperCase(), dictLevels);

  const isEn = pathname.startsWith('/en');
  const currentLang = isEn ? 'en' : 'es';

  const handleLanguageChange = (targetLocale: string) => {
    const currentPath = pathname.replace(/^\/en/, '') || '/';

    let targetPath = currentPath;
    if (targetLocale === 'en') {
      targetPath = `/en${currentPath === '/' ? '' : currentPath}`;
    }

    toast.loading('Cambiando idioma...', { duration: 1000 });
    // Delegamos la creación de la cookie al servidor (Backend) mediante una API Route.
    // Esto es vital porque Safari y otros navegadores a veces ignoran 'document.cookie'
    // si se establece desde el cliente, pero NUNCA ignoran una cabecera HTTP 'Set-Cookie'.
    window.location.href = `/api/set-language?lang=${targetLocale}&redirect=${encodeURIComponent(targetPath)}`;
  };

  const handlePlaceholderClick = (e: React.MouseEvent, feature: string) => {
    e.preventDefault();
    toast.success(`La sección "${feature}" estará disponible pronto.`, {
      icon: '🚧',
    });
  };

  const handleLogout = async () => {
    // Guardar el flag del tour
    const hasSeenTour = localStorage.getItem('hasSeenTicos100Tour');
    
    // Limpiar toda la memoria local (sesión y perfil)
    localStorage.clear();
    sessionStorage.clear();
    
    // Restaurar el flag del tour para que no lo vuelva a ver
    if (hasSeenTour) {
      localStorage.setItem('hasSeenTicos100Tour', hasSeenTour);
    }

    toast.success('Cerrando sesión...');
    
    // Cerrar sesión en Clerk y redirigir
    await signOut({ redirectUrl: '/' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* LADO IZQUIERDO: Logo (Mascota) e Inicio */}
          <Link
            href="/"
            title={dict?.home || "Inicio"}
            className="flex items-end gap-4 flex-shrink-0 group cursor-pointer h-full relative"
          >
            <div className="w-24 lg:w-40 h-full relative">
              <img
                src="/images/Imagenes_Pagina/otico-manitas-banner.PNG"
                alt="Mascota Tico100"
                className="absolute -bottom-2 lg:-bottom-4 left-0 w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ transformOrigin: 'bottom center' }}
              />
            </div>
            <span className="hidden md:block pb-2 lg:pb-3 text-base lg:text-lg font-bold text-stone-500 group-hover:text-emerald-700 transition-colors">
              {dict?.home || "Inicio"}
            </span>
          </Link>

          {/* LADO DERECHO: Menús Desktop */}
          <div className="hidden lg:flex flex-col justify-center items-end h-full w-full">

            {/* Nivel Superior (Secundario) */}
            <div className="flex items-center gap-6 mb-2 mt-3 border-b border-stone-100 pb-2 w-full justify-end">
              {/* Buscador Integrado */}
              <SearchBar lugares={mockLugares} />

              {/* Idioma - Dropdown */}
              <div className="flex items-center gap-1.5 text-stone-500 hover:text-emerald-700 cursor-pointer transition-colors text-sm font-medium group relative py-2">
                <Globe size={16} />
                <span>{dict?.language || 'Language'}</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 pt-2 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden flex flex-col">
                    <button
                      onClick={() => handleLanguageChange('es')}
                      className={`px-4 py-2 text-left w-full transition-colors hover:bg-stone-50 hover:text-emerald-700 ${!isEn ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-700'}`}
                    >
                      Español
                    </button>
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`px-4 py-2 text-left w-full transition-colors hover:bg-stone-50 hover:text-emerald-700 ${isEn ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-700'}`}
                    >
                      English
                    </button>
                  </div>
                </div>
              </div>

              {/* Configuración */}
              <Link href="/settings" className="flex items-center gap-1.5 text-stone-500 hover:text-emerald-700 cursor-pointer transition-colors text-sm font-medium group relative py-2">
                <Settings size={16} />
                <span>{dict?.settings || 'Configuración'}</span>
              </Link>

              <div className="w-px h-5 bg-stone-300 mx-2"></div>

              {/* Funcionalidad Preservada: Perfil de Usuario con Nivel XP */}
              <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="text-right flex flex-col items-end justify-center">
                  <div className="flex items-center gap-1.5">
                    {currentStreak > 0 && (
                      <span className="flex items-center text-[10px] font-black text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/50 shadow-sm" title={`Racha de ${currentStreak} días seguidos`}>
                        {currentStreak} <span className="ml-0.5 opacity-90">🔥</span>
                      </span>
                    )}
                    <p className="text-sm font-bold text-stone-800 whitespace-nowrap">{username}</p>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 whitespace-nowrap">{globalTitle} - {xp} XP</p>
                </div>
                <div className="relative">
                  {avatarUrl ? (
                    <div className="w-8 h-8 relative rounded-full overflow-hidden border border-stone-200">
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <UserCircle size={32} className="text-stone-300" />
                  )}
                  {/* Mini-Indicador de Nivel */}
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {level}
                  </div>
                </div>
              </Link>
              <Link 
                href={`/${currentLang}/nuestra-app?tab=instrucciones`} 
                className="text-stone-400 hover:text-emerald-600 transition-colors cursor-pointer"
                title="¿Cómo funcionan las rachas y niveles?"
              >
                <HelpCircle size={16} />
              </Link>

              {/* Funcionalidad Preservada: Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-stone-500 hover:text-emerald-700 transition-colors font-medium text-sm"
              >
                <LogOut size={16} />
                <span>{dict?.logout || 'Salir'}</span>
              </button>
            </div>

            {/* Nivel Inferior (Principal) */}
            <div className="flex items-center gap-8 text-stone-700 font-semibold text-base mt-2">
              <Link href="/nuestra-app" className="hover:text-emerald-700 transition-colors">{dict?.ourApp || 'Nuestra App'}</Link>
              <div className="relative group py-2">
                <Link href="/#mis-destinos" className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                  {dict?.destinations || 'Destinos'} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>
                <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden flex flex-col">
                    <Link
                      href={`/${currentLang}/provincias`}
                      className="px-4 py-2 text-left w-full transition-colors hover:bg-stone-50 hover:text-emerald-700 text-stone-700 font-medium border-b border-stone-50"
                    >
                      {dict?.provinces || 'Provincias'}
                    </Link>
                    <Link
                      href={`/${currentLang}/destinos-visitados`}
                      className="px-4 py-2 text-left w-full transition-colors hover:bg-stone-50 hover:text-emerald-700 text-stone-700 font-medium border-b border-stone-50"
                    >
                      {dict?.visitedDestinations || 'Mis Destinos Visitados'}
                    </Link>
                    <Link
                      href={`/${currentLang}/proximos-destinos`}
                      className="px-4 py-2 text-left w-full transition-colors hover:bg-stone-50 hover:text-emerald-700 text-stone-700 font-medium"
                    >
                      {dict?.upcomingDestinations || 'Mis Próximos Destinos'}
                    </Link>
                  </div>
                </div>
              </div>
              <Link href={`/${currentLang}/community`} className="hover:text-emerald-700 transition-colors">{dict?.community || 'Comunidad'}</Link>
              <Link href={`/${currentLang}/contact`} className="hover:text-emerald-700 transition-colors">{dict?.contact || 'Contacto'}</Link>
            </div>

          </div>

          {/* Menú Hamburguesa (Mobile) */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Racha Móvil */}
            {currentStreak > 0 && (
              <div className="flex items-center text-[10px] font-black text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/50 shadow-sm" title={`Racha de ${currentStreak} días`}>
                {currentStreak} <span className="ml-0.5 opacity-90">🔥</span>
              </div>
            )}
            {/* Perfil minimizado en móvil con Nivel */}
            <Link href="/profile" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer relative">
              {avatarUrl ? (
                <div className="w-8 h-8 relative rounded-full overflow-hidden border border-stone-200">
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ) : (
                <UserCircle size={32} className="text-stone-300" />
              )}
              {/* Mini-Indicador de Nivel (Mobile) */}
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                {level}
              </div>
            </Link>
            <Link 
              href={`/${currentLang}/nuestra-app?tab=instrucciones`} 
              className="text-stone-400 hover:text-emerald-600 transition-colors cursor-pointer"
              title="¿Cómo funcionan las rachas y niveles?"
            >
              <HelpCircle size={16} />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-stone-600 hover:text-emerald-700 hover:bg-stone-100 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Desplegable Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 shadow-lg absolute w-full left-0">
          <div className="px-4 pt-4 pb-6 space-y-4">

            {/* Opciones Principales */}
            <div className="flex flex-col space-y-4 pb-4 border-b border-stone-100">
              <Link href="/nuestra-app" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-800 font-semibold hover:text-emerald-700 block text-lg">{dict?.ourApp || 'Nuestra App'}</Link>
              <div className="space-y-2">
                <Link href="/#mis-destinos" onClick={() => setIsMobileMenuOpen(false)} className="text-stone-800 font-semibold hover:text-emerald-700 block text-lg">{dict?.destinations || 'Destinos'}</Link>
                <div className="pl-4 border-l-2 border-stone-100 flex flex-col gap-3 mt-2">
                  <Link href={`/${currentLang}/provincias`} onClick={() => setIsMobileMenuOpen(false)} className="text-stone-600 font-medium hover:text-emerald-700 block text-base">
                    {dict?.provinces || 'Provincias'}
                  </Link>
                  <Link href={`/${currentLang}/destinos-visitados`} onClick={() => setIsMobileMenuOpen(false)} className="text-stone-600 font-medium hover:text-emerald-700 block text-base">
                    {dict?.visitedDestinations || 'Mis Destinos Visitados'}
                  </Link>
                  <Link href={`/${currentLang}/proximos-destinos`} onClick={() => setIsMobileMenuOpen(false)} className="text-stone-600 font-medium hover:text-emerald-700 block text-base">
                    {dict?.upcomingDestinations || 'Mis Próximos Destinos'}
                  </Link>
                </div>
              </div>
              <Link href={`/${currentLang}/community`} onClick={() => setIsMobileMenuOpen(false)} className="text-stone-800 font-semibold hover:text-emerald-700 block text-lg">{dict?.community || 'Comunidad'}</Link>
              <Link href={`/${currentLang}/contact`} onClick={() => setIsMobileMenuOpen(false)} className="text-stone-800 font-semibold hover:text-emerald-700 block text-lg">{dict?.contact || 'Contacto'}</Link>

            </div>

            {/* Opciones Secundarias */}
            <div className="flex flex-col space-y-4 pb-4 border-b border-stone-100">
              <div
                className="flex items-center gap-3 text-stone-600 hover:text-emerald-700 cursor-pointer font-medium"
                onClick={(e) => handlePlaceholderClick(e, 'Buscar')}
              >
                <Search size={20} />
                <span>Buscar</span>
              </div>

              {/* Idioma - Expandable en Móvil */}
              <div>
                <div
                  className="flex items-center gap-3 text-stone-600 hover:text-emerald-700 cursor-pointer font-medium"
                  onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
                >
                  <Globe size={20} />
                  <span>{dict?.language || 'Language'}</span>
                  <ChevronDown size={16} className={`ml-auto transition-transform duration-200 ${isMobileLangOpen ? 'rotate-180' : ''}`} />
                </div>
                {isMobileLangOpen && (
                  <div className="mt-2 ml-8 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        handleLanguageChange('es');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left font-medium text-sm py-2 px-3 rounded-md transition-colors ${!isEn ? 'bg-emerald-50 text-emerald-800' : 'text-stone-500 hover:bg-stone-50'}`}
                    >
                      Español
                    </button>
                    <button
                      onClick={() => {
                        handleLanguageChange('en');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left font-medium text-sm py-2 px-3 rounded-md transition-colors ${isEn ? 'bg-emerald-50 text-emerald-800' : 'text-stone-500 hover:bg-stone-50'}`}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>
              <Link href="/settings" className="flex items-center gap-3 text-stone-600 hover:text-emerald-700 cursor-pointer font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <Settings size={20} />
                <span>{dict?.settings || 'Configuración'}</span>
              </Link>
            </div>

            {/* Perfil Completo & Logout en Móvil */}
            <div className="flex flex-col space-y-4 pt-2">
              <Link href="/profile" className="flex items-center gap-3 bg-stone-50 p-3 rounded-lg border border-stone-100">
                {avatarUrl ? (
                  <div className="w-7 h-7 relative rounded-full overflow-hidden border border-stone-200">
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <UserCircle size={28} className="text-stone-500" />
                )}
                <div>
                  <p className="text-base font-bold text-stone-800">{username}</p>
                  <p className="text-sm font-semibold text-emerald-600">{globalTitle} - {porcentajeGlobal}% Tico</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 text-stone-500 hover:text-emerald-700 font-medium py-2 w-full"
              >
                <LogOut size={20} />
                <span>{dict?.logout || 'Cerrar Sesión'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
