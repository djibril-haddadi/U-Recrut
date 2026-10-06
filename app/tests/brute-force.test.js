/**
 * Brute-force protection on login (U-Recrut)
 *
 * express-rate-limit is configured on POST /auth/login.
 * Tests load the app with a low max so they stay fast.
 */

jest.mock('../model/utilisateur');
jest.mock('../model/candidat');
jest.mock('../model/recruteur');
jest.mock('../model/administrateur');

process.env.SESSION_SECRET = 'test-secret';
process.env.LOGIN_MAX_ATTEMPTS = '5';
process.env.LOGIN_WINDOW_MS = String(15 * 60 * 1000);

const request = require('supertest');
const utilisateur = require('../model/utilisateur');
const candidat = require('../model/candidat');
const recruteur = require('../model/recruteur');
const administrateur = require('../model/administrateur');

const app = require('../app');

describe('U-Recrut brute-force protection', () => {
  beforeEach(() => {
    utilisateur.readAll.mockResolvedValue([]);
    candidat.readAll.mockResolvedValue([]);
    recruteur.readAll.mockResolvedValue([]);
    administrateur.readAll.mockResolvedValue([]);
  });

  test('returns HTTP 429 after too many failed login attempts from the same client', async () => {
    process.env.LOGIN_MAX_ATTEMPTS = '5';
    const agent = request.agent(app);
    const client = 'brute-force-client-1';

    for (let i = 0; i < 5; i += 1) {
      const res = await agent
        .post('/auth/login')
        .set('X-Test-Client', client)
        .type('form')
        .send({ email: 'attacker@test.com', password: `wrong-${i}` });

      expect(res.status).toBe(200);
      expect(res.text).toMatch(/Email ou mot de passe incorrect/i);
    }

    const blocked = await agent
      .post('/auth/login')
      .set('X-Test-Client', client)
      .type('form')
      .send({ email: 'attacker@test.com', password: 'wrong-final' });

    expect(blocked.status).toBe(429);
    expect(blocked.text).toMatch(/Trop de tentatives de connexion/i);
  });
});
