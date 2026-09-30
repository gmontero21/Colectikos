"use client";

import React, { useEffect, useState } from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/nextjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function AuthBox() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = pathname.split('/')[1] === 'en' ? 'en' : 'es';
  const redirectTarget = currentLang === 'en' ? '/en' : '/';

  const mode = searchParams.get('mode');
  const [isSignUp, setIsSignUp] = useState(mode === 'signup' || mode === 'sign-up');

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
        <SignUp
          routing="hash"
          signInUrl={loginUrl}
          fallbackRedirectUrl={redirectTarget}
          forceRedirectUrl={redirectTarget}
          appearance={appearance}
        />
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
    </div>
  );
}
