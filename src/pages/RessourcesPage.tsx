import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
  Lock,
  Unlock,
  CheckCircle,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Link as LinkIcon
} from 'lucide-react';
import { Ressource, Semestre, TypeRessource, UE } from '../types';

interface RessourcesPageProps {
  ressources: Ressource[];
  ues: UE[];
  onOpenNewModal: () => void;
  onDeleteRessource: (id: string) => Promise<void>;
  globalSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export const RessourcesPage: React.FC<RessourcesPageProps> = ({
  ressources,
  ues,
  onOpenNewModal,
  onDeleteRessource,
  globalSearchQuery,
  onSearchQueryChange
}) => {
  const [filterSemestre, setFilterSemestre] = useState<Semestre | 'all'>('all');
  const [filterType, setFilterType] = useState<TypeRessource | 'all'>('all');
  const [filterAccess, setFilterAccess] = useState<'all' | 'premium' | 'gratuit'>('all');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; titre: string } | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<Ressource | null>(null);

  const searchQuery = globalSearchQuery !== undefined ? globalSearchQuery : localSearchQuery;
  const setSearchQuery = (val: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(val);
    } else {
      setLocalSearchQuery(val);
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filtered = useMemo(() => {
    return ressources.filter((r) => {
      if (filterSemestre !== 'all' && r.semestre !== filterSemestre) return false;
      if (filterType !== 'all' && r.type !== filterType) return false;
      if (filterAccess === 'premium' && !r.is_premium) return false;
      if (filterAccess === 'gratuit' && r.is_premium) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.titre.toLowerCase().includes(q);
        const matchUe = r.ue?.code.toLowerCase().includes(q) || r.ue?.nom.toLowerCase().includes(q);
        const matchYear = r.annee.toString().includes(q);
        if (!matchTitle && !matchUe && !matchYear) return false;
      }
      return true;
    });
  }, [ressources, filterSemestre, filterType, filterAccess, searchQuery]);

  // Page slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete.id;
    setDeletingId(id);
    try {
      await onDeleteRessource(id);
      setItemToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeBadge = (type: TypeRessource) => {
    switch (type) {
      case 'epreuve':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#6366F1] border border-indigo-200">
            <FileText className="w-3 h-3" />
            Épreuve
          </span>
        );
      case 'corrige':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#059669] border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Corrigé
          </span>
        );
      case 'resume':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#5B3CC4] border border-[#5B3CC4]/20">
            <BookOpen className="w-3 h-3" />
            Résumé
          </span>
        );
    }
  };

  return (
    <div id="ressources-page-container" className="space-y-4">
      {/* Search and Filters Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#5B3CC4] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="ressources-search-input"
              type="text"
              placeholder="Rechercher par titre, code UE, année..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#5B3CC4] focus:ring-2 focus:ring-[#5B3CC4]/15 transition-all bg-slate-50/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-700"
              >
                Effacer
              </button>
            )}
          </div>

          <button
            id="add-ressource-header-btn"
            onClick={onOpenNewModal}
            className="px-3 py-1.5 bg-[#5B3CC4] hover:bg-[#4C2FB0] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une Ressource</span>
          </button>
        </div>

        {/* Filter chips bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-100">
          {/* Semestre filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-0.5">
              Semestre :
            </span>
            {(['all', 'S1', 'S2'] as const).map((s) => (
              <button
                key={s}
                id={`filter-semestre-${s}`}
                onClick={() => {
                  setFilterSemestre(s);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                  filterSemestre === s
                    ? 'bg-[#18181B] text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {s === 'all' ? 'Tous' : `S${s.replace('S', '')}`}
              </button>
            ))}
          </div>

          <div className="h-3.5 w-px bg-slate-200 hidden sm:block mx-0.5"></div>

          {/* Type filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-0.5">
              Type :
            </span>
            {(['all', 'epreuve', 'corrige', 'resume'] as const).map((t) => (
              <button
                key={t}
                id={`filter-type-${t}`}
                onClick={() => {
                  setFilterType(t);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                  filterType === t
                    ? 'bg-[#5B3CC4] text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {t === 'all' ? 'Tous' : t === 'epreuve' ? 'Épreuves' : t === 'corrige' ? 'Corrigés' : 'Résumés'}
              </button>
            ))}
          </div>

          <div className="h-3.5 w-px bg-slate-200 hidden sm:block mx-0.5"></div>

          {/* Access filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-0.5">
              Accès :
            </span>
            {(['all', 'premium', 'gratuit'] as const).map((acc) => (
              <button
                key={acc}
                id={`filter-access-${acc}`}
                onClick={() => {
                  setFilterAccess(acc);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                  filterAccess === acc
                    ? 'bg-[#5B3CC4] text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {acc === 'all' ? 'Tous' : acc === 'premium' ? 'Premium' : 'Gratuit'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Counter info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>
          <strong>{filtered.length}</strong> document{filtered.length > 1 ? 's' : ''} au total
        </span>
      </div>

      {/* Table / Digital Library List */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900">Aucune ressource trouvée</p>
            <button
              onClick={onOpenNewModal}
              className="mt-1 px-3 py-1 bg-[#EDE9FE] text-[#5B3CC4] hover:bg-[#DDD6FE] rounded-lg text-xs font-bold transition-colors"
            >
              + Téléverser
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="ressources-table" className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4">Document</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">UE</th>
                  <th className="py-2.5 px-3">Année</th>
                  <th className="py-2.5 px-3">Accès</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((r) => {
                  const linkedExam = r.epreuve_liee_id
                    ? ressources.find((e) => e.id === r.epreuve_liee_id)
                    : null;

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-2.5 px-3 sm:px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center shrink-0 border border-[#5B3CC4]/15">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-[#5B3CC4] transition-colors">
                              {r.titre}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                                {r.fichier_url.split('/').pop() || 'doc.pdf'}
                              </span>
                              {r.taille_ko && (
                                <span className="text-[9px] text-slate-400 bg-slate-100 px-1 rounded font-mono">
                                  {r.taille_ko} Ko
                                </span>
                              )}
                            </div>
                            {linkedExam && (
                              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#059669] bg-emerald-50 px-1.5 py-0.2 rounded inline-flex border border-emerald-100">
                                <LinkIcon className="w-2.5 h-2.5" />
                                <span>Sujet : {linkedExam.titre}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">{getTypeBadge(r.type)}</td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div>
                          <span className="font-mono font-bold text-xs text-slate-900">
                            {r.ue ? `[${r.ue.code}]` : 'N/A'}
                          </span>
                          <span className="inline-block ml-1.5 text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                            {r.semestre}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="text-xs font-bold text-slate-900">{r.annee}</span>
                        {r.session && (
                          <span className="text-[10px] text-slate-400 ml-1">({r.session})</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {r.is_premium ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-[#EC4899] border border-pink-200">
                            <Lock className="w-2.5 h-2.5 text-[#EC4899]" />
                            Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                            <Unlock className="w-2.5 h-2.5 text-slate-500" />
                            Gratuit
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedPreview(r)}
                            title="Inspecter"
                            className="p-1 text-slate-400 hover:text-[#5B3CC4] hover:bg-[#EDE9FE] rounded-md transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-ressource-${r.id}`}
                            disabled={deletingId === r.id}
                            onClick={() => setItemToDelete({ id: r.id, titre: r.titre })}
                            title="Supprimer définitivement"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Modern Pagination Bar */}
        {filtered.length > itemsPerPage && (
          <div className="px-3 sm:px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px]">
              Page <strong>{currentPage}</strong> / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-5 h-5 rounded-md text-[11px] font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-[#5B3CC4] text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Document Inspector Drawer / Modal */}
      {selectedPreview && (
        <div
          id="preview-modal-backdrop"
          onClick={() => setSelectedPreview(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-[#E4E4E7] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in-scale"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedPreview.titre}</h3>
                  <p className="text-xs text-[#71717A]">
                    {selectedPreview.ue ? `[${selectedPreview.ue.code}] ${selectedPreview.ue.nom}` : 'UE'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="text-slate-500 hover:text-slate-900 p-1.5 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7] space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Type de document :</span>
                <span className="font-bold capitalize">{selectedPreview.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Semestre :</span>
                <span className="font-bold font-mono">Semestre {selectedPreview.semestre}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Année & Session :</span>
                <span className="font-bold">{selectedPreview.annee} ({selectedPreview.session || 'Générale'})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Statut d'accès :</span>
                {selectedPreview.is_premium ? (
                  <span className="font-bold text-[#EC4899]">Protégé (Pass Premium)</span>
                ) : (
                  <span className="font-bold text-[#10B981]">Public / Gratuit</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Emplacement :</span>
                <code className="text-[#5B3CC4] font-mono text-[11px] truncate max-w-[200px]">
                  {selectedPreview.fichier_url}
                </code>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedPreview(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                Fermer
              </button>
              <a
                href={selectedPreview.fichier_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#5B3CC4] hover:bg-[#4C2FB0] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-[#5B3CC4]/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ouvrir le PDF</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* In-app Deletion Confirmation Modal */}
      {itemToDelete && (
        <div
          id="delete-confirm-modal"
          onClick={() => setItemToDelete(null)}
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
                <h3 className="text-sm font-bold text-slate-900">Supprimer le document</h3>
                <p className="text-[11px] text-slate-400">Action irréversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              Confirmez-vous la suppression définitive du document :<br />
              <strong className="text-slate-900 font-semibold mt-1 block">« {itemToDelete.titre} »</strong>
            </p>

            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                id="confirm-delete-btn"
                type="button"
                disabled={deletingId === itemToDelete.id}
                onClick={confirmDelete}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 active:scale-[0.98] transition-all"
              >
                {deletingId === itemToDelete.id ? (
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
