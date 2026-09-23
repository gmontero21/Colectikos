"use client";

import React, { useState, useEffect } from 'react';
import { useClerk, useAuth } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthBox() {
  const clerk = useClerk();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  const pathname = usePathname();
  const currentLang = (pathname.split('/')[1] === 'en' ? 'en' : 'es');

  const dict = {
    es: {
      continueWithGoogle: 'Continuar con Google',
      continueWithApple: 'Continuar con Apple',
      orWithEmail: 'o con correo',
      fullName: 'Nombre Completo',
      username: 'Nombre de Coleccionista',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      noAccount: '¿No tienes cuenta? ',
      haveAccount: '¿Ya tienes cuenta? ',
      signUp: 'Regístrate',
      signIn: 'Inicia Sesión',
      forgotPassword: '¿Olvidaste tu contraseña?',
      usernameWarning: '⚠️ Este nombre será permanente y no podrás cambiarlo.',
      errors: {
        form_identifier_not_found: 'No pudimos encontrar tu cuenta. Verifica tu correo.',
        form_password_incorrect: 'Contraseña incorrecta. Inténtalo de nuevo.',
        form_identifier_exists: 'Ya existe una cuenta con este correo o nombre de explorador.',
        form_password_pwned: 'Esta contraseña ha sido expuesta en filtraciones de datos, elige otra.',
        form_password_length_too_short: 'La contraseña no cumple con la longitud mínima requerida.',
        form_password_validation_failed: 'La contraseña no cumple con los requisitos de complejidad (números, mayúsculas o símbolos).',
        missing_fields: 'Por favor, completa todos los campos requeridos.',
        generic_login: 'Credenciales incorrectas o error al iniciar sesión.',
        generic_signup: 'Error al registrarse. Verifica tus datos.',
        not_loaded_login: 'El sistema de inicio de sesión aún se está cargando. Espera un momento.',
        not_loaded_signup: 'El sistema de registro aún se está cargando. Espera un momento.',
        verification_required: 'La cuenta requiere verificación. Revisa tu correo.',
        additional_steps: 'Se requieren pasos adicionales para iniciar sesión.'
      }
    },
    en: {
      continueWithGoogle: 'Continue with Google',
      continueWithApple: 'Continue with Apple',
      orWithEmail: 'or with email',
      fullName: 'Full Name',
      username: 'Collector Name',
      email: 'Email Address',
      password: 'Password',
      login: 'Log In',
      register: 'Sign Up',
      noAccount: "Don't have an account? ",
      haveAccount: 'Already have an account? ',
      signUp: 'Sign up',
      signIn: 'Log in',
      forgotPassword: 'Forgot password?',
      usernameWarning: '⚠️ This name will be permanent and cannot be changed.',
      errors: {
        form_identifier_not_found: "We couldn't find your account. Please check your email.",
        form_password_incorrect: 'Incorrect password. Please try again.',
        form_identifier_exists: 'An account with this email or username already exists.',
        form_password_pwned: 'This password has been exposed in a data breach, please choose another.',
        form_password_length_too_short: 'Password does not meet the minimum length requirement.',
        form_password_validation_failed: 'Password does not meet complexity requirements.',
        missing_fields: 'Please fill in all required fields.',
        generic_login: 'Invalid credentials or error logging in.',
        generic_signup: 'Error signing up. Please check your information.',
        not_loaded_login: 'Login system is still loading. Please wait a moment.',
        not_loaded_signup: 'Sign up system is still loading. Please wait a moment.',
        verification_required: 'Account requires verification. Check your email.',
        additional_steps: 'Additional steps are required to log in.'
      }
    }
  };

  const t = dict[currentLang];

  const getErrorMessage = (err: any, fallbackKey: keyof typeof t.errors) => {
    if (err?.errors?.[0]?.code) {
      const code = err.errors[0].code as keyof typeof t.errors;
      if (t.errors[code]) {
        return t.errors[code];
      }
    }
    // Fallback a un mensaje proporcionado por Clerk si existe
    if (err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message) {
      return err.errors[0].longMessage || err.errors[0].message;
    }
    return t.errors[fallbackKey];
  };

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.push('/');
    }
  }, [isAuthLoaded, isSignedIn, router]);

  const handleSocialAuth = (strategy: 'oauth_google' | 'oauth_apple') => {
    if (!clerk.loaded) return;
    setIsLoading(true);
    clerk.client.signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !password) {
      setErrorMsg(t.errors.missing_fields);
      return;
    }

    if (!isLogin && (!fullName || !username)) {
      setErrorMsg(t.errors.missing_fields);
      return;
    }
    
    setIsLoading(true);

    if (isLogin) {
      if (!clerk.loaded) {
        setErrorMsg(t.errors.not_loaded_login);
        setIsLoading(false);
        return;
      }
      try {
        const completeSignIn = await clerk.client.signIn.create({
          identifier: email,
          password,
        });
        
        if (completeSignIn.status === 'complete') {
          await clerk.setActive({ session: completeSignIn.createdSessionId });
          router.push('/');
        } else {
          console.log("Sign in needs additional steps:", completeSignIn);
          setErrorMsg(t.errors.additional_steps);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.log("Clerk SignIn Error:", err.errors || err);
        setErrorMsg(getErrorMessage(err, 'generic_login'));
        setIsLoading(false);
      }
    } else {
      if (!clerk.loaded) {
        setErrorMsg(t.errors.not_loaded_signup);
        setIsLoading(false);
        return;
      }
      try {
        const completeSignUp = await clerk.client.signUp.create({
          emailAddress: email,
          password,
          firstName: fullName,
          username: username,
        });
        
        if (completeSignUp.status === 'complete') {
          await clerk.setActive({ session: completeSignUp.createdSessionId });
          router.push('/');
        } else {
          console.log("Sign up needs verification:", completeSignUp);
          setErrorMsg(t.errors.verification_required);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.log("Clerk SignUp Error:", err.errors || err);
        setErrorMsg(getErrorMessage(err, 'generic_signup'));
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/20">
      <div className="flex justify-center mb-6">
        <img 
          src="/images/Imagenes_Pagina/logo_colectikos_color.png" 
          alt="Colectikos" 
          width={150} className="h-24 w-auto object-contain drop-shadow-sm"
          onError={(e) => {
            e.currentTarget.src = "/images/Imagenes_Pagina/logo_colectikos_color.png";
          }}
        />
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <button 
          onClick={() => handleSocialAuth('oauth_google')}
          type="button" 
          className="flex items-center justify-center gap-3 w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t.continueWithGoogle}
        </button>

        <button 
          onClick={() => handleSocialAuth('oauth_apple')}
          type="button" 
          className="flex items-center justify-center gap-3 w-full bg-black hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.85 3.44-.79 1.63.12 2.82.78 3.55 1.83-2.95 1.74-2.4 5.53.5 6.64-.69 1.69-1.52 3.44-2.57 4.49zm-3.03-14.8c-.1-1.63 1.14-3.13 2.76-3.48.33 1.74-1.12 3.2-2.76 3.48z"/>
          </svg>
          {t.continueWithApple}
        </button>
      </div>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300/50"></div>
        <span className="flex-shrink-0 mx-4 text-gray-500 text-sm font-medium">{t.orWithEmail}</span>
        <div className="flex-grow border-t border-gray-300/50"></div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm text-center font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <>
            <div>
              <input
                type="text"
                placeholder={t.fullName}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder={t.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
              <p className="text-xs text-stone-500 mt-1.5 ml-1">{t.usernameWarning}</p>
            </div>
          </>
        )}
        
        <div>
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
          {isLogin && (
            <div className="flex justify-end mt-1">
              <button type="button" className="text-xs text-emerald-600 font-semibold hover:underline">
                {t.forgotPassword}
              </button>
            </div>
          )}
        </div>

        <div id="clerk-captcha"></div>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl mt-2 shadow-sm transition-colors flex justify-center items-center cursor-pointer relative z-50"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isLogin ? t.login : t.register}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? t.noAccount : t.haveAccount}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          type="button" 
          className="text-emerald-600 font-bold hover:underline focus:outline-none"
        >
          {isLogin ? t.signUp : t.signIn}
        </button>
      </div>
    </div>
  );
}
