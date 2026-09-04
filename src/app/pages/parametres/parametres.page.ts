import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonToggle,
  IonButton,
  IonBadge
} from '@ionic/angular/standalone';
import { ThemeService, ACCENT_COLORS, AccentColor } from '../../core/services/theme';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonToggle,
    IonButton,
    IonBadge
  ],
  templateUrl: './parametres.page.html',
  styleUrls: ['./parametres.page.scss']
})
export class ParametresPage {
  accents = ACCENT_COLORS;

  constructor(public themeSvc: ThemeService) {}

  selectAccent(accent: AccentColor) {
    this.themeSvc.setAccent(accent);
  }

  toggleDarkMode(event: any) {
    this.themeSvc.setDarkMode(event.detail.checked);
  }
}
