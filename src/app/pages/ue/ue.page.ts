import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonMenuButton, IonInput, IonSelect, 
  IonSelectOption, IonButton, IonIcon, IonSpinner, 
  IonList, IonItem, IonLabel, IonBadge,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, addCircleOutline, bookOutline } from 'ionicons/icons';
import { UeService } from '../../core/services/ue';
import { UE, Semestre } from '../../core/models/ue.model';

@Component({
  selector: 'app-ue',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonMenuButton, IonInput, IonSelect, 
    IonSelectOption, IonButton, IonIcon, IonSpinner, 
    IonList, IonItem, IonLabel, IonBadge,
  ],
  templateUrl: './ue.page.html',
  styleUrls: ['./ue.page.scss']
})
export class UePage implements OnInit {
  ues: UE[] = [];
  loading = true;

  // État du formulaire
  form = {
    nom: '',
    code: '',
    semestre: 'S1' as Semestre
  };

  constructor(
    private ueSvc: UeService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ trashOutline, addCircleOutline, bookOutline });
  }

  async ngOnInit() {
    await this.charger();
  }

  async charger() {
    this.loading = true;
    try {
      this.ues = await this.ueSvc.list();
    } catch (error) {
      console.error('Erreur lors du chargement des UE', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async ajouter() {
    if (!this.form.nom || !this.form.code) return;
    
    try {
      await this.ueSvc.creer(this.form);
      // Réinitialisation du formulaire
      this.form = { nom: '', code: '', semestre: 'S1' };
      await this.charger();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'UE", error);
      alert("Une erreur est survenue lors de l'ajout.");
    }
  }

  async supprimer(id: string) {
    if (!confirm('Supprimer définitivement cette UE ? Les ressources liées seront aussi supprimées.')) return;
    
    try {
      await this.ueSvc.supprimer(id);
      await this.charger();
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
      alert("Impossible de supprimer cette UE.");
    }
  }
}