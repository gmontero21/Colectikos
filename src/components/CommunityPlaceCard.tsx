"use client";

import React from 'react';
import Image from 'next/image';
//import { CommunityPost } from '@prisma/client';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import { Lugar } from '../data/mockData';

interface CommunityPlaceCardProps {
  lugar: Lugar;
  post?: any | null;
  rotationClass?: string;
  nameToUse: string;
  index: number;
}

export default function CommunityPlaceCard({ lugar, post, rotationClass = '', nameToUse, index }: CommunityPlaceCardProps) {
  
  if (!post) {
    return (
      <div className={`bg-stone-50 p-2.5 rounded-sm shadow-sm border border-stone-200 flex flex-col group transition-all duration-300 relative ${rotationClass} z-0`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-stone-200/60 border-2 border-stone-300 flex flex-col items-center justify-center">
           
           {/* Sticker Number in corner */}
           <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center border border-stone-400">
             <span className="text-stone-500 font-bold text-xs">{index + 1}</span>
           </div>

           <div className="w-16 h-16 border-2 border-dashed border-stone-400 rounded-full flex flex-col items-center justify-center mb-4 opacity-40">
             <ImageIcon className="text-stone-500 mb-1" size={24} />
           </div>
           
           {/* Panini-style subtle place name */}
           <div className="absolute bottom-6 w-full text-center px-4">
               <p className="text-stone-400/80 font-bold uppercase tracking-widest text-sm drop-shadow-sm font-sans" style={{ letterSpacing: '0.15em' }}>
                 {nameToUse}
               </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-2.5 rounded-sm shadow-lg border border-gray-100 flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative ${rotationClass} hover:rotate-0 hover:scale-105 hover:z-10`}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 border-2 border-stone-100 flex flex-col">
        
        {/* Sticker Number in corner - Collected */}
        <div className="absolute top-2 left-2 z-20 w-6 h-6 rounded-full bg-emerald-500/80 backdrop-blur-sm flex items-center justify-center border border-white/50 shadow-sm">
          <span className="text-white font-bold text-xs">{index + 1}</span>
        </div>

        {post.imageUrl ? (
          <Image 
            src={post.imageUrl} 
            alt={nameToUse}
            fill
            className="object-cover object-center text-transparent transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-200">
            <span className="text-stone-400 opacity-50">Sin imagen</span>
          </div>
        )}
        
        {/* Information Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-stone-900/20 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col justify-end p-5">
          <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <span className="inline-block px-2.5 py-1 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider rounded mb-2">
              {lugar.categoria.replace(/_/g, ' ')}
            </span>
            <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 mb-2">
                {nameToUse}
            </h3>
            {post.caption && (
                <p className="text-stone-200 text-xs mb-4 line-clamp-3 leading-relaxed font-serif italic border-l-2 border-stone-500 pl-2">
                "{post.caption}"
                </p>
            )}
            
            <div className="bg-white/10 p-3 rounded mb-4 border-l-2 border-emerald-400 relative">
              <p className="text-stone-400 text-[9px] uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5">
                <MapPin size={10} /> Fotografía por
              </p>
              <div className="text-stone-200 text-xs font-sans not-italic truncate">
                 {post.userId}
              </div>
              <p className="text-emerald-300/80 mt-1 text-[10px] font-sans not-italic font-bold">
                 {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
