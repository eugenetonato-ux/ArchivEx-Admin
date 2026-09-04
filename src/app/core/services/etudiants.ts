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

const INITIAL_ETUDIANTS: EtudiantProfile[] = [];

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
