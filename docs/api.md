# Main routes (overview)

Base URL: `http://localhost:3000`

Exact paths live in `app/routes/`. Below is a recruiter-friendly map of the surface area.

| Area | Examples | Purpose |
|------|----------|---------|
| Auth | `/auth/login`, `/auth/register`, logout | Sign-in / sign-up |
| Public | `/`, offers list | Browse jobs |
| Candidate | applications, dashboard | Apply and track |
| Recruiter | create/manage offers, review applications | Hiring workflow |
| Admin | users, organisations, moderation | Platform admin |

For implementation details, open the corresponding files in `app/routes/` (`auth.js`, `offre.js`, `candidature.js`, `dashboard.js`, `admin.js`, `users.js`).
