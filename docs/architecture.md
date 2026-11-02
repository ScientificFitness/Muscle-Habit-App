# Muscle Habit — Architecture

## Overview

Muscle Habit is a client-only Next.js App Router product. All user data lives in `localStorage` under the key `muscle-habit-v1`. There is no backend and no login.

```
src/
  app/           # Routes (onboarding, dashboard, programs, workout, numbers, lab, settings)
  components/    # UI + feature components
  context/       # AppProvider — single source of truth
  data/          # Seed JSON (programs, research)
  lib/           # Pure domain logic (formulas, adaptation, coach, reinforcement)
docs/            # This folder
```

## Data flow

1. `AppProvider` hydrates state from `localStorage` on mount.
2. Feature pages call context methods (`logWorkout`, `addLiftEntry`, `applyResearch`, …).
3. Context persists after every state change.
4. `runAdaptations()` in `lib/adaptation.ts` inspects logs + weigh-ins and may rewrite the active program, appending entries to the adaptation changelog.

## Feature map

| Feature | Primary modules |
| --- | --- |
| Onboarding + My Numbers | `app/onboarding`, `app/numbers`, `lib/formulas` (Epley 1RM) |
| Programs + Coach Builder | `data/programs.json`, `app/programs`, `lib/coach.ts`, `lib/programs.ts` |
| Adaptive engine | `lib/adaptation.ts` — double progression, volume 10–20, plateau, deload, goal trend |
| Weight-loss predictor | `lib/formulas.ts` (`projectWeight`, Mifflin–St Jeor) + Recharts on dashboard |
| Habit Lab | `data/research.json` + `app/lab` — apply/dismiss without code changes |
| Positive reinforcement | `lib/reinforcement.ts` — welcome bank, praise, Habit Strength |

## Brand tokens

Defined in `src/app/globals.css`:

- Navy `#2B3B4C` — headlines & primary text
- Orange `#FF4A00` — actions only (never large orange body copy)
- Mid Slate `#6B7C8F` — disclaimers & secondary
- Heading font: Oswald · Body: Source Sans 3
- Logo: `public/muscle-habit-logo.png` (stacked MUSCLE navy / HABIT orange), via `BrandLogo`

## Extending research updates

Append objects to `src/data/research.json` with:

`id`, `date`, `title`, `summary`, `source`, `ruleTarget`, `proposedChange{ setting, from, to, explanation }`

The Lab UI and notification banner pick them up automatically.

## PWA

`app/manifest.ts` + icons in `public/icons` make the app installable. Data remains local to the browser profile.
