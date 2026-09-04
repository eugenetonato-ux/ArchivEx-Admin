import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonMenuButton, IonButton, IonIcon, 
  IonSpinner, IonSelect, IonSelectOption, IonBadge,
  IonList, IonItem, IonLabel 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, lockClosedOutline, documentAttachOutline, bookOutline } from 'ionicons/icons';
import { RessourcesService } from '../../core/services/ressources';
import { UeService } from '../../core/services/ue';
import { Ressource } from '../../core/models/ressource.model';
import { UE } from '../../core/models/ue.model';
import { RessourceFormModalComponent } from '../../shared/components/ressource-form-modal/ressource-form-modal.component';

@Component({
  selector: 'app-ressources',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonMenuButton, IonButton, IonIcon, 
    IonSpinner, IonSelect, IonSelectOption, IonBadge,
    IonList, IonItem,
    RessourceFormModalComponent // On importe le modal ici
  ],
  templateUrl: './ressources.page.html',
  styleUrls: ['./ressources.page.scss']
})
export class RessourcesPage implements OnInit {
  ressources: Ressource[] = [];
  ues: UE[] = [];
  loading = true;
  isModalOpen = false;

  // Filtres
  filtreSemestre: string | undefined = undefined;
  filtreType: string | undefined = undefined;

  constructor(
    private ressourcesSvc: RessourcesService,
    private ueSvc: UeService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ addOutline, trashOutline, lockClosedOutline, documentAttachOutline, bookOutline });
  }

  async ngOnInit() {
    await this.charger();
  }

  async charger() {
    this.loading = true;
    try {
      const [ressources, ues] = await Promise.all([
        this.ressourcesSvc.list({ semestre: this.filtreSemestre, type: this.filtreType }),
        this.ueSvc.list()
      ]);
      this.ressources = ressources;
      this.ues = ues;
    } catch (error) {
      console.error('Erreur lors du chargement des ressources', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async supprimer(id: string) {
    if (!confirm('Supprimer définitivement cette ressource ? Le fichier sera aussi supprimé.')) return;
    try {
      await this.ressourcesSvc.supprimer(id);
      await this.charger();
    } catch (error) {
      console.error('Erreur de suppression', error);
      alert('Impossible de supprimer la ressource.');
    }
  }

  // Appelée quand le modal émet l'événement formSubmit
  async ajouter(ressource: any, fichier: File) {
    try {
      await this.ressourcesSvc.creer(ressource, fichier);
      this.isModalOpen = false;
      await this.charger();
    } catch (error) {
      console.error("Erreur lors de l'ajout", error);
      alert("Une erreur est survenue lors de l'ajout de la ressource.");
    }
  }

  // Helpers pour l'affichage
  getUeName(ueId: string): string {
    return this.ues.find(u => u.id === ueId)?.nom || 'UE inconnue';
  }

  onFiltreChange() {
    this.charger();
  }
}