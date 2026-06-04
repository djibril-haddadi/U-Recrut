var express = require('express');
var router = express.Router();
var utilisateur = require('../model/utilisateur');
var organisation = require('../model/organisation');
var recruteur = require('../model/recruteur');
var offreEmploi = require('../model/offre_emploi');
var demandeRecruteur = require('../model/demande_recruteur');

// Middleware : vérifier l'authentification admin
const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('error', { 
      message: 'Accès réservé aux administrateurs',
      error: {} 
    });
  }
  next();
};

/* GET gestion des utilisateurs */
router.get('/users', requireAdmin, async (req, res, next) => {
  try {
    const users = await utilisateur.readAll();
    res.render('admin/users', { 
      title: 'Gestion des utilisateurs - U-Recrut',
      users 
    });
  } catch (err) {
    next(err);
  }
});

/* GET gestion des organisations */
router.get('/organisations', requireAdmin, async (req, res, next) => {
  try {
    const organisations = await organisation.readAll();
    res.render('admin/organisations', { 
      title: 'Gestion des organisations - U-Recrut',
      organisations 
    });
  } catch (err) {
    next(err);
  }
});

/* GET formulaire d'ajout d'organisation */
router.get('/organisations/new', requireAdmin, (req, res) => {
  res.render('admin/organisations_new', {
    title: 'Ajouter une organisation - U-Recrut'
  });
});

/* POST création d'organisation */
router.post('/organisations', requireAdmin, async (req, res, next) => {
  try {
    const { siren, nom, type, siegeSocial } = req.body;
    await organisation.create({ siren, nom, type, siegeSocial });
    res.redirect('/admin/organisations');
  } catch (err) {
    next(err);
  }
});

/* GET gestion des recruteurs */
router.get('/recruteurs', requireAdmin, async (req, res, next) => {
  try {
    const recruteurs = await recruteur.readAll();
    const recruteurDetails = await Promise.all(recruteurs.map(async (rec) => {
      const user = await utilisateur.read(rec.idRecruteur);
      const org = rec.sirenOrganisation ? await organisation.read(rec.sirenOrganisation) : null;
      return { ...rec, user, organisation: org };
    }));
    res.render('admin/recruteurs', { 
      title: 'Gestion des recruteurs - U-Recrut',
      recruteurs: recruteurDetails 
    });
  } catch (err) {
    next(err);
  }
});

/* GET gestion des demandes recruteur */
router.get('/demandes-recruteurs', requireAdmin, async (req, res, next) => {
  try {
    const demandes = await demandeRecruteur.readAll();
    const demandesDetails = await Promise.all(demandes.map(async (d) => {
      const user = d.idCandidat ? await utilisateur.read(d.idCandidat) : null;
      const org = d.sirenOrganisation ? await organisation.read(d.sirenOrganisation) : null;
      return { ...d, user, organisation: org };
    }));
    res.render('admin/demandes_recruteurs', {
      title: 'Demandes recruteurs - U-Recrut',
      demandes: demandesDetails
    });
  } catch (err) {
    next(err);
  }
});

/* POST accepter une demande recruteur */
router.post('/demandes-recruteurs/:id/accept', requireAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const demande = await demandeRecruteur.read(id);
    if (!demande) return res.status(404).render('error', { message: 'Demande introuvable', error: {} });

    const user = await utilisateur.read(demande.idCandidat);
    if (!user) return res.status(404).render('error', { message: 'Utilisateur introuvable', error: {} });

    const existingRec = await recruteur.read(demande.idCandidat);
    if (!existingRec) {
      await recruteur.create({ idRecruteur: demande.idCandidat, sirenOrganisation: demande.sirenOrganisation });
    }

    await utilisateur.update(demande.idCandidat, { statutCompte: 'actif' });
    await demandeRecruteur.update(id, { statutDemande: 'acceptée', idAdministrateur: req.session.user.id });

    res.redirect('/admin/demandes-recruteurs');
  } catch (err) {
    next(err);
  }
});

/* POST refuser une demande recruteur */
router.post('/demandes-recruteurs/:id/reject', requireAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const demande = await demandeRecruteur.read(id);
    if (!demande) return res.status(404).render('error', { message: 'Demande introuvable', error: {} });

    const idCandidat = demande.idCandidat;

    const existingRec = idCandidat ? await recruteur.read(idCandidat) : null;
    if (existingRec) {
      await recruteur.delete(idCandidat);
    }

    await demandeRecruteur.update(id, { idCandidat: null, statutDemande: 'rejetée', idAdministrateur: req.session.user.id });

    if (idCandidat) {
      await utilisateur.delete(idCandidat);
    }

    res.redirect('/admin/demandes-recruteurs');
  } catch (err) {
    next(err);
  }
});

/* GET gestion des offres */
router.get('/offres', requireAdmin, async (req, res, next) => {
  try {
    const offres = await offreEmploi.readAll();
    res.render('admin/offres', { 
      title: 'Gestion des offres - U-Recrut',
      offres 
    });
  } catch (err) {
    next(err);
  }
});

/* POST supprimer un utilisateur */
router.post('/users/:id/delete', requireAdmin, async (req, res, next) => {
  try {
    await utilisateur.delete(req.params.id);
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (err) {
    next(err);
  }
});

/* POST désactiver un compte utilisateur */
router.post('/users/:id/deactivate', requireAdmin, async (req, res, next) => {
  try {
    await utilisateur.update(req.params.id, { statutCompte: 'inactif' });
    res.json({ success: true, message: 'Compte désactivé' });
  } catch (err) {
    next(err);
  }
});

/* POST supprimer une offre */
router.post('/offres/:id/delete', requireAdmin, async (req, res, next) => {
  try {
    await offreEmploi.delete(req.params.id);
    res.json({ success: true, message: 'Offre supprimée' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
