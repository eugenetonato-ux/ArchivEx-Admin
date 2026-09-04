import { Injectable, signal } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  ready = signal(false);
  currentUserId = signal<string | null>(null);

  constructor() {
    supabase.auth.getSession().then(({ data }) => {
      this.currentUserId.set(data.session?.user.id ?? null);
      this.ready.set(true);
    }).catch((err) => {
      console.error("Erreur getSession:", err);
      this.ready.set(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUserId.set(session?.user.id ?? null);
      this.ready.set(true); 
    });
  }

  async waitUntilReady() {
    const timeout = Date.now() + 3000; 
    while (!this.ready() && Date.now() < timeout) {
      await new Promise(r => setTimeout(r, 50));
    }
  }

  isAuthenticated() {
    return !!this.currentUserId();
  }

  async signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion serveur:', error);
    } finally {
      // On force la déconnexion locale dans tous les cas
      this.currentUserId.set(null);
    }
  }
}