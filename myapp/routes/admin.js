var express = require('express');
var router = express.Router();
var utilisateur = require('../model/utilisateur');
var organisation = require('../model/organisation');
var recruteur = require('../model/recruteur');
var offreEmploi = require('../model/offre_emploi');

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
