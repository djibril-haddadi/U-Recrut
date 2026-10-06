var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var rateLimit = require('express-rate-limit');
var utilisateur = require('../model/utilisateur');
var candidat = require('../model/candidat');
var recruteur = require('../model/recruteur');
var administrateur = require('../model/administrateur');
var demandeRecruteur = require('../model/demande_recruteur');
var organisationModel = require('../model/organisation');
var session = require('../session');

// CORRECTION 1: Rate limiting pour prévenir les attaques par force brute
const loginLimiter = rateLimit({
  windowMs: Number(process.env.LOGIN_WINDOW_MS) || 15 * 60 * 1000,
  max: (req, res) => Number(process.env.LOGIN_MAX_ATTEMPTS) || 5,
  message: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
  // Allow tests to isolate clients without depending on shared IP state
  keyGenerator: (req) => req.headers['x-test-client'] || req.ip,
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
});

/* GET login page */
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Connexion - U-Recrut' });
});

/* POST login */
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await utilisateur.readAll();
    const user = users.find(u => u.email === email);

    // CORRECTION 1: Comparaison sécurisée du mot de passe avec bcrypt
    if (!user || !await bcrypt.compare(password, user.motDePasseHash)) {
      return res.render('auth/login', {
        title: 'Connexion - U-Recrut',
        error: 'Email ou mot de passe incorrect'
      });
    }

    if (user.statutCompte !== 'actif') {
      const message = user.statutCompte === 'en_attente'
        ? 'Votre compte est en attente d’approbation. Un administrateur doit valider votre demande avant que vous puissiez vous connecter.'
        : 'Votre compte n’est pas actif. Veuillez contacter un administrateur.';
      return res.render('auth/login', {
        title: 'Connexion - U-Recrut',
        error: null,
        message
      });
    }

    // Déterminer le rôle
    let role = 'user';
    const recCheck = await recruteur.readAll();
    const candCheck = await candidat.readAll();
    const admCheck = await administrateur.readAll();

    if (admCheck.some(a => a.idAdministrateur === user.idUtilisateur)) {
      role = 'admin';
    } else if (recCheck.some(r => r.idRecruteur === user.idUtilisateur)) {
      role = 'recruteur';
    } else if (candCheck.some(c => c.idCandidat === user.idUtilisateur)) {
      role = 'candidat';
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
router.get('/register', async (req, res, next) => {
  try {
    const organisations = await organisationModel.readAll();
    res.render('auth/register', {
      title: 'Inscription - U-Recrut',
      formAction: '/auth/register',
      error: null,
      organisations,
      selectedOrganisation: null,
      selectedRole: null
    });
  } catch (err) {
    next(err);
  }
});

/* POST register */
router.post('/register', async (req, res, next) => {
  try {
    const { nom, prenom, email, password, role, sirenOrganisation } = req.body;
    const organisations = await organisationModel.readAll();

    // Vérifier si l'email existe déjà
    const users = await utilisateur.readAll();
    if (users.some(u => u.email === email)) {
      return res.render('auth/register', {
        title: 'Inscription - U-Recrut',
        formAction: '/auth/register',
        error: 'Cet email est déjà utilisé',
        organisations,
        selectedOrganisation: sirenOrganisation,
        selectedRole: role
      });
    }

    if (role === 'recruteur' && !sirenOrganisation) {
      return res.render('auth/register', {
        title: 'Inscription - U-Recrut',
        formAction: '/auth/register',
        error: 'Veuillez choisir une organisation',
        organisations,
        selectedOrganisation: sirenOrganisation,
        selectedRole: role
      });
    }

    // Créer l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await utilisateur.create({
      nom,
      prenom,
      email,
      motDePasseHash: hashedPassword,
      dateCreation: new Date(),
      statutCompte: role === 'recruteur' ? 'en_attente' : 'actif'
    });

    // Créer le candidat ou la demande recruteur
    if (role === 'candidat') {
      await candidat.create({ idCandidat: newUser.insertId });
      req.session.user = {
        id: newUser.insertId,
        nom,
        prenom,
        email,
        role: 'candidat'
      };
      session.creatSession(req.session, email, 'candidat');
      return res.redirect('/dashboard/candidat');
    }

    if (role === 'recruteur') {
      await candidat.create({ idCandidat: newUser.insertId });
      await demandeRecruteur.create({
        dateDemande: new Date(),
        statutDemande: 'en_attente',
        idCandidat: newUser.insertId,
        sirenOrganisation: sirenOrganisation
      });

      return res.render('auth/login', {
        title: 'Connexion - U-Recrut',
        message: 'Votre demande de recruteur a bien été envoyée. Un administrateur doit l’approuver avant que votre compte puisse accéder aux fonctionnalités recruteur.',
        error: null
      });
    }

    // Connecter automatiquement si le rôle n'est pas définissable
    req.session.user = {
      id: newUser.insertId,
      nom,
      prenom,
      email,
      role: 'user'
    };
    session.creatSession(req.session, email, 'user');
    res.redirect('/');
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
