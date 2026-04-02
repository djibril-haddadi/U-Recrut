var express = require('express');
var router = express.Router();

const userModel = require('../model/utilisateur');
const offreModel = require('../model/offre_emploi');
const organisationModel = require('../model/organisation');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
