'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface SwapPuzzleProps {
  imageUrl: string;
  onSolve: () => void;
}

export default function SwapPuzzle({ imageUrl, onSolve }: SwapPuzzleProps) {
  const params = useParams();
  const isEnglish = params?.lang === 'en';

  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  // Initialize and shuffle
  useEffect(() => {
    const initialPieces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const shuffled = [...initialPieces];
    
    // Ensure it's not solved initially
    while (JSON.stringify(shuffled) === JSON.stringify(initialPieces)) {
      shuffled.sort(() => Math.random() - 0.5);
    }
    setPieces(shuffled);
  }, []);

  const handlePieceClick = (index: number) => {
    if (isSolved) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      if (selectedIndex === index) {
        // Deselect if clicking the same piece
        setSelectedIndex(null);
        return;
      }

      // Swap
      const newPieces = [...pieces];
      const temp = newPieces[selectedIndex];
      newPieces[selectedIndex] = newPieces[index];
      newPieces[index] = temp;

      setPieces(newPieces);
      setSelectedIndex(null);

      // Check win condition
      const isWinner = newPieces.every((piece, i) => piece === i);
      if (isWinner) {
        setIsSolved(true);
        setTimeout(() => {
          onSolve();
        }, 600); // slight delay for visual feedback before triggering the callback
      }
    }
  };

  const instructionText = isEnglish
    ? "Tap one piece then another to swap them."
    : "Toca una pieza y luego otra para intercambiarlas.";
    
  const successText = isEnglish
    ? "Excellent! You earned 30 XP."
    : "¡Excelente! Has ganado 30 XP.";

  if (pieces.length === 0) return null; // loading state

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-5">
      <p className="text-stone-700 font-medium text-center px-4">
        {isSolved ? (
          <span className="text-emerald-600 font-bold text-lg">{successText}</span>
        ) : (
          instructionText
        )}
      </p>

      <div className="relative aspect-square w-full rounded-xl overflow-hidden border-4 border-stone-200 bg-stone-100 shadow-lg">
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
          {pieces.map((pieceValue, index) => {
            // Calculate background position based on the original piece value (0-8)
            const row = Math.floor(pieceValue / 3);
            const col = pieceValue % 3;
            
            const xPos = col * 50;
            const yPos = row * 50;

            const isSelected = selectedIndex === index;

            return (
              <div
                key={pieceValue}
                onClick={() => handlePieceClick(index)}
                className={`w-full h-full cursor-pointer transition-all duration-200 box-border ${
                  isSelected 
                    ? 'border-4 border-amber-500 scale-95 z-10 shadow-lg rounded-md' 
                    : 'border border-white/20 hover:border-white/50'
                }`}
                style={{
                  backgroundImage: `url("${encodeURI(imageUrl)}")`,
                  backgroundSize: '300% 300%',
                  backgroundPosition: `${xPos}% ${yPos}%`,
                }}
              />
            );
          })}
        </div>
        
        {isSolved && (
          <div className="absolute inset-0 z-20 bg-emerald-500/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500">
            <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3 transform transition-transform duration-500 scale-100">
              <span className="text-5xl">🏆</span>
              <h3 className="font-extrabold text-2xl text-stone-900">
                {isEnglish ? 'Resolved!' : '¡Resuelto!'}
              </h3>
              <div className="bg-emerald-100 text-emerald-700 font-bold px-4 py-1.5 rounded-full text-sm">
                +30 XP
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
