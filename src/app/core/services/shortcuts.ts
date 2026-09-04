import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ShortcutsService {
  showHelpModal = signal<boolean>(false);

  constructor(private router: Router) {
    this.listen();
  }

  private listen() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ignore shortcut actions when typing in text inputs or textareas
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Ctrl+K or Cmd+K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('ion-searchbar input, input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      // H or ? : Toggle help modal
      if (e.key === '?' || e.key.toLowerCase() === 'h') {
        e.preventDefault();
        this.toggleHelpModal();
        return;
      }

      // Escape: Close help modal & blur active elements
      if (e.key === 'Escape') {
        this.showHelpModal.set(false);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        return;
      }

      // Navigation shortcuts
      switch (e.key.toLowerCase()) {
        case 'd':
          this.router.navigate(['/dashboard']);
          break;
        case 'r':
          this.router.navigate(['/ressources']);
          break;
        case 'm':
          this.router.navigate(['/ue']);
          break;
        case 'p':
          this.router.navigate(['/paiements']);
          break;
        case 'e':
          this.router.navigate(['/etudiants']);
          break;
        case 'n':
          this.router.navigate(['/ressources'], { queryParams: { action: 'new' } });
          break;
        case 'u':
          this.router.navigate(['/ue'], { queryParams: { action: 'new' } });
          break;
      }
    });
  }

  toggleHelpModal() {
    this.showHelpModal.update(v => !v);
  }
}
