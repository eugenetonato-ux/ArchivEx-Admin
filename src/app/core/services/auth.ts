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
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUserId.set(session?.user.id ?? null);
    });
  }

  async waitUntilReady() {
    while (!this.ready()) {
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
    await supabase.auth.signOut();
  }
}
