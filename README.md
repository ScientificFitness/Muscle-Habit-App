# Muscle Habit

Adaptive fitness coaching for busy professionals (28–50). Build or pick a 12-week program, log lifts and weigh-ins, and let an evidence-based engine adjust volume, loads, and deloads — with research updates from **The Habit Lab**.

No account. No backend. Everything stays in your browser (`localStorage`).

## Brand

- **Navy** `#2B3B4C` carries the message
- **Orange** `#FF4A00` triggers the action
- Logo: [`public/muscle-habit-logo.png`](public/muscle-habit-logo.png)
- Shop link (nav): configurable in Settings — default `https://musclehabit.shop`

## Quick start

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Screenshots

Captured from the local demo (`docs/screenshots/`):

| Step | File |
| --- | --- |
| Onboarding baseline | `01-onboarding-baseline.webp` |
| Dashboard welcome + predictor | `02-dashboard-welcome.webp` |
| Program activated | `03-program-activated.webp` |
| My Numbers + e1RM | `04-my-numbers-entries.webp` |
| Workout complete | `05-workout-complete.webp` |
| Adaptation changelog | `06-dashboard-changelog.webp` |
| Habit Lab apply | `07-habit-lab-research-applied.webp` |
| Coach Builder | `08-coach-builder-dialogue.webp` |

## 3-minute demo script

1. **Onboarding (45s)** — Enter baseline, returning lifter, 3×45 min, full gym, goal “both”. Enter the app.
2. **My Numbers (45s)** — Log current weight. Add bench as **working weight** 60 kg × 8 → show estimated 1RM. Skip other lifts.
3. **Programs (40s)** — Activate **Time-Crunch Full Body** (or build one in Coach Builder: muscle → back weak point → accept structure → save).
4. **Train (40s)** — Start today’s session, log top sets at the high end of the rep range, recovery 4, finish — celebrate.
5. **Dashboard + Lab (30s)** — Show weight projection disclaimer, Habit Strength, adaptation changelog. Open Habit Lab and apply one research update.

## Stack

- Next.js App Router · TypeScript · Tailwind CSS v4
- Recharts · React Context + localStorage
- Installable PWA (manifest + icons)

## Docs

See [`docs/architecture.md`](docs/architecture.md) for module map, adaptation rules, and how to add Habit Lab entries via JSON only.
