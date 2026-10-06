# Architecture

U-Recrut follows a classic **MVC** layout inside `app/`.

```text
Request → routes/ → model/ → views/ (EJS)
```

## Layers

| Folder | Role |
|--------|------|
| `routes/` | HTTP handlers (auth, offers, applications, admin, dashboard) |
| `model/` | MySQL access per domain entity (user, offer, candidature, …) |
| `views/` | Server-rendered pages (EJS) |
| `public/` | CSS, images, uploaded application documents |
| `session.js` | Session configuration |
| `tests/` | Jest + Supertest security checks |

## Main domain entities

- User / Candidate / Recruiter / Admin  
- Organisation  
- Job offer (`offre_emploi`) / job sheet (`fiche_poste`)  
- Application (`candidature`) + uploaded documents  

See also `docs/design/data-model/` (MCD / MLD PlantUML sources and diagrams).
