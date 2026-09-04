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
  IonInput
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
    IonInput
  ],
  templateUrl: './ue.page.html',
  styleUrls: ['./ue.page.scss']
})
export class UePage implements OnInit {
  ues: UE[] = [];
  loading = true;

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

  async ajouter() {
    if (!this.nouvelleUe.nom || !this.nouvelleUe.code) return;
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
