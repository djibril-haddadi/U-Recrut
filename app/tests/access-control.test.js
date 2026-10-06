
jest.mock('../model/utilisateur');
jest.mock('../model/candidat');
jest.mock('../model/recruteur');
jest.mock('../model/administrateur');
jest.mock('../model/candidature');
jest.mock('../model/offre_emploi');
jest.mock('../model/fiche_poste');
jest.mock('../model/organisation');
jest.mock('../model/demande_recruteur');

const request = require('supertest');
const utilisateur = require('../model/utilisateur');
const candidat = require('../model/candidat');
const recruteur = require('../model/recruteur');
const administrateur = require('../model/administrateur');
const candidature = require('../model/candidature');
const offreEmploi = require('../model/offre_emploi');
const { buildUser } = require('./helpers/users');

process.env.SESSION_SECRET = 'test-secret';
process.env.LOGIN_MAX_ATTEMPTS = '100';

const app = require('../app');

async function loginAs(agent, user, role) {
  utilisateur.readAll.mockResolvedValue([user]);
  candidat.readAll.mockResolvedValue(role === 'candidat' ? [{ idCandidat: user.idUtilisateur }] : []);
  recruteur.readAll.mockResolvedValue(role === 'recruteur' ? [{ idRecruteur: user.idUtilisateur }] : []);
  administrateur.readAll.mockResolvedValue(
    role === 'admin' ? [{ idAdministrateur: user.idUtilisateur }] : []
  );

  candidature.readAll.mockResolvedValue([]);
  offreEmploi.readAll.mockResolvedValue([]);

  const res = await agent
    .post('/auth/login')
    .type('form')
    .send({ email: user.email, password: user.password })
    .redirects(0);

  expect(res.status).toBe(302);
  return res;
}

describe('U-Recrut access control', () => {
  test('unauthenticated user is redirected to login on /dashboard/candidat', async () => {
    const res = await request(app).get('/dashboard/candidat').redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/auth/login');
  });

  test('unauthenticated user cannot open admin users page', async () => {
    const res = await request(app).get('/admin/users');

    expect(res.status).toBe(403);
    expect(res.text).toMatch(/administrateurs/i);
  });

  test('candidate cannot access /admin/users', async () => {
    const user = await buildUser({ email: 'candidate@test.com', role: 'candidat' });
    const agent = request.agent(app);
    await loginAs(agent, user, 'candidat');

    const res = await agent.get('/admin/users');

    expect(res.status).toBe(403);
    expect(res.text).toMatch(/administrateurs/i);
  });

  test('candidate cannot access /dashboard/admin', async () => {
    const user = await buildUser({ email: 'candidate2@test.com', role: 'candidat' });
    const agent = request.agent(app);
    await loginAs(agent, user, 'candidat');

    candidat.readAll.mockResolvedValue([{ idCandidat: user.idUtilisateur }]);

    const res = await agent.get('/dashboard/admin');

    expect(res.status).toBe(403);
    expect(res.text).toMatch(/admin/i);
  });

  test('recruiter cannot access candidate dashboard', async () => {
    const user = await buildUser({
      id: 2,
      email: 'recruiter@test.com',
      role: 'recruteur',
    });
    const agent = request.agent(app);
    await loginAs(agent, user, 'recruteur');

    const res = await agent.get('/dashboard/candidat');

    expect(res.status).toBe(403);
    expect(res.text).toMatch(/candidats/i);
  });

  test('candidate can open /dashboard/candidat', async () => {
    const user = await buildUser({
      id: 3,
      email: 'ok-candidate@test.com',
      role: 'candidat',
    });
    const agent = request.agent(app);
    await loginAs(agent, user, 'candidat');

    candidat.readAll.mockResolvedValue([{ idCandidat: user.idUtilisateur }]);
    candidature.readAll.mockResolvedValue([]);
    offreEmploi.readAll.mockResolvedValue([]);

    const res = await agent.get('/dashboard/candidat');

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Tableau de bord|U-Recrut|candidat/i);
  });
});
