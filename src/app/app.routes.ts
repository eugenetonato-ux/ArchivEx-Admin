import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'ue',
    loadComponent: () => import('./pages/ue/ue.page').then(m => m.UePage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'ressources',
    loadComponent: () => import('./pages/ressources/ressources.page').then(m => m.RessourcesPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'paiements',
    loadComponent: () => import('./pages/paiements/paiements.page').then(m => m.PaiementsPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'etudiants',
    loadComponent: () => import('./pages/etudiants/etudiants.page').then(m => m.EtudiantsPage),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'parametres',
    loadComponent: () => import('./pages/parametres/parametres.page').then(m => m.ParametresPage),
    canActivate: [adminAuthGuard]
  }
];
