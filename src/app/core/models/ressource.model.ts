import { Semestre } from './ue.model';

export type TypeRessource = 'epreuve' | 'corrige' | 'resume';

export interface Ressource {
  id: string;
  type: TypeRessource;
  titre: string;
  ue_id: string;
  semestre: Semestre;
  annee: number;
  session: 'normale' | 'rattrapage' | null;
  fichier_url: string;
  is_premium: boolean;
  epreuve_liee_id: string | null;
  created_at: string;
}