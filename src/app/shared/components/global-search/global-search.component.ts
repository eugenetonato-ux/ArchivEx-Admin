import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonIcon, IonBadge } from '@ionic/angular/standalone';
import { UeService } from '../../../core/services/ue';
import { RessourcesService } from '../../../core/services/ressources';
import { EtudiantsService } from '../../../core/services/etudiants';
import { UE } from '../../../core/models/ue.model';
import { Ressource } from '../../../core/models/ressource.model';

export interface SearchResult {
  id: string;
  category: 'Section' | 'Matière / UE' | 'Ressource' | 'Étudiant';
  title: string;
  subtitle?: string;
  url: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonBadge],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInputEl?: ElementRef<HTMLInputElement>;

  isOpen = signal<boolean>(false);
  query = signal<string>('');
  selectedIndex = signal<number>(0);

  ues = signal<UE[]>([]);
  ressources = signal<Ressource[]>([]);
  etudiants = signal<any[]>([]);

  private defaultPages: SearchResult[] = [
    {
      id: 'page-dashboard',
      category: 'Section',
      title: 'Tableau de bord',
      subtitle: 'Statistiques analytiques, graphiques et recettes',
      url: '/dashboard',
      icon: 'grid-outline',
      badge: 'Vue',
      badgeColor: 'primary'
    },
    {
      id: 'page-ue',
      category: 'Section',
      title: 'Unités d\'Enseignement (UE)',
      subtitle: 'Gestion des matières, codes et semestres S1/S2',
      url: '/ue',
      icon: 'book-outline',
      badge: 'S1/S2',
      badgeColor: 'tertiary'
    },
    {
      id: 'page-ressources',
      category: 'Section',
      title: 'Ressources Pédagogiques',
      subtitle: 'Bibliothèque d\'épreuves, corrigés et fiches PDF',
      url: '/ressources',
      icon: 'document-text-outline',
      badge: 'PDF',
      badgeColor: 'primary'
    },
    {
      id: 'page-paiements',
      category: 'Section',
      title: 'Validation des Paiements',
      subtitle: 'File d\'attente des transactions Mobile Money (Pass)',
      url: '/paiements',
      icon: 'card-outline',
      badge: 'Attente',
      badgeColor: 'warning'
    },
    {
      id: 'page-etudiants',
      category: 'Section',
      title: 'Gestion des Étudiants',
      subtitle: 'Annuaire des comptes et activation des Pass Premium',
      url: '/etudiants',
      icon: 'people-outline',
      badge: 'Pass',
      badgeColor: 'success'
    },
    {
      id: 'page-parametres',
      category: 'Section',
      title: 'Paramètres & Thème',
      subtitle: 'Mode sombre, palette de couleur et préférences',
      url: '/parametres',
      icon: 'settings-outline',
      badge: 'Config',
      badgeColor: 'medium'
    }
  ];

  constructor(
    private router: Router,
    private ueSvc: UeService,
    private ressourcesSvc: RessourcesService,
    private etudiantsSvc: EtudiantsService
  ) {}

  async ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {}

  async loadData() {
    try {
      const [uList, rList, eList] = await Promise.all([
        this.ueSvc.list().catch(() => []),
        this.ressourcesSvc.list().catch(() => []),
        this.etudiantsSvc.list().catch(() => [])
      ]);
      this.ues.set(uList);
      this.ressources.set(rList);
      this.etudiants.set(eList);
    } catch {
      // Fallback to empty
    }
  }

  @HostListener('window:keydown', ['$event'])
  onGlobalKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.openModal();
      return;
    }

    if (this.isOpen()) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeModal();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const max = this.filteredResults.length - 1;
        this.selectedIndex.update(i => (i < max ? i + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const max = this.filteredResults.length - 1;
        this.selectedIndex.update(i => (i > 0 ? i - 1 : max));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const results = this.filteredResults;
        if (results.length > 0) {
          const selected = results[this.selectedIndex()];
          if (selected) {
            this.selectResult(selected);
          }
        }
      }
    }
  }

  openModal() {
    this.loadData();
    this.isOpen.set(true);
    this.selectedIndex.set(0);
    setTimeout(() => {
      this.searchInputEl?.nativeElement?.focus();
    }, 50);
  }

  closeModal() {
    this.isOpen.set(false);
    this.query.set('');
  }

  get filteredResults(): SearchResult[] {
    const q = this.query().trim().toLowerCase();

    if (!q) {
      return this.defaultPages;
    }

    const results: SearchResult[] = [];

    // 1. Sections
    this.defaultPages.forEach(p => {
      if (p.title.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q)) {
        results.push(p);
      }
    });

    // 2. UEs
    this.ues().forEach(u => {
      if (u.nom.toLowerCase().includes(q) || u.code.toLowerCase().includes(q)) {
        results.push({
          id: `ue-${u.id}`,
          category: 'Matière / UE',
          title: u.nom,
          subtitle: `Code: ${u.code} • Semestre ${u.semestre}`,
          url: `/ue`,
          icon: 'book-outline',
          badge: u.semestre,
          badgeColor: u.semestre === 'S1' ? 'primary' : 'tertiary'
        });
      }
    });

    // 3. Ressources
    this.ressources().forEach(r => {
      if (r.titre.toLowerCase().includes(q)) {
        results.push({
          id: `res-${r.id}`,
          category: 'Ressource',
          title: r.titre,
          subtitle: `${r.type.toUpperCase()} • Semestre ${r.semestre} (${r.annee})`,
          url: `/ressources`,
          icon: 'document-text-outline',
          badge: r.is_premium ? 'Premium' : 'Gratuit',
          badgeColor: r.is_premium ? 'warning' : 'medium'
        });
      }
    });

    // 4. Etudiants
    this.etudiants().forEach(e => {
      const name = e.full_name || '';
      const email = e.email || '';
      if (name.toLowerCase().includes(q) || email.toLowerCase().includes(q)) {
        results.push({
          id: `etud-${e.id}`,
          category: 'Étudiant',
          title: name || 'Étudiant',
          subtitle: email,
          url: `/etudiants`,
          icon: 'person-outline',
          badge: (e.premium_s1 || e.premium_s2) ? 'Premium' : 'Standard',
          badgeColor: (e.premium_s1 || e.premium_s2) ? 'success' : 'medium'
        });
      }
    });

    return results;
  }

  selectResult(res: SearchResult) {
    this.closeModal();
    this.router.navigateByUrl(res.url);
  }
}
