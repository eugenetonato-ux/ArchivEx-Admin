import { Injectable, signal } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { AdminAction, ActionCategory } from '../models/admin-action.model';

const STORAGE_KEY = 'archivex_admin_actions_v1';

const INITIAL_SEED_ACTIONS: AdminAction[] = [
  {
    id: 'seed-1',
    title: 'Validation de Paiement',
    description: 'Paiement MoMo de 15,000 FCFA validé pour l\'étudiant #2024-089 (Pass Annuel)',
    category: 'payment',
    actor_email: 'admin@archivex.univ.bj',
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'success'
  },
  {
    id: 'seed-2',
    title: 'Nouvelle Ressource Pédagogique',
    description: 'Publication de "Examen Corrigé Algorithmique S1 (INF101)"',
    category: 'ressource',
    actor_email: 'admin@archivex.univ.bj',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'info'
  },
  {
    id: 'seed-3',
    title: 'Création d\'une Unité d\'Enseignement',
    description: 'Matière "Analyse Numérique & Mathématiques (MAT102)" ajoutée au Semestre 2',
    category: 'ue',
    actor_email: 'admin@archivex.univ.bj',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    status: 'info'
  },
  {
    id: 'seed-4',
    title: 'Mise à jour Profil Étudiant',
    description: 'Statut Premium activé pour l\'étudiant Bio Bio Marc (N° 2024-012)',
    category: 'etudiant',
    actor_email: 'admin@archivex.univ.bj',
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    status: 'success'
  },
  {
    id: 'seed-5',
    title: 'Refus de Paiement',
    description: 'Paiement rejeté pour Référence introuvable #2024-999',
    category: 'payment',
    actor_email: 'admin@archivex.univ.bj',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: 'danger'
  }
];

@Injectable({ providedIn: 'root' })
export class AdminActionsService {
  actions = signal<AdminAction[]>([]);
  loading = signal<boolean>(false);

  constructor() {
    this.fetchActions();
  }

  async fetchActions(): Promise<AdminAction[]> {
    this.loading.set(true);
    try {
      // Try Supabase persistent database store first
      const { data, error } = await supabase
        .from('admin_action_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        const mapped: AdminAction[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category || 'system',
          actor_email: item.actor_email || 'admin@archivex.univ.bj',
          created_at: item.created_at || new Date().toISOString(),
          status: item.status || 'info',
          metadata: item.metadata || {}
        }));
        this.actions.set(mapped);
        this.syncToLocalStorage(mapped);
        this.loading.set(false);
        return mapped;
      }
    } catch {
      // Fallback silently if table query fails or network is offline
    }

    // Local storage fallback for guaranteed demo persistence
    const local = this.getFromLocalStorage();
    this.actions.set(local);
    this.loading.set(false);
    return local;
  }

  async logAction(actionData: Omit<AdminAction, 'id' | 'created_at'>): Promise<AdminAction> {
    const newAction: AdminAction = {
      ...actionData,
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString()
    };

    // Prepend to current action feed in memory & local storage
    const currentList = [newAction, ...this.actions()];
    this.actions.set(currentList);
    this.syncToLocalStorage(currentList);

    // Persist to Supabase table asynchronously
    try {
      await supabase.from('admin_action_logs').insert([
        {
          id: newAction.id,
          title: newAction.title,
          description: newAction.description,
          category: newAction.category,
          actor_email: newAction.actor_email,
          created_at: newAction.created_at,
          status: newAction.status
        }
      ]);
    } catch {
      // Ignore background insert error
    }

    return newAction;
  }

  async clearAllActions(): Promise<void> {
    this.actions.set([]);
    localStorage.removeItem(STORAGE_KEY);
    try {
      await supabase.from('admin_action_logs').delete().neq('id', '');
    } catch {}
  }

  private getFromLocalStorage(): AdminAction[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    this.syncToLocalStorage(INITIAL_SEED_ACTIONS);
    return INITIAL_SEED_ACTIONS;
  }

  private syncToLocalStorage(items: AdminAction[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }
}
