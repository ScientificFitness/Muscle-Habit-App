import type { PersonalProfile, Sex, WeighIn } from "./types";

/** Epley estimated 1RM from working weight + reps. */
export function estimate1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}

/** Mifflin–St Jeor BMR (kcal/day). */
export function mifflinStJeor(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === "female") return base - 161;
  if (sex === "male") return base + 5;
  // Midpoint for "other"
  return base - 78;
}

/** Activity multiplier from training days/week. */
export function activityMultiplier(daysPerWeek: number): number {
  if (daysPerWeek <= 2) return 1.375;
  if (daysPerWeek <= 4) return 1.55;
  if (daysPerWeek <= 5) return 1.725;
  return 1.9;
}

export function maintenanceCalories(profile: PersonalProfile): number {
  const bmr = mifflinStJeor(
    profile.sex,
    profile.currentWeightKg,
    profile.heightCm,
    profile.age
  );
  return Math.round(bmr * activityMultiplier(profile.daysPerWeek));
}

/**
 * Sustainable deficit ~20% below maintenance.
 * Cap rate of loss at ~0.5–1% bodyweight / week (~0.75% default).
 */
export function targetCalories(
  profile: PersonalProfile,
  deficitPercent = 20
): { calories: number; weeklyLossKg: number; capped: boolean } {
  const maintenance = maintenanceCalories(profile);
  let calories = Math.round(maintenance * (1 - deficitPercent / 100));
  // ~7700 kcal ≈ 1 kg fat
  let weeklyLossKg = ((maintenance - calories) * 7) / 7700;
  const maxWeekly = profile.currentWeightKg * 0.01; // 1% BW/week hard cap
  const preferredMax = profile.currentWeightKg * 0.0075;
  let capped = false;
  if (weeklyLossKg > preferredMax) {
    weeklyLossKg = preferredMax;
    calories = Math.round(maintenance - (weeklyLossKg * 7700) / 7);
    capped = true;
  }
  if (weeklyLossKg > maxWeekly) {
    weeklyLossKg = maxWeekly;
    calories = Math.round(maintenance - (weeklyLossKg * 7700) / 7);
    capped = true;
  }
  // Floor: never below BMR
  const bmr = mifflinStJeor(
    profile.sex,
    profile.currentWeightKg,
    profile.heightCm,
    profile.age
  );
  if (calories < bmr) {
    calories = Math.round(bmr);
    weeklyLossKg = Math.max(0, ((maintenance - calories) * 7) / 7700);
    capped = true;
  }
  return {
    calories,
    weeklyLossKg: Math.round(weeklyLossKg * 100) / 100,
    capped,
  };
}

export interface WeightProjectionPoint {
  week: number;
  projected: number;
  low: number;
  high: number;
  actual?: number;
}

/** 12-week weight projection with confidence band. */
export function projectWeight(
  profile: PersonalProfile,
  weighIns: WeighIn[],
  deficitPercent = 20
): {
  points: WeightProjectionPoint[];
  realisticGoalKg: number;
  goalIsRealistic: boolean;
  message: string;
} {
  const { weeklyLossKg, capped } = targetCalories(profile, deficitPercent);
  const start = profile.currentWeightKg;
  const goal = profile.goalWeightKg;
  const isLoss = goal < start;
  const weeksNeeded = isLoss
    ? (start - goal) / Math.max(weeklyLossKg, 0.01)
    : (goal - start) / Math.max(weeklyLossKg * 0.5, 0.01);

  const goalIsRealistic = weeksNeeded <= 16;
  const realisticGoalKg = isLoss
    ? Math.round((start - weeklyLossKg * 12) * 10) / 10
    : Math.round((start + weeklyLossKg * 0.4 * 12) * 10) / 10;

  const points: WeightProjectionPoint[] = [];
  for (let w = 0; w <= 12; w++) {
    const delta = isLoss ? -weeklyLossKg * w : weeklyLossKg * 0.4 * w;
    const projected = Math.round((start + delta) * 10) / 10;
    const band = 0.5 + w * 0.15;
    points.push({
      week: w,
      projected,
      low: Math.round((projected - band) * 10) / 10,
      high: Math.round((projected + band) * 10) / 10,
    });
  }

  // Overlay actual weigh-ins if we have history relative to first weigh-in / today
  if (weighIns.length > 0) {
    const sorted = [...weighIns].sort((a, b) => a.date.localeCompare(b.date));
    const origin = new Date(sorted[0].date).getTime();
    for (const wi of sorted) {
      const week =
        Math.round(
          ((new Date(wi.date).getTime() - origin) / (7 * 86400000)) * 10
        ) / 10;
      if (week >= 0 && week <= 12) {
        const nearest = points.reduce((best, p) =>
          Math.abs(p.week - week) < Math.abs(best.week - week) ? p : best
        );
        nearest.actual = wi.weightKg;
      }
    }
  }

  let message =
    "Projections, not promises. Your body adjusts — we re-check every week.";
  if (!goalIsRealistic && isLoss) {
    message = `Your goal of ${goal} kg is ambitious for 12 weeks. A healthy target near ${realisticGoalKg} kg keeps progress sustainable.`;
  } else if (capped) {
    message =
      "We capped the deficit so fat loss stays near 0.5–1% of body weight per week.";
  }

  return { points, realisticGoalKg, goalIsRealistic, message };
}

/** 4-week rolling body-weight trend (kg/week). Negative = losing. */
export function weightTrendKgPerWeek(weighIns: WeighIn[]): number | null {
  if (weighIns.length < 2) return null;
  const cutoff = Date.now() - 28 * 86400000;
  const recent = [...weighIns]
    .filter((w) => new Date(w.date).getTime() >= cutoff)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (recent.length < 2) {
    const all = [...weighIns].sort((a, b) => a.date.localeCompare(b.date));
    if (all.length < 2) return null;
    const first = all[0];
    const last = all[all.length - 1];
    const weeks =
      (new Date(last.date).getTime() - new Date(first.date).getTime()) /
      (7 * 86400000);
    if (weeks < 0.5) return null;
    return (last.weightKg - first.weightKg) / weeks;
  }
  const first = recent[0];
  const last = recent[recent.length - 1];
  const weeks =
    (new Date(last.date).getTime() - new Date(first.date).getTime()) /
    (7 * 86400000);
  if (weeks < 0.5) return null;
  return Math.round(((last.weightKg - first.weightKg) / weeks) * 100) / 100;
}

export function kgToLb(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbToKg(lb: number): number {
  return Math.round((lb / 2.20462) * 10) / 10;
}

export function cmToIn(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}

export function inToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}
