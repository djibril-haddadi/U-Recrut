var express = require('express');
var router = express.Router();
var utilisateur = require('../model/utilisateur');
var candidat = require('../model/candidat');
var recruteur = require('../model/recruteur');
var administrateur = require('../model/administrateur');
var session = require('../session');

/* GET login page */
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Connexion - U-Recrut' });
});

/* POST login */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await utilisateur.readAll();
    const user = users.find(u => u.email === email && u.motDePasseHash === password);
    
    if (!user) {
      return res.render('auth/login', { 
        title: 'Connexion - U-Recrut',
        error: 'Email ou mot de passe incorrect' 
      });
    }

    // Déterminer le rôle
    let role = 'user';
    const candCheck = await candidat.readAll();
    const recCheck = await recruteur.readAll();
    const admCheck = await administrateur.readAll();

    if (candCheck.some(c => c.idCandidat === user.idUtilisateur)) {
      role = 'candidat';
    } else if (recCheck.some(r => r.idRecruteur === user.idUtilisateur)) {
      role = 'recruteur';
    } else if (admCheck.some(a => a.idAdministrateur === user.idUtilisateur)) {
      role = 'admin';
    }

    req.session.user = {
      id: user.idUtilisateur,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: role
    };
    session.creatSession(req.session, user.email, role);

    if (role === 'candidat') {
      res.redirect('/dashboard/candidat');
    } else if (role === 'recruteur') {
      res.redirect('/dashboard/recruteur');
    } else if (role === 'admin') {
      res.redirect('/dashboard/admin');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
});

/* GET register page */
router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Inscription - U-Recrut' });
});

/* POST register */
router.post('/register', async (req, res, next) => {
  try {
    const { nom, prenom, email, password, role } = req.body;
    
    // Vérifier si l'email existe déjà
    const users = await utilisateur.readAll();
    if (users.some(u => u.email === email)) {
      return res.render('auth/register', { 
        title: 'Inscription - U-Recrut',
        error: 'Cet email est déjà utilisé' 
      });
    }

    // Créer l'utilisateur
    const newUser = await utilisateur.create({
      nom,
      prenom,
      email,
      motDePasseHash: password,
      dateCreation: new Date(),
      statutCompte: 'actif'
    });

    // Créer le candidat ou recruteur
    if (role === 'candidat') {
      await candidat.create({ idCandidat: newUser.insertId });
    } else if (role === 'recruteur') {
      const recData = await recruteur.create({ idRecruteur: newUser.insertId });
    }

    // Connecter automatiquement
    req.session.user = {
      id: newUser.insertId,
      nom,
      prenom,
      email,
      role: role || 'candidat'
    };
    session.creatSession(req.session, email, role || 'candidat');

    if (role === 'candidat') {
      res.redirect('/dashboard/candidat');
    } else if (role === 'recruteur') {
      res.redirect('/dashboard/recruteur');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
});

/* GET logout */
router.get('/logout', async (req, res, next) => {
  try {
    session.deleteSession(req.session);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
