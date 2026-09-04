import React from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg border border-amber-400/20 transition-all duration-300 animate-bounce">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>
      <div className="flex items-center gap-1.5">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Mode Hors-ligne — Navigation dans les données chargées activée</span>
      </div>
    </div>
  );
};
