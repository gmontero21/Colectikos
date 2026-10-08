import React from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, RotateCcw } from 'lucide-react';

interface ConfirmRemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  canRefundTicket: boolean;
  isSpanish: boolean;
}

export default function ConfirmRemoveModal({ isOpen, onClose, onConfirm, canRefundTicket, isSpanish }: ConfirmRemoveModalProps) {
  if (!isOpen) return null;

  const content = {
    es: {
      withRefund: {
        title: "¡Uy! ¿Dedazo? 😅",
        desc: "¿Querés quitar este destino de tu álbum? Te devolvemos tu tiquete para que podás usarlo en otro lugar. (Te queda 1 devolución disponible hoy).",
        cancel: "Cancelar",
        confirm: "Sí, quitar y recuperar tiquete",
        icon: <RotateCcw size={24} className="text-orange-500" />
      },
      noRefund: {
        title: "¿Seguro que querés quitarlo? 🗑️",
        desc: "Ya usaste tu devolución de tiquete del día. Podés quitar esta postal de tu álbum, pero no vas a recuperar el tiquete que usaste para desbloquearla.",
        cancel: "Cancelar",
        confirm: "Sí, quitar sin reembolso",
        icon: <Trash2 size={24} className="text-red-500" />
      }
    },
    en: {
      withRefund: {
        title: "Oops! Fat finger? 😅",
        desc: "Do you want to remove this destination from your album? We'll give you your ticket back so you can use it somewhere else. (You have 1 return available today).",
        cancel: "Cancel",
        confirm: "Yes, remove & refund ticket",
        icon: <RotateCcw size={24} className="text-orange-500" />
      },
      noRefund: {
        title: "Are you sure? 🗑️",
        desc: "You've already used your daily ticket return. You can remove this postcard from your album, but you won't get the ticket back.",
        cancel: "Cancel",
        confirm: "Yes, remove without refund",
        icon: <Trash2 size={24} className="text-red-500" />
      }
    }
  };

  const text = isSpanish 
    ? (canRefundTicket ? content.es.withRefund : content.es.noRefund)
    : (canRefundTicket ? content.en.withRefund : content.en.noRefund);

  return typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 w-full max-w-sm relative flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors shrink-0"
        >
          <X size={18} />
        </button>
        
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
          {text.icon}
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight leading-tight mb-3">
          {text.title}
        </h2>
        
        <p className="text-stone-500 text-sm mb-6 leading-relaxed">
          {text.desc}
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-sm transition-all hover:scale-[1.02] ${
              canRefundTicket ? "bg-orange-500 hover:bg-orange-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {text.confirm}
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-all"
          >
            {text.cancel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;
}
