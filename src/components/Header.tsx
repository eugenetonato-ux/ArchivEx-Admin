import React, { useState, useEffect } from 'react';
import { Menu, Plus, RefreshCw, Sparkles, Bell, CheckCircle2, Clock, Search, X, Sun, Moon, Maximize2, Minimize2 } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  onOpenMobileMenu: () => void;
  onMouseEnterMenu?: () => void;
  onMouseLeaveMenu?: () => void;
  onNewRessource?: () => void;
  onNewUe?: () => void;
  onRefresh?: () => void;
  pendingCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  onMouseEnterMenu,
  onMouseLeaveMenu,
  onNewRessource,
  onNewUe,
  onRefresh,
  pendingCount = 0,
  searchQuery = '',
  onSearchChange,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Erreur d'activation du plein écran : ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleRefreshClick = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-[#5B3CC4] border-b border-[#4C2FB0] px-3.5 sm:px-6 py-2 flex items-center justify-between transition-colors shadow-2xs text-white"
    >
      <div className="flex items-center gap-2.5">
        <button
          id="menu-toggle-btn"
          onClick={onOpenMobileMenu}
          onMouseEnter={onMouseEnterMenu || onOpenMobileMenu}
          onMouseLeave={onMouseLeaveMenu}
          className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs shrink-0"
          aria-label="Ouvrir le menu"
          title="Ouvrir le menu (survol automatique ou clic)"
        >
          <Menu className="w-4 h-4 text-white" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-white truncate max-w-[120px] md:max-w-none">{title}</h1>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs shrink-0">
              <Clock className="w-2.5 h-2.5 text-slate-950" />
              {pendingCount} en attente
            </span>
          )}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-white/60 group-focus-within:text-violet-600 transition-colors">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Rechercher UE, code, titre..."
            className="w-full pl-8 pr-7 py-1.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder-white/50 focus:placeholder-slate-400 rounded-xl border border-white/10 focus:border-white text-xs font-semibold focus:outline-hidden transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => onSearchChange?.('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-white/60 hover:text-white focus:text-slate-950 group-focus-within:text-slate-400 group-focus-within:hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Dark Mode Toggle */}
        <button
          id="header-dark-mode-toggle"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
          className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-violet-100" />
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          id="header-fullscreen-toggle"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Quitter le plein écran' : 'Passer en plein écran'}
          className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-violet-100" />
          ) : (
            <Maximize2 className="w-4 h-4 text-violet-100" />
          )}
        </button>

        {onRefresh && (
          <button
            id="header-refresh-btn"
            onClick={handleRefreshClick}
            title="Rafraîchir"
            className="px-2 py-1 text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs active:scale-[0.98]"
          >
            <RefreshCw className={`w-3 h-3 transition-transform duration-500 ${isRefreshing ? 'rotate-180 text-white' : ''}`} />
            <span className="hidden md:inline">Actualiser</span>
          </button>
        )}

        {onNewUe && (
          <button
            id="header-new-ue-btn"
            onClick={onNewUe}
            className="px-2.5 py-1 text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-2xs active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span className="hidden xs:inline">Nouvelle UE</span>
          </button>
        )}

        {onNewRessource && (
          <button
            id="header-new-ressource-btn"
            onClick={onNewRessource}
            className="px-2.5 py-1 text-[#5B3CC4] bg-white hover:bg-violet-50 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-2xs active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 text-[#5B3CC4]" />
            <span className="hidden xs:inline">Ajouter</span>
          </button>
        )}
      </div>
    </header>
  );
};
