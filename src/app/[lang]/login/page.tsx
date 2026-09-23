"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AuthBox from '../../../components/AuthBox';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" 
      style={{ 
        backgroundImage: 'url(/images/Imagenes_Pagina/collage-postales-horizontal.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundAttachment: 'fixed' 
      }}
    >
      <LanguageSwitcher className="top-6 right-6 xl:top-[6.5rem] xl:right-[1rem]" />

      {/* Elemento Decorativo (Mascota Otico) */}
      <img 
        src="/images/Imagenes_Pagina/Otico%20senalando.png" 
        alt="Otico señalando" 
        style={{
          position: 'fixed',
          top: '9.5rem',
          right: '5rem',
          width: '360px',
          zIndex: 90,
          pointerEvents: 'none'
        }}
        className="hidden xl:block drop-shadow-2xl"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full flex justify-center mt-12 md:mt-0"
      >
        <AuthBox />
      </motion.div>
    </div>
  );
}
