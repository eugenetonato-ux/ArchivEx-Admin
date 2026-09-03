import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, Lock, AlertCircle, FileText, Sparkles, BookOpen } from 'lucide-react';
import { UE, Ressource, TypeRessource, Semestre, SessionType } from '../types';

interface RessourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<Ressource, 'id' | 'fichier_url' | 'created_at'>,
    file: File | { name: string; size: number }
  ) => Promise<void>;
  ues: UE[];
  existingEpreuves: Ressource[];
}

export const RessourceFormModal: React.FC<RessourceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  ues,
  existingEpreuves
}) => {
  const [type, setType] = useState<TypeRessource>('epreuve');
  const [titre, setTitre] = useState('');
  const [ueId, setUeId] = useState('');
  const [semestre, setSemestre] = useState<Semestre>('S1');
  const [annee, setAnnee] = useState<number>(new Date().getFullYear());
  const [session, setSession] = useState<SessionType>('normale');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [epreuveLieeId, setEpreuveLieeId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // When UE changes, synchronize semester
  useEffect(() => {
    if (ueId) {
      const selectedUe = ues.find((u) => u.id === ueId);
      if (selectedUe) {
        setSemestre(selectedUe.semestre);
      }
    }
  }, [ueId, ues]);

  // Set default UE when modal opens
  useEffect(() => {
    if (isOpen && ues.length > 0 && !ueId) {
      setUeId(ues[0].id);
      setSemestre(ues[0].semestre);
    }
  }, [isOpen, ues, ueId]);

  // ARCHIVEX BUSINESS RULE 4.2:
  // "si type = 'corrige' ou type = 'resume' -> le toggle is_premium est affiché coché et désactivé (non modifiable)"
  const isPremiumForced = type === 'corrige' || type === 'resume';
  const effectiveIsPremium = isPremiumForced ? true : isPremium;

  // Filter available épreuves for linking when creating a corrigé
  const candidateEpreuves = existingEpreuves.filter(
    (e) => e.type === 'epreuve' && (!ueId || e.ue_id === ueId)
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!titre.trim()) {
      setErrorMsg('Veuillez saisir le titre du document.');
      return;
    }
    if (!ueId) {
      setErrorMsg("Veuillez sélectionner une Unité d'Enseignement.");
      return;
    }
    if (!selectedFile) {
      setErrorMsg('Veuillez joindre un fichier PDF pour cette ressource.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(
        {
          type,
          titre: titre.trim(),
          ue_id: ueId,
          semestre,
          annee: Number(annee),
          session: type === 'resume' ? null : session,
          is_premium: effectiveIsPremium,
          epreuve_liee_id: type === 'corrige' && epreuveLieeId ? epreuveLieeId : null
        },
        selectedFile
      );
      // Reset
      setTitre('');
      setSelectedFile(null);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      id="ressource-form-modal-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div
        id="ressource-form-modal-dialog"
        className="bg-white rounded-3xl border border-[#E4E4E7] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in-scale"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#18181B]">Nouvelle Ressource</h2>
            </div>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-pink-50 border border-pink-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Type Selector (Épreuve, Corrigé, Résumé) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Type de Ressource *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'epreuve' as const, label: 'Épreuve' },
                { id: 'corrige' as const, label: 'Corrigé' },
                { id: 'resume' as const, label: 'Résumé' }
              ].map((t) => {
                const isSelected = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    id={`type-select-btn-${t.id}`}
                    onClick={() => {
                      setType(t.id);
                      if (t.id === 'corrige' || t.id === 'resume') {
                        setIsPremium(true);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#5B3CC4] bg-[#EDE9FE]/60 ring-1 ring-[#5B3CC4]/30'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#5B3CC4]' : 'text-slate-800'}`}>
                        {t.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#5B3CC4]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Titre */}
          <div>
            <label htmlFor="ressource-titre-input" className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1.5">
              Titre descriptif du document *
            </label>
            <input
              id="ressource-titre-input"
              type="text"
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: Examen Final Algorithmique & ASD I (Session Normale)"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] text-sm text-[#18181B] placeholder-[#71717A] focus:outline-hidden focus:border-[#5B3CC4] focus:ring-3 focus:ring-[#5B3CC4]/15 transition-all bg-[#FAFAF9]"
            />
          </div>

          {/* UE & Semestre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ressource-ue-select" className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1.5">
                Unité d'Enseignement (UE) *
              </label>
              <select
                id="ressource-ue-select"
                value={ueId}
                onChange={(e) => setUeId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] text-sm bg-[#FAFAF9] text-[#18181B] focus:outline-hidden focus:border-[#5B3CC4] focus:ring-3 focus:ring-[#5B3CC4]/15"
              >
                {ues.map((ue) => (
                  <option key={ue.id} value={ue.id}>
                    [{ue.code}] {ue.nom} ({ue.semestre})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ressource-semestre-select" className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1.5">
                Semestre académique *
              </label>
              <select
                id="ressource-semestre-select"
                value={semestre}
                onChange={(e) => setSemestre(e.target.value as Semestre)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] text-sm bg-[#FAFAF9] text-[#18181B] focus:outline-hidden focus:border-[#5B3CC4] focus:ring-3 focus:ring-[#5B3CC4]/15"
              >
                <option value="S1">Semestre 1 (S1)</option>
                <option value="S2">Semestre 2 (S2)</option>
              </select>
            </div>
          </div>

          {/* Année & Session */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ressource-annee-input" className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1.5">
                Année Académique *
              </label>
              <input
                id="ressource-annee-input"
                type="number"
                min={2018}
                max={2030}
                value={annee}
                onChange={(e) => setAnnee(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] text-sm bg-[#FAFAF9] text-[#18181B] focus:outline-hidden focus:border-[#5B3CC4] focus:ring-3 focus:ring-[#5B3CC4]/15"
              />
            </div>

            {type !== 'resume' && (
              <div>
                <label htmlFor="ressource-session-select" className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1.5">
                  Session d'Examen
                </label>
                <select
                  id="ressource-session-select"
                  value={session}
                  onChange={(e) => setSession(e.target.value as SessionType)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] text-sm bg-[#FAFAF9] text-[#18181B] focus:outline-hidden focus:border-[#5B3CC4] focus:ring-3 focus:ring-[#5B3CC4]/15"
                >
                  <option value="normale">Session Normale (Principale)</option>
                  <option value="rattrapage">Session de Rattrapage</option>
                </select>
              </div>
            )}
          </div>

          {/* Liaison Épreuve liée (si type === 'corrige') */}
          {type === 'corrige' && (
            <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7] space-y-2">
              <label htmlFor="epreuve-liee-select" className="block text-xs font-bold text-[#18181B] flex items-center justify-between">
                <span>Épreuve associée (Optionnel)</span>
                <span className="text-[11px] font-normal text-[#71717A]">Liaison sujet ↔ corrigé</span>
              </label>
              <select
                id="epreuve-liee-select"
                value={epreuveLieeId}
                onChange={(e) => setEpreuveLieeId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4E4E7] text-xs bg-white text-[#18181B] focus:outline-hidden focus:border-[#5B3CC4]"
              >
                <option value="">Aucune liaison spécifique</option>
                {candidateEpreuves.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.titre} ({ep.annee} - {ep.session || 'N/A'})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#71717A]">
                Permet aux étudiants dans l'application mobile de basculer en 1-clic entre le sujet et la solution.
              </p>
            </div>
          )}

          {/* BUSINESS RULE 4.2: Statut Premium */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isPremiumForced
              ? 'bg-[#EDE9FE]/50 border-[#5B3CC4]/25 text-[#18181B]'
              : 'bg-[#FAFAF9] border-[#E4E4E7] text-[#18181B]'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">Accès Pass Premium</span>
                  {isPremiumForced ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#5B3CC4] border border-[#5B3CC4]/30">
                      <Lock className="w-3 h-3 text-[#5B3CC4]" /> Pass Requis (Règle Académique)
                    </span>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-200 text-[#71717A]">
                      Configurable
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  {isPremiumForced
                    ? "Les corrigés types et résumés de cours sont STRICTEMENT réservés aux abonnés titulaires du Pass."
                    : "Activez pour réserver ce sujet d'épreuve aux étudiants titulaires d'un abonnement actif."}
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  id="ressource-premium-toggle"
                  type="checkbox"
                  disabled={isPremiumForced}
                  checked={effectiveIsPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  isPremiumForced ? 'peer-checked:bg-[#5B3CC4] opacity-90 cursor-not-allowed' : 'peer-checked:bg-[#5B3CC4]'
                }`}></div>
              </label>
            </div>
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-2">
              Fichier PDF du document *
            </label>
            <div
              id="file-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-[#E4E4E7] hover:border-[#5B3CC4] rounded-2xl p-6 text-center bg-[#FAFAF9] hover:bg-[#EDE9FE]/20 transition-all cursor-pointer"
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3 text-[#18181B]">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold truncate max-w-xs">{selectedFile.name}</p>
                    <p className="text-xs text-[#71717A]">{(selectedFile.size / 1024).toFixed(1)} Ko • Prêt pour le téléversement</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 py-1">
                  <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center mx-auto">
                    <Upload className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Glissez un fichier ou <span className="text-[#5B3CC4] underline">parcourez vos dossiers</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Format PDF jusqu'à 25 Mo</p>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              id="cancel-ressource-btn"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              id="submit-ressource-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-lg bg-[#5B3CC4] hover:bg-[#4C2FB0] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Envoi...</span>
                </>
              ) : (
                <span>Enregistrer</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
