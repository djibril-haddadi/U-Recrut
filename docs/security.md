# Security notes

This project includes a short security hardening track (course module). Focus is on **defenses**, not on publishing attack recipes.

## Implemented protections

| Topic | Approach |
|-------|----------|
| Password storage | `bcrypt` hashing |
| Injection | Prefer parameterized / careful query construction in models |
| Brute force | `express-rate-limit` on sensitive routes |
| Access control | Session + role checks on protected pages |
| Secrets | DB credentials via `.env` (see `.env.example`) — never hardcode |

## Automated tests

Security-focused tests use **Jest + Supertest** with mocked models (no UTC DB required):

- access control (roles / redirects / 403)
- login SQL-injection payloads rejected
- brute-force rate limiting (HTTP 429)
- session helper unit checks

```bash
cd app
npm test
```

## Important

Rotate any credentials that were previously committed in older revisions of this repository, and keep `.env` out of Git.
