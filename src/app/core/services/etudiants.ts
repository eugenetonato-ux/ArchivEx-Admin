import { Injectable, signal } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';

export interface EtudiantProfile {
  id: string;
  full_name: string;
  email: string;
  premium_s1: boolean;
  premium_s2: boolean;
  created_at?: string;
}

const INITIAL_ETUDIANTS: EtudiantProfile[] = [
  { id: '1', full_name: 'Koffi Mensah', email: 'koffi.m@student.univ.bj', premium_s1: true, premium_s2: false },
  { id: '2', full_name: 'Amina Lawson', email: 'amina.l@student.univ.bj', premium_s1: true, premium_s2: true },
  { id: '3', full_name: 'Sessou Eric', email: 'eric.s@student.univ.bj', premium_s1: false, premium_s2: false },
  { id: '4', full_name: 'Fatouma Diallo', email: 'fatou.d@student.univ.bj', premium_s1: false, premium_s2: true },
  { id: '5', full_name: 'Marc Kouassi', email: 'marc.k@student.univ.bj', premium_s1: false, premium_s2: false }
];

@Injectable({ providedIn: 'root' })
export class EtudiantsService {
  private localEtudiants = signal<EtudiantProfile[]>(INITIAL_ETUDIANTS);

  async list(): Promise<EtudiantProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });
      if (!error && data && data.length > 0) {
        this.localEtudiants.set(data as EtudiantProfile[]);
      }
    } catch {
      // Use local state
    }
    return this.localEtudiants();
  }

  async togglePremium(userId: string, field: 'premium_s1' | 'premium_s2', newValue: boolean): Promise<void> {
    try {
      await supabase
        .from('profiles')
        .update({ [field]: newValue })
        .eq('id', userId);
    } catch {
      // Ignore fallback
    }

    this.localEtudiants.update(list =>
      list.map(e => (e.id === userId ? { ...e, [field]: newValue } : e))
    );
  }
}
