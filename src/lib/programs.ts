import templates from "@/data/programs.json";
import type {
  Equipment,
  Goal,
  MuscleGroup,
  PersonalProfile,
  Program,
  ProgramExercise,
  ProgramSession,
} from "./types";
import { uid } from "./formulas";

export function getTemplatePrograms(): Program[] {
  return templates as Program[];
}

export function getAllPrograms(custom: Program[]): Program[] {
  return [...getTemplatePrograms(), ...custom];
}

export function getProgramById(
  id: string | null,
  custom: Program[]
): Program | null {
  if (!id) return null;
  return getAllPrograms(custom).find((p) => p.id === id) ?? null;
}

export function recommendTemplates(profile: PersonalProfile): Program[] {
  const all = getTemplatePrograms();
  return all
    .map((p) => {
      let score = 0;
      if (p.equipment === profile.equipment || p.equipment === "any") score += 3;
      if (p.goalFit.includes(profile.goal)) score += 3;
      if (Math.abs(p.daysPerWeek - profile.daysPerWeek) <= 1) score += 2;
      if (profile.experience === "beginner" && p.id.includes("time-crunch"))
        score += 2;
      if (profile.experience === "beginner" && p.id.includes("bodyweight"))
        score += 1;
      if (
        profile.experience === "intermediate" &&
        p.id.includes("strength-recomp")
      )
        score += 2;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

const EXERCISE_LIBRARY: ProgramExercise[] = [
  {
    id: "lib-squat",
    name: "Back Squat",
    pattern: "squat",
    muscleGroups: ["quads", "glutes"],
    sets: 3,
    repRange: [5, 8],
    linkedLift: "squat",
  },
  {
    id: "lib-goblet",
    name: "Goblet Squat",
    pattern: "squat",
    muscleGroups: ["quads", "glutes"],
    sets: 3,
    repRange: [8, 12],
    linkedLift: "squat",
  },
  {
    id: "lib-bench",
    name: "Bench Press",
    pattern: "horizontal_push",
    muscleGroups: ["chest", "triceps"],
    sets: 3,
    repRange: [6, 10],
    linkedLift: "bench",
  },
  {
    id: "lib-db-bench",
    name: "Dumbbell Bench",
    pattern: "horizontal_push",
    muscleGroups: ["chest", "triceps"],
    sets: 3,
    repRange: [8, 12],
    linkedLift: "bench",
  },
  {
    id: "lib-ohp",
    name: "Overhead Press",
    pattern: "vertical_push",
    muscleGroups: ["shoulders", "triceps"],
    sets: 3,
    repRange: [5, 8],
    linkedLift: "ohp",
  },
  {
    id: "lib-rdl",
    name: "Romanian Deadlift",
    pattern: "hinge",
    muscleGroups: ["hamstrings", "glutes", "back"],
    sets: 3,
    repRange: [6, 10],
    linkedLift: "deadlift",
  },
  {
    id: "lib-row",
    name: "Barbell Row",
    pattern: "horizontal_pull",
    muscleGroups: ["back", "biceps"],
    sets: 3,
    repRange: [6, 10],
    linkedLift: "row",
  },
  {
    id: "lib-db-row",
    name: "One-Arm DB Row",
    pattern: "horizontal_pull",
    muscleGroups: ["back", "biceps"],
    sets: 3,
    repRange: [8, 12],
    linkedLift: "row",
  },
  {
    id: "lib-pullup",
    name: "Pull-Up / Lat Pulldown",
    pattern: "vertical_pull",
    muscleGroups: ["back", "biceps"],
    sets: 3,
    repRange: [5, 10],
    linkedLift: "pullup",
  },
  {
    id: "lib-lunge",
    name: "Walking Lunge",
    pattern: "split_squat",
    muscleGroups: ["quads", "glutes"],
    sets: 2,
    repRange: [8, 12],
  },
  {
    id: "lib-facepull",
    name: "Face Pull",
    pattern: "rear_delt",
    muscleGroups: ["shoulders", "back"],
    sets: 2,
    repRange: [12, 15],
  },
  {
    id: "lib-curl",
    name: "Incline DB Curl",
    pattern: "elbow_flexion",
    muscleGroups: ["biceps"],
    sets: 2,
    repRange: [10, 15],
  },
  {
    id: "lib-triceps",
    name: "Triceps Pushdown",
    pattern: "elbow_extension",
    muscleGroups: ["triceps"],
    sets: 2,
    repRange: [10, 15],
  },
  {
    id: "lib-pushup",
    name: "Push-Up",
    pattern: "horizontal_push",
    muscleGroups: ["chest", "triceps"],
    sets: 3,
    repRange: [8, 15],
    linkedLift: "bench",
  },
  {
    id: "lib-hiphinge-bw",
    name: "Hip Hinge Good Morning",
    pattern: "hinge",
    muscleGroups: ["hamstrings", "glutes"],
    sets: 3,
    repRange: [10, 15],
    linkedLift: "deadlift",
  },
  {
    id: "lib-core",
    name: "Dead Bug",
    pattern: "core",
    muscleGroups: ["core"],
    sets: 3,
    repRange: [8, 12],
  },
  {
    id: "lib-lateral",
    name: "Lateral Raise",
    pattern: "abduction",
    muscleGroups: ["shoulders"],
    sets: 3,
    repRange: [12, 15],
  },
  {
    id: "lib-hipthrust",
    name: "Hip Thrust",
    pattern: "bridge",
    muscleGroups: ["glutes"],
    sets: 3,
    repRange: [8, 12],
  },
];

export function exerciseSwaps(current: ProgramExercise): ProgramExercise[] {
  return EXERCISE_LIBRARY.filter(
    (e) => e.pattern === current.pattern && e.name !== current.name
  ).slice(0, 4);
}

export function libraryForEquipment(equipment: Equipment): ProgramExercise[] {
  if (equipment === "bodyweight") {
    return EXERCISE_LIBRARY.filter((e) =>
      ["Push-Up", "Hip Hinge Good Morning", "Dead Bug", "Walking Lunge"].some(
        (n) => e.name.includes(n.split(" ")[0]) || e.id.includes("bw") || e.id.includes("pushup") || e.id.includes("hiphinge") || e.id.includes("core") || e.id.includes("lunge")
      )
    );
  }
  if (equipment === "dumbbells") {
    return EXERCISE_LIBRARY.filter(
      (e) =>
        e.name.includes("Dumbbell") ||
        e.name.includes("DB") ||
        e.name.includes("Goblet") ||
        e.name.includes("Lunge") ||
        e.name.includes("Curl") ||
        e.name.includes("Face") ||
        e.name.includes("Dead Bug") ||
        e.name.includes("Lateral") ||
        e.name.includes("Hip Thrust") ||
        e.name.includes("Push-Up")
    );
  }
  return EXERCISE_LIBRARY;
}

export function weeklySetsForMuscle(
  sessions: ProgramSession[],
  muscle: MuscleGroup
): number {
  let total = 0;
  for (const s of sessions) {
    for (const e of s.exercises) {
      if (e.muscleGroups.includes(muscle)) total += e.sets;
    }
  }
  return total;
}

export function validateProgramVolume(
  sessions: ProgramSession[],
  minSets = 10,
  maxSets = 20
): { ok: boolean; warnings: string[] } {
  const muscles: MuscleGroup[] = [
    "chest",
    "back",
    "shoulders",
    "quads",
    "hamstrings",
    "glutes",
    "biceps",
    "triceps",
  ];
  const warnings: string[] = [];
  for (const m of muscles) {
    const sets = weeklySetsForMuscle(sessions, m);
    if (sets === 0) continue;
    if (sets > maxSets) {
      warnings.push(
        `${m}: ~${sets} hard sets/week — above the ${maxSets} soft cap. Consider trimming.`
      );
    } else if (sets < minSets && sets > 0) {
      // Only warn if it's a priority pattern muscle with very low volume
      if (sets < 6) {
        warnings.push(
          `${m}: ~${sets} hard sets/week — light. Fine for maintenance; low for growth.`
        );
      }
    }
  }
  // Movement pattern coverage
  const patterns = new Set(sessions.flatMap((s) => s.exercises.map((e) => e.pattern)));
  for (const needed of ["squat", "hinge", "horizontal_push", "horizontal_pull"]) {
    if (![...patterns].some((p) => p.includes(needed.split("_")[0]) || p === needed)) {
      // soft check
      if (!patterns.has(needed)) {
        warnings.push(`Missing a clear ${needed.replace("_", " ")} pattern.`);
      }
    }
  }
  return { ok: warnings.length === 0, warnings };
}

export function buildSessionSkeleton(opts: {
  name: string;
  dayLabel: string;
  equipment: Equipment;
  minutes: number;
  emphasis?: string;
}): ProgramSession {
  const lib = libraryForEquipment(opts.equipment);
  const pick = (pattern: string) => {
    const found = lib.find((e) => e.pattern === pattern) ?? EXERCISE_LIBRARY.find((e) => e.pattern === pattern)!;
    return { ...found, id: uid("ex") };
  };

  const exercises: ProgramExercise[] = [];
  if (opts.minutes <= 30) {
    exercises.push(pick("squat"), pick("horizontal_push"), pick("horizontal_pull"), pick("core"));
  } else if (opts.minutes <= 45) {
    exercises.push(
      pick("squat"),
      pick("hinge"),
      pick("horizontal_push"),
      pick("horizontal_pull"),
      pick("core")
    );
  } else {
    exercises.push(
      pick("squat"),
      pick("hinge"),
      pick("horizontal_push"),
      pick("vertical_pull"),
      pick("horizontal_pull"),
      pick("core")
    );
  }

  if (opts.emphasis === "chest") {
    exercises.splice(1, 0, { ...pick("horizontal_push"), name: "Incline variation", id: uid("ex") });
  }
  if (opts.emphasis === "back") {
    exercises.push({ ...pick("vertical_pull"), id: uid("ex") });
  }
  if (opts.emphasis === "glutes" || opts.emphasis === "hamstrings") {
    exercises.push({
      id: uid("ex"),
      name: "Hip Thrust",
      pattern: "bridge",
      muscleGroups: ["glutes"],
      sets: 3,
      repRange: [8, 12],
    });
  }
  if (opts.emphasis === "shoulders") {
    exercises.push({
      id: uid("ex"),
      name: "Lateral Raise",
      pattern: "abduction",
      muscleGroups: ["shoulders"],
      sets: 3,
      repRange: [12, 15],
    });
  }

  return {
    id: uid("session"),
    name: opts.name,
    dayLabel: opts.dayLabel,
    estimatedMinutes: opts.minutes,
    exercises,
  };
}

export function cloneAsCustom(program: Program, name?: string): Program {
  return {
    ...structuredClone(program),
    id: uid("prog"),
    name: name ?? `${program.name} (Mine)`,
    isCustom: true,
    createdAt: new Date().toISOString(),
  };
}

export function matchGoalLabel(goal: Goal): string {
  switch (goal) {
    case "lose_fat":
      return "lose fat";
    case "build_muscle":
      return "build muscle";
    case "both":
      return "recomp (muscle + fat loss)";
    default:
      return "general health";
  }
}
