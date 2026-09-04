import { Injectable, signal } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { UE, Semestre } from '../models/ue.model';

const INITIAL_UES: UE[] = [
  { id: 'ue-1', nom: 'Algorithmique et Programmation C', code: 'INF101', semestre: 'S1' },
  { id: 'ue-2', nom: 'Architecture des Ordinateurs', code: 'INF102', semestre: 'S1' },
  { id: 'ue-3', nom: 'Analyse Mathématique I', code: 'MAT101', semestre: 'S1' },
  { id: 'ue-4', nom: 'Électricité et Électronique de base', code: 'PHY101', semestre: 'S1' },
  { id: 'ue-5', nom: 'Structures de Données & Algorithmes', code: 'INF201', semestre: 'S2' },
  { id: 'ue-6', nom: 'Systèmes d\'Exploitation & Linux', code: 'INF202', semestre: 'S2' },
  { id: 'ue-7', nom: 'Algèbre Linéaire & Matrice', code: 'MAT201', semestre: 'S2' },
  { id: 'ue-8', nom: 'Réseaux & Télécommunications', code: 'INF204', semestre: 'S2' }
];

@Injectable({ providedIn: 'root' })
export class UeService {
  private localUes = signal<UE[]>(INITIAL_UES);

  async list(semestre?: Semestre): Promise<UE[]> {
    try {
      let query = supabase.from('ue').select('*').order('nom');
      if (semestre) query = query.eq('semestre', semestre);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Merge Supabase UEs with initial ones if needed
        const supabaseUes = data as UE[];
        this.localUes.set(supabaseUes);
        return supabaseUes;
      }
    } catch {
      // Ignore Supabase error and use local state
    }

    let items = this.localUes();
    if (semestre) {
      items = items.filter(u => u.semestre === semestre);
    }
    return items;
  }

  async creer(ue: Omit<UE, 'id'>): Promise<UE> {
    const newUe: UE = {
      ...ue,
      id: 'ue-' + Date.now()
    };

    try {
      const { data, error } = await supabase.from('ue').insert(ue).select().single();
      if (!error && data) {
        newUe.id = data.id;
      }
    } catch {
      // Local fallback
    }

    this.localUes.update(list => [newUe, ...list]);
    return newUe;
  }

  async supprimer(id: string): Promise<void> {
    try {
      await supabase.from('ue').delete().eq('id', id);
    } catch {
      // Local fallback
    }
    this.localUes.update(list => list.filter(u => u.id !== id));
  }
}
