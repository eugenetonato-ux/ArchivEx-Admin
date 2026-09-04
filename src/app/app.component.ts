import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { 
  IonApp, IonSplitPane, IonMenu, IonContent, 
  IonList, IonListHeader, IonNote, IonMenuToggle, 
  IonItem, IonIcon, IonLabel, IonRouterOutlet 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { gridOutline, bookOutline, documentsOutline, cardOutline } from 'ionicons/icons';
import { AuthService } from './core/services/auth'; // <-- Import du service

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    IonApp, IonSplitPane, IonMenu, IonContent, 
    IonList, IonListHeader, IonNote, 
    IonMenuToggle, IonItem, IonIcon, IonLabel,
    IonRouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // On rend le service accessible dans le HTML
  public auth = inject(AuthService); 

  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'grid-outline' },
    { title: 'UE', url: '/ue', icon: 'book-outline' },
    { title: 'Ressources', url: '/ressources', icon: 'documents-outline' },
    { title: 'Paiements', url: '/paiements', icon: 'card-outline' }
  ];

  public labels: Array<any> = [];

  constructor() {
    addIcons({ gridOutline, bookOutline, documentsOutline, cardOutline });
  }
}