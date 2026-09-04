export type ActionCategory = 'payment' | 'ressource' | 'ue' | 'etudiant' | 'system';

export interface AdminAction {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  actor_email: string;
  created_at: string; // ISO string
  status: 'success' | 'warning' | 'danger' | 'info';
  metadata?: Record<string, any>;
}
