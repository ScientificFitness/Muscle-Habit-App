/** Positive reinforcement copy — encouraging, zero guilt. */

export const WELCOME_MESSAGES = [
  "Good to see you. Consistency looks good on you.",
  "Welcome back. One session at a time builds the habit.",
  "You're here — that's the hard part already started.",
  "Ready when you are. Small reps, big compound interest.",
  "Another day, another chance to stack the win.",
  "Hey. Your future self already thanks you for showing up.",
  "Muscle Habit is open. Let's make today count.",
  "Back at it. Progress prefers people who return.",
  "Glad you're here. Training is a practice, not a test.",
  "Welcome. Strong habits start with ordinary Tuesdays.",
  "You showed up again. That's Habit Strength in action.",
  "Nice to see you. We'll keep it focused and doable.",
  "Clock in. Leave the pressure at the door.",
  "Your program is waiting — no drama, just work.",
  "Steady beats spectacular. Let's train.",
  "Hello again. Momentum likes repeat visits.",
  "You're building something quiet and durable.",
  "Welcome back, coach's favorite kind of athlete: consistent.",
  "One good session is enough for today.",
  "The bar doesn't judge. Neither do we. Let's go.",
  "Fresh open, clear head. Pick up where you left off.",
  "Habit check: you're here. That's a win already.",
  "Training day energy — calm, capable, ready.",
  "Back in the lab. Small adjustments, honest effort.",
];

export const WORKOUT_PRAISE = [
  (name: string) => `Solid work on ${name}. Logged and locked in.`,
  (name: string) => `${name} done. That's another brick in the wall.`,
  (name: string) => `Nice session — ${name} is in the books.`,
  (name: string) => `You finished ${name}. Recovery starts now; pride can linger.`,
  (name: string) => `${name} complete. Consistency > intensity theater.`,
];

export const WEIGH_IN_PRAISE = [
  "Weigh-in logged. Data helps us coach you better.",
  "Thanks for the check-in. Trends over single days.",
  "Number noted. We'll watch the four-week trend, not the scale mood.",
];

export const STREAK_PHRASES = [
  (weeks: number) => `You've trained ${weeks} week${weeks === 1 ? "" : "s"} in a row.`,
  (weeks: number) => `${weeks} straight week${weeks === 1 ? "" : "s"} of showing up. Quietly powerful.`,
  (weeks: number) => `Habit streak: ${weeks} week${weeks === 1 ? "" : "s"}. Keep stacking.`,
];

export function pickWelcome(seed?: number): string {
  const i =
    typeof seed === "number"
      ? seed % WELCOME_MESSAGES.length
      : Math.floor(Math.random() * WELCOME_MESSAGES.length);
  return WELCOME_MESSAGES[i];
}

export function pickWorkoutPraise(sessionName: string): string {
  const fn = WORKOUT_PRAISE[Math.floor(Math.random() * WORKOUT_PRAISE.length)];
  return fn(sessionName);
}

export function pickWeighInPraise(): string {
  return WEIGH_IN_PRAISE[Math.floor(Math.random() * WEIGH_IN_PRAISE.length)];
}

export function formatStreak(weeks: number): string {
  if (weeks <= 0) return "Fresh start — every streak begins with session one.";
  const fn = STREAK_PHRASES[Math.floor(Math.random() * STREAK_PHRASES.length)];
  return fn(weeks);
}

/**
 * Habit Strength 0–100.
 * Grows with completed sessions; decays gently with idle days.
 */
export function updateHabitStrength(
  current: number,
  opts: { completedWorkout?: boolean; idleDays?: number; weighIn?: boolean }
): number {
  let next = current;
  if (opts.completedWorkout) next += 4;
  if (opts.weighIn) next += 1;
  if (opts.idleDays && opts.idleDays > 3) {
    next -= Math.min(8, (opts.idleDays - 3) * 1.5);
  }
  return Math.max(0, Math.min(100, Math.round(next)));
}

export function trainingStreakWeeks(
  workoutDates: string[]
): number {
  if (workoutDates.length === 0) return 0;
  const weeks = new Set(
    workoutDates.map((d) => {
      const dt = new Date(d);
      const onejan = new Date(dt.getFullYear(), 0, 1);
      return `${dt.getFullYear()}-W${Math.ceil(
        ((dt.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
      )}`;
    })
  );
  // Count consecutive weeks ending at current week
  const sorted = [...workoutDates].sort();
  const latest = new Date(sorted[sorted.length - 1]);
  let streak = 0;
  const cursor = new Date(latest);
  for (;;) {
    const weekStart = startOfWeek(cursor);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const has = workoutDates.some((d) => {
      const t = new Date(d).getTime();
      return t >= weekStart.getTime() && t < weekEnd.getTime();
    });
    if (!has) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 7);
    if (streak > 52) break;
  }
  void weeks;
  return streak;
}

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}
