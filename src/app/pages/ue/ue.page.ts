import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonBadge,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { UeService } from '../../core/services/ue';
import { AdminActionsService } from '../../core/services/admin-actions';
import { AuthService } from '../../core/services/auth';
import { UE, Semestre } from '../../core/models/ue.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-ue',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonBadge,
    IonSegment,
    IonSegmentButton,
    LoadingSpinnerComponent
  ],
  templateUrl: './ue.page.html',
  styleUrls: ['./ue.page.scss']
})
export class UePage implements OnInit {
  ues: UE[] = [];
  loading = true;
  filtreSemestre: string = 'tous';

  nouvelleUe = {
    nom: '',
    code: '',
    semestre: 'S1' as Semestre
  };

  constructor(
    private ueSvc: UeService,
    private adminActionsSvc: AdminActionsService,
    private authSvc: AuthService
  ) {}

  async ngOnInit() {
    await this.charger();
  }

  async charger() {
    this.loading = true;
    try {
      this.ues = await this.ueSvc.list();
    } finally {
      this.loading = false;
    }
  }

  get uesFiltrees(): UE[] {
    if (this.filtreSemestre === 'tous') return this.ues;
    return this.ues.filter(u => u.semestre === this.filtreSemestre);
  }

  async ajouter() {
    if (!this.nouvelleUe.nom.trim() || !this.nouvelleUe.code.trim()) return;
    const nom = this.nouvelleUe.nom;
    const code = this.nouvelleUe.code;
    const sem = this.nouvelleUe.semestre;

    await this.ueSvc.creer(this.nouvelleUe);

    await this.adminActionsSvc.logAction({
      title: 'Création d\'une UE',
      description: `Matière "${nom}" (${code}) ajoutée au ${sem}`,
      category: 'ue',
      status: 'info',
      actor_email: this.authSvc.currentUser()?.email || 'admin@archivex.univ.bj'
    });

    this.nouvelleUe.nom = '';
    this.nouvelleUe.code = '';
    await this.charger();
  }

  async supprimer(id: string) {
    const target = this.ues.find(u => u.id === id);
    await this.ueSvc.supprimer(id);

    await this.adminActionsSvc.logAction({
      title: 'Suppression d\'une UE',
      description: target ? `Suppression de l'UE "${target.nom}" (${target.code})` : `Suppression UE #${id}`,
      category: 'ue',
      status: 'warning',
      actor_email: this.authSvc.currentUser()?.email || 'admin@archivex.univ.bj'
    });

    await this.charger();
  }
}
