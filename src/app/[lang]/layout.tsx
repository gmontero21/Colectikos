import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "100% Tico",
  applicationName: "Colectikos",
  description: "Conquistando el país más bello del mundo",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Colectikos",
  },
  icons: {
    icon: '/images/icon-192x192.png',
    apple: '/images/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

import { ProgressProvider } from "../../context/ProgressContext";
import { DictionaryProvider } from "../../context/DictionaryContext";
import { Toaster } from 'react-hot-toast';
import { Toaster as SonnerToaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from "../../components/Navbar";
import InstallBanner from "../../components/InstallBanner";
import { getDictionary } from "../../dictionaries/getDictionary";
import WelcomeModal from "../../components/WelcomeModal";
import OnboardingModal from "../../components/OnboardingModal";

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'es' | 'en';
  const dict = await getDictionary(lang);
  // @ts-ignore - Agregamos lang dinámicamente al diccionario
  dict.lang = lang;

  return (
    <ClerkProvider>
      <html lang={resolvedParams.lang} suppressHydrationWarning>
        <body className={`${inter.className} text-stone-800 antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
          {/* Textura sutil de ruido para emular papel/acuarela */}
          <div 
            className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-multiply"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
          ></div>
          
          {/* Envoltorio principal para asegurar que el contenido quede por encima de la textura */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <DictionaryProvider dict={dict}>
              <ProgressProvider>
              <Navbar dict={dict.navbar} dictLevels={dict.levels} />
              <InstallBanner />
              <WelcomeModal />
              <OnboardingModal />
              {children}
              <Toaster 
                position="bottom-right"
              toastOptions={{
                duration: 10000,
                className: 'font-semibold',
                style: {
                  borderRadius: '16px',
                  background: '#333',
                  color: '#fff',
                }
              }}
            />
            <SonnerToaster position="bottom-center" richColors />
              </ProgressProvider>
            </DictionaryProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
