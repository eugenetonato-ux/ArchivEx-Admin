import { Injectable, signal, inject } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { Paiement } from '../models/paiement.model';
import { EtudiantsService } from './etudiants';

export interface PaiementExtended extends Paiement {
  profile?: {
    full_name: string;
    email: string;
  };
}

const INITIAL_PAIEMENTS: PaiementExtended[] = [
  {
    id: 'pay-1',
    user_id: '1',
    montant: 5000,
    semestre: 'S1',
    statut: 'en_attente',
    reference: 'SB-99481',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    profile: {
      full_name: 'Koffi Mensah',
      email: 'koffi.m@student.univ.bj'
    }
  },
  {
    id: 'pay-2',
    user_id: '3',
    montant: 5000,
    semestre: 'S2',
    statut: 'en_attente',
    reference: 'MTN-88219',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    profile: {
      full_name: 'Sessou Eric',
      email: 'eric.s@student.univ.bj'
    }
  },
  {
    id: 'pay-3',
    user_id: '2',
    montant: 5000,
    semestre: 'S1',
    statut: 'confirme',
    reference: 'MOOV-44120',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    profile: {
      full_name: 'Amina Lawson',
      email: 'amina.l@student.univ.bj'
    }
  },
  {
    id: 'pay-4',
    user_id: '4',
    montant: 5000,
    semestre: 'S2',
    statut: 'confirme',
    reference: 'SB-11029',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    profile: {
      full_name: 'Fatouma Diallo',
      email: 'fatou.d@student.univ.bj'
    }
  }
];

@Injectable({ providedIn: 'root' })
export class PaiementsService {
  private localPaiements = signal<PaiementExtended[]>(INITIAL_PAIEMENTS);
  private etudiantsSvc = inject(EtudiantsService);

  async list(statut?: string): Promise<PaiementExtended[]> {
    try {
      let query = supabase
        .from('paiements')
        .select('*, profile:user_id(full_name, email)')
        .order('created_at', { ascending: false });
      if (statut) query = query.eq('statut', statut);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        this.localPaiements.set(data as PaiementExtended[]);
      }
    } catch {
      // Use local state
    }

    let items = this.localPaiements();
    if (statut) {
      items = items.filter(p => p.statut === statut);
    }
    return items;
  }

  async valider(paiementId: string): Promise<void> {
    const target = this.localPaiements().find(p => p.id === paiementId);

    try {
      await supabase.rpc('valider_paiement', { p_paiement_id: paiementId });
    } catch {
      // Fallback local execution of procedure
    }

    // Update local state
    this.localPaiements.update(list =>
      list.map(p => (p.id === paiementId ? { ...p, statut: 'confirme' } : p))
    );

    // Grant premium access to student
    if (target) {
      const field = target.semestre === 'S1' ? 'premium_s1' : 'premium_s2';
      await this.etudiantsSvc.togglePremium(target.user_id, field, true);
    }
  }
}
