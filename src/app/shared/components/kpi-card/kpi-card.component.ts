import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss']
})
export class KpiCardComponent {
  // On définit les inputs attendus par la carte
  icon = input<string>('');           // Nom de l'icône Ionicons (ex: 'documents-outline')
  value = input<number | string>(0);  // La valeur du KPI (ex: 42)
  label = input<string>('');          // Le texte descriptif (ex: 'Ressources')
}