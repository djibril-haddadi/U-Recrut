# 🎯 U-Recrut - Application de Recrutement

Application web complète utilisant **Express.js**, **EJS**, et **MySQL** pour gérer un site de recrutement avec trois rôles : **Candidat**, **Recruteur**, et **Admin**.

---

## 📋 Structure du Projet

```
myapp/
├── bin/
│   └── www                    # Point d'entrée
├── model/                     # Couche Modèle (CRUD)
│   ├── db.js                  # Connexion MySQL
│   ├── utilisateur.js         # Model utilisateurs
│   ├── candidat.js
│   ├── recruteur.js
│   ├── administrateur.js
│   ├── organisation.js
│   ├── offre_emploi.js
│   ├── fiche_poste.js
│   ├── candidature.js
│   ├── document_candidature.js
│   ├── demande_recruteur.js
│   └── demande_organisation.js
├── routes/                    # Contrôleurs (Logique métier)
│   ├── index.js              # Accueil + liste offres
│   ├── auth.js               # Login, Register
│   ├── offre.js              # Offres CRUD
│   ├── candidature.js        # Candidatures
│   ├── dashboard.js          # Tableaux de bord
│   └── admin.js              # Modération
├── views/                     # Vues EJS
│   ├── layout.ejs            # Template principal
│   ├── home.ejs              # Page d'accueil
│   ├── error.ejs             # Gestion erreurs
│   ├── partials/
│   │   └── navbar.ejs        # Navigation globale
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── offres/
│   │   ├── list.ejs          # Liste offres
│   │   ├── detail.ejs        # Détail offre
│   │   └── create.ejs        # Créer offre
│   ├── candidatures/
│   │   ├── list.ejs          # Mes candidatures
│   │   └── received.ejs      # Candidatures reçues
│   ├── dashboard/
│   │   ├── candidat.ejs
│   │   ├── recruteur.ejs
│   │   └── admin.ejs
│   └── admin/
│       ├── users.ejs         # Gestion utilisateurs
│       ├── organisations.ejs
│       ├── recruteurs.ejs
│       └── offres.ejs
├── public/
│   ├── stylesheets/
│   └── images/
├── app.js                     # Configuration Express
├── package.json
└── README.md
```

---

## 🚀 Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer la base de données
- Éditer `model/db.js` avec vos identifiants MySQL
- Exécuter le script SQL : `ai16p032.sql`

### 3. Démarrer l'application
```bash
npm start
```

L'application est accessible sur : **http://localhost:3000**

---

## 📊 Modèle de données

### Tables principales utilisées :

| Table | Description |
|-------|-------------|
| `utilisateur` | Tous les utilisateurs (candidats, recruteurs, admins) |
| `candidat` | Candidats à l'emploi |
| `recruteur` | Recruteurs d'une organisation |
| `administrateur` | Administrateurs du site |
| `organisation` | Entreprises partenaires |
| `offre_emploi` | Offres publiées |
| `fiche_poste` | Détails des postes |
| `candidature` | Candidatures des candidats |
| `document_candidature` | Documents joints aux candidatures |
| `demande_recruteur` | Demandes de création de compte recruteur |
| `demande_organisation` | Demandes d'ajout d'organisation |

---

## 🔐 Authentification & Rôles

### Système de Sessions
- Sessions Express (7 jours de validité)
- Cookie-based authentication
- Middleware de vérification par rôle

### Trois rôles disponibles :

#### 👤 **CANDIDAT**
- Consulter les offres
- Postuler à une offre
- Voir l'état de ses candidatures
- Accéder à son tableau de bord personnel

Routes :
- `GET /` - Accueil
- `GET /offres` - Liste offres
- `GET /offres/:id` - Détail offre
- `POST /candidatures/create/:idOffre` - Postuler
- `GET /candidatures` - Mes candidatures
- `GET /dashboard/candidat` - Dashboard

#### 🏢 **RECRUTEUR**
- Publier des offres d'emploi
- Voir les candidatures reçues
- Mettre à jour le statut des candidatures
- Accéder à son tableau de bord

Routes :
- `GET /offres/create` - Formulaire création offre
- `POST /offres/create` - Créer offre
- `GET /candidatures/received` - Candidatures reçues
- `PUT /candidatures/:id` - Mettre à jour état candidature
- `GET /dashboard/recruteur` - Dashboard

#### ⚙️ **ADMIN**
- Gérer les utilisateurs
- Modérer les offres
- Voir les organisations
- Valider les recruteurs
- Accéder à la console d'administration

Routes :
- `GET /admin/users` - Gestion utilisateurs
- `GET /admin/organisations` - Organisations
- `GET /admin/recruteurs` - Recruteurs
- `GET /admin/offres` - Offres
- `POST /admin/users/:id/deactivate` - Désactiver compte
- `POST /admin/offres/:id/delete` - Supprimer offre
- `GET /dashboard/admin` - Console admin

---

## 🔗 Routes principales

### Authentication
```
GET  /auth/login              # Formulaire login
POST /auth/login              # Soumettre login
GET  /auth/register           # Formulaire inscription
POST /auth/register           # Créer compte
GET  /auth/logout             # Déconnexion
```

### Offres d'emploi
```
GET  /offres                  # Liste toutes les offres
GET  /offres/:id              # Détail d'une offre
GET  /offres/create           # Formulaire création (recruteur)
POST /offres/create           # Créer offre (recruteur)
```

### Candidatures
```
POST /candidatures/create/:id # Postuler (candidat)
GET  /candidatures            # Mes candidatures (candidat)
GET  /candidatures/received   # Candidatures reçues (recruteur)
PUT  /candidatures/:id        # Mettre à jour état (recruteur)
```

### Dashboards
```
GET /dashboard/candidat       # Dashboard candidat
GET /dashboard/recruteur      # Dashboard recruteur
GET /dashboard/admin          # Console admin
```

### Admin (protégés)
```
GET  /admin/users             # Liste utilisateurs
GET  /admin/organisations     # Liste organisations
GET  /admin/recruteurs        # Liste recruteurs
GET  /admin/offres            # Liste offres
POST /admin/users/:id/deactivate
POST /admin/offres/:id/delete
```

---

## 🎨 Design & Interface

- **Framework CSS** : Tailwind CSS
- **Typographie** : Outfit (sans-serif), Lora (serif)
- **Palette de couleurs** :
  - Jaune primaire : `#FFCD00`
  - Gris foncé : `#2C2C2C`
  - Gris clair : `#F8F9FA`
- **Animations** : Transitions fluides (0.18s)

### Composants key
- Navigation persistante
- Sidebar pour les dashboards
- Cartes responsives
- Tables de gestion
- Formulaires avec validation

---

## 🔄 Workflows métier

### Workflow Candidat
1. Inscription comme candidat
2. Connexion
3. Navigation vers les offres
4. Consultation détail d'une offre
5. Postulation
6. Suivi des candidatures dans le dashboard

### Workflow Recruteur
1. Inscription comme recruteur
2. Connexion
3. Création d'offres (avec fiche poste)
4. Consultation des candidatures reçues
5. Mise à jour du statut des candidatures

### Workflow Admin
1. Connexion en tant qu'admin
2. Accès à la console
3. Gestion des utilisateurs
4. Modération des offres
5. Gestion des organisations

---

## 💻 Technologies utilisées

- **Backend** : Node.js + Express.js
- **Frontend** : EJS, HTML, CSS, JavaScript
- **Base de données** : MySQL
- **Authentication** : express-session
- **Gestion des cookies** : cookie-parser
- **Logging** : Morgan

---

## 📝 Notes d'implémentation

### Async/Await
Tous les modèles utilisent des Promises et fonctions async/await pour les opérations asynchrones.

```javascript
const user = await utilisateur.read(id);
const offres = await offreEmploi.readAll();
```

### Jointures intelligentes
Les routes effectuent des jointures en JavaScript pour combiner les données de plusieurs tables :

```javascript
const offresAvecDetails = await Promise.all(
  offres.map(async (offre) => {
    const fiche = await fichePoste.read(offre.idFichePoste);
    const recruteur = await recruteur.read(offre.idRecruteur);
    return { ...offre, fiche, recruteur };
  })
);
```

### Middleware personnalisé
Protection des routes selon le rôle :

```javascript
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};
```

---

## 🚨 Erreurs gérées

- Utilisateur non trouve
- Email déjà utilisé
- Authentification requise
- Accès non autorisé (403)
- Route non trouvée (404)

---

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux écrans mobiles, tablettes et ordinateurs de bureau.

---

## 🔐 Sécurité

- Validation côté serveur des formulaires
- Protection contre les injections SQL via les Prepared Statements
- Sessions sécurisées (cookie httpOnly)
- Middleware d'authentification

---

## 📄 Données de test

Base de données incluse avec exemples :
- Utilisateurs : Ali, Nadia, Admin
- Identifiants : voir `ai16p032.sql`

Vous pouvez vous inscrire pour créer des comptes supplémentaires.

---

## 👥 Support & Contribution

Pour toute question ou problème, veuillez contacter l'administrateur du système ou consulter la documentation du code.

---

**Version** : 1.0  
**Dernière mise à jour** : 2026-04-03  
**Licence** : UTC
