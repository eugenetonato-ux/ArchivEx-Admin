import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RessourceFormModal } from './components/RessourceFormModal';
import { UeModal } from './components/UeModal';
import { DashboardPage } from './pages/DashboardPage';
import { RessourcesPage } from './pages/RessourcesPage';
import { UePage } from './pages/UePage';
import { PaiementsPage } from './pages/PaiementsPage';
import { EtudiantsPage } from './pages/EtudiantsPage';
import { LoginPage } from './pages/LoginPage';
import { OfflineIndicator } from './components/OfflineIndicator';
import { archivexService } from './services/archivexService';
import {
  UE,
  Ressource,
  Paiement,
  UserProfile,
  AdminUser,
  KpiStats
} from './types';

export interface AccentPalette {
  id: string;
  name: string;
  hex: string;
  hover: string;
  light: string;
  bgClass: string;
}

export const ACCENT_PALETTES: AccentPalette[] = [
  { id: 'violet', name: 'Classique Violet (ArchivEx)', hex: '#5B3CC4', hover: '#4C2FB0', light: '#EDE9FE', bgClass: 'bg-[#5B3CC4]' },
  { id: 'blue', name: 'Bleu Océan', hex: '#0284C7', hover: '#0369A1', light: '#E0F2FE', bgClass: 'bg-[#0284C7]' },
  { id: 'emerald', name: 'Vert Émeraude', hex: '#059669', hover: '#047857', light: '#D1FAE5', bgClass: 'bg-[#059669]' },
  { id: 'crimson', name: 'Rouge Velours', hex: '#DC2626', hover: '#B91C1C', light: '#FEE2E2', bgClass: 'bg-[#DC2626]' },
  { id: 'charcoal', name: 'Gris Charbon', hex: '#4B5563', hover: '#374151', light: '#F3F4F6', bgClass: 'bg-[#4B5563]' },
  { id: 'amber', name: 'Ambre Doré', hex: '#D97706', hover: '#B45309', light: '#FEF3C7', bgClass: 'bg-[#D97706]' },
];

export function App() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(archivexService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ressources' | 'ue' | 'paiements' | 'etudiants' | 'settings'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('archivex-dark-mode') === 'true';
  });
  
  const [accentPaletteId, setAccentPaletteId] = useState<string>(() => {
    return localStorage.getItem('archivex-accent-palette') || 'violet';
  });

  useEffect(() => {
    const palette = ACCENT_PALETTES.find(p => p.id === accentPaletteId) || ACCENT_PALETTES[0];
    localStorage.setItem('archivex-accent-palette', palette.id);
    const root = document.documentElement;
    root.style.setProperty('--accent-color', palette.hex);
    root.style.setProperty('--accent-color-hover', palette.hover);
    root.style.setProperty('--accent-color-light', palette.light);
  }, [accentPaletteId]);

  useEffect(() => {
    localStorage.setItem('archivex-dark-mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Search Bar shortcut: Ctrl + K or Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
          (searchInput as HTMLInputElement).select();
        }
        return;
      }

      // Check if user is actively writing in a form or input
      const active = document.activeElement;
      const isTyping = active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.tagName === 'SELECT' ||
        active.getAttribute('contenteditable') === 'true'
      );

      if (isTyping) {
        // Allow escape to blur input
        if (e.key === 'Escape') {
          (active as HTMLElement).blur();
        }
        return;
      }

      // Global navigation and actions shortcuts
      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          setIsRessourceModalOpen(true);
          break;
        case 'u':
          e.preventDefault();
          setIsUeModalOpen(true);
          break;
        case 'd':
          e.preventDefault();
          setActiveTab('dashboard');
          break;
        case 'r':
          e.preventDefault();
          setActiveTab('ressources');
          break;
        case 'm':
          e.preventDefault();
          setActiveTab('ue');
          break;
        case 'p':
          e.preventDefault();
          setActiveTab('paiements');
          break;
        case 'e':
          e.preventDefault();
          setActiveTab('etudiants');
          break;
        case 'h':
        case '?':
          e.preventDefault();
          setShowShortcutsHelp((prev) => !prev);
          break;
        case 'escape':
          e.preventDefault();
          setIsRessourceModalOpen(false);
          setIsUeModalOpen(false);
          setShowShortcutsHelp(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMenuHoverOpen = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setMobileMenuOpen(true);
  }, []);

  const handleMenuHoverClose = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = setTimeout(() => {
      setMobileMenuOpen(false);
    }, 320);
  }, []);

  const handleSidebarMouseEnter = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setMobileMenuOpen(true);
  }, []);

  // Modals
  const [isRessourceModalOpen, setIsRessourceModalOpen] = useState(false);
  const [isUeModalOpen, setIsUeModalOpen] = useState(false);

  // Data state
  const [ues, setUes] = useState<UE[]>([]);
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<KpiStats>(archivexService.getStats());
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [allUes, allRessources, allPaiements, allProfiles] = await Promise.all([
        archivexService.getUes(),
        archivexService.getRessources(),
        archivexService.getPaiements(),
        archivexService.getProfiles()
      ]);

      setUes(allUes);
      setRessources(allRessources);
      setPaiements(allPaiements);
      setProfiles(allProfiles);
      setStats(archivexService.getStats());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleLogin = async (email: string, pass: string) => {
    const user = await archivexService.login(email, pass);
    setCurrentUser(user);
    refreshData();
    return user;
  };

  const handleLogout = () => {
    archivexService.logout();
    setCurrentUser(null);
  };

  // Ressource handlers
  const handleCreateRessource = async (
    data: Omit<Ressource, 'id' | 'fichier_url' | 'created_at'>,
    file: File | { name: string; size: number }
  ) => {
    await archivexService.createRessource(data, file);
    await refreshData();
  };

  const handleDeleteRessource = async (id: string) => {
    setRessources((prev) => prev.filter((r) => r.id !== id));
    await archivexService.deleteRessource(id);
    await refreshData();
  };

  // UE handlers
  const handleCreateUe = async (data: Omit<UE, 'id'>) => {
    await archivexService.createUe(data);
    await refreshData();
  };

  const handleDeleteUe = async (id: string) => {
    setUes((prev) => prev.filter((u) => u.id !== id));
    await archivexService.deleteUe(id);
    await refreshData();
  };

  // Payment handlers
  const handleValidatePayment = async (id: string) => {
    const result = await archivexService.validerPaiement(id);
    await refreshData();
    return result;
  };

  const handleRejectPayment = async (id: string) => {
    await archivexService.rejeterPaiement(id);
    await refreshData();
  };

  // Profile manual adjustment
  const handleTogglePremium = async (userId: string, semestre: 'S1' | 'S2', currentVal: boolean) => {
    const target = profiles.find((p) => p.id === userId);
    if (target) {
      if (semestre === 'S1') target.premium_s1 = !currentVal;
      if (semestre === 'S2') target.premium_s2 = !currentVal;
      setProfiles([...profiles]);
      await refreshData();
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pendingPayments = paiements.filter((p) => p.statut === 'en_attente');

  const pageHeaders = {
    dashboard: {
      title: 'Vue d’ensemble',
      subtitle: 'Indicateurs clés, validation des paiements et flux documentaire ArchivEx'
    },
    ressources: {
      title: 'Bibliothèque Ressources',
      subtitle: 'Catalogue des épreuves, corrigés types et résumés pédagogiques'
    },
    ue: {
      title: "Unités d'Enseignement",
      subtitle: 'Découpage académique par semestre (S1 / S2)'
    },
    paiements: {
      title: 'Validation des Paiements',
      subtitle: 'Vérification des transactions et activation instantanée des pass'
    },
    etudiants: {
      title: 'Comptes Étudiants & Accès',
      subtitle: 'Supervision des droits et déblocages des Pass Premium'
    },
    settings: {
      title: 'Paramètres du Portail',
      subtitle: 'Personnalisation de l\'interface, palettes de couleur d\'accentuation et préférences'
    }
  };

  const currentHeader = pageHeaders[activeTab];

  return (
    <div
      id="archivex-admin-app-root"
      className={`min-h-screen flex font-sans transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#0D0A14] text-[#F5F3FF] selection:bg-violet-950 selection:text-violet-200' 
          : 'bg-[#FAFAF9] text-slate-900 selection:bg-[#EDE9FE] selection:text-[#5B3CC4]'
      }`}
    >
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingPaymentsCount={pendingPayments.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleMenuHoverClose}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header
          title={currentHeader.title}
          subtitle={currentHeader.subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          onMouseEnterMenu={handleMenuHoverOpen}
          onMouseLeaveMenu={handleMenuHoverClose}
          onNewRessource={() => setIsRessourceModalOpen(true)}
          onNewUe={() => setIsUeModalOpen(true)}
          onRefresh={refreshData}
          pendingCount={pendingPayments.length}
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full"
          >
            {activeTab === 'dashboard' && (
              <DashboardPage
                stats={stats}
                recentRessources={ressources}
                allUes={ues}
                pendingPaiements={pendingPayments}
                onNavigateTab={setActiveTab}
                onOpenNewRessource={() => setIsRessourceModalOpen(true)}
                onOpenNewUe={() => setIsUeModalOpen(true)}
                onValidatePayment={async (id) => {
                  await handleValidatePayment(id);
                }}
                searchQuery={globalSearchQuery}
                onSearchQueryChange={setGlobalSearchQuery}
              />
            )}

            {activeTab === 'ressources' && (
              <RessourcesPage
                ressources={ressources}
                ues={ues}
                onOpenNewModal={() => setIsRessourceModalOpen(true)}
                onDeleteRessource={handleDeleteRessource}
                globalSearchQuery={globalSearchQuery}
                onSearchQueryChange={setGlobalSearchQuery}
              />
            )}

            {activeTab === 'ue' && (
              <UePage
                ues={ues}
                ressources={ressources}
                onOpenNewModal={() => setIsUeModalOpen(true)}
                onDeleteUe={handleDeleteUe}
                globalSearchQuery={globalSearchQuery}
                onSearchQueryChange={setGlobalSearchQuery}
              />
            )}

            {activeTab === 'paiements' && (
              <PaiementsPage
                paiements={paiements}
                onValidate={handleValidatePayment}
                onReject={handleRejectPayment}
              />
            )}

            {activeTab === 'etudiants' && (
              <EtudiantsPage
                profiles={profiles}
                onTogglePremium={handleTogglePremium}
              />
            )}

            {activeTab === 'settings' && (
              <div id="settings-page" className="max-w-3xl space-y-8 animate-in-scale">
                {/* Visual Identity Customize Section */}
                <div className="bg-white dark:bg-[#120F20] rounded-2xl border border-slate-200 dark:border-violet-500/10 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                    <span className="p-2 rounded-lg bg-accent-light text-accent flex items-center justify-center">
                      <Settings className="w-5 h-5 text-accent" />
                    </span>
                    <div>
                      <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">Identité Visuelle de la Plateforme</h2>
                      <p className="text-xs text-slate-500 dark:text-violet-300">Personnalisez l'ambiance et la palette de couleurs d'accentuation d'ArchivEx</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-violet-200">
                      Palette de Couleur Principale (Accent)
                    </label>
                    <p className="text-xs text-slate-500 dark:text-violet-400">
                      Sélectionnez une palette professionnelle ci-dessous. Cette couleur sera appliquée instantanément à la barre latérale, aux boutons principaux, aux états actifs de navigation et aux indicateurs visuels du portail.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {ACCENT_PALETTES.map((palette) => {
                        const isSelected = accentPaletteId === palette.id;
                        return (
                          <button
                            key={palette.id}
                            id={`accent-palette-${palette.id}`}
                            onClick={() => setAccentPaletteId(palette.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-accent bg-accent-light/30 dark:bg-accent/10 ring-2 ring-accent'
                                : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 bg-slate-50/50 dark:bg-white/2 hover:scale-[1.01]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Round Color Indicator */}
                              <div className={`w-5 h-5 rounded-full ${palette.bgClass} flex items-center justify-center shrink-0 shadow-xs border border-white/20`}>
                                {isSelected && (
                                  <span className="text-white text-[10px] font-bold">✓</span>
                                )}
                              </div>
                              <div>
                                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                                  {palette.name}
                                </span>
                                <span className="block text-[10px] text-slate-400 font-mono">
                                  {palette.hex}
                                </span>
                              </div>
                            </div>

                            {/* Tiny preview pill */}
                            <span className={`px-2 py-0.5 rounded text-[9px] font-semibold text-white ${palette.bgClass}`}>
                              Accent
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interface Preview box */}
                  <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-violet-300 uppercase tracking-wider pb-3">Aperçu en Temps Réel</h3>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-xs">AE</span>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Boutons & Éléments Interactifs</p>
                            <p className="text-[10px] text-slate-500 dark:text-violet-400">Exemple de bouton principal dynamique</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="px-4 py-1.5 rounded-lg bg-accent text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity">
                            Bouton Principal
                          </button>
                          <button className="px-3 py-1.5 rounded-lg text-accent bg-accent-light/40 dark:bg-accent/15 hover:opacity-90 transition-opacity text-xs font-bold">
                            Bouton Secondaire
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                        <div className="p-2.5 rounded-lg border-2 border-accent bg-accent-light/10 text-center">
                          <span className="block text-xs font-extrabold text-accent">Actif</span>
                        </div>
                        <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent text-center">
                          <span className="block text-xs font-semibold text-slate-500 dark:text-violet-400">Inactif</span>
                        </div>
                        <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent text-center flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                          <span className="text-[10px] text-slate-500 dark:text-violet-400">Statut</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Information / Service Worker status */}
                <div className="bg-white dark:bg-[#120F20] rounded-2xl border border-slate-200 dark:border-violet-500/10 p-6 shadow-sm space-y-4">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-base">⚙️</span> Informations Système & Hors-ligne
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-white/2 rounded-xl space-y-1">
                      <span className="text-slate-500 dark:text-violet-300 block">Service Worker</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block">✓ Actif & Enregistré</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-white/2 rounded-xl space-y-1">
                      <span className="text-slate-500 dark:text-violet-300 block">Base Locale (Fallback)</span>
                      <span className="text-slate-900 dark:text-white font-bold block">Synchronisée (LocalStorage)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Ressource Creation Modal */}
      <RessourceFormModal
        isOpen={isRessourceModalOpen}
        onClose={() => setIsRessourceModalOpen(false)}
        onSubmit={handleCreateRessource}
        ues={ues}
        existingEpreuves={ressources.filter((r) => r.type === 'epreuve')}
      />

      {/* UE Creation Modal */}
      <UeModal
        isOpen={isUeModalOpen}
        onClose={() => setIsUeModalOpen(false)}
        onSubmit={handleCreateUe}
      />

      {/* Keyboard Shortcuts Floating Help Toggle Button */}
      <button
        id="shortcuts-help-floating-btn"
        onClick={() => setShowShortcutsHelp((prev) => !prev)}
        className="fixed bottom-4 right-4 z-40 p-2.5 rounded-full bg-slate-900 text-white dark:bg-slate-800 dark:text-violet-100 border border-slate-200/20 dark:border-white/10 shadow-lg hover:scale-105 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 dark:hover:bg-slate-700"
        title="Raccourcis Clavier [ H ]"
      >
        <span className="w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center font-mono font-bold text-[10px]">?</span>
        <span className="hidden sm:inline">Raccourcis Clavier</span>
      </button>

      {/* Shortcuts Modal Overlay */}
      {showShortcutsHelp && (
        <div
          id="shortcuts-modal-overlay"
          onClick={() => setShowShortcutsHelp(false)}
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-[#120F20] rounded-2xl border border-slate-200 dark:border-violet-500/30 p-5 sm:p-6 shadow-2xl relative space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-violet-100 dark:bg-violet-500/10 rounded-md flex items-center justify-center font-bold text-xs text-violet-600 dark:text-violet-400">⌨️</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Raccourcis de Productivité Admin</h3>
              </div>
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-md"
              >
                Fermer
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-violet-300">Rechercher</span>
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-2xs font-mono font-black text-[10px]">Ctrl + K</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-violet-300">Nouvelle Ressource</span>
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-2xs font-mono font-black text-[10px]">N</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-violet-300">Nouvelle UE</span>
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-2xs font-mono font-black text-[10px]">U</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-violet-300">Tableau de bord</span>
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-2xs font-mono font-black text-[10px]">D</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-violet-300">Bibliothèque</span>
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-2xs font-mono font-black text-[10px]">R</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-violet-300">Matières / UEs</span>
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-2xs font-mono font-black text-[10px]">M</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-violet-300">Paiements</span>
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-2xs font-mono font-black text-[10px]">P</kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-violet-300">Étudiants</span>
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-2xs font-mono font-black text-[10px]">E</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 text-xs">
                <span className="text-slate-500 dark:text-violet-300">Afficher l'aide</span>
                <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-2xs font-mono font-black text-[10px]">?</kbd>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-400 dark:text-violet-300/50">
              Pressez <span className="font-bold">Echap</span> pour fermer n'importe quel panneau ou formulaire.
            </p>
          </div>
        </div>
      )}

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default App;
