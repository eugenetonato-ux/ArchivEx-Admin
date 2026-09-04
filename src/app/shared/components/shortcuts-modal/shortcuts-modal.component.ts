import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortcutsService } from '../../../core/services/shortcuts';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-shortcuts-modal',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon],
  template: `
    <div *ngIf="shortcutsSvc.showHelpModal()" class="shortcuts-overlay" (click)="close()">
      <ion-card class="shortcuts-card" (click)="$event.stopPropagation()">
        <ion-card-header class="modal-header">
          <ion-card-title>⌨️ Raccourcis Clavier de Productivité</ion-card-title>
          <ion-button fill="clear" color="medium" (click)="close()">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-card-header>
        <ion-card-content>
          <div class="shortcut-grid">
            <div class="shortcut-item">
              <kbd>Ctrl + K</kbd> / <kbd>⌘ + K</kbd>
              <span>Focus barre de recherche</span>
            </div>
            <div class="shortcut-item">
              <kbd>D</kbd>
              <span>Tableau de bord</span>
            </div>
            <div class="shortcut-item">
              <kbd>R</kbd>
              <span>Bibliothèque des ressources</span>
            </div>
            <div class="shortcut-item">
              <kbd>M</kbd> / <kbd>U</kbd>
              <span>Matières / UEs</span>
            </div>
            <div class="shortcut-item">
              <kbd>P</kbd>
              <span>File des paiements</span>
            </div>
            <div class="shortcut-item">
              <kbd>E</kbd>
              <span>Annuaire Étudiants</span>
            </div>
            <div class="shortcut-item">
              <kbd>N</kbd>
              <span>Nouvelle Ressource</span>
            </div>
            <div class="shortcut-item">
              <kbd>Echap</kbd>
              <span>Fermer cette fenêtre</span>
            </div>
            <div class="shortcut-item">
              <kbd>?</kbd> ou <kbd>H</kbd>
              <span>Afficher/Masquer l'aide</span>
            </div>
          </div>
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [`
    .shortcuts-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .shortcuts-card {
      width: 100%;
      max-width: 520px;
      margin: 0;
      border-radius: 16px;
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .shortcut-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 8px;
    }
    .shortcut-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: var(--ion-color-light, #f4f5f8);
      padding: 10px 12px;
      border-radius: 8px;
    }
    kbd {
      background: var(--ion-color-primary);
      color: #fff;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.85rem;
      display: inline-block;
      width: fit-content;
    }
    span {
      font-size: 0.85rem;
      color: var(--ion-color-medium);
    }
  `]
})
export class ShortcutsModalComponent {
  constructor(public shortcutsSvc: ShortcutsService) {}

  close() {
    this.shortcutsSvc.showHelpModal.set(false);
  }
}
