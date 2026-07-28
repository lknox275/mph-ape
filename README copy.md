# Oncology EHR Mockup

An interactive prototype of an outpatient oncology infusion-clinic EHR,
built as a design + workflow reference (not a production system).

The mockup walks through what a nurse's shift on an infusion floor
actually looks like: check patients in from a dashboard of scheduled
appointments, open the day's encounter, review baseline vs. current
vitals/labs against the patient's own pre-treatment values, run a
CTCAE symptom assessment across the common immune-related adverse
event (irAE) modules, and — when a Grade ≥2 finding shows up — walk
through the escalation flow (nurse notes → provider notification →
provider orders → treatment decision → clinical + patient education
notes).

Everything runs client-side with mock patient data. No backend, no
network calls, no PHI. The point is to make the *interaction and
information architecture* of a real oncology visit concrete enough
to design, critique, and iterate against.

## What's in it

- **Dashboard** — today's schedule with 6 mock patients across
  immunotherapy, chemotherapy, follow-up, and consult visits.
- **Patient list** — every mock patient with cycle, diagnosis, and
  last-visit summary.
- **Patient record** — profile, visit history, labs (with H/L/C flags
  that route through the same CDS severity system as the encounter
  note), medications, documents.
- **Encounter note workflow** — required sequential steps (Baseline
  Comparison → Symptom Assessment → Vitals → Labs → Clearance →
  Infusion → Response → Plan), each gated behind the previous step's
  completion. Locked steps are visibly locked, not silently disabled.
- **Baseline Comparison panel** — patient-specific comparison of
  today's vitals/labs against the patient's own baseline (drawn at
  treatment initiation). Grouped into **Vitals**, **Labs**, and
  **Assessments**, each collapsible.
- **CTCAE symptom assessment** — a wizard covering pneumonitis,
  colitis, skin toxicity, hepatitis, nephritis, diarrhea, and a
  free-text "Other" catch-all with a link to the CTCAE v6 PDF. The
  hepatic and renal modules render **both** CTCAE rule sets side by
  side (ULN-anchored vs. baseline-anchored) with the inactive set
  greyed out, so the nurse can see *why* the grading logic picked
  the rule set it did.
- **Escalation flow (Grade ≥2 findings)** — nurse assessment notes,
  provider notification with an auto-drafted EHR message, a
  read-only display of provider orders (medications, labs, imaging,
  follow-up, consult) synthesized from the findings, treatment
  decision, and separate free-text boxes for clinical notes and
  patient education.

## Stack

- **React 18** + **Vite 6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **lucide-react** for icons
- **TypeScript** — Vite handles the compilation via esbuild;
  `npx tsc --noEmit` is available for a full type check

No UI framework beyond Tailwind + lucide. All components are
hand-rolled to keep the visual system honest.

## Running locally

### Prerequisites

You need **Node.js 18+** (Node 20 or 22 recommended) and npm. If you
don't have Node installed:

- **macOS / Linux**: install [nvm](https://github.com/nvm-sh/nvm) and
  then `nvm install --lts`
- **Windows**: install the LTS from
  [nodejs.org](https://nodejs.org/en/download)
- Or use Homebrew on macOS: `brew install node`

### Install + start

From the project root:

```bash
npm install --legacy-peer-deps
npm run dev
```

Then open **http://localhost:5000/** in a browser.

The `--legacy-peer-deps` flag skips a peer-dependency resolution step
that npm's newer arborist trips on with this dependency tree; you
only need it the first time.

### Other commands

```bash
npm run build       # production bundle to dist/
npm run preview     # serve the production bundle locally
npx tsc --noEmit    # type-check without emitting
```

## Hosting

Because the app is 100% client-side after `npm run build`, you can
deploy it anywhere that serves static files.

### Vercel (recommended, free)

1. Push the repo to GitHub.
2. Sign in at [vercel.com](https://vercel.com/) with your GitHub
   account.
3. Click **Add New Project**, pick this repo. Vercel auto-detects
   Vite, sets `npm run build` as the build command and `dist` as the
   output directory. Deploy.
4. You get a public `*.vercel.app` URL that redeploys on every push.

### Netlify (also free)

Same idea as Vercel — connect GitHub, Netlify auto-detects Vite.
Build command `npm run build`, publish directory `dist`.

### Any static host

Anywhere that serves static files will work: GitHub Pages, Cloudflare
Pages, S3 + CloudFront, Fly.io, an nginx box. Build with
`npm run build` and upload the contents of `dist/`.

### Replit (with a small tweak)

Replit doesn't automatically run `npm install` before starting the
dev server. If you upload the project there:

1. Open the **Shell** tab.
2. Run `npm install --legacy-peer-deps` once.
3. Then use the Run button (which invokes `npm run dev`).

Or edit `.replit`'s `run =` line to
`npm install --legacy-peer-deps && npm run dev`.

## Structure

```
src/
├── main.tsx           # entry point (createRoot + <App />)
├── app/
│   ├── App.tsx        # data, components, wizard, views — one file for now
│   └── types.ts       # every shared type in one place
└── styles/
    ├── index.css      # imports the three below
    ├── fonts.css      # web-font declarations
    ├── tailwind.css   # `@import "tailwindcss"` + preflight
    └── theme.css      # design tokens (colors, severity, grade, spacing)
```

`theme.css` is the single source of truth for the color system —
semantic severity tokens (`--sev-critical/warning/ok/info-*`),
CTCAE grade tokens (`--grade-1..5-fg`), accent/primary palette,
and shared utility classes (`.sev-chip`, `.text-eyebrow`,
`.sidebar-item`, etc.).

## Notes on the CTCAE grading

Hepatic (AST, ALT, bilirubin) and renal (creatinine) modules render
both CTCAE rule sets side-by-side — one anchored to ULN, the other
anchored to baseline or LLN — and grey out whichever doesn't apply
to the current patient. Clicking a grade in the greyed-out column
still selects it but posts a warning banner so the override is
intentional and traceable.

See `HEP_THRESHOLDS`, `autoGradeHepMetric`, and `buildHepGradePair` /
`buildNephritisGradePair` in `App.tsx`. Thresholds match CTCAE v6
(linked from the Other module's detail phase).
