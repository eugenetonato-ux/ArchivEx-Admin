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
  IonSearchbar,
  IonToggle
} from '@ionic/angular/standalone';
import { EtudiantsService, EtudiantProfile } from '../../core/services/etudiants';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-etudiants',
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
    IonSearchbar,
    IonToggle,
    LoadingSpinnerComponent
  ],
  templateUrl: './etudiants.page.html',
  styleUrls: ['./etudiants.page.scss']
})
export class EtudiantsPage implements OnInit {
  etudiants: EtudiantProfile[] = [];
  filtre = '';
  loading = true;

  constructor(private etudiantsSvc: EtudiantsService) {}

  async ngOnInit() {
    await this.charger();
  }

  async charger() {
    this.loading = true;
    try {
      this.etudiants = await this.etudiantsSvc.list();
    } finally {
      this.loading = false;
    }
  }

  get etudiantsFiltres(): EtudiantProfile[] {
    if (!this.filtre.trim()) return this.etudiants;
    const q = this.filtre.toLowerCase();
    return this.etudiants.filter(e =>
      e.full_name?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q)
    );
  }

  async togglePass(etudiant: EtudiantProfile, sem: 'premium_s1' | 'premium_s2', value: boolean) {
    etudiant[sem] = value;
    await this.etudiantsSvc.togglePremium(etudiant.id, sem, value);
  }
}
