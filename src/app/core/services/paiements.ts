import { Injectable } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { Paiement } from '../models/paiement.model';

@Injectable({ providedIn: 'root' })
export class PaiementsService {
  async list(statut?: string) {
    let query = supabase
      .from('paiements')
      .select('*, profile:user_id(full_name, email)')
      .order('created_at', { ascending: false });
    if (statut) query = query.eq('statut', statut);
    const { data, error } = await query;
    if (error) throw error;
    return data as (Paiement & { profile: { full_name: string; email: string } })[];
  }

  async valider(paiementId: string) {
    const { error } = await supabase.rpc('valider_paiement', { p_paiement_id: paiementId });
    if (error) throw error;
  }
}
