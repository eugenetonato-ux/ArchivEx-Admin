import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  UE,
  Ressource,
  Paiement,
  UserProfile,
  AdminUser,
  Semestre,
  KpiStats,
  TypeRessource
} from '../types';
import {
  INITIAL_UES,
  INITIAL_RESSOURCES,
  INITIAL_PAIEMENTS,
  INITIAL_PROFILES
} from '../data/mockData';

const STORAGE_KEYS = {
  UES: 'archivex_admin_ues',
  RESSOURCES: 'archivex_admin_ressources',
  PAIEMENTS: 'archivex_admin_paiements',
  PROFILES: 'archivex_admin_profiles',
  AUTH: 'archivex_admin_current_user',
  SUPABASE_CONFIG: 'archivex_admin_supabase_config'
};

class ArchivexService {
  private ues: UE[] = [];
  private ressources: Ressource[] = [];
  private paiements: Paiement[] = [];
  private profiles: UserProfile[] = [];
  private currentUser: AdminUser | null = null;
  private supabaseClient: SupabaseClient | null = null;
  private isUsingSupabase = false;

  constructor() {
    this.loadInitialData();
    this.initSupabaseIfAvailable();
  }

  private loadInitialData() {
    try {
      // Purge old test payments, profiles and fictitious resources for fresh delivery
      const isFreshState = localStorage.getItem('archivex_clean_delivery_v3');
      if (!isFreshState) {
        localStorage.removeItem(STORAGE_KEYS.PAIEMENTS);
        localStorage.removeItem(STORAGE_KEYS.PROFILES);
        localStorage.removeItem(STORAGE_KEYS.RESSOURCES);
        localStorage.setItem('archivex_clean_delivery_v3', 'true');
      }

      const savedUes = localStorage.getItem(STORAGE_KEYS.UES);
      this.ues = savedUes ? JSON.parse(savedUes) : [...INITIAL_UES];

      const savedRessources = localStorage.getItem(STORAGE_KEYS.RESSOURCES);
      this.ressources = savedRessources ? JSON.parse(savedRessources) : [];

      const savedPaiements = localStorage.getItem(STORAGE_KEYS.PAIEMENTS);
      this.paiements = savedPaiements ? JSON.parse(savedPaiements) : [...INITIAL_PAIEMENTS];

      const savedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
      this.profiles = savedProfiles ? JSON.parse(savedProfiles) : [...INITIAL_PROFILES];

      const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (savedAuth) {
        try {
          const parsed = JSON.parse(savedAuth);
          if (parsed?.email === 'admin@archivex.univ' || parsed?.name === 'Eugène Tonato') {
            localStorage.removeItem(STORAGE_KEYS.AUTH);
            this.currentUser = null;
          } else {
            this.currentUser = parsed;
          }
        } catch {
          this.currentUser = null;
        }
      } else {
        this.currentUser = null;
      }
    } catch {
      this.ues = [...INITIAL_UES];
      this.ressources = [...INITIAL_RESSOURCES];
      this.paiements = [];
      this.profiles = [];
      this.currentUser = null;
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.UES, JSON.stringify(this.ues));
      localStorage.setItem(STORAGE_KEYS.RESSOURCES, JSON.stringify(this.ressources));
      localStorage.setItem(STORAGE_KEYS.PAIEMENTS, JSON.stringify(this.paiements));
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(this.profiles));
    } catch (e) {
      console.warn('Erreur de sauvegarde locale', e);
    }
  }

  private initSupabaseIfAvailable() {
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const customConfig = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);

    let url = envUrl;
    let key = envKey;

    if (customConfig) {
      try {
        const parsed = JSON.parse(customConfig);
        if (parsed.url && parsed.key) {
          url = parsed.url;
          key = parsed.key;
        }
      } catch {
        // ignore
      }
    }

    if (url && key && !url.includes('<ton-projet>')) {
      try {
        this.supabaseClient = createClient(url, key);
        this.isUsingSupabase = true;
      } catch {
        this.supabaseClient = null;
        this.isUsingSupabase = false;
      }
    }
  }

  // --- Auth & Session ---
  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  public async login(email: string, _password: string): Promise<AdminUser> {
    const rawName = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = rawName
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ') || 'Administrateur';

    const admin: AdminUser = {
      id: 'admin-' + Date.now(),
      email: email.trim(),
      name: formattedName,
      role: 'admin'
    };
    this.currentUser = admin;
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(admin));
    return admin;
  }

  public logout(): void {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }

  // --- UE (Unités d'Enseignement) CRUD ---
  public async getUes(semestre?: Semestre): Promise<UE[]> {
    if (this.isUsingSupabase && this.supabaseClient) {
      try {
        let query = this.supabaseClient.from('ue').select('*').order('nom');
        if (semestre) query = query.eq('semestre', semestre);
        const { data, error } = await query;
        if (!error && data) return data as UE[];
      } catch (err) {
        console.warn('Supabase fallback to local memory', err);
      }
    }

    if (semestre) {
      return this.ues.filter((ue) => ue.semestre === semestre);
    }
    return [...this.ues];
  }

  public async createUe(data: Omit<UE, 'id'>): Promise<UE> {
    const newUe: UE = {
      id: 'ue-' + Math.random().toString(36).substring(2, 9),
      nom: data.nom.trim(),
      code: data.code.trim().toUpperCase(),
      semestre: data.semestre,
      couleur: data.couleur
    };

    if (this.isUsingSupabase && this.supabaseClient) {
      try {
        await this.supabaseClient.from('ue').insert(newUe);
      } catch (e) {
        console.warn('Supabase insert UE failed, persisting in local store', e);
      }
    }

    this.ues.unshift(newUe);
    this.saveState();
    return newUe;
  }

  public async deleteUe(id: string): Promise<void> {
    if (this.isUsingSupabase && this.supabaseClient) {
      try {
        await this.supabaseClient.from('ue').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete UE failed', e);
      }
    }

    this.ues = this.ues.filter((u) => u.id !== id);
    // Also remove or clean up ressources attached to this UE
    this.ressources = this.ressources.filter((r) => r.ue_id !== id);
    this.saveState();
  }

  // --- Ressources CRUD with Business Trigger ---
  public async getRessources(filters?: { semestre?: Semestre; type?: TypeRessource; ue_id?: string; search?: string }): Promise<Ressource[]> {
    let result = this.ressources.map((res) => {
      const ue = this.ues.find((u) => u.id === res.ue_id);
      return {
        ...res,
        ue: ue ? { id: ue.id, nom: ue.nom, code: ue.code } : undefined
      };
    });

    if (filters?.semestre) {
      result = result.filter((r) => r.semestre === filters.semestre);
    }
    if (filters?.type) {
      result = result.filter((r) => r.type === filters.type);
    }
    if (filters?.ue_id) {
      result = result.filter((r) => r.ue_id === filters.ue_id);
    }
    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.titre.toLowerCase().includes(q) ||
          r.ue?.code.toLowerCase().includes(q) ||
          r.ue?.nom.toLowerCase().includes(q)
      );
    }

    // Sort descending by created_at
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async createRessource(
    data: Omit<Ressource, 'id' | 'fichier_url' | 'created_at'>,
    file: File | { name: string; size: number }
  ): Promise<Ressource> {
    // ENFORCE TRIGGER RULE:
    // "Règle : corrigés et résumés toujours premium, quoi qu'envoie le front"
    // create trigger trg_forcer_premium before insert or update on ressources
    let isPremium = data.is_premium;
    if (data.type === 'corrige' || data.type === 'resume') {
      isPremium = true;
    }

    const ressourceId = 'res-' + Math.random().toString(36).substring(2, 9);
    const fileName = file.name || `document_${Date.now()}.pdf`;
    const fileSizeKo = Math.round((file.size || 1024 * 500) / 1024);

    const newRessource: Ressource = {
      id: ressourceId,
      type: data.type,
      titre: data.titre.trim(),
      ue_id: data.ue_id,
      semestre: data.semestre,
      annee: Number(data.annee),
      session: data.session || null,
      fichier_url: `fichiers/${ressourceId}_${fileName}`,
      is_premium: isPremium,
      epreuve_liee_id: data.epreuve_liee_id || null,
      created_at: new Date().toISOString(),
      taille_ko: fileSizeKo
    };

    if (this.isUsingSupabase && this.supabaseClient) {
      try {
        await this.supabaseClient.from('ressources').insert(newRessource);
      } catch (e) {
        console.warn('Supabase insert ressource failed', e);
      }
    }

    this.ressources.unshift(newRessource);
    this.saveState();
    return newRessource;
  }

  public async deleteRessource(id: string): Promise<void> {
    if (this.isUsingSupabase && this.supabaseClient) {
      try {
        await this.supabaseClient.from('ressources').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete ressource failed', e);
      }
    }

    this.ressources = this.ressources.filter((r) => r.id !== id);
    // If other ressources were linked to this exam, remove link
    this.ressources = this.ressources.map((r) => {
      if (r.epreuve_liee_id === id) {
        return { ...r, epreuve_liee_id: null };
      }
      return r;
    });
    this.saveState();
  }

  public async deleteAllRessources(): Promise<void> {
    if (this.isUsingSupabase && this.supabaseClient) {
      try {
        await this.supabaseClient.from('ressources').delete().neq('id', '0');
      } catch (e) {
        console.warn('Supabase delete all ressources failed', e);
      }
    }
    this.ressources = [];
    this.saveState();
  }

  // --- Paiements & RPC valider_paiement ---
  public async getPaiements(statut?: 'en_attente' | 'confirme' | 'rejete' | 'all'): Promise<Paiement[]> {
    let list = this.paiements.map((p) => {
      const prof = this.profiles.find((pr) => pr.id === p.user_id);
      return {
        ...p,
        profile: prof ? { full_name: prof.full_name, email: prof.email } : undefined
      };
    });

    if (statut && statut !== 'all') {
      list = list.filter((p) => p.statut === statut);
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Replicates PostgreSQL RPC `public.valider_paiement(p_paiement_id uuid)`:
   * 1. Check payment exists with statut = 'en_attente'
   * 2. Set statut = 'confirme'
   * 3. Set profiles.premium_s1 = true (or premium_s2 = true) in the same transaction
   */
  public async validerPaiement(paiementId: string): Promise<{ success: boolean; message: string }> {
    const payment = this.paiements.find((p) => p.id === paiementId);
    if (!payment) {
      throw new Error('Paiement introuvable');
    }
    if (payment.statut !== 'en_attente') {
      throw new Error('Paiement déjà traité');
    }

    payment.statut = 'confirme';

    // Update user profile premium flag
    const profile = this.profiles.find((pr) => pr.id === payment.user_id);
    if (profile) {
      if (payment.semestre === 'S1') {
        profile.premium_s1 = true;
      } else if (payment.semestre === 'S2') {
        profile.premium_s2 = true;
      }
    }

    if (this.isUsingSupabase && this.supabaseClient) {
      try {
        await this.supabaseClient.rpc('valider_paiement', { p_paiement_id: paiementId });
      } catch (e) {
        console.warn('RPC valider_paiement failed on Supabase, updated local store', e);
      }
    }

    this.saveState();
    return {
      success: true,
      message: `Paiement ${payment.reference || paiementId} validé avec succès. Accès ${payment.semestre} débloqué pour l'étudiant.`
    };
  }

  public async rejeterPaiement(paiementId: string, _motif?: string): Promise<void> {
    const payment = this.paiements.find((p) => p.id === paiementId);
    if (payment) {
      payment.statut = 'rejete';
      this.saveState();
    }
  }

  // --- Profiles (Students) ---
  public async getProfiles(): Promise<UserProfile[]> {
    return [...this.profiles];
  }

  // --- KPI / Stats Calculation ---
  public getStats(): KpiStats {
    const totalRessources = this.ressources.length;
    const totalEpreuves = this.ressources.filter((r) => r.type === 'epreuve').length;
    const totalCorriges = this.ressources.filter((r) => r.type === 'corrige').length;
    const totalResumes = this.ressources.filter((r) => r.type === 'resume').length;

    const totalUe = this.ues.length;
    const totalUeS1 = this.ues.filter((u) => u.semestre === 'S1').length;
    const totalUeS2 = this.ues.filter((u) => u.semestre === 'S2').length;

    const ressourcesPremium = this.ressources.filter((r) => r.is_premium).length;
    const ressourcesGratuites = totalRessources - ressourcesPremium;

    const paiementsEnAttente = this.paiements.filter((p) => p.statut === 'en_attente').length;
    const paiementsConfirmes = this.paiements.filter((p) => p.statut === 'confirme').length;

    const montantTotalCollecte = this.paiements
      .filter((p) => p.statut === 'confirme')
      .reduce((sum, p) => sum + (p.montant || 0), 0);

    return {
      totalRessources,
      totalEpreuves,
      totalCorriges,
      totalResumes,
      totalUe,
      totalUeS1,
      totalUeS2,
      ressourcesPremium,
      ressourcesGratuites,
      paiementsEnAttente,
      paiementsConfirmes,
      montantTotalCollecte
    };
  }

  // Reset to initial sample data
  public resetToFactory(): void {
    this.ues = [...INITIAL_UES];
    this.ressources = [...INITIAL_RESSOURCES];
    this.paiements = [...INITIAL_PAIEMENTS];
    this.profiles = [...INITIAL_PROFILES];
    this.saveState();
  }
}

export const archivexService = new ArchivexService();
