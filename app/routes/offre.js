var express = require('express');
var router = express.Router();
var offreEmploi = require('../model/offre_emploi');
var fichePoste = require('../model/fiche_poste');
var recruteur = require('../model/recruteur');
var organisation = require('../model/organisation');
var utilisateur = require('../model/utilisateur');
var candidature = require('../model/candidature');
var candidat = require('../model/candidat');

// Middleware : vérifier l'authentification
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

/* GET liste des offres */
router.get('/', async (req, res, next) => {
  try {
    const search = (req.query.search || '').trim();

    let appliedOfferIds = new Set();
    if (req.session.user && req.session.user.role === 'candidat') {
      const candRow = await candidat.read(req.session.user.id);
      if (candRow) {
        const candidatures = await candidature.readAll();
        candidatures
          .filter(c => c.idCandidat === candRow.idCandidat)
          .forEach(c => appliedOfferIds.add(c.idOffre));
      }
    }

    const offres = await offreEmploi.readAll();
    const offresAvecDetails = await Promise.all(offres.map(async (offre) => {
      const fiche = await fichePoste.read(offre.idFichePoste);
      const rec = await recruteur.read(offre.idRecruteur);
      const org = rec ? await organisation.read(rec.sirenOrganisation) : null;
      return { ...offre, fiche, organisation: org, dejaPostule: appliedOfferIds.has(offre.idOffre) };
    }));

    const offresFiltrees = search
      ? offresAvecDetails.filter((offre) => {
          const texte = [
            offre.fiche?.intitule,
            offre.fiche?.typeMetier,
            offre.fiche?.missionsActivites,
            offre.fiche?.competencesAttendues,
            offre.organisation?.nom
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          return texte.includes(search.toLowerCase());
        })
      : offresAvecDetails;

    // Récupérer le message flash et le supprimer de la session
    const message = req.session.message;
    const messageType = req.session.messageType;
    delete req.session.message;
    delete req.session.messageType;

    res.render('offres/list', {
      title: 'Offres d\'emploi - U-Recrut',
      offres: offresFiltrees,
      searchQuery: search,
      message,
      messageType
    });
  } catch (err) {
    next(err);
  }
});

/* GET page créer offre (recruteur) */
router.get('/create', requireAuth, (req, res) => {
  if (req.session.user.role !== 'recruteur') {
    return res.status(403).render('error', { 
      message: 'Accès réservé aux recruteurs',
      error: {} 
    });
  }
  res.render('offres/create', { title: 'Créer une offre - U-Recrut' });
});

/* POST créer offre */
router.post('/create', requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== 'recruteur') {
      return res.status(403).render('error', { 
        message: 'Accès réservé aux recruteurs',
        error: {} 
      });
    }

    const { intitule, typeMetier, lieuMission, rythme, fourchetteSalaire, missionsActivites, competencesAttendues, pieceJointeAttendue } = req.body;
    
    // Créer la fiche poste
    const rec = await recruteur.read(req.session.user.id);
    const fiche = await fichePoste.create({
      intitule,
      typeMetier,
      lieuMission,
      rythme,
      fourchetteSalaire,
      missionsActivites,
      competencesAttendues,
      pieceJointeAttendue,
      statutPoste: 'actif',
      sirenOrganisation: rec.sirenOrganisation
    });

    // Créer l'offre d'emploi
    const offre = await offreEmploi.create({
      dateCreation: new Date(),
      datePublication: new Date(),
      dateValidite: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
      statutOffre: 'publiée',
      idRecruteur: req.session.user.id,
      idFichePoste: fiche.insertId
    });

    res.redirect('/offres/' + offre.insertId);
  } catch (err) {
    next(err);
  }
});

/* GET détail d'une offre */
router.get('/:id', async (req, res, next) => {
  try {
    let offre = await offreEmploi.read(req.params.id);
    if (!offre) {
      return res.status(404).render('error', { 
        message: 'Offre non trouvée',
        error: {} 
      });
    }

    const fiche = await fichePoste.read(offre.idFichePoste);
    const rec = await recruteur.read(offre.idRecruteur);
    const user = rec ? await utilisateur.read(rec.idRecruteur) : null;
    const org = rec ? await organisation.read(rec.sirenOrganisation) : null;

    let dejaPostule = false;
    if (req.session.user && req.session.user.role === 'candidat') {
      const candRow = await candidat.read(req.session.user.id);
      if (candRow) {
        const candidatures = await candidature.readAll();
        dejaPostule = candidatures.some(c => 
          c.idCandidat === candRow.idCandidat && c.idOffre === parseInt(req.params.id, 10)
        );
      }
    }

    offre = { ...offre, fiche, recruteur: user, organisation: org, dejaPostule };

    res.render('offres/detail', { 
      title: offre.fiche?.intitule + ' - U-Recrut',
      offre 
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
