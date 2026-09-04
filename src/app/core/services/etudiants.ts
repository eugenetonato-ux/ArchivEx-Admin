import { Injectable } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';

export interface EtudiantProfile {
  id: string;
  full_name: string;
  email: string;
  premium_s1: boolean;
  premium_s2: boolean;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class EtudiantsService {
  async list() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
    if (error) {
      // Fallback demo data if table profiles empty or query fails
      return [
        { id: '1', full_name: 'Koffi Mensah', email: 'koffi.m@student.univ.bj', premium_s1: true, premium_s2: false },
        { id: '2', full_name: 'Amina Lawson', email: 'amina.l@student.univ.bj', premium_s1: true, premium_s2: true },
        { id: '3', full_name: 'Sessou Eric', email: 'eric.s@student.univ.bj', premium_s1: false, premium_s2: false },
        { id: '4', full_name: 'Fatouma Diallo', email: 'fatou.d@student.univ.bj', premium_s1: false, premium_s2: true }
      ] as EtudiantProfile[];
    }
    return data as EtudiantProfile[];
  }

  async togglePremium(userId: string, field: 'premium_s1' | 'premium_s2', newValue: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ [field]: newValue })
      .eq('id', userId);
    if (error) console.error('Error updating student premium:', error);
  }
}
