import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  BookOpen,
  Layers,
  Search,
  Filter,
  FileText,
  CheckCircle,
  FolderOpen
} from 'lucide-react';
import { UE, Semestre, Ressource } from '../types';

interface UePageProps {
  ues: UE[];
  ressources: Ressource[];
  onOpenNewModal: () => void;
  onDeleteUe: (id: string) => Promise<void>;
  onSelectUeFilter?: (code: string) => void;
  globalSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export const UePage: React.FC<UePageProps> = ({
  ues,
  ressources,
  onOpenNewModal,
  onDeleteUe,
  globalSearchQuery,
  onSearchQueryChange
}) => {
  const [filterSemestre, setFilterSemestre] = useState<Semestre | 'all'>('all');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [ueToDelete, setUeToDelete] = useState<UE | null>(null);

  const searchQuery = globalSearchQuery !== undefined ? globalSearchQuery : localSearchQuery;
  const setSearchQuery = (val: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(val);
    } else {
      setLocalSearchQuery(val);
    }
  };

  const filteredUes = ues.filter((u) => {
    if (filterSemestre !== 'all' && u.semestre !== filterSemestre) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return u.code.toLowerCase().includes(q) || u.nom.toLowerCase().includes(q);
    }
    return true;
  });

  const confirmDeleteUe = async () => {
    if (!ueToDelete) return;
    const id = ueToDelete.id;
    setDeletingId(id);
    try {
      await onDeleteUe(id);
      setUeToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  // Subtle academic color variants: violet, indigo, rose, orange, vert
  const colorThemes = [
    {
      name: 'violet',
      badgeBg: 'bg-[#EDE9FE] text-[#5B3CC4] border-[#5B3CC4]/25',
      headerGradient: 'from-[#5B3CC4]/10 via-[#EDE9FE]/50 to-transparent',
      iconBg: 'bg-[#EDE9FE] text-[#5B3CC4]',
      borderHover: 'hover:border-[#5B3CC4]/50',
      accentDot: 'bg-[#5B3CC4]'
    },
    {
      name: 'indigo',
      badgeBg: 'bg-indigo-50 text-[#6366F1] border-indigo-200',
      headerGradient: 'from-indigo-500/10 via-indigo-50/50 to-transparent',
      iconBg: 'bg-indigo-50 text-[#6366F1]',
      borderHover: 'hover:border-[#6366F1]/50',
      accentDot: 'bg-[#6366F1]'
    },
    {
      name: 'rose',
      badgeBg: 'bg-pink-50 text-[#EC4899] border-pink-200',
      headerGradient: 'from-pink-500/10 via-pink-50/50 to-transparent',
      iconBg: 'bg-pink-50 text-[#EC4899]',
      borderHover: 'hover:border-[#F472B6]/50',
      accentDot: 'bg-[#F472B6]'
    },
    {
      name: 'orange',
      badgeBg: 'bg-orange-50 text-[#EA580C] border-orange-200',
      headerGradient: 'from-orange-500/10 via-orange-50/50 to-transparent',
      iconBg: 'bg-orange-50 text-[#EA580C]',
      borderHover: 'hover:border-[#FB923C]/50',
      accentDot: 'bg-[#FB923C]'
    },
    {
      name: 'vert',
      badgeBg: 'bg-emerald-50 text-[#059669] border-emerald-200',
      headerGradient: 'from-emerald-500/10 via-emerald-50/50 to-transparent',
      iconBg: 'bg-emerald-50 text-[#059669]',
      borderHover: 'hover:border-[#10B981]/50',
      accentDot: 'bg-[#10B981]'
    }
  ];

  return (
    <div id="ue-page-container" className="space-y-4">
      {/* Search and Filters Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#5B3CC4] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="ue-search-input"
              type="text"
              placeholder="Rechercher par code (ex: INF101) ou intitulé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-[#18181B] placeholder-slate-400 focus:outline-hidden focus:border-[#5B3CC4] focus:ring-2 focus:ring-[#5B3CC4]/15 transition-all bg-slate-50/60"
            />
          </div>

          <button
            id="create-ue-btn"
            onClick={onOpenNewModal}
            className="px-3 py-1.5 bg-[#5B3CC4] hover:bg-[#4C2FB0] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvelle UE</span>
          </button>
        </div>

        {/* Semestre switch */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Semestre :
          </span>
          {(['all', 'S1', 'S2'] as const).map((s) => (
            <button
              key={s}
              id={`filter-ue-semestre-${s}`}
              onClick={() => setFilterSemestre(s)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                filterSemestre === s
                  ? 'bg-[#5B3CC4] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {s === 'all' ? 'Toutes' : `Semestre ${s}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of UEs: Modern Square Cards with Abstract Academic Graphics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredUes.map((ue, index) => {
          const theme = colorThemes[index % colorThemes.length];
          const resCount = ressources.filter((r) => r.ue_id === ue.id).length;
          const epreuveCount = ressources.filter((r) => r.ue_id === ue.id && r.type === 'epreuve').length;
          const corrigeCount = ressources.filter((r) => r.ue_id === ue.id && r.type === 'corrige').length;
          const resumeCount = ressources.filter((r) => r.ue_id === ue.id && r.type === 'resume').length;

          return (
            <div
              key={ue.id}
              className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-150 ${theme.borderHover} hover:border-slate-300 flex flex-col justify-between group`}
            >
              {/* Card top banner */}
              <div className={`p-3.5 bg-gradient-to-br ${theme.headerGradient} border-b border-slate-100 relative overflow-hidden`}>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold shadow-2xs ${theme.iconBg}`}>
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
                      {ue.code}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/95 text-slate-700 border border-slate-200">
                    S{ue.semestre}
                  </span>
                </div>

                <div className="mt-2.5 relative z-10">
                  <h3 className="text-xs sm:text-sm font-bold text-[#18181B] leading-snug group-hover:text-[#5B3CC4] transition-colors line-clamp-1">
                    {ue.nom}
                  </h3>
                </div>
              </div>

              {/* Card Body & Resource Counts */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Documents indexés :</span>
                    <strong className="text-slate-900 font-bold">{resCount}</strong>
                  </div>

                  {/* Micro breakdown pill counters */}
                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[9px] uppercase font-bold text-[#6366F1] block">Épreuves</span>
                      <span className="text-xs font-bold text-slate-900">{epreuveCount}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[9px] uppercase font-bold text-[#10B981] block">Corrigés</span>
                      <span className="text-xs font-bold text-slate-900">{corrigeCount}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[9px] uppercase font-bold text-[#5B3CC4] block">Résumés</span>
                      <span className="text-xs font-bold text-slate-900">{resumeCount}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {ue.id.slice(0, 6)}
                  </span>

                  <button
                    id={`delete-ue-btn-${ue.id}`}
                    disabled={deletingId === ue.id}
                    onClick={() => setUeToDelete(ue)}
                    title="Supprimer"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUes.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center mx-auto">
            <GraduationCap className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-900">Aucune Unité d'Enseignement trouvée</p>
        </div>
      )}

      {/* In-app Deletion Confirmation Modal for UE */}
      {ueToDelete && (
        <div
          id="delete-ue-modal"
          onClick={() => setUeToDelete(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 p-5 max-w-sm w-full shadow-2xl space-y-3.5 animate-in-scale"
          >
            <div className="flex items-center gap-2.5 text-rose-600">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Supprimer l'UE</h3>
                <p className="text-[11px] text-slate-400">Action irréversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              Confirmez-vous la suppression de l'Unité d'Enseignement :<br />
              <strong className="text-slate-900 font-semibold mt-1 block">[{ueToDelete.code}] {ueToDelete.nom}</strong>
            </p>

            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setUeToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                id="confirm-delete-ue-btn"
                type="button"
                disabled={deletingId === ueToDelete.id}
                onClick={confirmDeleteUe}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 active:scale-[0.98] transition-all"
              >
                {deletingId === ueToDelete.id ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <span>Supprimer</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
