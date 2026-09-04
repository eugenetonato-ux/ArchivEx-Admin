import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonBadge } from '@ionic/angular/standalone';

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  url: string;
  icon: string;
  badge?: string | number;
  badgeColor?: string;
}

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IonBadge
  ],
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss']
})
export class SidebarNavComponent {
  @Input() currentUserEmail = 'admin@archivex.univ.bj';
  @Input() pendingPaiementsCount = 0;

  @Output() linkClick = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onNavItemClick() {
    this.linkClick.emit();
  }

  onLogoutClick() {
    this.logout.emit();
  }

  get navGroups(): NavGroup[] {
    return [
      {
        groupName: 'VUE PRINCIPALE',
        items: [
          { title: 'Tableau de bord', url: '/dashboard', icon: 'fa-solid fa-table-cells-large' }
        ]
      },
      {
        groupName: 'GESTION ACADÉMIQUE',
        items: [
          { title: 'Unités d\'Enseignement', url: '/ue', icon: 'fa-solid fa-graduation-cap', badge: 'S1 / S2', badgeColor: 'tertiary' },
          { title: 'Ressources Pédagogiques', url: '/ressources', icon: 'fa-solid fa-file-lines', badge: 'PDF', badgeColor: 'primary' }
        ]
      },
      {
        groupName: 'FINANCES & ÉTUDIANTS',
        items: [
          {
            title: 'Validation Paiements',
            url: '/paiements',
            icon: 'fa-solid fa-credit-card',
            badge: this.pendingPaiementsCount > 0 ? `${this.pendingPaiementsCount}` : undefined,
            badgeColor: 'warning'
          },
          { title: 'Gestion Étudiants', url: '/etudiants', icon: 'fa-solid fa-user-graduate', badge: 'Pass', badgeColor: 'success' }
        ]
      },
      {
        groupName: 'SYSTÈME',
        items: [
          { title: 'Paramètres & Thème', url: '/parametres', icon: 'fa-solid fa-sliders' }
        ]
      }
    ];
  }
}
