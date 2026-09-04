import React from 'react';
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  CreditCard,
  Users,
  ShieldCheck,
  LogOut,
  Sparkles,
  Database,
  X,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Layers,
  Settings
} from 'lucide-react';
import { AdminUser } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'ressources' | 'ue' | 'paiements' | 'etudiants' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'ressources' | 'ue' | 'paiements' | 'etudiants' | 'settings') => void;
  pendingPaymentsCount: number;
  currentUser: AdminUser | null;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingPaymentsCount,
  currentUser,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  onMouseEnter,
  onMouseLeave
}) => {
  const primaryNav = [
    {
      id: 'dashboard' as const,
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'ressources' as const,
      label: 'Bibliothèque Ressources',
      icon: FileText,
      badge: null
    },
    {
      id: 'ue' as const,
      label: "Unités d'Enseignement",
      icon: GraduationCap,
      badge: null
    },
    {
      id: 'paiements' as const,
      label: 'Paiements & Pass',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : null,
      badgeColor: 'bg-[#FB923C] text-white font-bold'
    },
    {
      id: 'etudiants' as const,
      label: 'Étudiants & Accès',
      icon: Users,
      badge: null
    },
    {
      id: 'settings' as const,
      label: 'Paramètres',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
        />
      )}

      <aside
        id="app-sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-accent text-white flex flex-col border-r border-accent-hover shadow-2xl transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-accent-hover bg-accent-hover flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white text-accent flex items-center justify-center font-bold shadow-md border border-white/20">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">ArchivEx</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-white border border-white/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-violet-200">Portail Académique</p>
            </div>
          </div>
          <button
            id="close-mobile-sidebar-btn"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-violet-200 hover:text-white hover:bg-accent-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Area */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-6 sidebar-scroll">
          {/* Main Menu */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-violet-200">
              Gestion Pédagogique
            </div>
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                    isActive
                      ? 'bg-white text-accent shadow-md shadow-slate-900/10 font-bold'
                      : 'text-violet-100 hover:text-white hover:bg-accent-hover'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-accent' : 'text-violet-200 group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null ? (
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        item.badgeColor || 'bg-amber-400 text-slate-950 shadow-xs'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-4 h-4 text-accent opacity-80" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Academic Architecture Status */}
          <div className="pt-1">
            <div className="p-3 rounded-xl bg-black/15 border border-white/10 text-xs text-violet-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-white text-xs">
                <Database className="w-3.5 h-3.5 text-violet-200" />
                <span>Base Pédagogique</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                En ligne
              </span>
            </div>
          </div>
        </div>

        {/* User profile & logout bottom card with dynamic black opacity overlay */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white text-accent flex items-center justify-center font-bold text-sm shadow-xs border border-white/20 shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate">{currentUser?.name || 'Administrateur'}</p>
                <p className="text-[11px] text-violet-200 truncate">{currentUser?.email || 'Compte Administrateur'}</p>
              </div>
            </div>
            <button
              id="sidebar-logout-button"
              onClick={onLogout}
              title="Déconnexion"
              className="p-2 rounded-xl text-violet-200 hover:text-white hover:bg-white/15 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
