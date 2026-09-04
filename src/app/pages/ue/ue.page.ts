import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonIcon,
  IonSpinner,
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
import { UE, Semestre } from '../../core/models/ue.model';

@Component({
  selector: 'app-ue',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonIcon,
    IonSpinner,
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

  constructor(private ueSvc: UeService) {}

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
    await this.ueSvc.creer(this.nouvelleUe);
    this.nouvelleUe.nom = '';
    this.nouvelleUe.code = '';
    await this.charger();
  }

  async supprimer(id: string) {
    await this.ueSvc.supprimer(id);
    await this.charger();
  }
}
