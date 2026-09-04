import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './core/services/theme';
import { ShellLayoutComponent } from './shared/components/shell-layout/shell-layout.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    ShellLayoutComponent
  ]
})
export class AppComponent {
  constructor(
    public themeSvc: ThemeService,
    public router: Router
  ) {}

  get isLoginPage(): boolean {
    return this.router.url.includes('/auth/login');
  }

  get currentPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/ue')) return 'Unités d\'Enseignement (UE)';
    if (url.includes('/ressources')) return 'Bibliothèque de Ressources';
    if (url.includes('/paiements')) return 'Validation des Paiements';
    if (url.includes('/etudiants')) return 'Gestion des Étudiants';
    if (url.includes('/parametres')) return 'Paramètres & Thème';
    return 'Tableau de bord Analytique';
  }
}
