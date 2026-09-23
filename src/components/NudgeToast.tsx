"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface NudgeToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function NudgeToast({ message, isVisible, onClose }: NudgeToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] flex animate-fade-in-up justify-center sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md">
      <div className="flex w-full items-start rounded-lg bg-emerald-600 p-4 shadow-lg ring-1 ring-emerald-700 sm:w-auto">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 inline-flex shrink-0 rounded-md text-emerald-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600"
        >
          <span className="sr-only">Close</span>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
