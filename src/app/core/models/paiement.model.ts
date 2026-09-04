import { Semestre } from './ue.model';

export interface Paiement {
  id: string;
  user_id: string;
  semestre: Semestre;
  montant: number;
  statut: 'en_attente' | 'confirme' | 'rejete';
  reference: string | null;
  created_at: string;
}