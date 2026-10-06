# U-Recrut

Full-stack **recruitment web platform** connecting candidates, recruiters, and administrators.

Node.js / Express + EJS + MySQL, with role-based access, job listings, applications, and basic security hardening (bcrypt, rate limiting, SQL injection tests).

---

## Features

| Role | Capabilities |
|------|----------------|
| **Candidate** | Browse offers, apply, track applications |
| **Recruiter** | Publish and manage offers, review applications |
| **Admin** | Validate organizations / recruiters, moderate the platform |

**Stack:** Node.js · Express · EJS · MySQL · express-session · bcrypt · multer · Jest

---

## Repository layout

```text
U-Recrut/
├── README.md
├── .env.example
├── app/                      Express application (MVC)
│   ├── routes/               HTTP controllers
│   ├── model/                Data access (MySQL)
│   ├── views/                EJS templates
│   ├── public/               Static assets + uploads
│   ├── tests/                Security-oriented unit/integration tests
│   ├── app.js
│   └── package.json
└── docs/
    ├── architecture.md       MVC overview
    ├── api.md                Main routes
    ├── security.md           Hardening notes
    ├── design/               MCD/MLD, use cases, UI mockups
    └── course-materials/     Original course PDFs (archive)
```

---

## Quick start

### Requirements

- Node.js 18+
- MySQL 8+

### Setup

```bash
cd app
cp .env.example .env
# Edit .env with your MySQL credentials

npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

Optional seed data (if provided in your local DB setup):

```bash
# Import schema/seed into MySQL as needed for your environment
```

### Tests

```bash
cd app
npm test
```

Security-focused tests cover access control, SQL injection patterns, and brute-force / rate limiting behavior.

---

## Architecture (short)

```text
Browser → Express routes → model/*.js (MySQL) → EJS views
                ↑
         session + role checks
```

Design artifacts (PlantUML data model, use cases, HTML/CSS mockups) live under `docs/design/`.

---

## Security highlights

- Passwords hashed with **bcrypt** (not stored in plaintext)
- **Parameterized queries** / careful SQL usage in models
- **Rate limiting** on sensitive auth routes
- Automated checks in `app/tests/`

For more detail, see [docs/security.md](docs/security.md).

---

## Author

**Djibril Haddadi** — [github.com/djibril-haddadi](https://github.com/djibril-haddadi)

Academic project (UTC). Product name: **U-Recrut**.
