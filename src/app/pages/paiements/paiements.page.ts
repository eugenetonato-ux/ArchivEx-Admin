import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonBadge,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { PaiementsService } from '../../core/services/paiements';
import { AdminActionsService } from '../../core/services/admin-actions';
import { AuthService } from '../../core/services/auth';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonBadge,
    IonSegment,
    IonSegmentButton,
    LoadingSpinnerComponent
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
    private adminActionsSvc: AdminActionsService,
    private authSvc: AuthService
  ) {}

  async ngOnInit() {
    await this.charger();
  }

  async charger() {
    this.loading = true;
    try {
      this.paiements = await this.paiementsSvc.list(this.filtreStatut);
    } finally {
      this.loading = false;
    }
  }

  async valider(id: string) {
    const p = this.paiements.find(item => item.id === id);
    await this.paiementsSvc.valider(id);

    await this.adminActionsSvc.logAction({
      title: 'Validation de Paiement',
      description: p ? `Paiement MoMo de ${p.montant || 5000} FCFA validé (${p.ref_transaction || id})` : `Paiement #${id} validé avec succès.`,
      category: 'payment',
      status: 'success',
      actor_email: this.authSvc.currentUser()?.email || 'admin@archivex.univ.bj'
    });

    await this.charger();
  }

  changerFiltre(event: any) {
    this.filtreStatut = event.detail.value || undefined;
    this.charger();
  }
}
