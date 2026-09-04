import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { ShortcutsService } from '../../../core/services/shortcuts';

interface ShortcutGroup {
  category: string;
  shortcuts: { keys: string[]; description: string }[];
}

@Component({
  selector: 'app-shortcuts-modal',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './shortcuts-modal.component.html',
  styleUrls: ['./shortcuts-modal.component.scss']
})
export class ShortcutsModalComponent {
  shortcutGroups: ShortcutGroup[] = [
    {
      category: 'Navigation Générale',
      shortcuts: [
        { keys: ['D'], description: 'Accéder instantanément au Tableau de Bord' },
        { keys: ['R'], description: 'Consulter la Bibliothèque des Ressources' },
        { keys: ['M'], description: 'Gérer les Matières / UEs' },
        { keys: ['P'], description: 'Traiter la file des Paiements' },
        { keys: ['E'], description: "Gérer l'annuaire des Étudiants" }
      ]
    },
    {
      category: 'Actions Rapides',
      shortcuts: [
        { keys: ['Ctrl', 'K'], description: 'Focus automatique sur la barre de recherche globale' },
        { keys: ['N'], description: 'Ouvrir directement le formulaire de Nouvelle Ressource' },
        { keys: ['U'], description: 'Ouvrir directement le formulaire de Nouvelle UE' },
        { keys: ['H'], description: "Ouvrir / Fermer ce panneau d'aide" }
      ]
    },
    {
      category: 'Système & Interface',
      shortcuts: [
        { keys: ['?'], description: "Afficher l'aide des raccourcis clavier" },
        { keys: ['Échap'], description: 'Fermer n’importe quel panneau, formulaire ou invite d’aide' }
      ]
    }
  ];

  constructor(public shortcutsSvc: ShortcutsService) {}

  close() {
    this.shortcutsSvc.showHelpModal.set(false);
  }
}
