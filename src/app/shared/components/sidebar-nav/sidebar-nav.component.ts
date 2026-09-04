import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonMenu, IonContent, IonList, IonListHeader, 
  IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel 
} from '@ionic/angular';

export interface PageItem {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive,
    IonMenu, IonContent, IonList, IonListHeader, 
    IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel
  ],
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss']
})
export class SidebarNavComponent {
  // Inputs pour configurer le menu depuis le composant parent
  contentId = input<string>('main-content');
  pages = input<PageItem[]>([]);
  titre = input<string>('ArchivEx Admin');
  sousTitre = input<string>('Espace de gestion');
}