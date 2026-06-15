# SIGSE — Interface d'administration web

Interface bureau du **Système Intégré de Gestion du Suivi-Évaluation** (SIGSE).
Elle se connecte au même backend Supabase que l'application mobile de collecte.

Stack : **React + Vite + TypeScript**, `@supabase/supabase-js`, React Router,
Recharts, xlsx (SheetJS). CSS sobre, interface en français.

## Prérequis backend

Le schéma PostgreSQL (tables `profiles`, `submissions`, `quality_flags`,
`indicators`…) doit être en place dans Supabase. En complément, l'app web
utilise une **vue** non incluse dans le schéma initial :

```bash
# Supabase > SQL Editor > exécuter :
supabase/v_soumissions_qualite.sql
```

## Configuration

```bash
cp .env.example .env
# puis renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
```

Les valeurs se trouvent dans **Supabase > Project Settings > API**.

## Démarrage

```bash
npm install
npm run dev      # serveur de développement (http://localhost:5173)
npm run build    # build de production (vérifie aussi les types)
npm run preview  # prévisualisation du build
```

## Accès & rôles

La connexion se fait par e-mail / mot de passe (Supabase Auth). Après connexion,
le rôle est lu dans la table `profiles` :

- **superviseur / analyste / admin** → accès complet ;
- **enqueteur** → message « Accès réservé aux superviseurs ».

## Sections

1. **File de validation** — liste de `v_soumissions_qualite` triée par anomalies
   décroissantes ; panneau de détail (réponses + anomalies) ; actions
   Valider / Rejeter (le rejet exige un commentaire).
2. **Dashboard** — cartes de synthèse + 5 graphiques (sexe, âge, abri, site,
   évolution par jour). Les graphiques excluent les soumissions rejetées.
3. **Indicateurs** — calcul automatique (`comptage_soumissions`, `somme_champ`)
   avec barre de progression et taux de réalisation.
4. **Export** — génération d'un fichier Excel (une colonne par question).

## Structure

```
src/
  auth/         Contexte d'authentification, garde de rôle
  components/   Composants transverses (Layout, badges, Drawer…)
  hooks/        Hooks réutilisables
  lib/          Client Supabase, helpers de formatage
  pages/        Une sous-dossier par section
  types/        Types du schéma backend
```
