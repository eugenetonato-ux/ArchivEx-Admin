import React, { useState } from 'react';
import { Users, Shield, Check, X, Search, Sparkles, UserCheck, ShieldCheck, UserX } from 'lucide-react';
import { UserProfile } from '../types';

interface EtudiantsPageProps {
  profiles: UserProfile[];
  onTogglePremium: (userId: string, semestre: 'S1' | 'S2', currentVal: boolean) => void;
}

export const EtudiantsPage: React.FC<EtudiantsPageProps> = ({
  profiles,
  onTogglePremium
}) => {
  const [search, setSearch] = useState('');

  const countS1 = profiles.filter((p) => p.premium_s1).length;
  const countS2 = profiles.filter((p) => p.premium_s2).length;

  const filtered = profiles.filter((p) => {
    if (search.trim() === '') return true;
    const q = search.toLowerCase();
    return p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
  });

  return (
    <div id="etudiants-page-container" className="space-y-4">
      {/* Top metric overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1145] to-[#12082C] text-white p-4 rounded-xl border border-violet-500/20 shadow-md group hover:scale-[1.01] transition-transform duration-200">
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-violet-600/25 rounded-full blur-xl group-hover:bg-violet-600/40 transition-colors" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Total Inscrits</p>
              <p className="text-2xl font-black text-white mt-1.5">{profiles.length}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center border border-violet-500/30">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-[#101030] to-[#1D1D45] text-white p-4 rounded-xl border border-indigo-500/20 shadow-md group hover:scale-[1.01] transition-transform duration-200">
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-indigo-500/25 rounded-full blur-xl group-hover:bg-indigo-500/40 transition-colors" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Abonnés Pass S1</p>
              <p className="text-2xl font-black text-white mt-1.5">{countS1}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-[#062F20] to-[#0A4D34] text-white p-4 rounded-xl border border-emerald-500/25 shadow-md group hover:scale-[1.01] transition-transform duration-200">
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-emerald-500/25 rounded-full blur-xl group-hover:bg-emerald-500/40 transition-colors" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Abonnés Pass S2</p>
              <p className="text-2xl font-black text-white mt-1.5">{countS2}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#5B3CC4] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="etudiants-search-input"
            type="text"
            placeholder="Rechercher par nom ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#5B3CC4] focus:ring-2 focus:ring-[#5B3CC4]/15 transition-all bg-slate-50/60"
          />
        </div>

        <div className="text-[11px] text-slate-500 px-1 flex items-center gap-1.5 shrink-0">
          <UserCheck className="w-3.5 h-3.5 text-[#5B3CC4]" />
          <span>
            <strong>{filtered.length}</strong> étudiants
          </span>
        </div>
      </div>

      {/* Profiles Table / Cards Grid */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-1.5">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-900">Aucun étudiant</p>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (Hidden on Tablet/Desktop, perfect for portrait and landscape phones) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filtered.map((p) => {
                const initials = p.full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                const dateStr = new Date(p.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <div key={p.id} className="p-4 space-y-3.5 hover:bg-slate-50/50 transition-colors">
                    {/* Student Info */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#5B3CC4] font-bold flex items-center justify-center text-xs border border-[#5B3CC4]/20 shrink-0">
                        {initials || 'ET'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-xs text-slate-900 truncate">{p.full_name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{p.email}</p>
                      </div>
                    </div>

                    {/* Pass Statuses & Inscription Date */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10px]">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-bold block uppercase tracking-wider text-[8px]">Pass Semestre 1</span>
                        {p.premium_s1 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[#059669] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <Check className="w-2.5 h-2.5 text-[#10B981]" />
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            Inactif
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-bold block uppercase tracking-wider text-[8px]">Pass Semestre 2</span>
                        {p.premium_s2 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[#059669] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <Check className="w-2.5 h-2.5 text-[#10B981]" />
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            Inactif
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Date and Quick Action Switches */}
                    <div className="flex items-center justify-between gap-2.5 pt-1">
                      <span className="text-[10px] text-slate-400">Inscrit le : <strong>{dateStr}</strong></span>
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`mobile-toggle-s1-${p.id}`}
                          onClick={() => onTogglePremium(p.id, 'S1', p.premium_s1)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                            p.premium_s1
                              ? 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50'
                              : 'bg-[#EDE9FE] border-[#5B3CC4]/20 text-[#5B3CC4] hover:bg-[#DDD6FE]'
                          }`}
                        >
                          {p.premium_s1 ? 'Révoquer S1' : 'Activer S1'}
                        </button>
                        <button
                          id={`mobile-toggle-s2-${p.id}`}
                          onClick={() => onTogglePremium(p.id, 'S2', p.premium_s2)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                            p.premium_s2
                              ? 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50'
                              : 'bg-[#EDE9FE] border-[#5B3CC4]/20 text-[#5B3CC4] hover:bg-[#DDD6FE]'
                          }`}
                        >
                          {p.premium_s2 ? 'Révoquer S2' : 'Activer S2'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. Desktop Table View (Hidden on Mobile, Visible from tablet md: and up) */}
            <div className="hidden md:block overflow-x-auto">
              <table id="etudiants-table" className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 sm:px-4">Étudiant</th>
                    <th className="py-2.5 px-3">Pass S1</th>
                    <th className="py-2.5 px-3">Pass S2</th>
                    <th className="py-2.5 px-3">Inscription</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p) => {
                    const initials = p.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    const dateStr = new Date(p.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 sm:px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] text-[#5B3CC4] font-bold flex items-center justify-center text-[10px] border border-[#5B3CC4]/20 shrink-0">
                              {initials || 'ET'}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-slate-900">{p.full_name}</p>
                              <p className="text-[11px] text-slate-400">{p.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {p.premium_s1 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#059669] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3 text-[#10B981]" />
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Inactif
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {p.premium_s2 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#059669] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3 text-[#10B981]" />
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Inactif
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap text-[11px] text-slate-500">
                          {dateStr}
                        </td>

                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`toggle-s1-${p.id}`}
                              onClick={() => onTogglePremium(p.id, 'S1', p.premium_s1)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                                p.premium_s1
                                  ? 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50'
                                  : 'bg-[#EDE9FE] border-[#5B3CC4]/20 text-[#5B3CC4] hover:bg-[#DDD6FE]'
                              }`}
                            >
                              {p.premium_s1 ? 'Révoquer S1' : 'Activer S1'}
                            </button>
                            <button
                              id={`toggle-s2-${p.id}`}
                              onClick={() => onTogglePremium(p.id, 'S2', p.premium_s2)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                                p.premium_s2
                                  ? 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50'
                                  : 'bg-[#EDE9FE] border-[#5B3CC4]/20 text-[#5B3CC4] hover:bg-[#DDD6FE]'
                              }`}
                            >
                              {p.premium_s2 ? 'Révoquer S2' : 'Activer S2'}
                            </button>
                          </div>
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
    </div>
  );
};
