import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBadge } from '@ionic/angular/standalone';
import { AdminActionsService } from '../../../core/services/admin-actions';
import { AdminAction, ActionCategory } from '../../../core/models/admin-action.model';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-recent-actions-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBadge
  ],
  templateUrl: './recent-actions-list.component.html',
  styleUrls: ['./recent-actions-list.component.scss']
})
export class RecentActionsListComponent implements OnInit {
  adminActionsSvc = inject(AdminActionsService);
  authSvc = inject(AuthService);

  activeFilter = signal<string>('tous');
  searchQuery = signal<string>('');
  showAddModal = signal<boolean>(false);

  newActionForm = {
    title: '',
    description: '',
    category: 'system' as ActionCategory,
    status: 'success' as 'success' | 'warning' | 'danger' | 'info'
  };

  filteredActions = computed(() => {
    const list = this.adminActionsSvc.actions();
    const filter = this.activeFilter();
    const query = this.searchQuery().toLowerCase().trim();

    return list.filter(action => {
      const matchesCategory = filter === 'tous' || action.category === filter;
      const matchesSearch = !query || 
        action.title.toLowerCase().includes(query) || 
        action.description.toLowerCase().includes(query) ||
        action.actor_email.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  });

  ngOnInit() {
    this.adminActionsSvc.fetchActions();
  }

  getCategoryIcon(cat: ActionCategory): string {
    switch (cat) {
      case 'payment': return 'fa-solid fa-credit-card';
      case 'ressource': return 'fa-solid fa-file-lines';
      case 'ue': return 'fa-solid fa-graduation-cap';
      case 'etudiant': return 'fa-solid fa-user-graduate';
      case 'system': return 'fa-solid fa-gear';
      default: return 'fa-solid fa-bolt';
    }
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'danger': return 'danger';
      default: return 'primary';
    }
  }

  formatTimeAgo(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffSec < 60) return 'À l\'instant';
      if (diffSec < 3600) return `Il y a ${Math.floor(diffSec / 60)} min`;
      if (diffSec < 86400) return `Il y a ${Math.floor(diffSec / 3600)} h`;
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  }

  async submitNewAction() {
    if (!this.newActionForm.title.trim()) return;

    const email = this.authSvc.currentUser()?.email || 'admin@archivex.univ.bj';
    await this.adminActionsSvc.recordAction(
      this.newActionForm.title,
      this.newActionForm.description,
      this.newActionForm.category,
      this.newActionForm.status,
      email
    );

    this.newActionForm = {
      title: '',
      description: '',
      category: 'system',
      status: 'success'
    };
    this.showAddModal.set(false);
  }

  async refreshLogs() {
    await this.adminActionsSvc.fetchActions();
  }

  async clearHistory() {
    if (confirm('Voulez-vous réinitialiser l\'historique des actions locales ?')) {
      await this.adminActionsSvc.clearLocalHistory();
    }
  }
}
