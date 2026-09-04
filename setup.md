# Guide de Référence Complet & Manuel de Configuration — ArchivEx Admin

Ce guide documente l'ensemble des fonctionnalités, de l'architecture technique, de la configuration et des déploiements développés pour l'Espace d'Administration d'ArchivEx depuis le début de nos échanges.

---

## 🚀 1. Présentation de la Plateforme ArchivEx Admin

ArchivEx Admin est le portail web d'administration de l'application mobile ArchivEx, conçu pour les gestionnaires pédagogiques de l'université. L'application est un tableau de bord (SPA) complet, réactif, moderne et disponible en modes **Clair** et **Sombre**, avec un système robuste de raccourcis de productivité.

### Fonctionnalités Clés du Portail :
1. **Tableau de Bord Analytique** :
   * Des cartes KPI animées présentant les statistiques générales (recettes, étudiants premium, ressources partagées).
   * Des graphiques de performance interactifs avancés (répartition par semestre, tendances de publication, graphiques linéaires en relief).
   * Un flux d'activité en temps réel (`ActivityFeed`) pour suivre les dernières actions sur la plateforme.
2. **Gestion des Unités d'Enseignement (UEs)** :
   * Liste complète filtrée par semestre (S1 / S2) avec codes uniques de matières.
   * Création et suppression sécurisées d'UEs, associées à un nuancier de couleurs d'accentuation pour l'affichage.
3. **Bibliothèque de Ressources Pédagogiques** :
   * Recherche instantanée et filtres avancés (semestre, matière, type de ressource).
   * Formulaire complet de publication de documents avec téléversement factice/réel de fichiers (PDF, Images, etc.).
   * **Règle métier stricte (Trigger Répliqué)** : Les ressources de type *Corrigé* et *Résumé* sont **systématiquement forcées comme Premium**, quelle que soit l'instruction envoyée par le client (réplication du comportement du déclencheur de base de données PostgreSQL `trg_forcer_premium`).
4. **Validation des Paiements (File d'Attente)** :
   * File de traitement des transactions envoyées par les étudiants pour débloquer l'accès aux cours.
   * Option de filtrage rapide (En attente, Confirmé, Rejeté).
   * **Validation de Transaction Répliquée (RPC)** : La validation d'un paiement déclenche l'exécution factice/réelle de la procédure stockée `public.valider_paiement(p_paiement_id)`, qui met automatiquement à jour le statut du paiement en `confirme` et accorde instantanément le statut premium de l'étudiant concerné pour le semestre ciblé.
5. **Gestion des Comptes Étudiants & Accès** :
   * Annuaire complet des profils d'étudiants inscrits.
   * Suivi des accès Premium semestre par semestre.
   * Boutons d'activation/désactivation manuelle directe des droits premium (Pass S1 / Pass S2).
6. **Espace Paramètres & Sélecteur d'Accentuation Dynamique** :
   * Personnalisation instantanée de l'ambiance visuelle du portail.
   * Journal système détaillant l'état de la synchronisation locale et du Service Worker.

---

## ⌨️ 2. Raccourcis Clavier de Productivité (Keyboard Shortcuts)

Pour accélérer la navigation des administrateurs au quotidien, un moteur de raccourcis clavier global a été implémenté (un panneau d'aide interactif peut être ouvert via le bouton **"?"** flottant en bas à droite de l'écran, ou en pressant la touche `H` ou `?`) :

* `Ctrl + K` / `Cmd + K` : Focus automatique sur la barre de recherche globale (avec auto-sélection du texte existant).
* `D` : Accéder instantanément au **Tableau de Bord**.
* `R` : Consulter la **Bibliothèque des Ressources**.
* `M` : Gérer les **Matières / UEs**.
* `P` : Traiter la file des **Paiements**.
* `E` : Gérer l'annuaire des **Étudiants**.
* `N` : Ouvrir directement le formulaire de **Nouvelle Ressource**.
* `U` : Ouvrir directement le formulaire de **Nouvelle UE**.
* `Echap` : Fermer instantanément n'importe quel panneau, formulaire de création ou invite d'aide.

---

## 🎨 3. Thèmes & Personnalisation de l'Accentuation Visuelle

L'interface utilise des variables d'environnement CSS (`--accent-color`, `--accent-color-hover`, `--accent-color-light`) intégrées dans la couche de base de Tailwind CSS.

### Sélections de Couleurs Professionnelles :
* **Classique Violet (ArchivEx)** : Violet institutionnel d'origine (`#5B3CC4`).
* **Bleu Océan** : Bleu rassurant et élégant (`#0284C7`).
* **Vert Émeraude** : Vert moderne, symbole de validation académique (`#059669`).
* **Rouge Velours** : Rouge puissant et audacieux pour une présence affirmée (`#DC2626`).
* **Gris Charbon** : Un ton neutre, contemporain et ultra-épuré (`#4B5563`).
* **Ambre Doré** : Un jaune ambré chaleureux et prestigieux (`#D97706`).

La couleur d'accentuation choisie est mémorisée sous la clé `archivex-accent-palette` dans le stockage local (`localStorage`) de l'utilisateur pour être restaurée automatiquement à chaque visite. Un **Aperçu en Temps Réel** interactif est disponible dans l'onglet *Paramètres* pour visualiser le rendu des éléments interactifs et des états (boutons, badges, bordures, ombres).

---

## 📡 4. Support Hors-Ligne Résilient (PWA & Service Worker)

L'application est entièrement conforme aux standards **PWA (Progressive Web App)** :

### Stratégies d'Intégration Réseau :
1. **App Shell Pré-mis en Cache** :
   * Grâce au plugin `vite-plugin-pwa` et Workbox, la totalité de l'application est enregistrée localement dans le stockage de cache du navigateur de l'administrateur.
   * L'application démarre et répond instantanément, même sans aucune connexion Internet active.
2. **Synchronisation Locale de Données (Bascule Intelligente)** :
   * Les données pédagogiques, CRUD et d'authentification sont automatiquement sérialisées dans le stockage local (`localStorage`).
   * En mode déconnecté, la couche d'accès aux données (notamment lors de pannes ou d'absences de connexions à l'instance Supabase distante) effectue une bascule silencieuse et transparente vers cette base de données locale synchronisée.
3. **Indicateur d'État de Connexion (`OfflineIndicator`)** :
   * Un badge animé s'affiche discrètement en bas à gauche de l'écran dès que l'administrateur passe hors-ligne : `"Mode Hors-ligne — Navigation dans les données chargées activée"`.
4. **Bouton d'Installation Natif (`PWAInstallButton`)** :
   * Intégration d'un bouton d'installation dynamique dans la barre d'outils de l'en-tête (`Header`).
   * **Pour Android/Windows/MacOS (Chromium)** : Lance l'invite native d'installation de l'application sur l'appareil.
   * **Pour iOS (Safari WebKit)** : Déploie automatiquement un panneau d'aide expliquant comment ajouter le portail sur l'écran d'accueil Safari en deux clics.
   * Le bouton de téléchargement se masque de manière automatique une fois l'application installée et lancée en mode autonome (`standalone`).

---

## 🛠️ 5. Installation, Lancement et Génération d'Actifs

### Dépendances Requises :
Les dépendances clés nécessaires au bon fonctionnement de l'application sont :
* `vite-plugin-pwa` (Plugin d'intégration PWA pour le bundling du Service Worker).
* `sharp` (Moteur de traitement d'images haute performance utilisé pour compiler les icônes).
* `motion/react` (Moteur d'animations fluide pour les changements de pages et formulaires).
* `lucide-react` (Bibliothèque complète d'icônes vectorielles uniformes).
* `recharts` / `d3` (Moteurs de rendu graphique réactifs).

### Lancement du Projet :
1. **Installer les dépendances** :
   ```bash
   npm install
   ```
2. **Générer le jeu d'icônes PWA de haute résolution** (depuis le modèle vectoriel source `public/icon.svg` vers des versions PNG adaptées aux exigences de Google Play, App Store et iOS Safari) :
   ```bash
   node generate-icons.js
   ```
3. **Lancer le serveur de développement local** :
   ```bash
   npm run dev
   ```
4. **Créer le build de production final** :
   ```bash
   npm run build
   ```
