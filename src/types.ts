export type Semestre = 'S1' | 'S2';

export type TypeRessource = 'epreuve' | 'corrige' | 'resume';

export type SessionType = 'normale' | 'rattrapage';

export type StatutPaiement = 'en_attente' | 'confirme' | 'rejete';

export interface UE {
  id: string;
  nom: string;
  code: string;
  semestre: Semestre;
}

export interface Ressource {
  id: string;
  type: TypeRessource;
  titre: string;
  ue_id: string;
  semestre: Semestre;
  annee: number;
  session: SessionType | null;
  fichier_url: string;
  is_premium: boolean;
  epreuve_liee_id: string | null;
  created_at: string;
  // Joined or helper properties
  ue?: {
    id: string;
    nom: string;
    code: string;
  };
  taille_ko?: number;
}

export interface Paiement {
  id: string;
  user_id: string;
  semestre: Semestre;
  montant: number;
  statut: StatutPaiement;
  reference: string | null;
  created_at: string;
  // Joined profile info
  profile?: {
    full_name: string;
    email: string;
  };
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  premium_s1: boolean;
  premium_s2: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
}

export interface KpiStats {
  totalRessources: number;
  totalEpreuves: number;
  totalCorriges: number;
  totalResumes: number;
  totalUe: number;
  totalUeS1: number;
  totalUeS2: number;
  ressourcesPremium: number;
  ressourcesGratuites: number;
  paiementsEnAttente: number;
  paiementsConfirmes: number;
  montantTotalCollecte: number;
}
