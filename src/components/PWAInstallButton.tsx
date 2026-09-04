import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        id="pwa-install-desktop-btn"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE9FE] text-[#5B3CC4] hover:bg-[#DDD6FE] dark:bg-[#1E1935] dark:text-[#C3C0EC] rounded-lg text-xs font-bold transition-all active:scale-95 shadow-2xs cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 animate-pulse" />
        <span>Installer l'App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          id="pwa-install-ios-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE9FE] text-[#5B3CC4] hover:bg-[#DDD6FE] dark:bg-[#1E1935] dark:text-[#C3C0EC] rounded-lg text-xs font-bold transition-all active:scale-95 shadow-2xs cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Installer l'App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-slate-100 dark:bg-[#120F20] dark:border-[#231F3A] relative animate-fade-in">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#5B3CC4]" />
                Installer sur iOS / Safari
              </h3>
              <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
                <span className="block">1. Appuyez sur le bouton <strong>Partager</strong> <span className="inline-block px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-bold font-sans">↑</span> dans la barre d'outils Safari.</span>
                <span className="block">2. Faites défiler vers le bas et sélectionnez <strong>Sur l'écran d'accueil</strong>.</span>
              </p>
              
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-[#5B3CC4] py-2 text-xs font-bold text-white hover:bg-[#4C2FB0] transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
