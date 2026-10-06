var express = require('express');
var router = express.Router();

const userModel = require('../model/utilisateur');
const offreModel = require('../model/offre_emploi');
const organisationModel = require('../model/organisation');
const candidat = require('../model/candidat');
const recruteur = require('../model/recruteur');
const session = require('../session');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET formulaire de création d'un utilisateur */
router.get('/new', async function(req, res, next) {
  try {
    const organisations = await organisationModel.readAll();
    res.render('auth/register', {
      title: 'Créer un utilisateur - U-Recrut',
      formAction: '/users',
      error: null,
      organisations,
      selectedOrganisation: null,
      selectedRole: null
    });
  } catch (error) {
    next(error);
  }
});

/* POST création d'un utilisateur */
router.post('/', async function(req, res, next) {
  try {
    const { nom, prenom, email, password, role, sirenOrganisation } = req.body;
    const demandeModel = require('../model/demande_recruteur');
    const users = await userModel.readAll();
    const organisations = await organisationModel.readAll();

    if (users.some(u => u.email === email)) {
      return res.render('auth/register', {
        title: 'Créer un utilisateur - U-Recrut',
        formAction: '/users',
        error: 'Cet email est déjà utilisé',
        organisations,
        selectedOrganisation: sirenOrganisation,
        selectedRole: role
      });
    }

    if (role === 'recruteur' && !sirenOrganisation) {
      return res.render('auth/register', {
        title: 'Créer un utilisateur - U-Recrut',
        formAction: '/users',
        error: 'Veuillez choisir une organisation',
        organisations,
        selectedOrganisation: sirenOrganisation,
        selectedRole: role
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      nom,
      prenom,
      email,
      motDePasseHash: hashedPassword,
      dateCreation: new Date(),
      statutCompte: role === 'recruteur' ? 'en_attente' : 'actif'
    });

    await candidat.create({ idCandidat: newUser.insertId });

    if (role === 'recruteur') {
      await demandeModel.create({
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

    // Connecter l'utilisateur comme candidat
    req.session.user = {
      id: newUser.insertId,
      nom,
      prenom,
      email,
      role: 'candidat'
    };
    session.creatSession(req.session, email, 'candidat');
    return res.redirect('/dashboard/candidat');
  } catch (error) {
    next(error);
  }
});

// Liste des utilisateurs avec promesse (await)
router.get('/userslist', async function (req, res, next) {
  try {
    const users = await userModel.readAll();
    res.render('usersList', { title: 'Liste des utilisateurs', users });
  } catch (error) {
    next(error);
  }
});

// Liste des offres d'emploi
router.get('/offreslist', async function (req, res, next) {
  try {
    const offres = await offreModel.readAll();
    res.render('offresList', { title: 'Liste des offres', offres });
  } catch (error) {
    next(error);
  }
});

// Liste des organisations
router.get('/organisationslist', async function (req, res, next) {
  try {
    const organisations = await organisationModel.readAll();
    res.render('organisationsList', { title: 'Liste des organisations', organisations });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
