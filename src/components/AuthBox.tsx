"use client";

import React, { useEffect, useState } from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/nextjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import esDict from '../dictionaries/es.json';
import enDict from '../dictionaries/en.json';

export default function AuthBox() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = pathname.split('/')[1] === 'en' ? 'en' : 'es';
  const redirectTarget = currentLang === 'en' ? '/en' : '/';

  const mode = searchParams.get('mode');
  const [isSignUp, setIsSignUp] = useState(mode === 'signup' || mode === 'sign-up');
  
  // Términos de uso state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Diccionario para los términos
  const t = currentLang === 'en' ? enDict.terminos : esDict.terminos;
  const termsSections = [
    { title: t.sec1Title, desc: t.sec1Desc },
    { title: t.sec2Title, desc: t.sec2Desc },
    { title: t.sec3Title, desc: t.sec3Desc },
    { title: t.sec4Title, desc: t.sec4Desc },
    { title: t.sec5Title, desc: t.sec5Desc },
    { title: t.sec6Title, desc: t.sec6Desc },
    { title: (t as any).sec7Title, desc: (t as any).sec7Desc },
    { title: (t as any).sec8Title, desc: (t as any).sec8Desc },
    { title: (t as any).sec9Title, desc: (t as any).sec9Desc },
    { title: (t as any).sec10Title, desc: (t as any).sec10Desc },
    { title: (t as any).sec11Title, desc: (t as any).sec11Desc },
    { title: (t as any).sec12Title, desc: (t as any).sec12Desc },
  ].filter(s => s.title && s.desc);

  const handleOverlayClick = () => {
    if (!acceptedTerms) {
      setShowTermsError(true);
      setTimeout(() => setShowTermsError(false), 2500);
    }
  };

  useEffect(() => {
    setIsSignUp(mode === 'signup' || mode === 'sign-up');
  }, [mode]);

  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.push(redirectTarget);
    }
  }, [isAuthLoaded, isSignedIn, router, redirectTarget]);

  const appearance = {
    layout: {
      socialButtonsPlacement: 'top' as const,
      socialButtonsVariant: 'blockButton' as const,
      logoImageUrl: '/images/Imagenes_Pagina/logo_colectikos_color.PNG',
    },
    variables: {
      colorPrimary: '#059669',
      colorText: '#1c1917',
      colorTextSecondary: '#78716c',
      colorBackground: 'rgba(255, 255, 255, 0.92)',
      colorInputBackground: 'rgba(255, 255, 255, 0.8)',
      colorInputText: '#1c1917',
      borderRadius: '0.75rem',
      fontFamily: 'inherit',
    },
    elements: {
      rootBox: 'w-full max-w-md mx-auto',
      cardBox: 'w-full shadow-2xl rounded-3xl',
      card: 'bg-white/85 backdrop-blur-md shadow-2xl border border-white/30 rounded-3xl p-6 sm:p-8',
      logoImage: 'h-20 w-auto object-contain mx-auto mb-2 drop-shadow-sm',
      headerTitle: 'text-2xl font-bold text-stone-800 text-center',
      headerSubtitle: 'text-sm text-stone-600 text-center',
      socialButtonsBlockButton: 'border border-gray-200 bg-white/80 hover:bg-white text-stone-700 font-medium py-2.5 rounded-xl transition-all shadow-sm',
      socialButtonsBlockButtonText: 'font-medium text-stone-700',
      formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-base',
      footerActionLink: 'text-emerald-600 font-bold hover:underline',
      formFieldInput: 'bg-white/70 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2.5 transition-all text-stone-800',
      formFieldLabel: 'text-stone-700 font-medium text-sm mb-1',
      dividerLine: 'bg-gray-300/60',
      dividerText: 'text-stone-400 text-xs uppercase font-semibold',
      identityPreviewText: 'text-stone-800 font-medium',
      identityPreviewEditButtonIcon: 'text-emerald-600',
      formResendCodeLink: 'text-emerald-600 font-semibold hover:underline',
      otpCodeFieldInput: 'border-gray-200 focus:border-emerald-500 rounded-xl',
      footer: 'pt-2',
    }
  };

  const loginUrl = currentLang === 'en' ? '/en/login' : '/login';
  const signUpUrl = `${loginUrl}?mode=signup`;

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {isSignUp ? (
        <div className="w-full flex flex-col gap-4">
          {/* Checkbox de Términos */}
          <div className={`p-4 rounded-2xl bg-white/85 backdrop-blur-md border ${showTermsError ? 'border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' : 'border-white/40 shadow-sm'} transition-all duration-300 w-full`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (e.target.checked) setShowTermsError(false);
                }}
                className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 shrink-0 cursor-pointer shadow-sm"
              />
              <span className="text-sm text-stone-700 font-medium leading-tight pt-0.5">
                {currentLang === 'en' ? (
                  <>I have read and understood the <button type="button" onClick={() => setShowTermsModal(true)} className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">Terms of Use</button></>
                ) : (
                  <>He leído y comprendido los <button type="button" onClick={() => setShowTermsModal(true)} className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">Términos de Uso</button></>
                )}
              </span>
            </label>
            {showTermsError && (
              <p className="mt-2 text-xs text-red-500 font-bold ml-8">
                {currentLang === 'en' ? 'You must accept the terms to continue.' : 'Debes aceptar los términos para continuar.'}
              </p>
            )}
          </div>

          <div className="relative w-full">
            <div className={`transition-all duration-300 ${!acceptedTerms ? 'opacity-60 grayscale-[0.3]' : ''}`}>
              <SignUp
                routing="hash"
                signInUrl={loginUrl}
                fallbackRedirectUrl={redirectTarget}
                forceRedirectUrl={redirectTarget}
                appearance={appearance}
              />
            </div>
            {/* Overlay para bloquear interacción si no ha aceptado términos */}
            {!acceptedTerms && (
              <div 
                className="absolute inset-0 z-10 cursor-not-allowed rounded-3xl" 
                onClick={handleOverlayClick}
                title={currentLang === 'en' ? 'Please accept the Terms of Use first' : 'Por favor acepta los Términos de Uso primero'}
              />
            )}
          </div>
        </div>
      ) : (
        <SignIn
          routing="hash"
          signUpUrl={signUpUrl}
          fallbackRedirectUrl={redirectTarget}
          forceRedirectUrl={redirectTarget}
          appearance={appearance}
        />
      )}

      {/* Leyenda de longitud mínima de contraseña */}
      <div className="mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-sm text-xs text-stone-600 font-medium max-w-sm text-center">
        <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>
          {currentLang === 'en'
            ? 'Password must have a minimum of 10 characters.'
            : 'La contraseña debe tener una longitud mínima de 10 caracteres.'}
        </span>
      </div>

      {/* Modal de Términos de Uso */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-24 pb-8 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl max-h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 sm:p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h2 className="text-xl sm:text-2xl font-serif italic text-emerald-900 font-bold">{t.title}</h2>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-stone-400 hover:text-stone-700 bg-white hover:bg-stone-100 p-2 rounded-full transition-colors border border-stone-200 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-left custom-scrollbar">
              {termsSections.map((sec, idx) => (
                <section key={idx} className="border-b border-stone-100 pb-5 last:border-0 last:pb-0">
                  <h3 className="text-emerald-800 font-bold text-lg mb-2">{sec.title}</h3>
                  <p className="text-stone-600 leading-relaxed text-sm">{sec.desc}</p>
                </section>
              ))}
            </div>
            
            <div className="p-5 border-t border-stone-100 bg-stone-50 flex justify-end">
              <button 
                onClick={() => {
                  setShowTermsModal(false);
                  setAcceptedTerms(true);
                  setShowTermsError(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {currentLang === 'en' ? 'Accept & Close' : 'Aceptar y Cerrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
