import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner,
  IonBadge,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { PaiementsService } from '../../core/services/paiements';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonSpinner,
    IonBadge,
    IonSegment,
    IonSegmentButton
  ],
  templateUrl: './paiements.page.html',
  styleUrls: ['./paiements.page.scss']
})
export class PaiementsPage implements OnInit {
  paiements: any[] = [];
  loading = true;
  filtreStatut: string | undefined = 'en_attente';

  constructor(private paiementsSvc: PaiementsService) {}

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
    await this.paiementsSvc.valider(id);
    await this.charger();
  }

  changerFiltre(event: any) {
    this.filtreStatut = event.detail.value || undefined;
    this.charger();
  }
}
