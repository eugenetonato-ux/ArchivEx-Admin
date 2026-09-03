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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Inscrits</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{profiles.length}</p>
          </div>
          <div className="w-7 h-7 rounded-md bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Abonnés Pass S1</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{countS1}</p>
          </div>
          <div className="w-7 h-7 rounded-md bg-indigo-50 text-[#6366F1] flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Abonnés Pass S2</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{countS2}</p>
          </div>
          <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#10B981] flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
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
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-[#18181B] placeholder-slate-400 focus:outline-hidden focus:border-[#5B3CC4] focus:ring-2 focus:ring-[#5B3CC4]/15 transition-all bg-slate-50/60"
          />
        </div>

        <div className="text-[11px] text-slate-500 px-1 flex items-center gap-1.5 shrink-0">
          <UserCheck className="w-3.5 h-3.5 text-[#5B3CC4]" />
          <span>
            <strong>{filtered.length}</strong> étudiants
          </span>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-1.5">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-900">Aucun étudiant</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                          <p className="font-bold text-xs text-[#18181B]">{p.full_name}</p>
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
        )}
      </div>
    </div>
  );
};
