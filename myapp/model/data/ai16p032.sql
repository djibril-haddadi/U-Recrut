-- phpMyAdmin SQL Dump
-- version 5.2.1deb1+deb12u1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : jeu. 26 mars 2026 à 10:56
-- Version du serveur : 10.11.11-MariaDB-0+deb12u1
-- Version de PHP : 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ai16p032`
--

-- --------------------------------------------------------

--
-- Structure de la table `administrateur`
--

CREATE TABLE `administrateur` (
  `idAdministrateur` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `candidat`
--

CREATE TABLE `candidat` (
  `idCandidat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `candidature`
--

CREATE TABLE `candidature` (
  `idCandidature` int(11) NOT NULL,
  `dateCandidature` date DEFAULT NULL,
  `etatCandidature` varchar(50) DEFAULT NULL,
  `idCandidat` int(11) DEFAULT NULL,
  `idOffre` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `demande_organisation`
--

CREATE TABLE `demande_organisation` (
  `idDemandeOrganisation` int(11) NOT NULL,
  `sirenPropose` varchar(20) DEFAULT NULL,
  `nomPropose` varchar(150) DEFAULT NULL,
  `typePropose` varchar(100) DEFAULT NULL,
  `siegePropose` varchar(255) DEFAULT NULL,
  `dateDemande` date DEFAULT NULL,
  `statutDemande` varchar(50) DEFAULT NULL,
  `idCandidat` int(11) DEFAULT NULL,
  `idAdministrateur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `demande_recruteur`
--

CREATE TABLE `demande_recruteur` (
  `idDemandeRecruteur` int(11) NOT NULL,
  `dateDemande` date DEFAULT NULL,
  `statutDemande` varchar(50) DEFAULT NULL,
  `idCandidat` int(11) DEFAULT NULL,
  `sirenOrganisation` varchar(20) DEFAULT NULL,
  `idAdministrateur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `document_candidature`
--

CREATE TABLE `document_candidature` (
  `idDocument` int(11) NOT NULL,
  `nomFichier` varchar(255) DEFAULT NULL,
  `typeDocument` varchar(100) DEFAULT NULL,
  `cheminStockage` varchar(255) DEFAULT NULL,
  `dateDepot` date DEFAULT NULL,
  `idCandidature` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fiche_poste`
--

CREATE TABLE `fiche_poste` (
  `idFichePoste` int(11) NOT NULL,
  `intitule` varchar(150) DEFAULT NULL,
  `statutPoste` varchar(50) DEFAULT NULL,
  `responsableHierarchique` varchar(150) DEFAULT NULL,
  `typeMetier` varchar(100) DEFAULT NULL,
  `lieuMission` varchar(150) DEFAULT NULL,
  `rythme` varchar(100) DEFAULT NULL,
  `fourchetteSalaire` varchar(100) DEFAULT NULL,
  `missionsActivites` text DEFAULT NULL,
  `competencesAttendues` text DEFAULT NULL,
  `sirenOrganisation` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `offre_emploi`
--

CREATE TABLE `offre_emploi` (
  `idOffre` int(11) NOT NULL,
  `dateCreation` date DEFAULT NULL,
  `datePublication` date DEFAULT NULL,
  `dateValidite` date DEFAULT NULL,
  `statutOffre` varchar(50) DEFAULT NULL,
  `piecesDemandees` text DEFAULT NULL,
  `nbPiecesDemandees` int(11) DEFAULT NULL,
  `idRecruteur` int(11) DEFAULT NULL,
  `idFichePoste` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `organisation`
--

CREATE TABLE `organisation` (
  `siren` varchar(20) NOT NULL,
  `nom` varchar(150) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `siegeSocial` varchar(255) DEFAULT NULL,
  `idDemandeOrganisationSource` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `recruteur`
--

CREATE TABLE `recruteur` (
  `idRecruteur` int(11) NOT NULL,
  `sirenOrganisation` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `idUtilisateur` int(11) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `motDePasseHash` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `codePostal` varchar(20) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `dateCreation` datetime DEFAULT NULL,
  `statutCompte` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`idUtilisateur`, `nom`, `prenom`, `email`, `motDePasseHash`, `telephone`, `adresse`, `codePostal`, `ville`, `dateCreation`, `statutCompte`) VALUES
(1, 'Ali', 'Ben', 'ali@test.com', 'mdp123', '0612345678', '12 rue des Fleurs', '60200', 'Lille', '2026-03-26 00:00:00', 'actif'),
(5, 'Nadia', 'Dupont', 'nadia@test.com', 'mdp456', '0698765432', '8 avenue Victor Hugo', '75015', 'Paris', '2026-03-26 00:00:00', 'actif'),
(6, 'Admin', 'Site', 'admin@test.com', 'admin123', '0600000000', '1 place Centrale', '59000', 'Lille', '2026-03-26 00:00:00', 'actif');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `administrateur`
--
ALTER TABLE `administrateur`
  ADD PRIMARY KEY (`idAdministrateur`);

--
-- Index pour la table `candidat`
--
ALTER TABLE `candidat`
  ADD PRIMARY KEY (`idCandidat`);

--
-- Index pour la table `candidature`
--
ALTER TABLE `candidature`
  ADD PRIMARY KEY (`idCandidature`),
  ADD UNIQUE KEY `idCandidat` (`idCandidat`,`idOffre`),
  ADD KEY `idOffre` (`idOffre`);

--
-- Index pour la table `demande_organisation`
--
ALTER TABLE `demande_organisation`
  ADD PRIMARY KEY (`idDemandeOrganisation`),
  ADD KEY `idCandidat` (`idCandidat`),
  ADD KEY `idAdministrateur` (`idAdministrateur`);

--
-- Index pour la table `demande_recruteur`
--
ALTER TABLE `demande_recruteur`
  ADD PRIMARY KEY (`idDemandeRecruteur`),
  ADD KEY `idCandidat` (`idCandidat`),
  ADD KEY `sirenOrganisation` (`sirenOrganisation`),
  ADD KEY `idAdministrateur` (`idAdministrateur`);

--
-- Index pour la table `document_candidature`
--
ALTER TABLE `document_candidature`
  ADD PRIMARY KEY (`idDocument`),
  ADD KEY `idCandidature` (`idCandidature`);

--
-- Index pour la table `fiche_poste`
--
ALTER TABLE `fiche_poste`
  ADD PRIMARY KEY (`idFichePoste`),
  ADD KEY `sirenOrganisation` (`sirenOrganisation`);

--
-- Index pour la table `offre_emploi`
--
ALTER TABLE `offre_emploi`
  ADD PRIMARY KEY (`idOffre`),
  ADD KEY `idRecruteur` (`idRecruteur`),
  ADD KEY `idFichePoste` (`idFichePoste`);

--
-- Index pour la table `organisation`
--
ALTER TABLE `organisation`
  ADD PRIMARY KEY (`siren`),
  ADD UNIQUE KEY `idDemandeOrganisationSource` (`idDemandeOrganisationSource`);

--
-- Index pour la table `recruteur`
--
ALTER TABLE `recruteur`
  ADD PRIMARY KEY (`idRecruteur`),
  ADD KEY `sirenOrganisation` (`sirenOrganisation`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`idUtilisateur`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `candidature`
--
ALTER TABLE `candidature`
  MODIFY `idCandidature` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `demande_organisation`
--
ALTER TABLE `demande_organisation`
  MODIFY `idDemandeOrganisation` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `demande_recruteur`
--
ALTER TABLE `demande_recruteur`
  MODIFY `idDemandeRecruteur` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `document_candidature`
--
ALTER TABLE `document_candidature`
  MODIFY `idDocument` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `fiche_poste`
--
ALTER TABLE `fiche_poste`
  MODIFY `idFichePoste` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `offre_emploi`
--
ALTER TABLE `offre_emploi`
  MODIFY `idOffre` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `idUtilisateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `administrateur`
--
ALTER TABLE `administrateur`
  ADD CONSTRAINT `administrateur_ibfk_1` FOREIGN KEY (`idAdministrateur`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `candidat`
--
ALTER TABLE `candidat`
  ADD CONSTRAINT `candidat_ibfk_1` FOREIGN KEY (`idCandidat`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `candidature`
--
ALTER TABLE `candidature`
  ADD CONSTRAINT `candidature_ibfk_1` FOREIGN KEY (`idCandidat`) REFERENCES `candidat` (`idCandidat`),
  ADD CONSTRAINT `candidature_ibfk_2` FOREIGN KEY (`idOffre`) REFERENCES `offre_emploi` (`idOffre`);

--
-- Contraintes pour la table `demande_organisation`
--
ALTER TABLE `demande_organisation`
  ADD CONSTRAINT `demande_organisation_ibfk_1` FOREIGN KEY (`idCandidat`) REFERENCES `candidat` (`idCandidat`),
  ADD CONSTRAINT `demande_organisation_ibfk_2` FOREIGN KEY (`idAdministrateur`) REFERENCES `administrateur` (`idAdministrateur`);

--
-- Contraintes pour la table `demande_recruteur`
--
ALTER TABLE `demande_recruteur`
  ADD CONSTRAINT `demande_recruteur_ibfk_1` FOREIGN KEY (`idCandidat`) REFERENCES `candidat` (`idCandidat`),
  ADD CONSTRAINT `demande_recruteur_ibfk_2` FOREIGN KEY (`sirenOrganisation`) REFERENCES `organisation` (`siren`),
  ADD CONSTRAINT `demande_recruteur_ibfk_3` FOREIGN KEY (`idAdministrateur`) REFERENCES `administrateur` (`idAdministrateur`);

--
-- Contraintes pour la table `document_candidature`
--
ALTER TABLE `document_candidature`
  ADD CONSTRAINT `document_candidature_ibfk_1` FOREIGN KEY (`idCandidature`) REFERENCES `candidature` (`idCandidature`);

--
-- Contraintes pour la table `fiche_poste`
--
ALTER TABLE `fiche_poste`
  ADD CONSTRAINT `fiche_poste_ibfk_1` FOREIGN KEY (`sirenOrganisation`) REFERENCES `organisation` (`siren`);

--
-- Contraintes pour la table `offre_emploi`
--
ALTER TABLE `offre_emploi`
  ADD CONSTRAINT `offre_emploi_ibfk_1` FOREIGN KEY (`idRecruteur`) REFERENCES `recruteur` (`idRecruteur`),
  ADD CONSTRAINT `offre_emploi_ibfk_2` FOREIGN KEY (`idFichePoste`) REFERENCES `fiche_poste` (`idFichePoste`);

--
-- Contraintes pour la table `recruteur`
--
ALTER TABLE `recruteur`
  ADD CONSTRAINT `recruteur_ibfk_1` FOREIGN KEY (`idRecruteur`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `recruteur_ibfk_2` FOREIGN KEY (`sirenOrganisation`) REFERENCES `organisation` (`siren`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
