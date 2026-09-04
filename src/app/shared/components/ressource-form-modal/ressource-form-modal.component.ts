import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, 
  IonButton, IonContent, IonList, IonItem, IonLabel, 
  IonInput, IonSelect, IonSelectOption, IonToggle, IonIcon, IonNote 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, cloudUploadOutline } from 'ionicons/icons';
import { UE } from '../../../core/models/ue.model';
import { Ressource, TypeRessource } from '../../../core/models/ressource.model';

@Component({
  selector: 'app-ressource-form-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, 
    IonButton, IonContent, IonList, IonItem, IonLabel, 
    IonInput, IonSelect, IonSelectOption, IonToggle, IonIcon, IonNote
  ],
  templateUrl: './ressource-form-modal.component.html',
  styleUrls: ['./ressource-form-modal.component.scss']
})
export class RessourceFormModalComponent {
  // Configurations reçues du parent
  isOpen = input<boolean>(false);
  ues = input<UE[]>([]);

  // Événements émis vers le parent
  formSubmit = output<{ ressource: Omit<Ressource, 'id' | 'fichier_url' | 'created_at'>, fichier: File }>();
  modalClose = output<void>();

  // État du formulaire
  form = {
    type: 'epreuve' as TypeRessource,
    titre: '',
    ue_id: '',
    semestre: 'S1' as 'S1' | 'S2',
    annee: new Date().getFullYear(),
    session: 'normale' as 'normale' | 'rattrapage',
    is_premium: false,
  };

  fichier: File | null = null;

  constructor() {
    addIcons({ closeOutline, cloudUploadOutline });
  }

  // Règle métier : corrigés et résumés sont toujours premium
  get premiumForce(): boolean {
    return this.form.type === 'corrige' || this.form.type === 'resume';
  }

  onFichierChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fichier = input.files[0];
    }
  }

  submit() {
    if (!this.fichier || !this.form.titre || !this.form.ue_id) return;

    this.formSubmit.emit({
      ressource: {
        ...this.form,
        is_premium: this.premiumForce ? true : this.form.is_premium,
        epreuve_liee_id: null
      },
      fichier: this.fichier
    });

    this.resetForm();
  }

  close() {
    this.modalClose.emit();
  }

  private resetForm() {
    this.form = {
      type: 'epreuve',
      titre: '',
      ue_id: '',
      semestre: 'S1',
      annee: new Date().getFullYear(),
      session: 'normale',
      is_premium: false
    };
    this.fichier = null;
  }
}