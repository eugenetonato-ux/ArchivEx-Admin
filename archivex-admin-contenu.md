# ArchivEx Admin — Contenu du code (scaffold initial)

Compagnon de `archivex-admin-skill.md`. Code de base — à compléter au
fil des itérations.

---

## 1. Configuration racine

### `main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding
} from '@angular/router';

import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons(allIcons);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient()
  ]
});
```

### `src/environments/environment.ts`

```typescript
export const environment = {
  production: false, // true dans environment.prod.ts
  supabaseUrl: 'https://<ton-projet>.supabase.co',
  supabaseAnonKey: '<clé-publique-anon>'
};
```

---

## 2. Modèles

### `core/models/ue.model.ts`

```typescript
export type Semestre = 'S1' | 'S2';

export interface UE {
  id: string;
  nom: string;
  code: string;
  semestre: Semestre;
}
```

### `core/models/ressource.model.ts`

```typescript
import { Semestre } from './ue.model';

export type TypeRessource = 'epreuve' | 'corrige' | 'resume';

export interface Ressource {
  id: string;
  type: TypeRessource;
  titre: string;
  ue_id: string;
  semestre: Semestre;
  annee: number;
  session: 'normale' | 'rattrapage' | null;
  fichier_url: string;
  is_premium: boolean;
  epreuve_liee_id: string | null;
  created_at: string;
}
```

### `core/models/paiement.model.ts`

```typescript
import { Semestre } from './ue.model';

export interface Paiement {
  id: string;
  user_id: string;
  semestre: Semestre;
  montant: number;
  statut: 'en_attente' | 'confirme' | 'rejete';
  reference: string | null;
  created_at: string;
}
```

---

## 3. Services

### `core/services/auth.ts`

```typescript
import { Injectable, signal } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  ready = signal(false);
  currentUserId = signal<string | null>(null);

  constructor() {
    supabase.auth.getSession().then(({ data }) => {
      this.currentUserId.set(data.session?.user.id ?? null);
      this.ready.set(true);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUserId.set(session?.user.id ?? null);
    });
  }

  async waitUntilReady() {
    while (!this.ready()) {
      await new Promise(r => setTimeout(r, 50));
    }
  }

  isAuthenticated() {
    return !!this.currentUserId();
  }

  async signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async signOut() {
    await supabase.auth.signOut();
  }
}
```

### `core/services/ue.ts`

```typescript
import { Injectable } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { UE, Semestre } from '../models/ue.model';

@Injectable({ providedIn: 'root' })
export class UeService {
  async list(semestre?: Semestre) {
    let query = supabase.from('ue').select('*').order('nom');
    if (semestre) query = query.eq('semestre', semestre);
    const { data, error } = await query;
    if (error) throw error;
    return data as UE[];
  }

  async creer(ue: Omit<UE, 'id'>) {
    const { error } = await supabase.from('ue').insert(ue);
    if (error) throw error;
  }

  async supprimer(id: string) {
    const { error } = await supabase.from('ue').delete().eq('id', id);
    if (error) throw error;
  }
}
```

### `core/services/ressources.ts`

```typescript
import { Injectable } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { Ressource } from '../models/ressource.model';

@Injectable({ providedIn: 'root' })
export class RessourcesService {
  async list(filtres: { semestre?: string; type?: string } = {}) {
    let query = supabase.from('ressources').select('*, ue:ue_id(nom)').order('created_at', { ascending: false });
    if (filtres.semestre) query = query.eq('semestre', filtres.semestre);
    if (filtres.type) query = query.eq('type', filtres.type);
    const { data, error } = await query;
    if (error) throw error;
    return data as Ressource[];
  }

  // is_premium est envoyé tel quel pour les épreuves ; pour corrigé/résumé,
  // le trigger Postgres `forcer_premium_corrige_resume` écrase la valeur
  // à true quoi qu'on envoie ici — pas besoin de le forcer côté front,
  // mais on le fait quand même en UI pour la cohérence de l'affichage.
  async creer(ressource: Omit<Ressource, 'id' | 'fichier_url' | 'created_at'>, fichier: File) {
    const { data: inserted, error: errInsert } = await supabase
      .from('ressources')
      .insert({ ...ressource, fichier_url: '' })
      .select()
      .single();
    if (errInsert) throw errInsert;

    const chemin = `fichiers/${inserted.id}`;
    const { error: errUpload } = await supabase.storage.from('ressources').upload(chemin, fichier);
    if (errUpload) throw errUpload;

    const { error: errUpdate } = await supabase
      .from('ressources')
      .update({ fichier_url: chemin })
      .eq('id', inserted.id);
    if (errUpdate) throw errUpdate;
  }

  async supprimer(id: string) {
    await supabase.storage.from('ressources').remove([`fichiers/${id}`]);
    const { error } = await supabase.from('ressources').delete().eq('id', id);
    if (error) throw error;
  }
}
```

### `core/services/paiements.ts`

```typescript
import { Injectable } from '@angular/core';
import { supabase } from '../../data/supabase/supabase-client';
import { Paiement } from '../models/paiement.model';

@Injectable({ providedIn: 'root' })
export class PaiementsService {
  async list(statut?: string) {
    let query = supabase
      .from('paiements')
      .select('*, profile:user_id(full_name, email)')
      .order('created_at', { ascending: false });
    if (statut) query = query.eq('statut', statut);
    const { data, error } = await query;
    if (error) throw error;
    return data as (Paiement & { profile: { full_name: string; email: string } })[];
  }

  // Passe par la RPC transactionnelle côté Postgres : met à jour le statut
  // ET active premium_s1/s2 dans la même transaction (cf. schéma admin).
  async valider(paiementId: string) {
    const { error } = await supabase.rpc('valider_paiement', { p_paiement_id: paiementId });
    if (error) throw error;
  }
}
```

---

## 4. Guard

### `core/guards/admin-auth.guard.ts`

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminAuthGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.waitUntilReady();
  if (auth.isAuthenticated()) return true;
  return router.parseUrl('/auth/login');
};
```

---

## 5. Page — Ressources (liste + formulaire d'ajout)

### `pages/ressources/ressources.page.ts`

```typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular';
import { RessourcesService } from '../../core/services/ressources';
import { UeService } from '../../core/services/ue';
import { Ressource, TypeRessource } from '../../core/models/ressource.model';
import { UE } from '../../core/models/ue.model';

@Component({
  selector: 'app-ressources',
  standalone: true,
  imports: [CommonModule, IonContent],
  templateUrl: './ressources.page.html',
  styleUrls: ['./ressources.page.scss']
})
export class RessourcesPage implements OnInit {
  ressources: Ressource[] = [];
  ues: UE[] = [];
  loading = true;

  // état du formulaire d'ajout
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
    private ueSvc: UeService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.charger();
  }

  // Le toggle premium est désactivé en UI pour corrigé/résumé —
  // reflète la règle imposée côté base par le trigger.
  get premiumForce(): boolean {
    return this.form.type === 'corrige' || this.form.type === 'resume';
  }

  async charger() {
    this.loading = true;
    try {
      this.ressources = await this.ressourcesSvc.list();
      this.ues = await this.ueSvc.list();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onFichierChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.form.fichier = input.files?.[0] ?? null;
  }

  async ajouter() {
    if (!this.form.fichier) return;
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
    await this.charger();
  }

  async supprimer(id: string) {
    await this.ressourcesSvc.supprimer(id);
    await this.charger();
  }
}
```

---

## 6. Page — Paiements (validation manuelle)

### `pages/paiements/paiements.page.ts`

```typescript
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular';
import { PaiementsService } from '../../core/services/paiements';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [CommonModule, IonContent],
  templateUrl: './paiements.page.html',
  styleUrls: ['./paiements.page.scss']
})
export class PaiementsPage implements OnInit {
  paiements: any[] = [];
  loading = true;
  filtreStatut: string | undefined = 'en_attente';

  constructor(private paiementsSvc: PaiementsService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.charger();
  }

  async charger() {
    this.loading = true;
    try {
      this.paiements = await this.paiementsSvc.list(this.filtreStatut);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // À appeler seulement après vérification manuelle côté dashboard Sebpay
  async valider(id: string) {
    await this.paiementsSvc.valider(id);
    await this.charger();
  }

  changerFiltre(statut: string | undefined) {
    this.filtreStatut = statut;
    this.charger();
  }
}
```

---

## 7. Schéma Supabase

Le schéma complet (tables `profiles`, `ue`, `ressources`, `paiements`,
trigger `forcer_premium_corrige_resume`, RPC `valider_paiement`,
policies RLS) est dans `archivex-admin-skill.md`, section 6 — c'est la
version de référence, partagée avec la PWA.
