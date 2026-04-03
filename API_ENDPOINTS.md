# 📡 API U-Recrut - Documentation des endpoints

## Base URL
```
http://localhost:3000
```

---

## 🔑 Authentication Endpoints

### Login
- **Route**: `POST /auth/login`
- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Redirection vers dashboard selon le rôle
- **Status**: 302 (Redirect) ou 200 (page de login avec erreur)

### Register
- **Route**: `POST /auth/register`
- **Body**:
  ```json
  {
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean@example.com",
    "password": "password123",
    "role": "candidat" // ou "recruteur"
  }
  ```
- **Response**: Redirection vers dashboard
- **Status**: 302 ou 200

### Logout
- **Route**: `GET /auth/logout`
- **Response**: Redirection vers `/`
- **Status**: 302

---

## 🏠 Home & Offres

### Page d'accueil (avec offres)
- **Route**: `GET /`
- **Auth**: Public
- **Response**: HTML page d'accueil
- **Status**: 200

### Liste toutes les offres
- **Route**: `GET /offres`
- **Auth**: Public
- **Query params**: Aucun (pour l'instant)
- **Response**: HTML liste offres
- **Status**: 200

### Détail d'une offre
- **Route**: `GET /offres/:id`
- **Auth**: Public
- **Params**: `id` = idOffre (entier)
- **Response**: HTML détail offre
- **Status**: 200 ou 404

### Page création offre (formulaire)
- **Route**: `GET /offres/create`
- **Auth**: Required (recruteur)
- **Response**: HTML formulaire
- **Status**: 200 ou 403

### Créer une offre
- **Route**: `POST /offres/create`
- **Auth**: Required (recruteur)
- **Body**:
  ```json
  {
    "intitule": "Développeur Full Stack",
    "typeMetier": "CDI",
    "lieuMission": "Paris",
    "rythme": "Temps plein",
    "fourchetteSalaire": "35k - 45k",
    "missionsActivites": "Description des missions...",
    "competencesAttendues": "Description compétences..."
  }
  ```
- **Response**: Redirection vers détail offre créée
- **Status**: 302

---

## 📝 Candidatures

### Postuler à une offre
- **Route**: `POST /candidatures/create/:idOffre`
- **Auth**: Required (candidat)
- **Params**: `idOffre` (entier)
- **Response**:
  ```json
  {
    "success": true,
    "id": 1,
    "message": "Candidature envoyée"
  }
  ```
- **Status**: 200 (success) ou 400/403 (error)

### Mes candidatures (candidat)
- **Route**: `GET /candidatures`
- **Auth**: Required (candidat)
- **Response**: HTML liste candidatures
- **Status**: 200 ou 403

### Candidatures reçues (recruteur)
- **Route**: `GET /candidatures/received`
- **Auth**: Required (recruteur)
- **Response**: HTML table candidatures reçues
- **Status**: 200 ou 403

### Mettre à jour état candidature
- **Route**: `PUT /candidatures/:id`
- **Auth**: Required (recruteur)
- **Params**: `id` = idCandidature
- **Body**:
  ```json
  {
    "etat": "entretien" // "en attente", "entretien", "acceptée", "rejetée"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Candidature mise à jour"
  }
  ```
- **Status**: 200

---

## 📊 Dashboards

### Dashboard Candidat
- **Route**: `GET /dashboard/candidat`
- **Auth**: Required (candidat)
- **Response**: HTML dashboard
- **Status**: 200 ou 403

### Dashboard Recruteur
- **Route**: `GET /dashboard/recruteur`
- **Auth**: Required (recruteur)
- **Response**: HTML dashboard
- **Status**: 200 ou 403

### Console Admin
- **Route**: `GET /dashboard/admin`
- **Auth**: Required (admin)
- **Response**: HTML console
- **Status**: 200 ou 403

---

## 🛡️ Admin Endpoints

### Liste utilisateurs
- **Route**: `GET /admin/users`
- **Auth**: Required (admin)
- **Response**: HTML table utilisateurs
- **Status**: 200

### Désactiver un utilisateur
- **Route**: `POST /admin/users/:id/deactivate`
- **Auth**: Required (admin)
- **Params**: `id` = idUtilisateur
- **Response**:
  ```json
  {
    "success": true,
    "message": "Compte désactivé"
  }
  ```
- **Status**: 200

### Supprimer un utilisateur
- **Route**: `POST /admin/users/:id/delete`
- **Auth**: Required (admin)
- **Params**: `id` = idUtilisateur
- **Response**:
  ```json
  {
    "success": true,
    "message": "Utilisateur supprimé"
  }
  ```
- **Status**: 200

### Liste organisations
- **Route**: `GET /admin/organisations`
- **Auth**: Required (admin)
- **Response**: HTML liste organisations
- **Status**: 200

### Liste recruteurs
- **Route**: `GET /admin/recruteurs`
- **Auth**: Required (admin)
- **Response**: HTML table recruteurs
- **Status**: 200

### Gestion offres
- **Route**: `GET /admin/offres`
- **Auth**: Required (admin)
- **Response**: HTML table offres
- **Status**: 200

### Supprimer une offre
- **Route**: `POST /admin/offres/:id/delete`
- **Auth**: Required (admin)
- **Params**: `id` = idOffre
- **Response**:
  ```json
  {
    "success": true,
    "message": "Offre supprimée"
  }
  ```
- **Status**: 200

---

## 🔄 Status codes

| Code | Signification |
|------|---------------|
| 200 | OK - Succès |
| 302 | Redirect - Redirection |
| 400 | Bad Request - Données invalides |
| 403 | Forbidden - Accès non authorisé |
| 404 | Not Found - Ressource non trouvée |
| 500 | Server Error - Erreur serveur |

---

## 🔐 Authentification

Tous les endpoints "Auth: Required" nécessitent :
- Une session valide (`req.session.user` existant)
- Le rôle approprié

Les sessions expirent après 7 jours d'inactivité.

---

## 📋 Exemple de workflow

```bash
# 1. Se connecter
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"candidat@test.com","password":"password123"}'

# 2. Voir les offres
curl http://localhost:3000/offres

# 3. Postuler à une offre
curl -X POST http://localhost:3000/candidatures/create/1 \
  -H "Cookie: connect.sid=value"

# 4. Voir mes candidatures
curl http://localhost:3000/candidatures \
  -H "Cookie: connect.sid=value"
```

---

## ⚠️ Erreurs courantes

### 403 - Forbidden
- Vous n'êtes pas connecté
- Votre rôle n'a pas accès à cette ressource

### 404 - Not Found
- L'offre/candidature n'existe pas
- Les IDs ne sont pas corrects

### 400 - Bad Request
- Données manquantes
- Format JSON invalide
- Email déjà utilisé (register)

---

**API Version**: 1.0  
**Last Updated**: 2026-04-03
