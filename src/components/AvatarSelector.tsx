import React from 'react';
import Image from 'next/image';

const AVATARS = [
  { id: '01', src: '/images/Avatars/Avatar01-mono-capuchino.png', alt: 'Mono Capuchino' },
  { id: '02', src: '/images/Avatars/Avatar02-rana-dorada.png', alt: 'Rana Dorada' },
  { id: '03', src: '/images/Avatars/Avatar03-danta.png', alt: 'Danta' },
  { id: '04', src: '/images/Avatars/Avatar04-lapa-roja.png', alt: 'Lapa Roja' },
  { id: '05', src: '/images/Avatars/Avatar05-yiguirro.png', alt: 'Yigüirro' },
  { id: '06', src: '/images/Avatars/Avatar06-perezoso-surf.png', alt: 'Perezoso Surf' },
  { id: '07', src: '/images/Avatars/Avatar07-tico100.png', alt: 'Tico' },
  { id: '08', src: '/images/Avatars/Avatar08-tica100.png', alt: 'Tica' },
  { id: '09', src: '/images/Avatars/Avatar09-rana-ojos-rojos.png', alt: 'Rana de Ojos Rojos' }
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelectAvatar: (src: string) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelectAvatar }: AvatarSelectorProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {AVATARS.map((avatar) => {
          const isSelected = selectedAvatar === avatar.src;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelectAvatar(avatar.src)}
              className={`relative rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-offset-2
                ${isSelected 
                  ? 'ring-4 ring-emerald-500 ring-offset-2 scale-110 z-10' 
                  : 'hover:scale-110 opacity-70 hover:opacity-100 hover:ring-2 hover:ring-stone-300 hover:ring-offset-1'
                }
              `}
              aria-label={`Seleccionar avatar ${avatar.alt}`}
              title={avatar.alt}
            >
              <div className="w-20 h-20 relative rounded-full overflow-hidden bg-stone-100 shadow-sm border border-stone-200">
                <Image
                  src={avatar.src}
                  alt={avatar.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, 80px"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
