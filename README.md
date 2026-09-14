# RV University Placements — Website Revamp

A concept redesign of the [RV University Placements page](https://rvu.edu.in/placements/), built for the **RVU Placement Website Revamp Competition 2026**.

Submitted by **Team MJ** — Jishnu & Misha.

## About

This is a multi-page, static site that reimagines the placements page for three audiences the brief calls out explicitly — students, corporate recruiters, and parents — with a persona switcher, real placement data pulled from RVU's own published figures, and RVU's actual brand colors, typography, and photography.

Pages:
- `index.html` — Home, with a student/recruiter/parent persona switcher
- `students.html` — Eligibility, training, the full placement process, internships, FAQs
- `recruiters.html` — School-wise eligible talent, outcome data, how to recruit, a recruiter enquiry form
- `parents.html` — Outcomes dashboard, governance explained in plain language, FAQs
- `contact.html` — Corporate & Alumni Relations (CAR) office details and a contact form

## Tech

Plain **HTML, CSS, and JavaScript** — no frameworks, no build step, no dependencies. Fonts (Playfair Display, Montserrat) load from Google Fonts; everything else is self-contained.

```
placements/
├── index.html
├── students.html
├── recruiters.html
├── parents.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    └── img/          # RVU logo + real campus/placement photography
```

## Running locally

No build step needed — just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```
npx serve .
```

## Deploying to GitHub Pages

1. Push this repo to GitHub with these files at the **repository root** (not nested in a subfolder — a common issue when uploading via the GitHub web UI drag-and-drop).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`, **Branch** to `main` / `(root)`, then **Save**.
4. The site will be live at `https://<username>.github.io/<repo-name>/` within a minute or two.

The included `.nojekyll` file tells GitHub Pages to serve the site as-is, skipping Jekyll processing.

## Notes

- Placement statistics, school-wise eligibility figures, and rules & regulations are sourced from RVU's own published placements page as of 2026, used here as illustrative content for the competition entry.
- This is a competition concept entry, not RV University's official website.
