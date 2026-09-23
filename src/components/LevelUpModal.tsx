"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import { useDictionary } from '../context/DictionaryContext';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newRank: string;
}

export default function LevelUpModal({ isOpen, onClose, newRank }: LevelUpModalProps) {
  const dict = useDictionary();

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti when modal opens
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#f59e0b', '#3b82f6']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#f59e0b', '#3b82f6']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-stone-100 text-center z-10"
          >
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Trophy size={40} className="text-yellow-500 drop-shadow-md" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-stone-900 mb-2">{dict?.levelUpModal?.congratulations || '¡Felicidades!'}</h2>
            <p className="text-stone-500 mb-6 font-medium">{dict?.levelUpModal?.achievement_unlocked || 'Has alcanzado un nuevo rango en tu colección.'}</p>
            
            <div className="bg-emerald-50 rounded-2xl py-4 px-6 mb-8 border border-emerald-100">
              <p className="text-sm text-emerald-800 font-semibold mb-1">{dict?.levelUpModal?.rank_achieved || 'Nuevo Rango'}</p>
              <p className="text-2xl font-bold text-emerald-600">{newRank}</p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
            >
              {dict?.levelUpModal?.close || '¡Pura Vida!'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
