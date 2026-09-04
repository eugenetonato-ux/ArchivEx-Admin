import { Injectable } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { UE, Semestre } from '../models/ue.model';

@Injectable({ providedIn: 'root' })
export class UeService {
  async list(semestre?: Semestre) {
    let query = supabase.from('ue').select('*').order('nom');
    if (semestre) query = query.eq('semestre', semestre);
    const { data, error } = await query;
    if (error) throw error;
    return data as UE[];
  }

  async creer(ue: Omit<UE, 'id'>) {
    const { error } = await supabase.from('ue').insert(ue);
    if (error) throw error;
  }

  async supprimer(id: string) {
    const { error } = await supabase.from('ue').delete().eq('id', id);
    if (error) throw error;
  }
}
