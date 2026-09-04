import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth';
import { ThemeService } from '../../../core/services/theme';
import { ShortcutsService } from '../../../core/services/shortcuts';
import { PaiementsService } from '../../../core/services/paiements';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';
import { GlobalSearchComponent } from '../global-search/global-search.component';
import { ShortcutsModalComponent } from '../shortcuts-modal/shortcuts-modal.component';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    SidebarNavComponent,
    GlobalSearchComponent,
    ShortcutsModalComponent
  ],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss']
})
export class ShellLayoutComponent implements OnInit {
  @Input() pageTitle = 'Dashboard Admin';

  mobileMenuOpen = signal<boolean>(false);
  pendingPaiementsCount = signal<number>(3);

  private paiementsSvc = inject(PaiementsService);

  constructor(
    public authSvc: AuthService,
    public themeSvc: ThemeService,
    public shortcutsSvc: ShortcutsService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const list = await this.paiementsSvc.list('en_attente');
      this.pendingPaiementsCount.set(list.length);
    } catch {
      // Keep default fallback count
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(val => !val);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  async logout() {
    await this.authSvc.signOut();
    this.router.navigate(['/auth/login']);
  }
}
