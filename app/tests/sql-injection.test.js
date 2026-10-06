
jest.mock('../model/utilisateur');
jest.mock('../model/candidat');
jest.mock('../model/recruteur');
jest.mock('../model/administrateur');

const request = require('supertest');
const utilisateur = require('../model/utilisateur');
const candidat = require('../model/candidat');
const recruteur = require('../model/recruteur');
const administrateur = require('../model/administrateur');
const { buildUser } = require('./helpers/users');

process.env.SESSION_SECRET = 'test-secret';
process.env.LOGIN_MAX_ATTEMPTS = '100';

const app = require('../app');

describe('U-Recrut SQL injection resistance (login)', () => {
  beforeEach(() => {
    candidat.readAll.mockResolvedValue([]);
    recruteur.readAll.mockResolvedValue([]);
    administrateur.readAll.mockResolvedValue([]);
  });

  test('OR 1=1 style payload does not authenticate', async () => {
    const legit = await buildUser({ email: 'admin@test.com' });
    utilisateur.readAll.mockResolvedValue([legit]);

    const res = await request(app)
      .post('/auth/login')
      .type('form')
      .send({
        email: "admin@test.com' OR '1'='1",
        password: "' OR '1'='1",
      })
      .redirects(0);

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Email ou mot de passe incorrect/i);
    expect(res.headers.location).toBeUndefined();
  });

  test('UNION SELECT payload is treated as a normal email string', async () => {
    utilisateur.readAll.mockResolvedValue([]);

    const res = await request(app)
      .post('/auth/login')
      .type('form')
      .send({
        email: "test@test.com' UNION SELECT * FROM utilisateur--",
        password: 'anything',
      });

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Email ou mot de passe incorrect/i);
  });

  test('DROP TABLE payload does not authenticate', async () => {
    const user = await buildUser({ email: 'safe@test.com' });
    utilisateur.readAll.mockResolvedValue([user]);

    const res = await request(app)
      .post('/auth/login')
      .type('form')
      .send({
        email: "test'; DROP TABLE utilisateur;--",
        password: user.password,
      });

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Email ou mot de passe incorrect/i);
  });

  test('special characters in password do not bypass bcrypt compare', async () => {
    const user = await buildUser({ email: 'user@test.com' });
    utilisateur.readAll.mockResolvedValue([user]);

    const res = await request(app)
      .post('/auth/login')
      .type('form')
      .send({
        email: 'user@test.com',
        password: "' OR 'a'='a",
      });

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Email ou mot de passe incorrect/i);
  });

  test('valid credentials still work (sanity check)', async () => {
    const user = await buildUser({ email: 'ok@test.com', role: 'candidat' });
    utilisateur.readAll.mockResolvedValue([user]);
    candidat.readAll.mockResolvedValue([{ idCandidat: user.idUtilisateur }]);
    recruteur.readAll.mockResolvedValue([]);
    administrateur.readAll.mockResolvedValue([]);

    const res = await request(app)
      .post('/auth/login')
      .type('form')
      .send({ email: user.email, password: user.password })
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/dashboard/candidat');
  });
});
