import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonIcon,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonButton
} from '@ionic/angular/standalone';
import { RessourcesService } from '../../core/services/ressources';
import { PaiementsService } from '../../core/services/paiements';
import { UeService } from '../../core/services/ue';
import { EtudiantsService } from '../../core/services/etudiants';

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
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonIcon,
    IonBadge,
    IonList,
    IonItem,
    IonLabel,
    IonButton
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  stats = {
    totalRessources: 0,
    totalUEs: 0,
    paiementsEnAttente: 0,
    recettesEstimees: 1250000,
    etudiantsPremium: 142
  };
  loading = true;

  activityFeed: ActivityItem[] = [
    {
      id: '1',
      type: 'paiement',
      title: 'Paiement confirmé',
      description: 'Amina Lawson - Pass S1 (5 000 FCFA)',
      time: 'Il y a 10 minutes',
      icon: 'checkmark-circle',
      color: 'success'
    },
    {
      id: '2',
      type: 'publication',
      title: 'Nouveau Corrigé ajouté',
      description: 'Analyse Numérique - Examen 2024 (S2)',
      time: 'Il y a 45 minutes',
      icon: 'document-text',
      color: 'primary'
    },
    {
      id: '3',
      type: 'ue',
      title: 'Création d\'UE',
      description: 'INF204 - Réseaux & Télécoms (S2)',
      time: 'Il y a 2 heures',
      icon: 'book',
      color: 'tertiary'
    },
    {
      id: '4',
      type: 'paiement',
      title: 'Nouveau paiement soumis',
      description: 'Sessou Eric - Réf: SB-99481',
      time: 'Il y a 3 heures',
      icon: 'card',
      color: 'warning'
    }
  ];

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
      this.stats.recettesEstimees = (this.stats.etudiantsPremium + 200) * 5000;
    } finally {
      this.loading = false;
    }
  }
}
