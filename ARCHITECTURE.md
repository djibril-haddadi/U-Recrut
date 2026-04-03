# 🏗️ Architecture MVC - U-Recrut

## Overview

U-Recrut suit le pattern **Model-View-Controller (MVC)** avec une séparation claire des responsabilités :

```
Request → Router (Routes/) → Model (Model/) → View (Views/)
  ↓                                             ↑
  └─────────────────────────────────────────────┘
```

---

## 📦 Couches

### 1️⃣ Model Layer (`model/`)

**Responsabilité** : Accès et manipulation des données BD

#### Structure générique
```javascript
// model/[table].js
const query = (sql, params) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) return reject(err);
    resolve(results);
  });
});

module.exports = {
  read: async (id) => { /* SELECT */ },
  readAll: async () => { /* SELECT ALL */ },
  create: async (data) => { /* INSERT */ },
  update: async (id, data) => { /* UPDATE */ },
  delete: async (id) => { /* DELETE */ }
};
```

#### Models disponibles
- `utilisateur` - Tous les users
- `candidat` - Candidats seulement
- `recruteur` - Recruteurs uniquement
- `administrateur` - Admins
- `organisation` - Entreprises
- `offre_emploi` - Offres publiées
- `fiche_poste` - Détails des postes
- `candidature` - Candidatures des candidats
- `document_candidature` - Files uploaded
- `demande_recruteur` - Requests to become recruiter
- `demande_organisation` - Requests to add org

#### Patterns CRUD
```javascript
// CREATE
const newUser = await utilisateur.create({
  nom: "Dupont",
  prenom: "Jean",
  email: "jean@example.com",
  motDePasseHash: "hashed_pwd"
});
// Returns: { insertId, ...data }

// READ
const user = await utilisateur.read(id);
// Returns: User object or null

// UPDATE
const affected = await utilisateur.update(id, {
  nom: "Nouveau nom"
});
// Returns: affectedRows count

// DELETE
const deleted = await utilisateur.delete(id);
// Returns: affectedRows count
```

---

### 2️⃣ Controller Layer (`routes/`)

**Responsabilité** : Logique métier, validation, orchestration

#### Key concepts

1. **Req/Res Handling**
```javascript
router.get('/offres/:id', async (req, res, next) => {
  try {
    const offre = await offreEmploi.read(req.params.id);
    if (!offre) {
      return res.status(404).render('error', { 
        message: 'Offre non trouvée' 
      });
    }
    res.render('offres/detail', { offre });
  } catch (err) {
    next(err); // Passe au middleware d'erreur
  }
});
```

2. **Middleware de sécurité**
```javascript
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

const requireRole = (role) => (req, res, next) => {
  if (req.session.user.role !== role) {
    return res.status(403).render('error', { 
      message: 'Accès réservé au rôle: ' + role 
    });
  }
  next();
};
```

3. **Jointures en JavaScript**
```javascript
// Les jointures se font en JS car les models ne font que SELECT
const offresAvecDetails = await Promise.all(
  offres.map(async (offre) => {
    const fiche = await fichePoste.read(offre.idFichePoste);
    const recruteur = await recruteur.read(offre.idRecruteur);
    const organisation = await organisation.read(recruteur.sirenOrganisation);
    return {
      ...offre,
      fiche,
      recruteur,
      organisation
    };
  })
);
```

4. **Session Management**
```javascript
// Setter (dans le login/register)
req.session.user = {
  id: user.idUtilisateur,
  nom: user.nom,
  prenom: user.prenom,
  email: user.email,
  role: role // "candidat", "recruteur", ou "admin"
};

// Getter (dans les vues)
<% if (user && user.role === 'candidat') { %>
  <!-- Afficher UI candidat -->
<% } %>
```

#### Routes actuelles

**auth.js**
```
GET  /auth/login              → Afficher formulaire
POST /auth/login              → Traiter connexion
GET  /auth/register           → Afficher inscription
POST /auth/register           → Créer compte
GET  /auth/logout             → Déconnecter
```

**index.js**
```
GET  /                        → Accueil + offres récentes
```

**offre.js**
```
GET  /offres                  → Liste toutes les offres
GET  /offres/:id              → Détail d'une offre
GET  /offres/create           → Formulaire création
POST /offres/create           → Créer offre
```

**candidature.js**
```
POST /candidatures/create/:id → Postuler
GET  /candidatures            → Mes candidatures
GET  /candidatures/received   → Candidatures reçues
PUT  /candidatures/:id        → Mettre à jour état
```

**dashboard.js**
```
GET  /dashboard/candidat      → Dashboard candidat
GET  /dashboard/recruteur     → Dashboard recruteur
GET  /dashboard/admin         → Console admin
```

**admin.js**
```
GET  /admin/users             → Gestion utilisateurs
GET  /admin/organisations     → Gestion orgs
GET  /admin/recruteurs        → Gestion recruteurs
GET  /admin/offres            → Gestion offres
POST /admin/users/:id/...     → Actions admin
```

---

### 3️⃣ View Layer (`views/`)

**Responsabilité** : Rendu HTML et présentation

#### Hiérarchie des templates

```
layout.ejs (wrapper principal)
├── partials/navbar.ejs (navigation)
├── home.ejs (page d'accueil)
├── error.ejs (gestion erreurs)
├── auth/
│   ├── login.ejs
│   └── register.ejs
├── offres/
│   ├── list.ejs
│   ├── detail.ejs
│   └── create.ejs
├── candidatures/
│   ├── list.ejs
│   └── received.ejs
├── dashboard/
│   ├── candidat.ejs
│   ├── recruteur.ejs
│   └── admin.ejs
└── admin/
    ├── users.ejs
    ├── organisations.ejs
    ├── recruteurs.ejs
    └── offres.ejs
```

#### Patterns EJS

1. **Inclusion de partials**
```ejs
<%- include('../layout') %>
<%- include('partials/navbar') %>
```

2. **Condition et boucles**
```ejs
<% if (user && user.role === 'candidat') %>
  <a href="/candidatures">Mes candidatures</a>
<% } %>

<% offres.forEach(offre => { %>
  <div><%= offre.fiche?.intitule %></div>
<% }); %>
```

3. **Affichage de données**
```ejs
<%= user.prenom %>           <!-- Échappé HTML -->
<%- offre.description %>      <!-- HTML brut -->
<%= new Date(date).toLocaleDateString('fr-FR') %>
```

4. **Formulaires POST/PUT**
```ejs
<form method="POST" action="/candidatures/create/<%= offre.id %>">
  <input type="text" name="field" required>
  <button type="submit">Envoyer</button>
</form>
```

---

## 🔄 Flux de données

### Exemple : Un candidat postule

```
1. User sees offre on /offres/:id
   └─ Route GET /offres/:id appelée
      └─ Controller charge offre + fiche + organisation
         └─ Model.read(offreEmploi, id)
         └─ Model.read(fichePoste, ...)
         └─ Model.read(organisation, ...)
      └─ render('offres/detail', { offre })

2. User clicks "Postuler" button
   └─ POST /candidatures/create/123
      └─ Controller vérifie role === 'candidat'
         └─ Controller crée candidature
            └─ Model.create(candidature, data)
         └─ res.json({ success: true })

3. JS Client reloads page
   └─ User sees "Candidature envoyée ✅"
```

---

## 🔐 Sécurité par couche

### Model Layer
- Prepared statements (via mysql module)
- Pas de logique métier
- Données brutes seulement

### Controller Layer
- Validation des inputs
- Vérification des permissions (role-based)
- Sessions gérées ici
- Gestion des erreurs (try/catch)

### View Layer
- Échappement HTML par défaut (<%= ... %>)
- HTML brut seulement si nécessaire (<%- ... %>)
- Affichage conditionnel selon rôle

---

## 🎯 Patterns utilisés

### 1. Async/Await
```javascript
const result = await model.read(id);
```

### 2. Error Handling
```javascript
try {
  const data = await model.get(id);
  res.render('view', { data });
} catch (err) {
  next(err); // Passe au middleware d'erreur Express
}
```

### 3. Role-Based Access Control (RBAC)
```javascript
const requireRole = (role) => (req, res, next) => {
  if (req.session.user?.role !== role) {
    return res.status(403).send('Forbidden');
  }
  next();
};

router.post('/create', requireRole('candidat'), async (req, res) => {
  // Code protégé
});
```

### 4. REST-like API
```javascript
GET    /offres        // List
GET    /offres/:id    // Read
POST   /offres        // Create
PUT    /offres/:id    // Update
DELETE /offres/:id    // Delete
```

### 5. Promise-based CRUD
```javascript
const model = {
  read: async (id) => { /* ... */ },
  readAll: async () => { /* ... */ },
  create: async (data) => { /* ... */ },
  update: async (id, data) => { /* ... */ },
  delete: async (id) => { /* ... */ }
};
```

---

## 📊 Modèle de données

```
utilisateur (base)
├── candidat (extend utilisateur)
├── recruteur (extend)
│   └── organisation
│       └── fiche_poste
│           └── offre_emploi
│               └── candidature
│                   ├── document_candidature
│                   └── utilisateur (candidat)
├── administrateur (extend)
├── demande_recruteur
└── demande_organisation
```

---

## 🚀 Performance

### Optimisations
- Sessions côté serveur (express-session)
- Requêtes BD minimales (pas de N+1)
- Promise.all() pour paralléliser

### Considérations futures
- Caching (Redis)
- Pagination (limit/offset)
- Indexation BD
- Connection pooling

---

## 📝 Conventions

- **Noms de variables** : camelCase
- **Noms de fichiers** : lowercase avec underscores (model/user_role.js)
- **Noms de fichiers EJS** : kebab-case (offres/list.ejs)
- **Routes** : kebab-case et RESTful

---

**Architecture Design**: MVC + Layered Architecture  
**Data Flow**: Request → Route → Controller → Model → View  
**Security**: Role-based + Session-based  
**Performance**: Async/Promise-based  

Version 1.0 | 2026-04-03
