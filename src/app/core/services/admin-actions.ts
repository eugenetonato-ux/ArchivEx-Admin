import { Injectable, signal } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { AdminAction, ActionCategory } from '../models/admin-action.model';

const STORAGE_KEY = 'archivex_admin_actions_v1';

// Brand new project: zero seed actions
const INITIAL_SEED_ACTIONS: AdminAction[] = [];

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

    // Local storage fallback
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

  async recordAction(
    title: string,
    description: string,
    category: ActionCategory,
    status: 'success' | 'warning' | 'danger' | 'info',
    actor_email: string
  ): Promise<AdminAction> {
    return this.logAction({ title, description, category, status, actor_email });
  }

  async clearAllActions(): Promise<void> {
    this.actions.set([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      await supabase.from('admin_action_logs').delete().neq('id', '');
    } catch {}
  }

  async clearLocalHistory(): Promise<void> {
    return this.clearAllActions();
  }

  private getFromLocalStorage(): AdminAction[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return [];
  }

  private syncToLocalStorage(items: AdminAction[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }
}
