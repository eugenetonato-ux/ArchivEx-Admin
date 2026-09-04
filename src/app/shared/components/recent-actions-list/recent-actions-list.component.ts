import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonBadge } from '@ionic/angular/standalone';
import { AdminActionsService } from '../../../core/services/admin-actions';
import { AdminAction, ActionCategory } from '../../../core/models/admin-action.model';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-recent-actions-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
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
      case 'payment': return 'card-outline';
      case 'ressource': return 'document-text-outline';
      case 'ue': return 'book-outline';
      case 'etudiant': return 'people-outline';
      case 'system': return 'cog-outline';
      default: return 'flash-outline';
    }
  }

  getCategoryColor(cat: ActionCategory): string {
    switch (cat) {
      case 'payment': return 'warning';
      case 'ressource': return 'tertiary';
      case 'ue': return 'primary';
      case 'etudiant': return 'success';
      case 'system': return 'medium';
      default: return 'dark';
    }
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'danger': return 'danger';
      case 'info': return 'tertiary';
      default: return 'medium';
    }
  }

  formatTimeAgo(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} j`;

    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  async submitNewAction() {
    if (!this.newActionForm.title.trim()) return;

    await this.adminActionsSvc.logAction({
      title: this.newActionForm.title,
      description: this.newActionForm.description || 'Action administrative enregistrée manuellement.',
      category: this.newActionForm.category,
      status: this.newActionForm.status,
      actor_email: this.authSvc.currentUser()?.email || 'admin@archivex.univ.bj'
    });

    this.newActionForm.title = '';
    this.newActionForm.description = '';
    this.showAddModal.set(false);
  }

  async refreshLogs() {
    await this.adminActionsSvc.fetchActions();
  }

  async clearHistory() {
    if (confirm('Voulez-vous vraiment réinitialiser l\'historique des actions récentes ?')) {
      await this.adminActionsSvc.clearAllActions();
    }
  }
}
