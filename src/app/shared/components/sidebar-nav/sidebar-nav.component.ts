import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon, IonBadge } from '@ionic/angular/standalone';

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
    IonIcon,
    IonBadge
  ],
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss']
})
export class SidebarNavComponent {
  @Input() collapsed = false;
  @Input() currentUserEmail = 'admin@archivex.univ.bj';
  @Input() pendingPaiementsCount = 3;

  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() linkClick = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  get navGroups(): NavGroup[] {
    return [
      {
        groupName: 'VUE PRINCIPALE',
        items: [
          { title: 'Tableau de bord', url: '/dashboard', icon: 'grid-outline' }
        ]
      },
      {
        groupName: 'GESTION ACADÉMIQUE',
        items: [
          { title: 'Unités d\'Enseignement', url: '/ue', icon: 'book-outline', badge: 'S1 / S2', badgeColor: 'tertiary' },
          { title: 'Ressources Pédagogiques', url: '/ressources', icon: 'document-text-outline', badge: 'PDF', badgeColor: 'primary' }
        ]
      },
      {
        groupName: 'FINANCES & ÉTUDIANTS',
        items: [
          {
            title: 'Validation Paiements',
            url: '/paiements',
            icon: 'card-outline',
            badge: this.pendingPaiementsCount > 0 ? `${this.pendingPaiementsCount}` : undefined,
            badgeColor: 'warning'
          },
          { title: 'Gestion Étudiants', url: '/etudiants', icon: 'people-outline', badge: 'Pass', badgeColor: 'success' }
        ]
      },
      {
        groupName: 'SYSTÈME',
        items: [
          { title: 'Paramètres & Thème', url: '/parametres', icon: 'settings-outline' }
        ]
      }
    ];
  }

  onCollapseToggle() {
    this.toggleCollapse.emit();
  }

  onNavItemClick() {
    this.linkClick.emit();
  }

  onLogoutClick() {
    this.logout.emit();
  }
}
