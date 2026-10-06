var express = require('express');
var router = express.Router();
var utilisateur = require('../model/utilisateur');
var candidat = require('../model/candidat');
var recruteur = require('../model/recruteur');
var demandeRecruteur = require('../model/demande_recruteur');
var offreEmploi = require('../model/offre_emploi');
var fichePoste = require('../model/fiche_poste');
var candidature = require('../model/candidature');
var organisation = require('../model/organisation');

// Middleware : vérifier l'authentification
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

/* GET dashboard candidat */
router.get('/candidat', requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== 'candidat') {
      return res.status(403).render('error', { 
        message: 'Accès réservé aux candidats',
        error: {} 
      });
    }

    const candidatData = await candidat.readAll();
    const candRow = candidatData.find(c => c.idCandidat === req.session.user.id);

    // Récupérer les statistiques
    const candidatures = await candidature.readAll();
    const mesCandidatures = candidatures.filter(c => c.idCandidat === candRow.idCandidat);
    const enAttente = mesCandidatures.filter(c => c.etatCandidature === 'en attente').length;
    const enEntretien = mesCandidatures.filter(c => c.etatCandidature === 'entretien').length;
    const acceptees = mesCandidatures.filter(c => c.etatCandidature === 'acceptée').length;
    const rejetees = mesCandidatures.filter(c => c.etatCandidature === 'rejetée').length;

    // Récupérer les dernières offres
    const offres = await offreEmploi.readAll();
    const dernieres = offres.length > 5 ? offres.slice(-5).reverse() : offres.reverse();

    res.render('dashboard/candidat', { 
      title: 'Tableau de bord - U-Recrut',
      stats: {
        total: mesCandidatures.length,
        enAttente,
        enEntretien,
        acceptees,
        rejetees
      },
      dernieres
    });
  } catch (err) {
    next(err);
  }
});

/* GET dashboard recruteur */
router.get('/recruteur', requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== 'recruteur') {
      return res.status(403).render('error', { 
        message: 'Accès réservé aux recruteurs',
        error: {} 
      });
    }

    const offres = await offreEmploi.readAll();
    const mesOffres = offres.filter(o => o.idRecruteur === req.session.user.id);
    
    const candidatures = await candidature.readAll();
    const mesCandidatures = candidatures.filter(c => 
      mesOffres.some(o => o.idOffre === c.idOffre)
    );

    const enAttente = mesCandidatures.filter(c => c.etatCandidature === 'en attente').length;
    const enEntretien = mesCandidatures.filter(c => c.etatCandidature === 'entretien').length;
    const acceptees = mesCandidatures.filter(c => c.etatCandidature === 'acceptée').length;
    const rejetees = mesCandidatures.filter(c => c.etatCandidature === 'rejetée').length;

    res.render('dashboard/recruteur', { 
      title: 'Tableau de bord - U-Recrut',
      stats: {
        offresTotal: mesOffres.length,
        candidaturesTotal: mesCandidatures.length,
        enAttente,
        enEntretien,
        acceptees,
        rejetees
      }
    });
  } catch (err) {
    next(err);
  }
});

/* GET offres publiées par le recruteur */
router.get('/recruteur/offres-publiees', requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== 'recruteur') {
      return res.status(403).render('error', {
        message: 'Accès réservé aux recruteurs',
        error: {}
      });
    }

    const offres = await offreEmploi.readAll();
    const mesOffres = offres.filter(o => o.idRecruteur === req.session.user.id);

    const offresAvecDetails = await Promise.all(mesOffres.map(async (offre) => {
      const fiche = await fichePoste.read(offre.idFichePoste);
      const recAuteur = await recruteur.read(offre.idRecruteur);
      const org = recAuteur ? await organisation.read(recAuteur.sirenOrganisation) : null;
      return { ...offre, fiche, organisation: org };
    }));

    res.render('offres/organisation', {
      title: 'Mes offres publiées - U-Recrut',
      offres: offresAvecDetails
    });
  } catch (err) {
    next(err);
  }
});

/* GET offres de l'organisation du recruteur */
router.get('/recruteur/offres-organisation', requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== 'recruteur') {
      return res.status(403).render('error', {
        message: 'Accès réservé aux recruteurs',
        error: {}
      });
    }

    const rec = await recruteur.read(req.session.user.id);
    if (!rec || !rec.sirenOrganisation) {
      return res.status(404).render('error', {
        message: 'Organisation non trouvée pour ce recruteur',
        error: {}
      });
    }

    const allRecruteurs = await recruteur.readAll();
    const sameOrgRecruteurs = allRecruteurs
      .filter(r => r.sirenOrganisation === rec.sirenOrganisation)
      .map(r => r.idRecruteur);

    const offres = await offreEmploi.readAll();
    const offresOrg = offres.filter(o => sameOrgRecruteurs.includes(o.idRecruteur));

    const offresAvecDetails = await Promise.all(offresOrg.map(async (offre) => {
      const fiche = await fichePoste.read(offre.idFichePoste);
      const recAuteur = await recruteur.read(offre.idRecruteur);
      const org = recAuteur ? await organisation.read(recAuteur.sirenOrganisation) : null;
      return { ...offre, fiche, organisation: org };
    }));

    res.render('offres/organisation', {
      title: 'Offres de mon organisation - U-Recrut',
      offres: offresAvecDetails
    });
  } catch (err) {
    next(err);
  }
});

/* GET dashboard admin */
router.get('/admin', requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).render('error', { 
        message: 'Accès réservé aux administrateurs',
        error: {} 
      });
    }

    const users = await utilisateur.readAll();
    const offres = await offreEmploi.readAll();
    const candidatures = await candidature.readAll();
    const organisations = await organisation.readAll();
    const candidats = await candidat.readAll();
    const recruteurs = await recruteur.readAll();
    const demandes = await demandeRecruteur.readAll();
    const demandesEnAttente = demandes.filter(d => d.statutDemande === 'en_attente').length;

    res.render('dashboard/admin', { 
      title: 'Console Admin - U-Recrut',
      stats: {
        utilisateurs: users.length,
        candidats: candidats.length,
        recruteurs: recruteurs.length,
        offres: offres.length,
        candidatures: candidatures.length,
        organisations: organisations.length,
        demandes: demandesEnAttente
      },
      users: users.slice(-10),
      offres: offres.slice(-10),
      candidatures: candidatures.slice(-10)
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
