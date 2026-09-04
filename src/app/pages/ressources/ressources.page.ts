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
  IonCheckbox,
  IonBadge,
  IonSearchbar,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { RessourcesService } from '../../core/services/ressources';
import { UeService } from '../../core/services/ue';
import { Ressource, TypeRessource } from '../../core/models/ressource.model';
import { UE } from '../../core/models/ue.model';

@Component({
  selector: 'app-ressources',
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
    IonCheckbox,
    IonBadge,
    IonSearchbar,
    IonSegment,
    IonSegmentButton
  ],
  templateUrl: './ressources.page.html',
  styleUrls: ['./ressources.page.scss']
})
export class RessourcesPage implements OnInit {
  ressources: Ressource[] = [];
  ues: UE[] = [];
  loading = true;

  filtreQuery = '';
  filtreSemestre = 'tous';
  filtreType = 'tous';

  afficherFormulaire = false;

  form = {
    type: 'epreuve' as TypeRessource,
    titre: '',
    ue_id: '',
    semestre: 'S1' as 'S1' | 'S2',
    annee: new Date().getFullYear(),
    session: 'normale' as 'normale' | 'rattrapage',
    is_premium: false,
    fichier: null as File | null
  };

  constructor(
    private ressourcesSvc: RessourcesService,
    private ueSvc: UeService
  ) {}

  async ngOnInit() {
    await this.charger();
  }

  get premiumForce(): boolean {
    return this.form.type === 'corrige' || this.form.type === 'resume';
  }

  async charger() {
    this.loading = true;
    try {
      this.ressources = await this.ressourcesSvc.list();
      this.ues = await this.ueSvc.list();
      if (this.ues.length > 0 && !this.form.ue_id) {
        this.form.ue_id = this.ues[0].id;
      }
    } finally {
      this.loading = false;
    }
  }

  get ressourcesFiltrees(): Ressource[] {
    return this.ressources.filter(r => {
      const matchQuery = !this.filtreQuery || r.titre.toLowerCase().includes(this.filtreQuery.toLowerCase());
      const matchSemestre = this.filtreSemestre === 'tous' || r.semestre === this.filtreSemestre;
      const matchType = this.filtreType === 'tous' || r.type === this.filtreType;
      return matchQuery && matchSemestre && matchType;
    });
  }

  onFichierChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.form.fichier = input.files?.[0] ?? null;
  }

  async ajouter() {
    if (!this.form.titre.trim() || !this.form.ue_id) return;
    await this.ressourcesSvc.creer(
      {
        type: this.form.type,
        titre: this.form.titre,
        ue_id: this.form.ue_id,
        semestre: this.form.semestre,
        annee: this.form.annee,
        session: this.form.session,
        is_premium: this.premiumForce ? true : this.form.is_premium,
        epreuve_liee_id: null
      },
      this.form.fichier
    );
    this.form.titre = '';
    this.form.fichier = null;
    this.afficherFormulaire = false;
    await this.charger();
  }

  async supprimer(id: string) {
    await this.ressourcesSvc.supprimer(id);
    await this.charger();
  }

  getNomUe(ueId: string): string {
    const ue = this.ues.find(u => u.id === ueId);
    return ue ? `${ue.nom} (${ue.code})` : 'Matière générale';
  }
}
