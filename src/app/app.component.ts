import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { ThemeService } from './core/services/theme';
import { ShortcutsService } from './core/services/shortcuts';
import { ShortcutsModalComponent } from './shared/components/shortcuts-modal/shortcuts-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonFab,
    IonFabButton,
    ShortcutsModalComponent
  ]
})
export class AppComponent {
  public appPages = [
    { title: 'Tableau de bord', url: '/dashboard', icon: 'grid' },
    { title: 'Unités d\'Enseignement', url: '/ue', icon: 'book' },
    { title: 'Ressources', url: '/ressources', icon: 'document-text' },
    { title: 'Validation Paiements', url: '/paiements', icon: 'card' },
    { title: 'Gestion Étudiants', url: '/etudiants', icon: 'people' },
    { title: 'Paramètres & Thème', url: '/parametres', icon: 'settings' }
  ];

  constructor(public themeSvc: ThemeService, public shortcutsSvc: ShortcutsService) {}
}
