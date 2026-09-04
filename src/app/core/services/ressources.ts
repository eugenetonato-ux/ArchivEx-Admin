import { Injectable, signal } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { Ressource } from '../models/ressource.model';

const INITIAL_RESSOURCES: Ressource[] = [
  {
    id: 'res-1',
    type: 'epreuve',
    titre: 'Examen Final Algorithmique C (2024)',
    ue_id: 'ue-1',
    semestre: 'S1',
    annee: 2024,
    session: 'normale',
    is_premium: false,
    epreuve_liee_id: null,
    fichier_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'res-2',
    type: 'corrige',
    titre: 'Corrigé Détaillé Examen Algorithmique C (2024)',
    ue_id: 'ue-1',
    semestre: 'S1',
    annee: 2024,
    session: 'normale',
    is_premium: true, // Forcé Premium par règle métier
    epreuve_liee_id: 'res-1',
    fichier_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'res-3',
    type: 'resume',
    titre: 'Fiche Synthèse - Architecture des Ordinateurs (ASSEMBLY & RISC-V)',
    ue_id: 'ue-2',
    semestre: 'S1',
    annee: 2024,
    session: 'normale',
    is_premium: true, // Forcé Premium par règle métier
    epreuve_liee_id: null,
    fichier_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'res-4',
    type: 'epreuve',
    titre: 'Épreuve Blance Structures de Données & Arbres (S2)',
    ue_id: 'ue-5',
    semestre: 'S2',
    annee: 2024,
    session: 'normale',
    is_premium: false,
    epreuve_liee_id: null,
    fichier_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'res-5',
    type: 'corrige',
    titre: 'Corrigé Épreuve Blanche Structures de Données (S2)',
    ue_id: 'ue-5',
    semestre: 'S2',
    annee: 2024,
    session: 'normale',
    is_premium: true, // Forcé Premium par règle métier
    epreuve_liee_id: 'res-4',
    fichier_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    created_at: new Date(Date.now() - 3600000 * 30).toISOString()
  }
];

@Injectable({ providedIn: 'root' })
export class RessourcesService {
  private localRessources = signal<Ressource[]>(INITIAL_RESSOURCES);

  async list(filtres: { semestre?: string; type?: string; q?: string } = {}): Promise<Ressource[]> {
    try {
      let query = supabase.from('ressources').select('*, ue:ue_id(nom, code)').order('created_at', { ascending: false });
      if (filtres.semestre) query = query.eq('semestre', filtres.semestre);
      if (filtres.type) query = query.eq('type', filtres.type);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        this.localRessources.set(data as Ressource[]);
      }
    } catch {
      // Ignore error and use local fallback
    }

    let result = this.localRessources();
    if (filtres.semestre) {
      result = result.filter(r => r.semestre === filtres.semestre);
    }
    if (filtres.type) {
      result = result.filter(r => r.type === filtres.type);
    }
    if (filtres.q) {
      const queryStr = filtres.q.toLowerCase();
      result = result.filter(r => r.titre.toLowerCase().includes(queryStr));
    }
    return result;
  }

  async creer(
    ressource: Omit<Ressource, 'id' | 'fichier_url' | 'created_at'>,
    fichier?: File | null
  ): Promise<Ressource> {
    // REGLER METIER TRG_FORCER_PREMIUM :
    // Tout corrigé ou résumé est FORCÉMENT Premium
    const forcePremium = ressource.type === 'corrige' || ressource.type === 'resume';
    const isPremiumFinal = forcePremium ? true : ressource.is_premium;

    const newRes: Ressource = {
      ...ressource,
      id: 'res-' + Date.now(),
      is_premium: isPremiumFinal,
      fichier_url: fichier ? URL.createObjectURL(fichier) : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      created_at: new Date().toISOString()
    };

    try {
      const { data: inserted, error: errInsert } = await supabase
        .from('ressources')
        .insert({ ...ressource, is_premium: isPremiumFinal, fichier_url: '' })
        .select()
        .single();

      if (!errInsert && inserted) {
        newRes.id = inserted.id;
        if (fichier) {
          const chemin = `fichiers/${inserted.id}`;
          await supabase.storage.from('ressources').upload(chemin, fichier);
          await supabase.from('ressources').update({ fichier_url: chemin }).eq('id', inserted.id);
          newRes.fichier_url = chemin;
        }
      }
    } catch {
      // Local fallback mode
    }

    this.localRessources.update(list => [newRes, ...list]);
    return newRes;
  }

  async supprimer(id: string): Promise<void> {
    try {
      await supabase.storage.from('ressources').remove([`fichiers/${id}`]);
      await supabase.from('ressources').delete().eq('id', id);
    } catch {
      // Fallback local
    }
    this.localRessources.update(list => list.filter(r => r.id !== id));
  }
}
