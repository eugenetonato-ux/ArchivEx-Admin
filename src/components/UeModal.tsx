import React, { useState } from 'react';
import { X, GraduationCap, AlertCircle, Sparkles } from 'lucide-react';
import { UE, Semestre } from '../types';

interface UeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<UE, 'id'>) => Promise<void>;
}

export const UeModal: React.FC<UeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [nom, setNom] = useState('');
  const [code, setCode] = useState('');
  const [semestre, setSemestre] = useState<Semestre>('S1');
  const [couleur, setCouleur] = useState<string>('#5B3CC4');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nom.trim()) {
      setErrorMsg("Veuillez saisir le nom de l'UE.");
      return;
    }
    if (!code.trim()) {
      setErrorMsg("Veuillez saisir le code d'UE (ex: INF101).");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        nom: nom.trim(),
        code: code.trim().toUpperCase(),
        semestre,
        couleur
      });
      setNom('');
      setCode('');
      setCouleur('#5B3CC4');
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de la création de l'UE");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="ue-modal-container"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="ue-modal-dialog"
        className="bg-white rounded-3xl border border-[#E4E4E7] shadow-2xl max-w-md w-full animate-in-scale"
      >
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#5B3CC4] flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#18181B]">Ajouter une UE</h2>
            </div>
          </div>
          <button
            id="ue-modal-close-btn"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-pink-50 border border-pink-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label htmlFor="ue-code-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Code de l'UE *
            </label>
            <input
              id="ue-code-input"
              type="text"
              required
              placeholder="Ex: INF101"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs uppercase tracking-wider font-mono font-bold focus:outline-hidden focus:border-[#5B3CC4] focus:ring-2 focus:ring-[#5B3CC4]/15 bg-slate-50/60 text-[#18181B]"
            />
          </div>

          <div>
            <label htmlFor="ue-nom-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Intitulé *
            </label>
            <input
              id="ue-nom-input"
              type="text"
              required
              placeholder="Ex: Algorithmique & Programmation"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-[#5B3CC4] focus:ring-2 focus:ring-[#5B3CC4]/15 bg-slate-50/60 text-[#18181B]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Semestre *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['S1', 'S2'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  id={`semestre-choice-${s}`}
                  onClick={() => setSemestre(s)}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                    semestre === s
                      ? 'border-[#5B3CC4] bg-[#EDE9FE] text-[#5B3CC4] shadow-2xs'
                      : 'border-slate-200 text-slate-600 bg-slate-50/60 hover:bg-slate-100'
                  }`}
                >
                  Semestre {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Couleur de la carte (Code Hex) *
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex flex-wrap gap-1.5 flex-1">
                {[
                  { hex: '#5B3CC4', label: 'Violet' },
                  { hex: '#6366F1', label: 'Indigo' },
                  { hex: '#EC4899', label: 'Rose' },
                  { hex: '#EA580C', label: 'Orange' },
                  { hex: '#059669', label: 'Vert' }
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    id={`color-choice-${c.hex.replace('#', '')}`}
                    onClick={() => setCouleur(c.hex)}
                    style={{ borderColor: couleur === c.hex ? c.hex : 'transparent' }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                      couleur === c.hex
                        ? `ring-2 ring-slate-400/15 shadow-2xs`
                        : 'border-slate-200 text-slate-600 bg-slate-50/60 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Custom hex/color input */}
              <div className="flex items-center gap-2 border border-slate-200 bg-slate-50/60 p-1 rounded-xl shrink-0">
                <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-200 cursor-pointer flex items-center justify-center bg-white">
                  <input
                    type="color"
                    value={couleur}
                    onChange={(e) => setCouleur(e.target.value)}
                    className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0"
                  />
                  <div className="w-5 h-5 rounded-md border border-slate-200/50" style={{ backgroundColor: couleur }} />
                </div>
                <input
                  type="text"
                  maxLength={7}
                  value={couleur}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (!val.startsWith('#') && val.length > 0) val = '#' + val;
                    setCouleur(val);
                  }}
                  className="w-16 text-center text-[10px] font-mono font-bold bg-transparent border-0 p-0 text-slate-800 uppercase focus:ring-0 focus:outline-hidden dark:text-white"
                  placeholder="#Hex"
                />
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              id="cancel-ue-btn"
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              id="save-ue-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-lg bg-[#5B3CC4] hover:bg-[#4C2FB0] text-white text-xs font-bold shadow-2xs active:scale-[0.98]"
            >
              {isSubmitting ? 'Création...' : "Créer l'UE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
