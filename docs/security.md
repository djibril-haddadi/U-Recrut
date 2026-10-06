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

```bash
cd app && npm test
```

- `tests/access-control.test.js`  
- `tests/sql-injection.test.js`  
- `tests/brute-force.test.js`  

## Important

Rotate any credentials that were previously committed in older revisions of this repository, and keep `.env` out of Git.
