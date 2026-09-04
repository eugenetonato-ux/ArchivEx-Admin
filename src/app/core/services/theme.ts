import { Injectable, signal } from '@angular/core';

export interface AccentColor {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  shade: string;
  tint: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'violet', name: 'Violet Pur (ArchivEx)', hex: '#5B3CC4', rgb: '91, 60, 196', shade: '#5035ad', tint: '#6b50ca' },
  { id: 'ocean', name: 'Bleu Océan', hex: '#0284C7', rgb: '2, 132, 199', shade: '#0274b0', tint: '#1ba3e6' },
  { id: 'emerald', name: 'Vert Émeraude', hex: '#059669', rgb: '5, 150, 105', shade: '#04825b', tint: '#0fa978' },
  { id: 'velours', name: 'Rouge Velours', hex: '#DC2626', rgb: '220, 38, 38', shade: '#c22121', tint: '#e24848' },
  { id: 'charbon', name: 'Gris Charbon', hex: '#4B5563', rgb: '75, 85, 99', shade: '#404955', tint: '#616c7a' },
  { id: 'ambre', name: 'Ambre Doré', hex: '#D97706', rgb: '217, 119, 6', shade: '#be6805', tint: '#e48d21' }
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentAccent = signal<AccentColor>(ACCENT_COLORS[0]);
  darkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    // 1. Accent palette persistence
    const savedAccent = localStorage.getItem('archivex-accent-palette');
    if (savedAccent) {
      const found = ACCENT_COLORS.find(c => c.id === savedAccent);
      if (found) this.setAccent(found);
      else this.setAccent(ACCENT_COLORS[0]);
    } else {
      this.setAccent(ACCENT_COLORS[0]);
    }

    // 2. Dark mode persistence
    const savedDark = localStorage.getItem('archivex-dark-mode');
    if (savedDark !== null) {
      this.setDarkMode(savedDark === 'true');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkMode(prefersDark);
    }
  }

  setAccent(accent: AccentColor) {
    this.currentAccent.set(accent);
    localStorage.setItem('archivex-accent-palette', accent.id);

    const root = document.documentElement;
    root.style.setProperty('--ion-color-primary', accent.hex);
    root.style.setProperty('--ion-color-primary-rgb', accent.rgb);
    root.style.setProperty('--ion-color-primary-shade', accent.shade);
    root.style.setProperty('--ion-color-primary-tint', accent.tint);
    root.style.setProperty('--accent-color', accent.hex);

    document.body.style.setProperty('--ion-color-primary', accent.hex);
    document.body.style.setProperty('--ion-color-primary-rgb', accent.rgb);
    document.body.style.setProperty('--ion-color-primary-shade', accent.shade);
    document.body.style.setProperty('--ion-color-primary-tint', accent.tint);
  }

  setDarkMode(isDark: boolean) {
    this.darkMode.set(isDark);
    localStorage.setItem('archivex-dark-mode', String(isDark));

    document.body.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkMode());
  }
}
