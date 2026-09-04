import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonButton
} from '@ionic/angular/standalone';
import { RessourcesService } from '../../core/services/ressources';
import { PaiementsService } from '../../core/services/paiements';
import { UeService } from '../../core/services/ue';
import { EtudiantsService } from '../../core/services/etudiants';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ActivityChartsComponent } from '../../shared/components/activity-charts/activity-charts.component';
import { RecentActionsListComponent } from '../../shared/components/recent-actions-list/recent-actions-list.component';

export interface ActivityItem {
  id: string;
  type: 'publication' | 'paiement' | 'ue';
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonButton,
    LoadingSpinnerComponent,
    ActivityChartsComponent,
    RecentActionsListComponent
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  stats = {
    totalRessources: 0,
    totalUEs: 0,
    paiementsEnAttente: 0,
    recettesEstimees: 0,
    etudiantsPremium: 0
  };
  loading = true;

  activityFeed: ActivityItem[] = [];

  constructor(
    private ressourcesSvc: RessourcesService,
    private paiementsSvc: PaiementsService,
    private ueSvc: UeService,
    private etudiantsSvc: EtudiantsService
  ) {}

  async ngOnInit() {
    await this.chargerData();
  }

  async chargerData() {
    this.loading = true;
    try {
      const [resList, ueList, paiementsList, etudiantsList] = await Promise.all([
        this.ressourcesSvc.list().catch(() => []),
        this.ueSvc.list().catch(() => []),
        this.paiementsSvc.list('en_attente').catch(() => []),
        this.etudiantsSvc.list().catch(() => [])
      ]);
      this.stats.totalRessources = resList.length;
      this.stats.totalUEs = ueList.length;
      this.stats.paiementsEnAttente = paiementsList.length;
      this.stats.etudiantsPremium = etudiantsList.filter(e => e.premium_s1 || e.premium_s2).length;
      this.stats.recettesEstimees = this.stats.etudiantsPremium * 5000;
    } finally {
      this.loading = false;
    }
  }
}
