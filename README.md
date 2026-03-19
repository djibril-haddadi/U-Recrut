# 🎯 U-Recrut — *Votre Talent, Notre Connection*

> Projet académique réalisé dans le cadre du cours **GI02 / AI16** — UTC  
> Livrable TD1

---

## 📋 Table des matières

1. [Présentation du projet](#présentation-du-projet)
2. [Structure du dépôt](#structure-du-dépôt)
3. [Livrables](#livrables)
   - [Cas d'utilisation](#1-cas-dutilisation)
   - [Conception — MCD & MLD](#2-conception--mcd--mld)
   - [Sitemap & Prototype IHM](#3-sitemap--prototype-ihm)
4. [Identité visuelle](#identité-visuelle)
5. [Équipe](#équipe)

---

## Présentation du projet

**U-Recrut** est une application web de recrutement conçue pour mettre en relation candidats et recruteurs au sein d'organisations validées. Elle s'articule autour de trois rôles principaux :

| Rôle | Description |
|------|-------------|
| 👤 **Candidat** | Consulte et postule aux offres d'emploi, suit l'état de ses candidatures |
| 🏢 **Recruteur** | Publie et gère des offres, examine les candidatures reçues |
| ⚙️ **Administrateur** | Valide les organisations et les accès recruteurs, modère la plateforme |

---

## Structure du dépôt

```
td1-cdc/
│
├── Maquette/
│   ├── asset/
│   │   └── image.png              # Logo U-Recrut (versions claire & sombre)
│   └── u-recrut.html              # Prototype IHM interactif (HTML / Tailwind CSS)
│
├── TD1/
│   ├── MCD&MCD/
│   │   ├── Shema/
│   │   │   ├── MCD.png            # Diagramme MCD (export image)
│   │   │   └── MLD.png            # Diagramme MLD (export image)
│   │   ├── Code MCD.puml          # Source PlantUML du MCD
│   │   └── code MLD.puml          # Source PlantUML du MLD
│   │
│   └── Use Case/
│       ├── Shema/
│       │   ├── Cas d'utilisation - Administration.png
│       │   ├── Cas d'utilisation - Candidat.png
│       │   ├── Cas d'utilisation - Recruteur.png
│       │   └── Vue d'ensemble.png
│       ├── Diagramme Général.puml
│       ├── Vue Admin.puml
│       ├── Vue Candidat.puml
│       └── Vue Recruteur.puml
│
├── SiteMap.png                    # Carte de navigation du site web
├── Tableau_fonctionnalites_AI16.pdf
├── TD 1 SR10.pdf                  # Énoncé du TD
├── Doc_aide_sr10_docx.pdf         # Documentation d'aide
├── README.md
└── .gitignore
```

---

## Livrables

### 1. Cas d'utilisation

Les diagrammes de cas d'utilisation ont été modélisés avec **PlantUML** et décrivent les interactions entre les acteurs et le système pour chaque rôle.

#### Acteurs identifiés

- **Visiteur** — accède à l'accueil public et aux offres sans se connecter
- **Candidat** — crée un compte, postule et suit ses candidatures
- **Recruteur** — publie des offres et gère les candidatures reçues
- **Administrateur** — valide les organisations et supervise la plateforme

#### Diagrammes disponibles

| Fichier | Description |
|---------|-------------|
| `Diagramme Général.puml` | Vue d'ensemble de tous les acteurs |
| `Vue Candidat.puml` | Cas d'utilisation spécifiques au candidat |
| `Vue Recruteur.puml` | Cas d'utilisation spécifiques au recruteur |
| `Vue Admin.puml` | Cas d'utilisation spécifiques à l'administrateur |

> 📁 Les exports PNG se trouvent dans `TD1/Use Case/Shema/`

---

### 2. Conception — MCD & MLD

La conception de la base de données a suivi le processus suivant :

```
Analyse du cahier des charges
        ↓
Diagramme de classes (orienté objet)
        ↓
MCD — Modèle Conceptuel de Données
        ↓
MLD — Modèle Logique de Données (schéma relationnel)
```

Les sources PlantUML (`Code MCD.puml`, `code MLD.puml`) permettent de régénérer les diagrammes à tout moment.

> 📁 Les exports PNG se trouvent dans `TD1/MCD&MCD/Shema/`

---

### 3. Sitemap & Prototype IHM

#### Sitemap

Le fichier `SiteMap.png` (racine du dépôt) présente la structure de navigation complète du site et les liens entre les différentes pages selon le rôle de l'utilisateur connecté.

#### Prototype IHM — `u-recrut.html`

Le prototype est une **Single Page Application** interactive développée avec **HTML + Tailwind CSS + JavaScript vanilla**. Il simule l'intégralité du flux de navigation pour la présentation.

**Vues incluses :**

| Vue | Contenu |
|-----|---------|
| 🏠 Accueil public | Barre de recherche héro, filtres latéraux, grille de cartes d'offres |
| 🔐 Connexion / Inscription | Formulaire avec onglets, connexion OAuth simulée |
| 👤 Dashboard Candidat | KPIs, tableau des candidatures avec badges de statut, offres recommandées |
| 🏢 Dashboard Recruteur | Statistiques de vues, gestion des offres (Modifier / Prolonger / Supprimer), liste des candidats |
| ⚙️ Dashboard Admin | Validation des organisations, accès recruteurs, modération des signalements |

**Pour ouvrir le prototype :**
```bash
# Ouvrir directement dans un navigateur
open Maquette/u-recrut.html

# Ou via un serveur local
cd Maquette && python3 -m http.server 8080
# Puis naviguer sur http://localhost:8080/u-recrut.html
```

---

## Identité visuelle

| Élément | Valeur |
|---------|--------|
| **Couleur principale** | Jaune Or `#FFCD00` |
| **Couleur de structure** | Gris Anthracite `#4D4D4D` |
| **Fond de page** | Gris très clair `#F8F9FA` |
| **Typographie** | Outfit (Sans-Serif moderne) |
| **Coins arrondis** | 12px |
| **Slogan** | *Votre Talent, Notre Connection* |

> Le logo est disponible en version claire et sombre dans `Maquette/asset/image.png`

---
## Base de donner 

https://tuxa.sme.utc.fr/phpmyadmin/ 

login dans le .env donner par mail par le prof
---

## Équipe

Projet réalisé par le **Hérald NKOUNKOU et Djibril Haddadi** dans le cadre du cours GI02 — Université de Technologie de Compiègne (UTC).

---

*Dernière mise à jour : mars 2026*