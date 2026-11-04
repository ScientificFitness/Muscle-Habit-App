import { estimate1RM, todayISO, uid, weightTrendKgPerWeek } from "./formulas";
import type {
  AdaptationEntry,
  AppSettings,
  LiftEntry,
  LiftId,
  PersonalProfile,
  Program,
  ProgramExercise,
  WeighIn,
  WorkoutLog,
} from "./types";

export interface AdaptationResult {
  program: Program;
  entries: AdaptationEntry[];
}

function latest1RM(entries: LiftEntry[], liftId: LiftId): number | null {
  const list = entries
    .filter((e) => e.liftId === liftId)
    .sort((a, b) => b.date.localeCompare(a.date));
  return list[0]?.estimated1RM ?? null;
}

function weeklyTop1RMs(
  logs: WorkoutLog[],
  liftId: LiftId
): { weekKey: string; e1rm: number }[] {
  const byWeek = new Map<string, number>();
  for (const log of logs) {
    const week = log.date.slice(0, 7) + "-W" + weekNumber(log.date);
    for (const ex of log.exercises) {
      if (ex.linkedLift !== liftId) continue;
      for (const s of ex.sets) {
        if (!s.completed || s.weightKg <= 0) continue;
        const e = estimate1RM(s.weightKg, s.reps);
        byWeek.set(week, Math.max(byWeek.get(week) ?? 0, e));
      }
    }
  }
  return [...byWeek.entries()]
    .map(([weekKey, e1rm]) => ({ weekKey, e1rm }))
    .sort((a, b) => a.weekKey.localeCompare(b.weekKey));
}

function weekNumber(iso: string): number {
  const d = new Date(iso);
  const onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(
    ((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
  );
}

function programWeekIndex(logs: WorkoutLog[], programId: string): number {
  const related = logs.filter((l) => l.sessionId.startsWith(programId) || true);
  if (related.length === 0) return 1;
  const first = [...related].sort((a, b) => a.date.localeCompare(b.date))[0];
  const weeks =
    Math.floor(
      (Date.now() - new Date(first.date).getTime()) / (7 * 86400000)
    ) + 1;
  return Math.max(1, Math.min(12, weeks));
}

function bumpExerciseLoad(
  ex: ProgramExercise,
  pct: number
): ProgramExercise {
  return {
    ...ex,
    notes: [
      ex.notes,
      `Working weight +${pct}% (double progression)`,
    ]
      .filter(Boolean)
      .join(" · "),
  };
}

function shrinkVolume(ex: ProgramExercise): ProgramExercise {
  return {
    ...ex,
    sets: Math.max(2, ex.sets - 1),
    notes: [ex.notes, "Volume trimmed toward 10–20 hard sets/muscle"]
      .filter(Boolean)
      .join(" · "),
  };
}

function addVolume(ex: ProgramExercise): ProgramExercise {
  return {
    ...ex,
    sets: Math.min(5, ex.sets + 1),
    notes: [ex.notes, "Volume nudged up within hypertrophy range"]
      .filter(Boolean)
      .join(" · "),
  };
}

function deloadExercise(ex: ProgramExercise): ProgramExercise {
  return {
    ...ex,
    sets: Math.max(2, Math.round(ex.sets * 0.6)),
    repRange: ex.repRange,
    notes: [ex.notes, "Deload: ~60% volume, keep technique crisp"]
      .filter(Boolean)
      .join(" · "),
  };
}

function loadDeload5(ex: ProgramExercise): ProgramExercise {
  return {
    ...ex,
    notes: [ex.notes, "Deload recommended: cut working weight ~5%"]
      .filter(Boolean)
      .join(" · "),
  };
}

function exerciseTargetMap(program: Program): Map<string, [number, number]> {
  const map = new Map<string, [number, number]>();
  for (const s of program.sessions) {
    for (const e of s.exercises) {
      map.set(e.id, e.repRange);
    }
  }
  return map;
}

/** True when a logged session mostly missed the bottom of prescribed rep ranges. */
export function sessionMissedRepTargets(
  log: WorkoutLog,
  program: Program
): boolean {
  const targets = exerciseTargetMap(program);
  let judged = 0;
  let missed = 0;
  for (const ex of log.exercises) {
    const range =
      targets.get(ex.exerciseId) ??
      program.sessions
        .flatMap((s) => s.exercises)
        .find((e) => e.name === ex.name)?.repRange;
    if (!range) continue;
    const completed = ex.sets.filter((s) => s.completed && s.reps > 0);
    if (completed.length === 0) continue;
    judged += 1;
    const hitFloor = completed.some((s) => s.reps >= range[0]);
    if (!hitFloor) missed += 1;
  }
  if (judged === 0) return false;
  return missed / judged >= 0.5;
}

/**
 * Coach Builder / adaptive rule: two consecutive sessions missing the
 * target rep range → suggest a 5% load deload.
 */
export function isMissedRepDeloadRecommended(
  program: Program | null,
  workoutLogs: WorkoutLog[]
): boolean {
  if (!program || workoutLogs.length < 2) return false;
  const recent = [...workoutLogs].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const a = recent[0];
  const b = recent[1];
  return (
    sessionMissedRepTargets(a, program) && sessionMissedRepTargets(b, program)
  );
}

function countHardSetsByMuscle(program: Program): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const session of program.sessions) {
    for (const ex of session.exercises) {
      for (const m of ex.muscleGroups) {
        counts[m] = (counts[m] ?? 0) + ex.sets;
      }
    }
  }
  // Approximate weekly volume = sum across sessions (already weekly template)
  return counts;
}

/**
 * Run evidence-based adaptation rules against the active program.
 * Returns a possibly updated program copy + changelog entries.
 */
export function runAdaptations(input: {
  program: Program;
  profile: PersonalProfile;
  liftEntries: LiftEntry[];
  workoutLogs: WorkoutLog[];
  weighIns: WeighIn[];
  settings: AppSettings;
  existingAdaptations: AdaptationEntry[];
}): AdaptationResult {
  const { profile, liftEntries, workoutLogs, weighIns, settings } = input;
  let program: Program = structuredClone(input.program);
  const entries: AdaptationEntry[] = [];
  const week = programWeekIndex(workoutLogs, program.id);
  const today = todayISO();

  const alreadySaid = (rule: string, withinDays = 7) =>
    input.existingAdaptations.some(
      (a) =>
        a.rule === rule &&
        Date.now() - new Date(a.date).getTime() < withinDays * 86400000
    );

  // --- Scheduled deload at weeks 4 and 8 ---
  if (settings.deloadWeeks.includes(week) && !alreadySaid(`deload_week_${week}`, 10)) {
    program = {
      ...program,
      sessions: program.sessions.map((s) => ({
        ...s,
        exercises: s.exercises.map(deloadExercise),
      })),
    };
    entries.push({
      id: uid("adapt"),
      date: today,
      summary: `Deload week ${week} applied`,
      detail:
        "Scheduled deload: volume cut to ~60% so you recover and come back sharper.",
      rule: `deload_week_${week}`,
    });
  }

  // --- Double progression: hit top of rep range on all sets → +2.5–5% load cue ---
  for (const log of workoutLogs.slice(-5)) {
    for (const ex of log.exercises) {
      if (!ex.linkedLift || ex.sets.length === 0) continue;
      const completed = ex.sets.filter((s) => s.completed);
      if (completed.length === 0) continue;
      // Find matching program exercise rep range
      let target: ProgramExercise | undefined;
      for (const s of program.sessions) {
        target = s.exercises.find((e) => e.id === ex.exerciseId || e.linkedLift === ex.linkedLift);
        if (target) break;
      }
      if (!target) continue;
      const top = target.repRange[1];
      const allHitTop = completed.every((s) => s.reps >= top);
      const rule = `double_prog_${ex.linkedLift}`;
      if (allHitTop && !alreadySaid(rule, 5)) {
        program = {
          ...program,
          sessions: program.sessions.map((s) => ({
            ...s,
            exercises: s.exercises.map((e) =>
              e.linkedLift === ex.linkedLift ? bumpExerciseLoad(e, 2.5) : e
            ),
          })),
        };
        entries.push({
          id: uid("adapt"),
          date: today,
          summary: `Adjusted ${today}: ${ex.name} working weight +2.5%`,
          detail: `You hit the top of the ${target.repRange[0]}–${top} rep range on all sets. Classic double progression — time to nudge the load.`,
          rule,
        });
      }
    }
  }

  // --- Volume guardrails 10–20 hard sets / muscle / week ---
  const volumes = countHardSetsByMuscle(program);
  for (const [muscle, sets] of Object.entries(volumes)) {
    if (sets > settings.volumeMaxSets && !alreadySaid(`vol_high_${muscle}`, 14)) {
      program = {
        ...program,
        sessions: program.sessions.map((s) => ({
          ...s,
          exercises: s.exercises.map((e) =>
            e.muscleGroups.includes(muscle as never) ? shrinkVolume(e) : e
          ),
        })),
      };
      entries.push({
        id: uid("adapt"),
        date: today,
        summary: `Trimmed ${muscle} volume to stay near ${settings.volumeMaxSets} hard sets`,
        detail: `Weekly ${muscle} volume was ~${sets} hard sets. Optimal hypertrophy sits roughly ${settings.volumeMinSets}–${settings.volumeMaxSets}.`,
        rule: `vol_high_${muscle}`,
      });
    } else if (
      // Only nudge true under-dosing (<6). 6–10 is fine for time-crunch blocks.
      sets > 0 &&
      sets < 6 &&
      workoutLogs.length >= 3 &&
      !alreadySaid(`vol_low_${muscle}`, 14)
    ) {
      program = {
        ...program,
        sessions: program.sessions.map((s) => ({
          ...s,
          exercises: s.exercises.map((e) =>
            e.muscleGroups[0] === muscle ? addVolume(e) : e
          ),
        })),
      };
      entries.push({
        id: uid("adapt"),
        date: today,
        summary: `Nudged ${muscle} volume upward`,
        detail: `Weekly ${muscle} volume was ~${sets} hard sets — light even for a maintenance week. Sweet spot for growth is roughly ${settings.volumeMinSets}–${settings.volumeMaxSets}.`,
        rule: `vol_low_${muscle}`,
      });
    }
  }

  // --- Plateau protocol: no e1RM improvement 2 consecutive weeks ---
  const lifts: LiftId[] = ["squat", "bench", "ohp", "deadlift", "row", "pullup"];
  for (const liftId of lifts) {
    const series = weeklyTop1RMs(workoutLogs, liftId);
    if (series.length < 3) continue;
    const a = series[series.length - 3];
    const b = series[series.length - 2];
    const c = series[series.length - 1];
    const flat = c.e1rm <= b.e1rm && b.e1rm <= a.e1rm;
    const rule = `plateau_${liftId}`;
    if (flat && !alreadySaid(rule, 14)) {
      program = {
        ...program,
        sessions: program.sessions.map((s) => ({
          ...s,
          exercises: s.exercises.map((e) => {
            if (e.linkedLift !== liftId) return e;
            const mid = Math.round((e.repRange[0] + e.repRange[1]) / 2);
            return {
              ...e,
              repRange: [Math.max(3, mid - 2), mid + 1] as [number, number],
              notes: [e.notes, "Plateau: swap rep zone & keep effort honest"]
                .filter(Boolean)
                .join(" · "),
            };
          }),
        })),
      };
      entries.push({
        id: uid("adapt"),
        date: today,
        summary: `Plateau protocol on ${liftId}`,
        detail:
          "Estimated 1RM flat for ~2 weeks. We shifted the rep zone and will reassess after a few sessions.",
        rule,
      });
    }
  }

  // --- Missed rep range × 2 sessions → 5% load deload (Coach Builder rule) ---
  if (
    isMissedRepDeloadRecommended(program, workoutLogs) &&
    !alreadySaid("missed_rep_deload_5", 10)
  ) {
    program = {
      ...program,
      sessions: program.sessions.map((s) => ({
        ...s,
        exercises: s.exercises.map(loadDeload5),
      })),
    };
    entries.push({
      id: uid("adapt"),
      date: today,
      summary: "Deload recommended: −5% working weight",
      detail:
        "Two consecutive sessions missed the target rep range. Drop loads ~5%, own the reps, then rebuild.",
      rule: "missed_rep_deload_5",
    });
  }

  // --- Auto deload suggestion: poor recovery + high completion stress ---
  const recentLogs = workoutLogs
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);
  const lowRecovery =
    recentLogs.filter((l) => (l.recoveryScore ?? 5) <= 2).length >= 2;
  if (lowRecovery && !alreadySaid("auto_deload_recovery", 14)) {
    program = {
      ...program,
      sessions: program.sessions.map((s) => ({
        ...s,
        exercises: s.exercises.map(deloadExercise),
      })),
    };
    entries.push({
      id: uid("adapt"),
      date: today,
      summary: "Suggested deload from recovery check-ins",
      detail:
        "Recent recovery scores looked low. We dialed volume down so you can bounce back — not a setback, a strategy.",
      rule: "auto_deload_recovery",
    });
  }

  // --- Goal-specific: fat loss but weight trend flat/up → nudge deficit note ---
  if (
    (profile.goal === "lose_fat" || profile.goal === "both") &&
    !alreadySaid("fat_loss_trend", 10)
  ) {
    const trend = weightTrendKgPerWeek(weighIns);
    if (trend !== null && trend >= -0.1) {
      entries.push({
        id: uid("adapt"),
        date: today,
        summary: "Fat-loss coach note: trend is flat",
        detail:
          "Four-week weight trend isn't moving down yet. Keep protein high, hold training volume, and consider a slightly larger (still sustainable) deficit. No panic — habits first.",
        rule: "fat_loss_trend",
      });
      // Soft programming cue: keep intensity, don't add junk volume
      program = {
        ...program,
        sessions: program.sessions.map((s) => ({
          ...s,
          exercises: s.exercises.map((e) => ({
            ...e,
            notes: [e.notes, "Fat-loss phase: prioritize compound effort"]
              .filter(Boolean)
              .join(" · "),
          })),
        })),
      };
    }
  }

  void latest1RM;
  void liftEntries;

  return { program, entries };
}

export function applyResearchChange(
  program: Program,
  setting: string,
  to: string
): Program {
  const next = structuredClone(program);
  if (setting === "volumeMaxSets" || setting === "volume_cap") {
    // Soft-trim any exercise over 4 sets
    next.sessions = next.sessions.map((s) => ({
      ...s,
      exercises: s.exercises.map((e) => ({
        ...e,
        sets: Math.min(e.sets, 4),
        notes: [e.notes, `Habit Lab: ${to}`].filter(Boolean).join(" · "),
      })),
    }));
  } else if (setting === "rep_zones" || setting.includes("rep")) {
    next.sessions = next.sessions.map((s) => ({
      ...s,
      exercises: s.exercises.map((e) => ({
        ...e,
        notes: [e.notes, `Habit Lab updated rep focus: ${to}`]
          .filter(Boolean)
          .join(" · "),
      })),
    }));
  } else if (setting.includes("deload")) {
    next.sessions = next.sessions.map((s) => ({
      ...s,
      exercises: s.exercises.map((e) => ({
        ...e,
        notes: [e.notes, `Habit Lab deload guidance: ${to}`]
          .filter(Boolean)
          .join(" · "),
      })),
    }));
  } else {
    next.sessions = next.sessions.map((s) => ({
      ...s,
      exercises: s.exercises.map((e) => ({
        ...e,
        notes: [e.notes, `Habit Lab: ${to}`].filter(Boolean).join(" · "),
      })),
    }));
  }
  return next;
}
