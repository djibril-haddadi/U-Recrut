# Guide de démarrage rapide - U-Recrut

## ⚡ Démarrer l'application

```bash
cd myapp
npm start
```

Accédez à : **http://localhost:3000**

---

## 🔑 Comptes de test

### Admin
- Email: `admin@test.com`
- Mot de passe: `admin123`

### Candidat
- Email: `jean.dupont@test.com`
- Mot de passe: `motdepasse123`

### Recruteur
- Email: `thomas.laurent@techcorp.com`
- Mot de passe: `recruiter1`

Ou créez un compte en vous inscrivant via le formulaire.

Via phpmyadmin : https://tuxa.sme.utc.fr/phpmyadmin 

---

## 📱 Navigation principale

### Pour un candidat
1. **Accueil** - Voir les offres disponibles
2. **Offres** - Parcourir toutes les offres
3. **Mes candidatures** - Suivre ses postulations
4. **Dashboard** - Statistiques personnelles

### Pour un recruteur
1. **Créer une offre** - Publier une nouvelle offre
2. **Candidatures reçues** - Gérer les candidatures
3. **Dashboard** - Vue d'ensemble des offres

### Pour un admin
1. **Console Admin** - Statistiques globales
2. **Utilisateurs** - Gérer les comptes
3. **Organisations** - Voir les entreprises
4. **Offres** - Modérer les offres

---

## 🗺️ Flux principal

### Candidat postule
```
Accueil → Voir offres → Cliquer "Postuler" → Confirmation
↓
Mes candidatures → Suivre l'état
↓
Recevoir réponse (acceptée/rejetée/entretien)
```

### Recruteur recrute
```
Créer une offre → Offre publiée
↓
Recevoir candidatures
↓
Consulter candidatures reçues → Mettre à jour l'état
```

---

## 🛠️ Personnalisation

### Changer la connexion BD
Fichier : `model/db.js`
```javascript
var pool = mysql.createPool({
  host: "votre_host",
  user: "votre_user",
  password: "votre_password",
  database: "votre_bd"
});
```

### Modifier le port
Fichier : `bin/www`
```javascript
var port = process.env.PORT || 3000;
```

### Ajouter des routes
Créer un fichier dans `routes/` et l'importer dans `app.js`

---

## 📊 Architecture MVC

- **Models** (`model/`) : Accès BD
- **Views** (`views/`) : Affichage EJS
- **Controllers** (`routes/`) : Logique métier

```
Route → Controller → Model → View
```

---

## 🔒 Authentification

Les sessions durent **7 jours** après la dernière activité.

Le rôle est déterminé automatiquement lors de la connexion en vérifiant :
- Table `candidat` → Rôle "candidat"
- Table `recruteur` → Rôle "recruteur"
- Table `administrateur` → Rôle "admin"

---

## 🚀 Déploiement

### Préparation 
1. Vérifier les variables d'environnement
2. Optimiser les bases de données
3. Configurer HTTPS

### Serveur
- Node.js 14+ obligatoire
- MySQL 5.7+
- Port 3000 (ou configuré)

### Avec PM2 (production)
```bash
npm install -g pm2
pm2 start bin/www --name "u-recrut"
pm2 save
pm2 startup
```

---

## 📞 Support

En cas de problème :
1. Vérifier la connexion BD
2. Consulter les logs serveur
3. Vérifier les permissions base de données
4. Réinitialiser les sessions

---

**Bonne utilisation ! 🎉**
