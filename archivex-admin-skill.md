# SKILL : Scaffolding & Architecture — ArchivEx Admin (Web)

## 🎯 Objectif

Ce skill décrit l'architecture cible de l'**espace administrateur web
ArchivEx** (Angular + Ionic + Supabase), utilisé pour gérer les UE, les
ressources (épreuves/corrigés/résumés), le statut premium et la
validation des paiements Sebpay. Adapté du scaffold Budgy.

Le code complet de chaque fichier est dans `archivex-admin-contenu.md`
(même dossier). Le pendant étudiant est dans `archivex-pwa-skill.md` /
`archivex-pwa-contenu.md`. **Le schéma Supabase de cette page fait
référence pour les deux applications.**

---

## 1️⃣ Stack réelle

| Brique | Choix |
|---|---|
| Framework | Angular (standalone components, builder `@angular/build:application`) |
| UI Kit | Ionic Framework (`@ionic/angular`) — utilisé ici pour un dashboard desktop, pas pour une PWA installable |
| Backend | Supabase — Auth email/mot de passe (comptes admin créés manuellement, pas d'inscription publique) + Postgres + Storage + RLS |
| Upload fichiers | Supabase Storage, bucket `ressources` (privé) |
| Icônes | `ionicons` — `addIcons(allIcons)` dans `main.ts` |

> Pas de service worker / manifest ici : l'admin est un outil de
> gestion interne, pas une app installable.

---

## 2️⃣ Commandes de création

```bash
ionic start archivex-admin sidemenu --type=angular-standalone
cd archivex-admin

npm install @supabase/supabase-js
```

---

## 3️⃣ Arborescence cible

```
src/
├── app/
│   ├── core/
│   │   ├── guards/admin-auth.guard.ts
│   │   ├── models/
│   │   │   ├── ue.model.ts
│   │   │   ├── ressource.model.ts
│   │   │   └── paiement.model.ts
│   │   └── services/
│   │       ├── auth.ts              (email/mot de passe, comptes admin uniquement)
│   │       ├── ue.ts                (CRUD)
│   │       ├── ressources.ts        (CRUD + upload Storage)
│   │       └── paiements.ts         (liste + validation manuelle)
│   ├── data/supabase/supabase-client.ts
│   ├── shared/components/
│   │   ├── sidebar-nav/
│   │   ├── ressource-form-modal/     (type, UE, semestre, année, session, is_premium)
│   │   ├── upload-zone/
│   │   └── kpi-card/
│   ├── pages/
│   │   ├── auth/login/
│   │   ├── dashboard/                 (KPI: nb ressources, nb premium, paiements en attente)
│   │   ├── ue/                        (liste + form UE par semestre)
│   │   ├── ressources/                (liste + filtres + form ajout/édition)
│   │   └── paiements/                 (liste, statut, bouton "Valider")
│   ├── app.routes.ts
│   └── app.component.ts
├── environments/environment.ts, environment.prod.ts
├── theme/archivex-tokens.scss
angular.json
```

# Scaffold de l'arborescence ArchivEx Admin (PowerShell)
# À exécuter depuis la racine du projet (après `ionic start archivex-admin sidemenu --type=angular-standalone`)
# Usage : .\scaffold-archivex-admin.ps1

$Base = "src/app"

function New-Dir($path) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
}

function New-File($path) {
    New-Item -ItemType File -Path $path -Force | Out-Null
}

# --- core/guards ---
New-Dir "$Base/core/guards"
New-File "$Base/core/guards/admin-auth.guard.ts"

# --- core/models ---
New-Dir "$Base/core/models"
New-File "$Base/core/models/ue.model.ts"
New-File "$Base/core/models/ressource.model.ts"
New-File "$Base/core/models/paiement.model.ts"

# --- core/services ---
New-Dir "$Base/core/services"
New-File "$Base/core/services/auth.ts"
New-File "$Base/core/services/ue.ts"
New-File "$Base/core/services/ressources.ts"
New-File "$Base/core/services/paiements.ts"

# --- data/supabase ---
New-Dir "$Base/data/supabase"
New-File "$Base/data/supabase/supabase-client.ts"

# --- shared/components ---
New-Dir "$Base/shared/components/sidebar-nav"
New-File "$Base/shared/components/sidebar-nav/sidebar-nav.component.ts"
New-File "$Base/shared/components/sidebar-nav/sidebar-nav.component.html"
New-File "$Base/shared/components/sidebar-nav/sidebar-nav.component.scss"

New-Dir "$Base/shared/components/ressource-form-modal"
New-File "$Base/shared/components/ressource-form-modal/ressource-form-modal.component.ts"
New-File "$Base/shared/components/ressource-form-modal/ressource-form-modal.component.html"
New-File "$Base/shared/components/ressource-form-modal/ressource-form-modal.component.scss"

New-Dir "$Base/shared/components/upload-zone"
New-File "$Base/shared/components/upload-zone/upload-zone.component.ts"
New-File "$Base/shared/components/upload-zone/upload-zone.component.html"
New-File "$Base/shared/components/upload-zone/upload-zone.component.scss"

New-Dir "$Base/shared/components/kpi-card"
New-File "$Base/shared/components/kpi-card/kpi-card.component.ts"
New-File "$Base/shared/components/kpi-card/kpi-card.component.html"
New-File "$Base/shared/components/kpi-card/kpi-card.component.scss"

# --- pages/auth/login ---
New-Dir "$Base/pages/auth/login"
New-File "$Base/pages/auth/login/login.page.ts"
New-File "$Base/pages/auth/login/login.page.html"
New-File "$Base/pages/auth/login/login.page.scss"

# --- pages/dashboard ---
New-Dir "$Base/pages/dashboard"
New-File "$Base/pages/dashboard/dashboard.page.ts"
New-File "$Base/pages/dashboard/dashboard.page.html"
New-File "$Base/pages/dashboard/dashboard.page.scss"

# --- pages/ue ---
New-Dir "$Base/pages/ue"
New-File "$Base/pages/ue/ue.page.ts"
New-File "$Base/pages/ue/ue.page.html"
New-File "$Base/pages/ue/ue.page.scss"

# --- pages/ressources ---
New-Dir "$Base/pages/ressources"
New-File "$Base/pages/ressources/ressources.page.ts"
New-File "$Base/pages/ressources/ressources.page.html"
New-File "$Base/pages/ressources/ressources.page.scss"

# --- pages/paiements ---
New-Dir "$Base/pages/paiements"
New-File "$Base/pages/paiements/paiements.page.ts"
New-File "$Base/pages/paiements/paiements.page.html"
New-File "$Base/pages/paiements/paiements.page.scss"

# --- racine app ---
New-File "$Base/app.routes.ts"
New-File "$Base/app.component.ts"

# --- environments ---
New-Dir "src/environments"
New-File "src/environments/environment.ts"
New-File "src/environments/environment.prod.ts"

# --- theme ---
New-Dir "src/theme"
New-File "src/theme/archivex-tokens.scss"

Write-Host "Arborescence ArchivEx Admin créée." -ForegroundColor Green



---

## 4️⃣ Points d'architecture spécifiques ArchivEx Admin

### 4.1 Comptes admin — pas d'inscription publique

Les comptes admin sont créés **manuellement** depuis le dashboard
Supabase (Auth > Users) ou via un script, jamais via un formulaire
d'inscription exposé dans l'app. `guest.guard`/signup n'existent pas
côté admin — uniquement une page login email/mot de passe.

### 4.2 Règle premium forcée au niveau base, pas seulement formulaire

Dans `ressource-form-modal` :
- si `type = 'corrige'` ou `type = 'resume'` → le toggle `is_premium`
  est **affiché coché et désactivé** (non modifiable)
- si `type = 'epreuve'` → le toggle est actif, l'admin choisit

Mais l'UI seule ne suffit pas : un **trigger Postgres** applique la
règle à l'insertion/mise à jour (cf. schéma section 6) pour empêcher
tout contournement (bug front, appel API direct, etc.).

### 4.3 Upload de fichiers

`ressources.ts` : à la création d'une ressource, upload du fichier
vers `storage.from('ressources').upload('fichiers/' + ressourceId, file)`
puis insertion de la ligne en base avec l'`id` déjà connu (généré côté
client avant upload, ou récupéré après insert puis renommage du
fichier). Le bucket est **privé** — jamais d'URL publique directe.

### 4.4 Validation manuelle des paiements Sebpay

Le lien Sebpay utilisé côté PWA ne notifie pas automatiquement le
backend (pas de webhook). La page `paiements` liste donc les demandes
`en_attente`, l'admin vérifie côté dashboard Sebpay que la transaction
est bien reçue, puis clique "Valider" :
- statut paiement → `confirme`
- `profiles.premium_s1` ou `premium_s2` de l'utilisateur → `true`

Ces deux mises à jour doivent être faites dans une seule transaction
(fonction RPC Postgres recommandée plutôt que deux appels séparés côté
client, pour éviter un état incohérent en cas d'erreur réseau).

### 4.5 Bugs Budgy à surveiller par anticipation

- `polyfills: ["zone.js"]` dans `angular.json`
- `addIcons(allIcons)` dans `main.ts`
- Import Ionic direct `@ionic/angular` (pas `/standalone`)
- `this.cdr.detectChanges()` après chaque chargement Supabase async

---

## 5️⃣ Lancement

```bash
ionic serve
ng build --configuration production
```

---

## 6️⃣ Schéma Supabase (canonique, partagé PWA + Admin)

```sql
-- Profils étudiants (extension de auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  premium_s1 boolean default false,
  premium_s2 boolean default false,
  created_at timestamptz default now()
);

-- Unités d'enseignement
create table ue (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  code text not null,
  semestre text not null check (semestre in ('S1', 'S2'))
);

-- Ressources pédagogiques
create table ressources (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('epreuve', 'corrige', 'resume')),
  titre text not null,
  ue_id uuid not null references ue(id) on delete cascade,
  semestre text not null check (semestre in ('S1', 'S2')),
  annee int not null,
  session text check (session in ('normale', 'rattrapage')),
  fichier_url text not null,
  is_premium boolean not null default false,
  epreuve_liee_id uuid references ressources(id) on delete set null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Règle : corrigés et résumés toujours premium, quoi qu'envoie le front
create function public.forcer_premium_corrige_resume()
returns trigger as $$
begin
  if new.type in ('corrige', 'resume') then
    new.is_premium := true;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_forcer_premium
  before insert or update on ressources
  for each row execute procedure public.forcer_premium_corrige_resume();

-- Paiements
create table paiements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  semestre text not null check (semestre in ('S1', 'S2')),
  montant numeric not null,
  statut text not null default 'en_attente' check (statut in ('en_attente', 'confirme', 'rejete')),
  reference text,
  created_at timestamptz default now()
);

-- RPC de validation atomique (statut + activation premium)
create function public.valider_paiement(p_paiement_id uuid)
returns void as $$
declare
  v_user_id uuid;
  v_semestre text;
begin
  select user_id, semestre into v_user_id, v_semestre
  from paiements where id = p_paiement_id and statut = 'en_attente';

  if v_user_id is null then
    raise exception 'Paiement introuvable ou déjà traité';
  end if;

  update paiements set statut = 'confirme' where id = p_paiement_id;

  if v_semestre = 'S1' then
    update profiles set premium_s1 = true where id = v_user_id;
  else
    update profiles set premium_s2 = true where id = v_user_id;
  end if;
end;
$$ language plpgsql security definer;

-- Trigger création profil à l'inscription (Google OAuth côté PWA)
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table profiles enable row level security;
alter table ue enable row level security;
alter table ressources enable row level security;
alter table paiements enable row level security;

create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

create policy "ue_select_all" on ue for select using (true);

create policy "ressources_select_accessible" on ressources for select using (
  is_premium = false
  or (semestre = 'S1' and (select premium_s1 from profiles where id = auth.uid()))
  or (semestre = 'S2' and (select premium_s2 from profiles where id = auth.uid()))
);

create policy "paiements_select_own" on paiements for select using (auth.uid() = user_id);
create policy "paiements_insert_own" on paiements for insert with check (auth.uid() = user_id);
```

> ⚠️ Les policies `insert`/`update`/`delete` sur `ue` et `ressources`
> ne sont **pas** ouvertes ici : elles doivent être restreintes aux
> comptes admin (par ex. via une table `admins(user_id)` vérifiée dans
> la policy, ou via le rôle `service_role` utilisé uniquement côté
> app admin avec une clé dédiée — à trancher selon si l'admin passe
> par l'anon key + policy dédiée, ou par une clé service).

---

## ✅ Checklist scaffold Admin

- [ ] Login email/mot de passe (comptes créés manuellement)
- [ ] CRUD UE (nom, code, semestre)
- [ ] CRUD ressources avec upload fichier vers Storage
- [ ] Toggle `is_premium` désactivé et forcé pour corrigés/résumés
- [ ] Liaison épreuve ↔ corrigé (`epreuve_liee_id`)
- [ ] Liste paiements avec filtre par statut
- [ ] Bouton "Valider" appelant la RPC `valider_paiement`
- [ ] Dashboard avec KPI (nb ressources par semestre, paiements en attente)
