# TD Sécurité Web - U-Recrut - RÉSUMÉ FINAL

## 📋 Fichiers Créés/Modifiés

### 📄 Documentation
1. **RAPPORT_SECURITE.md** - Rapport complet d'analyse (ce fichier)
2. **EXPLOITATIONS.md** - Guide détaillé des exploitations avant/après
3. **RESUME_FINAL.md** - Ce fichier

### 🔧 Code Modifié - Corrections Implémentées

#### 1️⃣ routes/auth.js (Correction des mots de passe)
- ✅ Ajout de `bcrypt` pour le hachage
- ✅ Ajout de `express-rate-limit` pour protection force brute
- ✅ Middleware `loginLimiter` (max 5 tentatives/15min)
- ✅ Utilisation de `bcrypt.hash()` à la création (ligne 130)
- ✅ Utilisation de `bcrypt.compare()` au login (ligne 21)

#### 2️⃣ routes/candidature.js (Correction upload + contrôle d'accès)
- ✅ Whitelist de types MIME (PDF, DOC, DOCX)
- ✅ Limite de taille (5MB max)
- ✅ Vérification d'extension
- ✅ Ajout vérification propriétaire dans PUT (Correction 3)

#### 3️⃣ package.json
- ✅ Ajout `bcrypt: ^6.0.0`
- ✅ Ajout `express-rate-limit: ^8.5.2`
- ✅ Ajout `jest` et `supertest` (devDependencies)
- ✅ Ajout script `test: jest`

### 🧪 Tests Automatisés Créés

#### tests/access-control.test.js (Test a - OBLIGATOIRE)
- ✅ Test d'authentification requise
- ✅ Test accès non autorisé admin
- ✅ Test isolement des dashboards par rôle
- ✅ Test propriété des candidatures

#### tests/brute-force.test.js (Test b)
- ✅ Test rate limiting après 5 tentatives
- ✅ Test message d'erreur approprié
- ✅ Test réinitialisation après succès
- ✅ Test isolation par IP

#### tests/sql-injection.test.js (Test c)
- ✅ Test injection SQL classique (OR 1=1)
- ✅ Test injection UNION SELECT
- ✅ Test injection DROP TABLE
- ✅ Test échappement automatique mysql

---

## 🛡️ Vulnérabilités Choisies et Corrigées

### Vulnérabilité 1: Mots de passe non hachés
**Sévérité:** 🔴 CRITIQUE

**Problème avant:**
```javascript
// Comparaison directe en clair
const user = users.find(u => u.email === email && u.motDePasseHash === password);

// Stockage sans hachage
motDePasseHash: password
```

**Solution implémentée:**
```javascript
// Hachage sécurisé
const hashedPassword = await bcrypt.hash(password, 10);
motDePasseHash: hashedPassword

// Comparaison sécurisée
if (user && await bcrypt.compare(password, user.motDePasseHash))
```

### Vulnérabilité 2: Upload non sécurisé
**Sévérité:** 🔴 CRITIQUE

**Problème avant:**
```javascript
// Aucune validation!
const upload = multer({ storage }); // ❌
```

**Solution implémentée:**
```javascript
const ALLOWED_TYPES = ['application/pdf', 'application/msword', ...];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    // Vérification MIME + extension
    if (!ALLOWED_TYPES.includes(file.mimetype)) return cb(new Error(...));
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.pdf', '.doc', '.docx'].includes(ext)) return cb(new Error(...));
    cb(null, true);
  }
});
```

### Vulnérabilité 3: Contrôle d'accès insuffisant
**Sévérité:** 🟠 HAUTE

**Problème avant:**
```javascript
// Pas de vérification du propriétaire!
router.put('/:id', requireAuth, async (req, res, next) => {
  // ...
  await candidature.update(req.params.id, { etatCandidature: etat });
});
```

**Solution implémentée:**
```javascript
router.put('/:id', requireAuth, async (req, res, next) => {
  // Vérification propriétaire
  const candidatureToUpdate = await candidature.read(req.params.id);
  const offre = await offreEmploi.read(candidatureToUpdate.idOffre);
  
  if (offre.idRecruteur !== req.session.user.id) {
    return res.status(403).json({ error: 'Vous n\'avez pas le droit...' });
  }
  // OK pour modifier
});
```

---

## 📊 Vérification de la Sécurité

### Avant les Corrections (Vulnérable ❌)
```
Mots de passe:    stockés en clair dans la BD
Upload fichiers:  aucune validation, RCE possible
Accès candidat:   peut être manipulée par n'importe quel recruteur
Rate limiting:    aucun, brute force possible
```

### Après les Corrections (Sécurisé ✅)
```
Mots de passe:    hachés bcrypt (coût 10), non-retrouvables
Upload fichiers:  whitelist MIME/ext, limite 5MB, RCE impossible
Accès candidat:   vérifiée au niveau propriétaire, isolée par recruteur
Rate limiting:    5 tentatives/15min par IP
```

---

## 🚀 Instructions d'Exécution

### 1. Installation
```bash
cd /Users/herald/Desktop/COURS-UTC/GI02/AI16/td-cdc/myapp
npm install
```

### 2. Démarrer l'application
```bash
npm start
# L'app est disponible sur http://localhost:3000
```

### 3. Exécuter les tests
```bash
npm test
# Exécute: jest (tous les tests dans /tests)
```

### 4. Tester les exploitations (manuel)
Voir **EXPLOITATIONS.md** pour les commandes curl de démonstration

---

## ✅ Checklist Complétude TD

- ✅ Question 1: **3 vulnérabilités choisies**
  - ✅ Mots de passe non hachés
  - ✅ Upload non sécurisé
  - ✅ Contrôle d'accès insuffisant

- ✅ Question 2: **Exploitations démontrées**
  - ✅ Accès aux mots de passe en clair
  - ✅ Upload de fichier malveillant (RCE)
  - ✅ Modification de candidatures non autorisée

- ✅ Question 3: **Solutions implémentées**
  - ✅ Hachage bcrypt des mots de passe
  - ✅ Validation stricte des uploads
  - ✅ Vérification du propriétaire de candidature

- ✅ Question 4 (SR10): **Tests automatisés**
  - ✅ (a) Tests sessions et droits d'accès (OBLIGATOIRE)
  - ✅ (b) Tests simulation attaque force brute
  - ✅ (c) Tests résistance injection SQL

---

## 📚 Ressources Utilisées

- 📖 OWASP Top 10
- 🔗 bcrypt: https://www.npmjs.com/package/bcrypt
- 🔗 express-rate-limit: https://www.npmjs.com/package/express-rate-limit
- 🔗 multer: https://github.com/expressjs/multer
- 🔗 jest: https://jestjs.io
- 🔗 supertest: https://www.npmjs.com/package/supertest

---

## 📝 Notes Importantes

1. **Mots de passe**: 
   - Le hash bcrypt change à chaque fois (salt aléatoire)
   - Impossible de retrouver le mot de passe original
   - Coût 10 = bon équilibre sécurité/performance

2. **Upload**:
   - Whitelist > Blacklist (sécurité par défaut)
   - Vérifier MIME type ET extension (double validation)
   - Stocker en dehors du webroot idéalement

3. **Contrôle d'accès**:
   - Vérifier propriété au niveau le plus bas (modèle, si possible)
   - Ne pas faire confiance au client
   - Logged HTTP 403 si accès non autorisé

4. **Rate limiting**:
   - Par IP pour le login
   - 15 minutes de délai prudent (peut être ajusté)
   - Peut être désactivé pour les utilisateurs de confiance (todo)

---

**TD Complété avec succès! 🎉**

