-- ============================================================
-- DONNÉES DE TEST - U-RECRUT APPLICATION
-- ============================================================
-- Script pour peupler la base de données avec des données de test
-- À exécuter APRÈS la création des tables (ai16p032.sql)
-- ============================================================

-- Nettoyage (optionnel - commenter si vous voulez garder les données)
-- DELETE FROM candidature;
-- DELETE FROM offre_emploi;
-- DELETE FROM fiche_poste;
-- DELETE FROM document_candidature;
-- DELETE FROM recruteur;
-- DELETE FROM administrateur;
-- DELETE FROM candidat;
-- DELETE FROM organisation;
-- DELETE FROM utilisateur;

-- ============================================================
-- 1. ORGANISATIONS
-- ============================================================
INSERT INTO `organisation` (`siren`, `nom`, `type`, `siegeSocial`) VALUES
('12345678901234', 'TechCorp France', 'SARL', '123 rue de la Technologie, 75001 Paris'),
('98765432109876', 'Innovation Digital', 'SA', '456 avenue du Web, 59000 Lille'),
('11111111111111', 'ConsultPro Services', 'EIRL', '789 boulevard Conseil, 33000 Bordeaux');

-- ============================================================
-- 2. UTILISATEURS
-- ============================================================
INSERT INTO `utilisateur` (`idUtilisateur`, `nom`, `prenom`, `email`, `motDePasseHash`, `telephone`, `adresse`, `codePostal`, `ville`, `dateCreation`, `statutCompte`) VALUES
-- Candidats
(1, 'Dupont', 'Jean', 'jean.dupont@test.com', 'motdepasse123', '0612345678', '12 rue des Fleurs', '75001', 'Paris', NOW(), 'actif'),
(2, 'Martin', 'Marie', 'marie.martin@test.com', 'motdepasse456', '0623456789', '45 avenue Victor Hugo', '75015', 'Paris', NOW(), 'actif'),
(3, 'Durand', 'Pierre', 'pierre.durand@test.com', 'motdepasse789', '0634567890', '78 rue de la Paix', '59000', 'Lille', NOW(), 'actif'),
(4, 'Bernard', 'Sophie', 'sophie.bernard@test.com', 'motdepasse999', '0645678901', '321 boulevard Tolton', '33000', 'Bordeaux', NOW(), 'actif'),

-- Recruteurs
(5, 'Laurent', 'Thomas', 'thomas.laurent@techcorp.com', 'recruiter1', '0656789012', '123 rue de la Technologie', '75001', 'Paris', NOW(), 'actif'),
(6, 'Michaux', 'Isabelle', 'isabelle.michaux@innovation.com', 'recruiter2', '0667890123', '456 avenue du Web', '59000', 'Lille', NOW(), 'actif'),
(7, 'Rousseau', 'Daniel', 'daniel.rousseau@consultpro.com', 'recruiter3', '0678901234', '789 boulevard Conseil', '33000', 'Bordeaux', NOW(), 'actif'),

-- Admin
(8, 'Admin', 'Master', 'admin@test.com', 'admin123', '0600000000', '1 place Centrale', '75002', 'Paris', NOW(), 'actif');

-- ============================================================
-- 3. CANDIDATS (lier les utilisateurs candidats)
-- ============================================================
INSERT INTO `candidat` (`idCandidat`) VALUES
(1), (2), (3), (4);

-- ============================================================
-- 4. RECRUTEURS (lier les utilisateurs recruteurs aux organisations)
-- ============================================================
INSERT INTO `recruteur` (`idRecruteur`, `sirenOrganisation`) VALUES
(5, '12345678901234'),      -- Thomas Laurent pour TechCorp
(6, '98765432109876'),      -- Isabelle Michaux pour Innovation Digital
(7, '11111111111111');      -- Daniel Rousseau pour ConsultPro

-- ============================================================
-- 5. ADMINISTRATEUR (lier l'utilisateur admin)
-- ============================================================
INSERT INTO `administrateur` (`idAdministrateur`) VALUES
(8);

-- ============================================================
-- 6. FICHES DE POSTE
-- ============================================================
INSERT INTO `fiche_poste` (`idFichePoste`, `intitule`, `statutPoste`, `responsableHierarchique`, `typeMetier`, `lieuMission`, `rythme`, `fourchetteSalaire`, `missionsActivites`, `competencesAttendues`, `pieceJointeAttendue`, `sirenOrganisation`) VALUES

(1, 'Développeur Full Stack (Node.js/React)', 'CDI', 'Directeur Technique', 'Développement Web', 'Paris (75)', 'Temps plein - Hybride (3j/semaine)', '38000-48000€ brut/an', 
'- Développer des applications web modernes et performantes\n- Créer et maintenir des APIs REST\n- Collaborer avec le design et le product management\n- Optimiser les performances et la scalabilité\n- Participer aux code reviews',
'- JavaScript/Node.js (obligatoire)\n- React ou Vue.js\n- SQL et bases de données relationnelles\n- Git\n- Expérience avec Docker souhaitée\n- Anglais courant',
NULL,
'12345678901234'),

(2, 'Data Scientist / Machine Learning Engineer', 'CDI', 'Head of Data', 'Data Science', 'Lille (59)', 'Temps plein - 100% télétravail possible', '42000-55000€ brut/an',
'- Développer des modèles de machine learning\n- Analyser des grandes volumes de données\n- Créer des pipelines de données ETL\n- Faire du A/B testing et de l\'expérimentation\n- Documenter les modèles et les méthodologies',
'- Python (sklearn, pandas, numpy)\n- TensorFlow ou PyTorch\n- SQL et gestion BD\n- Statistiques appliquées\n- Communication des insights metier',
NULL,
'98765432109876'),

(3, 'Consultant Business Intelligence / Analytics', 'CDI', 'Manager Consulting', 'Consulting', 'Bordeaux (33)', 'Temps plein - Mobilité acceptable (30%)', '35000-45000€ brut/an',
'- Accompagner clients dans leur transformation digitale\n- Concevoir des solutions BI\n- Analyser les processus métier\n- Présenter des recommandations aux décideurs\n- Gérer les projets de bout en bout',
'- Excellentes capacités d\'analyse\n- Power BI ou Tableau\n- SQL avancé\n- Excel expert\n- Soft skills: communication, leadership, negociation',
NULL,
'11111111111111'),

(4, 'QA Engineer / Test Automation', 'CDI', 'Tech Lead QA', 'Quality Assurance', 'Paris (75)', 'Temps plein - Sur site preferé', '32000-40000€ brut/an',
'- Écrire et exécuter des cas de test\n- Automatiser les tests de régression\n- Identifier et documenter les bugs\n- Participer à la stratégie QA\n- Collaborer avec les développeurs',
'- Selenium ou Cypress\n- Python ou JavaScript pour l\'automation\n- SQL pour tester les données\n- Jira/Azure DevOps\n- Méthodologies Agile',
NULL,
'12345678901234'),

(5, 'Développeur Backend Python', 'CDI', 'Tech Lead Backend', 'Développement Backend', 'Lille (59)', 'Temps plein - Hybride', '40000-50000€ brut/an',
'- Développer des services backend scalables\n- Créer des APIs RESTful\n- Gérer les bases de données\n- Optimiser les performances\n- Mettre en place CI/CD',
'- Python 3.x (obligatoire)\n- Django ou FastAPI\n- PostgreSQL ou MongoDB\n- Docker et Kubernetes notions\n- Git et Linux',
NULL,
'98765432109876');

-- ============================================================
-- 7. OFFRES D'EMPLOI
-- ============================================================
INSERT INTO `offre_emploi` (`idOffre`, `dateCreation`, `datePublication`, `dateValidite`, `statutOffre`, `piecesDemandees`, `nbPiecesDemandees`, `idRecruteur`, `idFichePoste`) VALUES

(1, '2026-03-15', '2026-03-16', '2026-06-16', 'publiée', 'CV,Lettre motivation,Certificats', 3, 5, 1),
(2, '2026-03-18', '2026-03-19', '2026-06-19', 'publiée', 'CV,Certificats,Portfolio', 3, 2, 2),
(3, '2026-03-20', '2026-03-21', '2026-05-21', 'publiée', 'CV,Lettre motivation', 2, 7, 3),
(4, '2026-03-22', '2026-03-23', '2026-06-23', 'publiée', 'CV,Tests techniques', 2, 5, 4),
(5, '2026-03-25', '2026-03-26', '2026-07-26', 'publiée', 'CV', 1, 6, 5);

-- ============================================================
-- 8. CANDIDATURES (quelques candidatures pour tester les workflows)
-- ============================================================
INSERT INTO `candidature` (`idCandidature`, `dateCandidature`, `etatCandidature`, `idCandidat`, `idOffre`) VALUES

-- Jean Dupont (candidat 1)
(1, '2026-03-26', 'en attente', 1, 1),
(2, '2026-03-25', 'entretien', 1, 4),

-- Marie Martin (candidat 2)  
(3, '2026-03-26', 'acceptée', 2, 2),
(4, '2026-03-24', 'rejetée', 2, 3),

-- Pierre Durand (candidat 3)
(5, '2026-03-26', 'en attente', 3, 5),
(6, '2026-03-20', 'entretien', 3, 2),

-- Sophie Bernard (candidat 4)
(7, '2026-03-25', 'acceptée', 4, 3),
(8, '2026-03-22', 'en attente', 4, 1);

-- ============================================================
-- RÉSUMÉ DES DONNÉES
-- ============================================================
-- 
-- UTILISATEURS:
-- - 4 Candidats: Jean, Marie, Pierre, Sophie
-- - 3 Recruteurs: Thomas (TechCorp), Isabelle (Innovation), Daniel (ConsultPro)
-- - 1 Admin: Admin Master
--
-- ORGANISATIONS:
-- - TechCorp France (SARL) - 2 offres
-- - Innovation Digital (SA) - 2 offres
-- - ConsultPro Services (EIRL) - 1 offre
--
-- OFFRES (5 au total): 
-- - 2 Développeur Full Stack + QA Engineer (TechCorp)
-- - 2 Data Scientist + Backend Python (Innovation)
-- - 1 Consultant BI (ConsultPro)
--
-- CANDIDATURES (8 au total):
-- - États variés: en attente, entretien, acceptée, rejetée
--
-- ============================================================
--
-- COMPTES DE TEST POUR SE CONNECTER:
--
-- CANDIDAT:
--   Email: jean.dupont@test.com
--   Mot de passe: motdepasse123
--   (ou marie.martin@test.com / pierre.durand@test.com / sophie.bernard@test.com)
--
-- RECRUTEUR:
--   Email: thomas.laurent@techcorp.com
--   Mot de passe: recruiter1
--   (ou isabelle.michaux@innovation.com / daniel.rousseau@consultpro.com)
--
-- ADMIN:
--   Email: admin@test.com
--   Mot de passe: admin123
--
-- ============================================================
