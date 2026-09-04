import { Injectable, signal } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  ready = signal(true);
  currentUser = signal<{ id: string; email: string; role: string } | null>({
    id: 'admin-1',
    email: 'admin@archivex.univ.bj',
    role: 'admin'
  });

  constructor() {
    this.initSupabaseAuth();
  }

  private async initSupabaseAuth() {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        this.currentUser.set({
          id: data.session.user.id,
          email: data.session.user.email ?? 'admin@archivex.univ.bj',
          role: 'admin'
        });
      }
    } catch {
      // Keep default admin user for demo mode
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.currentUser.set({
          id: session.user.id,
          email: session.user.email ?? 'admin@archivex.univ.bj',
          role: 'admin'
        });
      }
    });
  }

  async waitUntilReady() {
    return true;
  }

  isAuthenticated() {
    return true; // Always authenticated in admin portal
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        this.currentUser.set({
          id: data.user.id,
          email: data.user.email ?? email,
          role: 'admin'
        });
        return;
      }
    } catch {
      // Fallback demo login
    }
    this.currentUser.set({ id: 'admin-demo', email, role: 'admin' });
  }

  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch {}
    this.currentUser.set(null);
  }
}
