import { UE, Ressource, Paiement, UserProfile, AdminUser } from '../types';

export const INITIAL_UES: UE[] = [
  {
    id: 'ue-1',
    code: 'INF101',
    nom: 'Algorithmique & Structures de Données I',
    semestre: 'S1',
  },
  {
    id: 'ue-2',
    code: 'MAT101',
    nom: 'Algèbre Linéaire & Géométrie',
    semestre: 'S1',
  },
  {
    id: 'ue-3',
    code: 'INF102',
    nom: 'Architecture des Ordinateurs & Systèmes',
    semestre: 'S1',
  },
  {
    id: 'ue-4',
    code: 'PHY101',
    nom: 'Électronique Numérique & Logique',
    semestre: 'S1',
  },
  {
    id: 'ue-5',
    code: 'INF201',
    nom: 'Bases de Données Relationnelles & SQL',
    semestre: 'S2',
  },
  {
    id: 'ue-6',
    code: 'MAT201',
    nom: 'Probabilités & Statistiques Appliquées',
    semestre: 'S2',
  },
  {
    id: 'ue-7',
    code: 'INF202',
    nom: 'Programmation Orientée Objet (Java)',
    semestre: 'S2',
  },
  {
    id: 'ue-8',
    code: 'INF203',
    nom: 'Réseaux Informatiques & Télécoms',
    semestre: 'S2',
  },
];

export const INITIAL_PROFILES: UserProfile[] = [];

export const INITIAL_RESSOURCES: Ressource[] = [];

export const INITIAL_PAIEMENTS: Paiement[] = [];

export const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-1',
  email: 'archivexadmin@gmail.com',
  name: 'Administrateur',
  role: 'superadmin',
};
