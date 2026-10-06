const bcrypt = require('bcrypt');

/**
 * Build a fake user row as returned by the utilisateur model.
 */
async function buildUser({
  id = 1,
  email = 'user@test.com',
  password = 'Password123!',
  role = 'candidat',
  statutCompte = 'actif',
} = {}) {
  const hash = await bcrypt.hash(password, 10);
  return {
    idUtilisateur: id,
    nom: 'Test',
    prenom: 'User',
    email,
    motDePasseHash: hash,
    statutCompte,
    role,
    password,
  };
}

module.exports = { buildUser };
