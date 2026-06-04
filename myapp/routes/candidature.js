var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var candidature = require('../model/candidature');
var offreEmploi = require('../model/offre_emploi');
var fichePoste = require('../model/fiche_poste');
var utilisateur = require('../model/utilisateur');
var candidat = require('../model/candidat');
var recruteur = require('../model/recruteur');
var documentCandidature = require('../model/document_candidature');

// Middleware : vérifier l'authentification
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${Date.now()}_${safeName}`);
  }
});
const upload = multer({ storage });

/* GET formulaire de candidature avec upload */
router.get('/create/:idOffre', requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== 'candidat') {
      return res.status(403).render('error', { message: 'Accès réservé aux candidats', error: {} });
    }

    res.render('candidatures/create', {
      title: 'Postuler à une offre - U-Recrut',
      idOffre: req.params.idOffre
    });
  } catch (err) {
    next(err);
  }
});

/* POST postuler à une offre */
router.post('/create/:idOffre', requireAuth, upload.single('document'), async (req, res, next) => {
  try {
    if (req.session.user.role !== 'candidat') {
      return res.status(403).json({ error: 'Accès réservé aux candidats' });
    }

    const candidatData = await candidat.readAll();
    const candRow = candidatData.find(c => c.idCandidat === req.session.user.id);

    if (!candRow) {
      return res.status(400).json({ error: 'Profil candidat non trouvé' });
    }

    // Vérifier si déjà postulé
    const candidatures = await candidature.readAll();
    const existing = candidatures.find(c => 
      c.idCandidat === candRow.idCandidat && c.idOffre === parseInt(req.params.idOffre)
    );

    if (existing) {
      return res.status(400).json({ error: 'Vous avez déjà postulé à cette offre' });
    }

    // Créer la candidature
    const newCandidature = await candidature.create({
      dateCandidature: new Date(),
      etatCandidature: 'en attente',
      idCandidat: candRow.idCandidat,
      idOffre: req.params.idOffre
    });

    if (req.file) {
      await documentCandidature.create({
        nomFichier: req.file.originalname,
        typeDocument: req.file.mimetype,
        cheminStockage: '/uploads/' + req.file.filename,
        dateDepot: new Date(),
        idCandidature: newCandidature.insertId
      });
    }

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, id: newCandidature.insertId, message: 'Candidature envoyée' });
    }

    res.redirect('/candidatures');
  } catch (err) {
    next(err);
  }
});

/* GET mes candidatures (candidat) */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== 'candidat') {
      return res.status(403).render('error', { 
        message: 'Accès réservé aux candidats',
        error: {} 
      });
    }

    const candidatData = await candidat.readAll();
    const candRow = candidatData.find(c => c.idCandidat === req.session.user.id);

    if (!candRow) {
      return res.status(400).render('error', { 
        message: 'Profil candidat non trouvé',
        error: {} 
      });
    }

    const candidatures = await candidature.readAll();
    const mesCandidatures = candidatures.filter(c => c.idCandidat === candRow.idCandidat);

    const candidaturesAvecDetails = await Promise.all(mesCandidatures.map(async (cand) => {
      const offre = await offreEmploi.read(cand.idOffre);
      const fiche = offre ? await fichePoste.read(offre.idFichePoste) : null;
      return { ...cand, offre, fiche };
    }));

    res.render('candidatures/list', { 
      title: 'Mes candidatures - U-Recrut',
      candidatures: candidaturesAvecDetails 
    });
  } catch (err) {
    next(err);
  }
});

/* GET candidatures reçues (recruteur) */
router.get('/received', requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== 'recruteur') {
      return res.status(403).render('error', { 
        message: 'Accès réservé aux recruteurs',
        error: {} 
      });
    }

    // Récupérer l'organisation du recruteur
    const recruteurs = await recruteur.readAll();
    const recruteurEnCours = recruteurs.find(r => r.idRecruteur === req.session.user.id);
    if (!recruteurEnCours || !recruteurEnCours.sirenOrganisation) {
      return res.status(404).render('error', {
        message: 'Organisation du recruteur introuvable',
        error: {}
      });
    }

    const recruteursOrganisation = recruteurs
      .filter(r => r.sirenOrganisation === recruteurEnCours.sirenOrganisation)
      .map(r => r.idRecruteur);

    // Récupérer toutes les offres de l'organisation
    const offres = await offreEmploi.readAll();
    const offresOrganisation = offres.filter(o => recruteursOrganisation.includes(o.idRecruteur));
    const offresOrganisationIds = offresOrganisation.map(o => o.idOffre);

    // Récupérer les candidatures pour ces offres
    const candidatures = await candidature.readAll();
    const mesCandidatures = candidatures.filter(c => offresOrganisationIds.includes(c.idOffre));

    const candidaturesAvecDetails = await Promise.all(mesCandidatures.map(async (cand) => {
      const offre = await offreEmploi.read(cand.idOffre);
      const fiche = offre ? await fichePoste.read(offre.idFichePoste) : null;
      const user = await utilisateur.read(cand.idCandidat);
      const document = await documentCandidature.readByCandidatureId(cand.idCandidature);
      return { ...cand, offre, fiche, candidat: user, document };
    }));

    res.render('candidatures/received', { 
      title: 'Candidatures reçues - U-Recrut',
      candidatures: candidaturesAvecDetails 
    });
  } catch (err) {
    next(err);
  }
});

/* PUT mettre à jour l'état d'une candidature */
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== 'recruteur') {
      return res.status(403).json({ error: 'Accès réservé aux recruteurs' });
    }

    const { etat } = req.body;
    await candidature.update(req.params.id, { etatCandidature: etat });
    
    res.json({ success: true, message: 'Candidature mise à jour' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
