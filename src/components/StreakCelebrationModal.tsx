"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Trophy, Flame, Star, Zap } from 'lucide-react';
import { useDictionary } from '../context/DictionaryContext';

interface StreakCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
}

export default function StreakCelebrationModal({ isOpen, onClose, streak }: StreakCelebrationModalProps) {
  const { width, height } = useWindowSize();
  const dict = useDictionary();
  const lang = dict?.lang || 'es';
  const [timeLeft, setTimeLeft] = useState(8);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setTimeLeft(8);
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && timeLeft === 0) {
      onClose();
    }
  }, [isOpen, timeLeft, onClose]);

  const getMilestoneMessage = (streakValue: number) => {
    if (lang === 'en') {
      switch (streakValue) {
        case 5: return "You're on fire! 5 days in a row! \uD83D\uDD25";
        case 10: return "Double digits! 10 days of adventure! \uD83C\uDF1F";
        case 15: return "Unstoppable! 15 consecutive days! \u26A1";
        case 20: return "Legendary! 20 days exploring Costa Rica! \uD83C\uDFC6";
        default: return `Amazing! ${streakValue} days streak! \uD83C\uDF89`;
      }
    } else {
      switch (streakValue) {
        case 5: return "\u00A1Est\u00E1s que ardes! \u00A15 d\u00EDas seguidos! \uD83D\uDD25";
        case 10: return "\u00A1Doble d\u00EDgito! \u00A110 d\u00EDas de aventura! \uD83C\uDF1F";
        case 15: return "\u00A1Imparable! \u00A115 d\u00EDas consecutivos! \u26A1";
        case 20: return "\u00A1Legendario! \u00A120 d\u00EDas explorando Costa Rica! \uD83C\uDFC6";
        default: return `\u00A1Incre\u00EDble! \u00A1Racha de ${streakValue} d\u00EDas! \uD83C\uDF89`;
      }
    }
  };

  const getIcon = (streakValue: number) => {
    switch (streakValue) {
      case 5: return <Flame className="w-16 h-16 text-orange-500" />;
      case 10: return <Star className="w-16 h-16 text-yellow-400" />;
      case 15: return <Zap className="w-16 h-16 text-emerald-400" />;
      case 20: return <Trophy className="w-16 h-16 text-yellow-500" />;
      default: return <Flame className="w-16 h-16 text-orange-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.15}
          colors={['#f97316', '#fbbf24', '#34d399', '#ffffff']}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-sm bg-gradient-to-b from-orange-50 to-orange-100 rounded-[2.5rem] p-8 shadow-2xl border-4 border-white flex flex-col items-center text-center overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/50 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-200/50 rounded-full blur-3xl -ml-10 -mb-10" />

          {/* Icon Badge */}
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
            className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 relative z-10 border-4 border-orange-50"
          >
            {getIcon(streak)}
          </motion.div>

          {/* Number */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-7xl font-black text-orange-600 drop-shadow-sm mb-2"
          >
            {streak}
          </motion.h2>

          {/* Subtitle */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-bold text-stone-800 mb-6 uppercase tracking-wider"
          >
            {lang === 'en' ? 'Day Streak!' : '\u00A1D\u00EDas de Racha!'}
          </motion.h3>

          {/* Dynamic Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-stone-600 font-medium leading-relaxed mb-8 relative z-10"
          >
            {getMilestoneMessage(streak)}
          </motion.p>

          {/* Continue Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-[0_8px_0_0_rgba(234,88,12,1)] hover:shadow-[0_4px_0_0_rgba(234,88,12,1)] hover:translate-y-1 transition-all relative z-10"
          >
            {lang === 'en' ? 'Continue' : 'Continuar'} ({timeLeft}s)
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
