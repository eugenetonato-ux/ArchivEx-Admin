import React from 'react';
import {
  FileText,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Lock,
  Unlock,
  Layers,
  BookOpen,
  FolderLock
} from 'lucide-react';
import { KpiStats, Paiement, Ressource, UE } from '../types';
import { KpiCard } from '../components/KpiCard';
import { Dashboard3DCharts } from '../components/Dashboard3DCharts';
import { ActivityFeed } from '../components/ActivityFeed';
import { Dashboard3DLinearChart } from '../components/Dashboard3DLinearChart';

interface DashboardPageProps {
  stats: KpiStats;
  recentRessources: Ressource[];
  allUes?: UE[];
  pendingPaiements: Paiement[];
  onNavigateTab: (tab: 'dashboard' | 'ressources' | 'ue' | 'paiements' | 'etudiants') => void;
  onOpenNewRessource: () => void;
  onOpenNewUe: () => void;
  onValidatePayment: (id: string) => Promise<void>;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  recentRessources,
  allUes = [],
  pendingPaiements,
  onNavigateTab,
  onOpenNewRessource,
  onOpenNewUe,
  onValidatePayment,
  searchQuery = '',
  onSearchQueryChange
}) => {
  const epreuvesPercent = Math.round((stats.totalEpreuves / (stats.totalRessources || 1)) * 100);
  const corrigesPercent = Math.round((stats.totalCorriges / (stats.totalRessources || 1)) * 100);
  const resumesPercent = 100 - epreuvesPercent - corrigesPercent;

  const query = searchQuery.trim().toLowerCase();

  const foundRessources = React.useMemo(() => {
    if (!query) return [];
    return recentRessources.filter((r) =>
      r.titre.toLowerCase().includes(query) ||
      (r.ue && (r.ue.code.toLowerCase().includes(query) || r.ue.nom.toLowerCase().includes(query))) ||
      r.annee.toString().includes(query)
    );
  }, [query, recentRessources]);

  const foundUes = React.useMemo(() => {
    if (!query) return [];
    return allUes.filter((u) =>
      u.code.toLowerCase().includes(query) ||
      u.nom.toLowerCase().includes(query)
    );
  }, [query, allUes]);

  return (
    <div id="dashboard-page-container" className="space-y-4 sm:space-y-5">
      {/* Alert banner if pending payments exist */}
      {pendingPaiements.length > 0 && (
        <div
          id="pending-payments-banner"
          className="p-3 sm:p-3.5 rounded-xl bg-orange-50/90 border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FB923C] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#18181B]">
                {pendingPaiements.length} règlement{pendingPaiements.length > 1 ? 's' : ''} en attente de vérification
              </p>
            </div>
          </div>
          <button
            id="view-pending-payments-btn"
            onClick={() => onNavigateTab('paiements')}
            className="px-2.5 py-1 rounded-lg bg-[#FB923C] hover:bg-[#EA580C] text-white text-xs font-bold shrink-0 transition-all flex items-center gap-1 shadow-2xs active:scale-[0.98]"
          >
            <span>Traiter</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Global Search Results Panel */}
      {query && (
        <div id="global-search-results-panel" className="bg-gradient-to-r from-[#1A0F3D] to-[#12092D] rounded-2xl border-2 border-violet-500/30 p-4 sm:p-5 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <h2 className="text-xs sm:text-sm font-extrabold">Résultats de la Recherche Globale</h2>
            </div>
            <button
              id="clear-global-search-link"
              onClick={() => onSearchQueryChange?.('')}
              className="text-xs text-violet-300 hover:text-white underline"
            >
              Effacer la recherche
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resources results */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-violet-200 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Ressources ({foundRessources.length})</span>
              </h3>
              {foundRessources.length === 0 ? (
                <p className="text-xs text-violet-300/60 bg-white/5 p-3 rounded-xl border border-white/5">Aucune ressource ne correspond.</p>
              ) : (
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {foundRessources.slice(0, 5).map((res) => (
                    <div
                      key={res.id}
                      onClick={() => {
                        onNavigateTab('ressources');
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1">{res.titre}</p>
                        <p className="text-[10px] text-violet-300/80">
                          {res.ue ? `[${res.ue.code}] ${res.ue.nom}` : 'UE'} • {res.annee}
                        </p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-violet-400" />
                    </div>
                  ))}
                  {foundRessources.length > 5 && (
                    <button
                      onClick={() => onNavigateTab('ressources')}
                      className="text-xs font-semibold text-violet-300 hover:text-white pt-1 flex items-center gap-1"
                    >
                      <span>Voir les {foundRessources.length - 5} autres ressources</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* UEs results */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-violet-200 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Matières / UEs ({foundUes.length})</span>
              </h3>
              {foundUes.length === 0 ? (
                <p className="text-xs text-violet-300/60 bg-white/5 p-3 rounded-xl border border-white/5">Aucune UE ne correspond.</p>
              ) : (
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {foundUes.slice(0, 5).map((ue) => (
                    <div
                      key={ue.id}
                      onClick={() => {
                        onNavigateTab('ue');
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">[{ue.code}] {ue.nom}</p>
                        <p className="text-[10px] text-violet-300/80">Semestre {ue.semestre}</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-violet-400" />
                    </div>
                  ))}
                  {foundUes.length > 5 && (
                    <button
                      onClick={() => onNavigateTab('ue')}
                      className="text-xs font-semibold text-violet-300 hover:text-white pt-1 flex items-center gap-1"
                    >
                      <span>Voir les {foundUes.length - 5} autres UEs</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div id="dashboard-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        <KpiCard
          id="kpi-card-ressources"
          title="Ressources"
          value={stats.totalRessources}
          subtitle={`${stats.totalEpreuves} épreuves • ${stats.totalCorriges} corrigés`}
          icon={FileText}
          colorScheme="violet"
          onClick={() => onNavigateTab('ressources')}
        />

        <KpiCard
          id="kpi-card-ues"
          title="Unités d'Enseignement"
          value={stats.totalUe}
          subtitle={`${stats.totalUeS1} en S1 • ${stats.totalUeS2} en S2`}
          icon={GraduationCap}
          colorScheme="indigo"
          onClick={() => onNavigateTab('ue')}
        />

        <KpiCard
          id="kpi-card-premium"
          title="Documents Pass"
          value={stats.ressourcesPremium}
          subtitle={`${Math.round((stats.ressourcesPremium / (stats.totalRessources || 1)) * 100)}% sous Pass`}
          icon={FolderLock}
          colorScheme="rose"
          trendBadge="Pass"
          onClick={() => onNavigateTab('ressources')}
        />

        <KpiCard
          id="kpi-card-revenue"
          title="Recettes des Pass"
          value={`${stats.montantTotalCollecte.toLocaleString()} F`}
          subtitle={
            stats.paiementsConfirmes > 0
              ? `${stats.paiementsConfirmes} abonnement${stats.paiementsConfirmes > 1 ? 's' : ''}`
              : '0 encaissement'
          }
          icon={CreditCard}
          colorScheme="emerald"
          onClick={() => onNavigateTab('paiements')}
        />
      </div>

      {/* 3D Charts: Circular 3D and Bands 3D */}
      <Dashboard3DCharts stats={stats} recentRessources={recentRessources} />

      {/* 3D Growth Ribbon Chart: Evolution of registrations & revenues */}
      <Dashboard3DLinearChart totalInscriptions={195} totalRevenus={stats.montantTotalCollecte} />

      {/* Main Grid: Pending Payments & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Paiements en attente */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center font-bold">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-[#18181B]">Demandes en Attente</h2>
            </div>
            <button
              id="goto-all-payments-btn"
              onClick={() => onNavigateTab('paiements')}
              className="text-xs font-semibold text-[#5B3CC4] hover:text-[#4C2FB0] flex items-center gap-1 transition-colors"
            >
              <span>Voir tout ({pendingPaiements.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {pendingPaiements.length === 0 ? (
            <div className="py-8 text-center text-[#71717A] space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#18181B]">Aucun paiement en attente</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingPaiements.slice(0, 4).map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#18181B] truncate">
                        {p.profile?.full_name || 'Étudiant'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#EDE9FE] text-[#5B3CC4] border border-[#5B3CC4]/20">
                        Pack {p.semestre}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71717A] font-mono mt-0.5">
                      Réf: <strong className="text-[#18181B]">{p.reference || 'Non fournie'}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs font-bold text-[#18181B]">{p.montant.toLocaleString()} F</span>
                    <button
                      id={`dashboard-valider-payment-${p.id}`}
                      onClick={() => onValidatePayment(p.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Valider</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Quick Actions & Access Rules */}
        <div className="space-y-4">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 space-y-2.5">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions Rapides</h3>
            <div className="space-y-1.5">
              <button
                id="quick-action-new-ressource"
                onClick={onOpenNewRessource}
                className="w-full text-left px-3 py-2 rounded-lg bg-[#EDE9FE]/60 hover:bg-[#EDE9FE] text-[#5B3CC4] text-xs font-bold flex items-center justify-between transition-colors border border-[#5B3CC4]/15"
              >
                <span>Publier une ressource</span>
                <ArrowRight className="w-3 h-3 text-[#5B3CC4]" />
              </button>
              <button
                id="quick-action-new-ue"
                onClick={onOpenNewUe}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#18181B] text-xs font-semibold flex items-center justify-between transition-colors border border-slate-200"
              >
                <span>Créer une Unité d'Enseignement</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                id="quick-action-manage-students"
                onClick={() => onNavigateTab('etudiants')}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#18181B] text-xs font-semibold flex items-center justify-between transition-colors border border-slate-200"
              >
                <span>Superviser les étudiants</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Rules Card in deep violet */}
          <div className="bg-[#160D2E] text-slate-100 rounded-xl p-3.5 space-y-2 shadow-xs border border-[#27194D]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#EDE9FE]">Règles d'Accès</h3>
            </div>
            <ul className="text-xs text-[#C5BADF] space-y-1.5 leading-snug">
              <li className="flex items-start gap-1.5">
                <span className="text-[#A78BFA] font-bold">•</span>
                <span>Corrigés & résumés réservés au Pass Premium.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#A78BFA] font-bold">•</span>
                <span>La validation active instantanément le Pass S1/S2.</span>
              </li>
            </ul>
          </div>

          {/* Activity Feed Card */}
          <ActivityFeed
            recentRessources={recentRessources}
            allUes={allUes}
            pendingPaiements={pendingPaiements}
          />
        </div>
      </div>

      {/* Bottom Section: Recent Resources */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center font-bold">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#18181B]">Dernières Ressources</h2>
          </div>
          <button
            id="goto-all-ressources-btn"
            onClick={() => onNavigateTab('ressources')}
            className="text-xs font-semibold text-[#5B3CC4] hover:text-[#4C2FB0] flex items-center gap-1 transition-colors"
          >
            <span>Bibliothèque</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recentRessources.slice(0, 3).map((res) => (
            <div
              key={res.id}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5 hover:border-[#5B3CC4]/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                    res.type === 'epreuve'
                      ? 'bg-indigo-50 text-[#6366F1] border border-indigo-200'
                      : res.type === 'corrige'
                      ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                      : 'bg-[#EDE9FE] text-[#5B3CC4] border border-[#5B3CC4]/20'
                  }`}
                >
                  {res.type === 'epreuve' ? 'Épreuve' : res.type === 'corrige' ? 'Corrigé' : 'Résumé'}
                </span>
                {res.is_premium ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-pink-50 text-[#EC4899] border border-pink-200 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Premium
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-[#71717A] flex items-center gap-0.5">
                    <Unlock className="w-2.5 h-2.5" /> Gratuit
                  </span>
                )}
              </div>

              <h4 className="font-bold text-xs text-[#18181B] line-clamp-1 group-hover:text-[#5B3CC4] transition-colors">
                {res.titre}
              </h4>
              <p className="text-[11px] text-[#71717A]">
                {res.ue ? `[${res.ue.code}] ${res.ue.nom}` : 'UE'} • {res.annee}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
