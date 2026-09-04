import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonMenuButton, IonButton, IonIcon, IonSpinner 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  documentsOutline, lockClosedOutline, 
  calendarOutline, alertCircleOutline, logOutOutline 
} from 'ionicons/icons';
import { RessourcesService } from '../../core/services/ressources';
import { PaiementsService } from '../../core/services/paiements';
import { AuthService } from '../../core/services/auth';
import { Ressource } from '../../core/models/ressource.model';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonContent, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonMenuButton, IonButton, IonIcon, IonSpinner,
    KpiCardComponent
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {
  loading = true;

  totalRessources = 0;
  totalPremium = 0;
  totalS1 = 0;
  totalS2 = 0;
  paiementsEnAttente = 0;

  dernieresRessources: Ressource[] = [];

  constructor(
    private ressourcesSvc: RessourcesService,
    private paiementsSvc: PaiementsService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ documentsOutline, lockClosedOutline, calendarOutline, alertCircleOutline, logOutOutline });
  }

  // ionViewWillEnter s'exécute à CHAQUE FOIS qu'on arrive sur la page
  ionViewWillEnter() {
    this.charger();
  }

  async charger() {
    this.loading = true;
    try {
      const [ressources, paiementsEnAttente] = await Promise.all([
        this.ressourcesSvc.list(),
        this.paiementsSvc.list('en_attente')
      ]);

      this.totalRessources = ressources.length;
      this.totalPremium = ressources.filter(r => r.is_premium).length;
      this.totalS1 = ressources.filter(r => r.semestre === 'S1').length;
      this.totalS2 = ressources.filter(r => r.semestre === 'S2').length;
      this.paiementsEnAttente = paiementsEnAttente.length;
      this.dernieresRessources = ressources.slice(0, 5);
    } catch (error) {
      console.error('Erreur dashboard', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}