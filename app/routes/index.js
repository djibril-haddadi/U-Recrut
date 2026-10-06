var express = require('express');
var router = express.Router();
var offreEmploi = require('../model/offre_emploi');
var fichePoste = require('../model/fiche_poste');
var recruteur = require('../model/recruteur');
var organisation = require('../model/organisation');
var utilisateur = require('../model/utilisateur');

/* GET home page avec liste des offres */
router.get('/', async (req, res, next) => {
  try {
    const offres = await offreEmploi.readAll();
    const offresAvecDetails = await Promise.all(offres.map(async (offre) => {
      const fiche = await fichePoste.read(offre.idFichePoste);
      const rec = await recruteur.read(offre.idRecruteur);
      const org = rec ? await organisation.read(rec.sirenOrganisation) : null;
      const user = rec ? await utilisateur.read(rec.idRecruteur) : null;
      return {
        ...offre,
        fiche,
        recruteur: user,
        organisation: org
      };
    }));
    
    res.render('home', { 
      title: 'U-Recrut - Accueil',
      offres: offresAvecDetails 
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
