import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonMenuButton, IonSegment, IonSegmentButton, 
  IonLabel, IonList, IonItem, IonBadge, IonButton, 
  IonIcon, IonSpinner, IonText 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, cardOutline, hourglassOutline, closeCircleOutline } from 'ionicons/icons';
import { PaiementsService } from '../../core/services/paiements';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonMenuButton, IonSegment, IonSegmentButton, 
    IonLabel, IonList, IonItem, IonBadge, IonButton, 
    IonIcon, IonSpinner, IonText
  ],
  templateUrl: './paiements.page.html',
  styleUrls: ['./paiements.page.scss']
})
export class PaiementsPage implements OnInit {
  paiements: any[] = [];
  loading = true;
  filtreStatut: string | undefined = 'en_attente';

  constructor(
    private paiementsSvc: PaiementsService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ checkmarkCircleOutline, cardOutline, hourglassOutline, closeCircleOutline });
  }

  async ngOnInit() {
    await this.charger();
  }

  async charger() {
    this.loading = true;
    try {
      this.paiements = await this.paiementsSvc.list(this.filtreStatut);
    } catch (error) {
      console.error('Erreur lors du chargement des paiements', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async valider(id: string) {
    if (!confirm('Confirmer la validation de ce paiement ? L\'étudiant aura accès au premium.')) return;
    
    try {
      await this.paiementsSvc.valider(id);
      await this.charger();
    } catch (error) {
      console.error('Erreur lors de la validation', error);
      alert('Une erreur est survenue lors de la validation.');
    }
  }

  changerFiltre(event: any) {
    this.filtreStatut = event.detail.value === 'tous' ? undefined : event.detail.value;
    this.charger();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}