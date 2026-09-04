import { Injectable, signal } from '@angular/core';

export interface AccentColor {
  id: string;
  name: string;
  hex: string;
  rgb: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'violet', name: 'Classique Violet (ArchivEx)', hex: '#5B3CC4', rgb: '91, 60, 196' },
  { id: 'ocean', name: 'Bleu Océan', hex: '#0284C7', rgb: '2, 132, 199' },
  { id: 'emerald', name: 'Vert Émeraude', hex: '#059669', rgb: '5, 150, 105' },
  { id: 'velours', name: 'Rouge Velours', hex: '#DC2626', rgb: '220, 38, 38' },
  { id: 'charbon', name: 'Gris Charbon', hex: '#4B5563', rgb: '75, 85, 99' },
  { id: 'ambre', name: 'Ambre Doré', hex: '#D97706', rgb: '217, 119, 6' }
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentAccent = signal<AccentColor>(ACCENT_COLORS[0]);
  darkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const savedAccent = localStorage.getItem('archivex-accent-palette');
    if (savedAccent) {
      const found = ACCENT_COLORS.find(c => c.id === savedAccent);
      if (found) this.setAccent(found);
    } else {
      this.setAccent(ACCENT_COLORS[0]);
    }

    const savedDark = localStorage.getItem('archivex-dark-mode');
    if (savedDark === 'true') {
      this.setDarkMode(true);
    }
  }

  setAccent(accent: AccentColor) {
    this.currentAccent.set(accent);
    localStorage.setItem('archivex-accent-palette', accent.id);

    document.documentElement.style.setProperty('--ion-color-primary', accent.hex);
    document.documentElement.style.setProperty('--ion-color-primary-rgb', accent.rgb);
    document.documentElement.style.setProperty('--accent-color', accent.hex);
  }

  setDarkMode(isDark: boolean) {
    this.darkMode.set(isDark);
    localStorage.setItem('archivex-dark-mode', String(isDark));
    document.body.classList.toggle('dark', isDark);
  }
}
