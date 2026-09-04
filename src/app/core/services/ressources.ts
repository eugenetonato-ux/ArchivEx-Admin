import { Injectable } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { Ressource } from '../models/ressource.model';

@Injectable({ providedIn: 'root' })
export class RessourcesService {
  async list(filtres: { semestre?: string; type?: string } = {}) {
    let query = supabase.from('ressources').select('*, ue:ue_id(nom)').order('created_at', { ascending: false });
    if (filtres.semestre) query = query.eq('semestre', filtres.semestre);
    if (filtres.type) query = query.eq('type', filtres.type);
    const { data, error } = await query;
    if (error) throw error;
    return data as Ressource[];
  }

  async creer(ressource: Omit<Ressource, 'id' | 'fichier_url' | 'created_at'>, fichier: File) {
    const { data: inserted, error: errInsert } = await supabase
      .from('ressources')
      .insert({ ...ressource, fichier_url: '' })
      .select()
      .single();
    if (errInsert) throw errInsert;

    const chemin = `fichiers/${inserted.id}`;
    const { error: errUpload } = await supabase.storage.from('ressources').upload(chemin, fichier);
    if (errUpload) throw errUpload;

    const { error: errUpdate } = await supabase
      .from('ressources')
      .update({ fichier_url: chemin })
      .eq('id', inserted.id);
    if (errUpdate) throw errUpdate;
  }

  async supprimer(id: string) {
    await supabase.storage.from('ressources').remove([`fichiers/${id}`]);
    const { error } = await supabase.from('ressources').delete().eq('id', id);
    if (error) throw error;
  }
}
