import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowDownToLine,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Paiement, StatutPaiement } from '../types';

interface PaiementsPageProps {
  paiements: Paiement[];
  onValidate: (id: string) => Promise<unknown>;
  onReject: (id: string) => Promise<unknown>;
}

export const PaiementsPage: React.FC<PaiementsPageProps> = ({
  paiements,
  onValidate,
  onReject
}) => {
  const [filterStatut, setFilterStatut] = useState<StatutPaiement | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [paymentToReject, setPaymentToReject] = useState<string | null>(null);

  // Financial KPIs
  const totalCollecte = paiements
    .filter((p) => p.statut === 'confirme')
    .reduce((sum, p) => sum + p.montant, 0);

  const pendingCount = paiements.filter((p) => p.statut === 'en_attente').length;
  const confirmedCount = paiements.filter((p) => p.statut === 'confirme').length;
  const rejectedCount = paiements.filter((p) => p.statut === 'rejete').length;

  const filtered = paiements.filter((p) => {
    if (filterStatut !== 'all' && p.statut !== filterStatut) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = p.profile?.full_name?.toLowerCase().includes(q) || false;
      const matchEmail = p.profile?.email?.toLowerCase().includes(q) || false;
      const matchRef = p.reference?.toLowerCase().includes(q) || false;
      return matchName || matchEmail || matchRef;
    }
    return true;
  });

  const handleValidate = async (id: string) => {
    try {
      setProcessingId(id);
      await onValidate(id);
    } finally {
      setProcessingId(null);
    }
  };

  const confirmReject = async () => {
    if (!paymentToReject) return;
    const id = paymentToReject;
    try {
      setProcessingId(id);
      await onReject(id);
      setPaymentToReject(null);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (statut: StatutPaiement) => {
    switch (statut) {
      case 'en_attente':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#EA580C] border border-orange-200">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      case 'confirme':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#059669] border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Confirmé
          </span>
        );
      case 'rejete':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-[#E11D48] border border-pink-200">
            <XCircle className="w-3 h-3" />
            Rejeté
          </span>
        );
    }
  };

  return (
    <div id="paiements-page-container" className="space-y-4">
      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#062F20] to-[#0A4D34] text-white p-4 rounded-xl border border-emerald-500/25 shadow-md group hover:scale-[1.01] transition-transform duration-200">
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-emerald-500/25 rounded-full blur-xl group-hover:bg-emerald-500/40 transition-colors" />
          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
            <span>Total Recettes</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30 shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-black text-white">{totalCollecte.toLocaleString()} F</p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-[#3C1A08] to-[#602709] text-white p-4 rounded-xl border border-orange-500/25 shadow-md group hover:scale-[1.01] transition-transform duration-200">
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-orange-500/25 rounded-full blur-xl group-hover:bg-orange-500/40 transition-colors" />
          <div className="flex items-center justify-between text-[10px] font-bold text-orange-300 uppercase tracking-wider">
            <span>En attente</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-300 flex items-center justify-center border border-orange-500/30 shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-black text-white">{pendingCount}</p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-[#101030] to-[#1D1D45] text-white p-4 rounded-xl border border-indigo-500/20 shadow-md group hover:scale-[1.01] transition-transform duration-200">
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-indigo-500/25 rounded-full blur-xl group-hover:bg-indigo-500/40 transition-colors" />
          <div className="flex items-center justify-between text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
            <span>Pass Activés</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30 shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-black text-white">{confirmedCount}</p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-[#3B0712] to-[#5C0A1A] text-white p-4 rounded-xl border border-rose-500/25 shadow-md group hover:scale-[1.01] transition-transform duration-200">
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-rose-500/25 rounded-full blur-xl group-hover:bg-rose-500/40 transition-colors" />
          <div className="flex items-center justify-between text-[10px] font-bold text-rose-300 uppercase tracking-wider">
            <span>Rejetés</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30 shadow-xs">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-black text-white">{rejectedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#5B3CC4] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="paiements-search-input"
              type="text"
              placeholder="Rechercher par étudiant, email ou référence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#5B3CC4] focus:ring-2 focus:ring-[#5B3CC4]/15 transition-all bg-slate-50/60"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-50 rounded-lg border border-slate-200 shrink-0">
            <button
              id="tab-paiement-all"
              onClick={() => setFilterStatut('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                filterStatut === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tous ({paiements.length})
            </button>
            <button
              id="tab-paiement-en-attente"
              onClick={() => setFilterStatut('en_attente')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                filterStatut === 'en_attente'
                  ? 'bg-[#FB923C] text-white shadow-2xs'
                  : 'text-[#EA580C] hover:bg-orange-50'
              }`}
            >
              <span>En attente</span>
              {pendingCount > 0 && (
                <span className={`px-1 rounded-full text-[10px] font-bold ${filterStatut === 'en_attente' ? 'bg-white text-[#EA580C]' : 'bg-[#FB923C] text-white'}`}>
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              id="tab-paiement-confirme"
              onClick={() => setFilterStatut('confirme')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                filterStatut === 'confirme'
                  ? 'bg-[#10B981] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Confirmés ({confirmedCount})
            </button>
            <button
              id="tab-paiement-rejete"
              onClick={() => setFilterStatut('rejete')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                filterStatut === 'rejete'
                  ? 'bg-[#18181B] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Rejetés ({rejectedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-1.5">
            <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-900">
              {paiements.length === 0 ? 'Aucun paiement' : 'Aucune transaction trouvée'}
            </p>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (Hidden on Tablet/Desktop, perfect for portrait and landscape phones) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filtered.map((p) => {
                const dateStr = new Date(p.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <div key={p.id} className="p-4 space-y-3.5 hover:bg-slate-50/50 transition-colors">
                    {/* Student Info & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center font-bold text-xs shrink-0 border border-[#5B3CC4]/15">
                          {p.profile?.full_name ? p.profile.full_name.charAt(0) : 'E'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-slate-900 truncate">{p.profile?.full_name || 'Étudiant'}</p>
                          <p className="text-[10px] text-slate-400 truncate">{p.profile?.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(p.statut)}
                      </div>
                    </div>

                    {/* Financial details grid */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10px]">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-bold block uppercase tracking-wider text-[8px]">Type d'accès</span>
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-[#EDE9FE] text-[#5B3CC4] border border-[#5B3CC4]/20">
                          Pass S{p.semestre}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-bold block uppercase tracking-wider text-[8px]">Montant réglé</span>
                        <span className="font-bold text-xs text-slate-900">{p.montant.toLocaleString()} F</span>
                      </div>
                    </div>

                    {/* Reference and Date info */}
                    <div className="flex items-center justify-between gap-2.5 text-[10px]">
                      <div>
                        <span className="text-slate-400 font-semibold mr-1">Réf:</span>
                        <code className="font-mono font-bold bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200 text-slate-800">
                          {p.reference || 'Aucune'}
                        </code>
                      </div>
                      <span className="text-[10px] text-slate-400">Date: <strong>{dateStr}</strong></span>
                    </div>

                    {/* Quick action buttons for pending payments */}
                    {p.statut === 'en_attente' && (
                      <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-50">
                        <button
                          id={`mobile-valider-payment-${p.id}`}
                          disabled={processingId === p.id}
                          onClick={() => handleValidate(p.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-[10px] font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-[0.98] disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Valider</span>
                        </button>
                        <button
                          id={`mobile-rejeter-payment-${p.id}`}
                          disabled={processingId === p.id}
                          onClick={() => setPaymentToReject(p.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Rejeter</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 2. Desktop Table View (Hidden on Mobile, Visible from tablet md: and up) */}
            <div className="hidden md:block overflow-x-auto">
              <table id="paiements-table" className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 sm:px-4">Étudiant</th>
                    <th className="py-2.5 px-3">Pass</th>
                    <th className="py-2.5 px-3">Montant</th>
                    <th className="py-2.5 px-3">Référence</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Statut</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p) => {
                    const dateStr = new Date(p.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 sm:px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center font-bold text-xs shrink-0 border border-[#5B3CC4]/15">
                              {p.profile?.full_name ? p.profile.full_name.charAt(0) : 'E'}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-slate-900">{p.profile?.full_name || 'Étudiant'}</p>
                              <p className="text-[11px] text-slate-400">{p.profile?.email || 'N/A'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#EDE9FE] text-[#5B3CC4] border border-[#5B3CC4]/20">
                            Pass S{p.semestre}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="font-bold text-xs text-slate-900">{p.montant.toLocaleString()} F</span>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <code className="text-[11px] font-mono font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                            {p.reference || 'Aucune'}
                          </code>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap text-[11px] text-slate-500">{dateStr}</td>

                        <td className="py-2.5 px-3 whitespace-nowrap">{getStatusBadge(p.statut)}</td>

                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          {p.statut === 'en_attente' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                id={`valider-payment-${p.id}`}
                                disabled={processingId === p.id}
                                onClick={() => handleValidate(p.id)}
                                className="px-2.5 py-1 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-[0.98] disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Valider</span>
                              </button>
                              <button
                                id={`rejeter-payment-${p.id}`}
                                disabled={processingId === p.id}
                                onClick={() => setPaymentToReject(p.id)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Rejeter</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">Traité</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* In-app Rejection Confirmation Modal */}
      {paymentToReject && (
        <div
          id="reject-payment-modal"
          onClick={() => setPaymentToReject(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 p-5 max-w-sm w-full shadow-2xl space-y-3.5 animate-in-scale"
          >
            <div className="flex items-center gap-2.5 text-rose-600">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Rejeter le paiement</h3>
                <p className="text-[11px] text-slate-400">Accès étudiant bloqué</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              Confirmez-vous le rejet de cette transaction ? L'accès de l'étudiant restera verrouillé.
            </p>

            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPaymentToReject(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                id="confirm-reject-btn"
                type="button"
                disabled={processingId === paymentToReject}
                onClick={confirmReject}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 active:scale-[0.98] transition-all"
              >
                {processingId === paymentToReject ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rejet en cours...</span>
                  </>
                ) : (
                  <span>Confirmer le rejet</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
