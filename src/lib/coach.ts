import { uid } from "./formulas";
import {
  buildSessionSkeleton,
  validateProgramVolume,
} from "./programs";
import type {
  CoachMessage,
  Equipment,
  Goal,
  PersonalProfile,
  Program,
  ProgramSession,
} from "./types";

export type CoachStep =
  | "intro"
  | "goal_emphasis"
  | "weak_points"
  | "days_confirm"
  | "session_length"
  | "propose_structure"
  | "tweak_session"
  | "validate"
  | "complete";

export interface CoachBuilderState {
  step: CoachStep;
  messages: CoachMessage[];
  goalEmphasis?: Goal | "performance";
  weakPoints: string[];
  days: number;
  minutes: number;
  sessions: ProgramSession[];
  rejectedPatterns: string[];
}

export function initialCoachState(profile: PersonalProfile): CoachBuilderState {
  const intro: CoachMessage = {
    id: uid("msg"),
    role: "coach",
    text: `Hey — let's build this together. Based on your profile I'm thinking ${profile.daysPerWeek} full-body-ish days, ${profile.sessionMinutes} minutes, ${equipmentLabel(profile.equipment)}. First question: what should this block emphasize?`,
    options: [
      { id: "lose_fat", label: "Fat loss — keep muscle" },
      { id: "build_muscle", label: "Build muscle" },
      { id: "both", label: "Recomp — both" },
      { id: "performance", label: "Get stronger on the big lifts" },
      { id: "general_health", label: "Feel athletic & healthy" },
    ],
  };
  return {
    step: "goal_emphasis",
    messages: [intro],
    weakPoints: [],
    days: profile.daysPerWeek,
    minutes: profile.sessionMinutes,
    sessions: [],
    rejectedPatterns: [],
  };
}

function equipmentLabel(e: Equipment): string {
  if (e === "full_gym") return "full gym access";
  if (e === "dumbbells") return "dumbbells only";
  return "bodyweight tools";
}

function push(
  state: CoachBuilderState,
  coach: Omit<CoachMessage, "id" | "role">,
  userText?: string
): CoachBuilderState {
  const messages = [...state.messages];
  if (userText) {
    messages.push({ id: uid("msg"), role: "user", text: userText });
  }
  messages.push({ id: uid("msg"), role: "coach", ...coach });
  return { ...state, messages };
}

/** Deep dialogue — 15+ distinct branches via option ids. */
export function advanceCoach(
  state: CoachBuilderState,
  profile: PersonalProfile,
  optionId: string,
  optionLabel: string
): CoachBuilderState {
  switch (state.step) {
    case "goal_emphasis": {
      const next = push(
        {
          ...state,
          goalEmphasis: optionId as CoachBuilderState["goalEmphasis"],
          step: "weak_points",
        },
        {
          text: weakPointPrompt(optionId),
          options: [
            { id: "chest", label: "Chest" },
            { id: "back", label: "Back" },
            { id: "shoulders", label: "Shoulders" },
            { id: "glutes", label: "Glutes" },
            { id: "hamstrings", label: "Hamstrings" },
            { id: "quads", label: "Quads" },
            { id: "arms", label: "Arms" },
            { id: "none", label: "No weak points — keep balanced" },
          ],
        },
        optionLabel
      );
      return next;
    }
    case "weak_points": {
      const weakPoints = optionId === "none" ? [] : [optionId];
      return push(
        {
          ...state,
          weakPoints,
          step: "days_confirm",
        },
        {
          text: `Got it${weakPoints.length ? ` — we'll give ${weakPoints[0]} a little extra love` : ""}. You said ${profile.daysPerWeek} days/week. Stick with that, or adjust?`,
          options: [
            { id: "d2", label: "2 days" },
            { id: "d3", label: "3 days" },
            { id: "d4", label: "4 days" },
            { id: "d5", label: "5 days" },
            { id: "keep", label: `Keep ${profile.daysPerWeek} days` },
          ],
        },
        optionLabel
      );
    }
    case "days_confirm": {
      const days =
        optionId === "keep"
          ? state.days
          : Number(optionId.replace("d", "")) || state.days;
      return push(
        { ...state, days, step: "session_length" },
        {
          text: lengthPrompt(days, state.goalEmphasis),
          options: [
            { id: "m20", label: "20 min — ruthless focus" },
            { id: "m30", label: "30 min" },
            { id: "m45", label: "45 min" },
            { id: "m60", label: "60 min" },
          ],
        },
        optionLabel
      );
    }
    case "session_length": {
      const minutes = Number(optionId.replace("m", "")) || 45;
      const sessions = inventSessions({
        days: state.days,
        minutes,
        equipment: profile.equipment,
        emphasis: state.weakPoints[0],
        goal: state.goalEmphasis,
      });
      const validation = validateProgramVolume(sessions);
      return push(
        {
          ...state,
          minutes,
          sessions,
          step: "propose_structure",
        },
        {
          text: structurePitch(sessions, validation.warnings),
          options: [
            { id: "accept_structure", label: "Looks good — continue" },
            { id: "more_pull", label: "Add more pulling" },
            { id: "more_legs", label: "Emphasize legs more" },
            { id: "shorter", label: "Make sessions shorter" },
            { id: "reject_structure", label: "Rebuild from scratch" },
          ],
          proposal: { kind: "session", payload: sessions },
        },
        optionLabel
      );
    }
    case "propose_structure": {
      if (optionId === "reject_structure") {
        const sessions = inventSessions({
          days: Math.max(2, state.days - 1),
          minutes: state.minutes,
          equipment: profile.equipment,
          emphasis: state.weakPoints[0],
          goal: state.goalEmphasis,
          seed: 2,
        });
        return push(
          { ...state, sessions, step: "propose_structure" },
          {
            text: `Alright, alternate take: ${sessions.length} sessions, slightly different balance. ${structurePitch(sessions, validateProgramVolume(sessions).warnings)}`,
            options: [
              { id: "accept_structure", label: "Take this version" },
              { id: "more_pull", label: "More pulling" },
              { id: "more_legs", label: "More legs" },
              { id: "shorter", label: "Shorter sessions" },
            ],
            proposal: { kind: "session", payload: sessions },
          },
          optionLabel
        );
      }
      let sessions = [...state.sessions];
      if (optionId === "more_pull") {
        sessions = sessions.map((s, i) =>
          i === 0
            ? {
                ...s,
                exercises: [
                  ...s.exercises,
                  {
                    id: uid("ex"),
                    name: "Extra Row variation",
                    pattern: "horizontal_pull",
                    muscleGroups: ["back", "biceps"],
                    sets: 2,
                    repRange: [10, 15] as [number, number],
                    linkedLift: "row" as const,
                  },
                ],
              }
            : s
        );
      }
      if (optionId === "more_legs") {
        sessions = sessions.map((s, i) =>
          i === 0
            ? {
                ...s,
                exercises: [
                  ...s.exercises,
                  {
                    id: uid("ex"),
                    name: "Bulgarian Split Squat",
                    pattern: "split_squat",
                    muscleGroups: ["quads", "glutes"],
                    sets: 3,
                    repRange: [8, 12] as [number, number],
                  },
                ],
              }
            : s
        );
      }
      if (optionId === "shorter") {
        sessions = sessions.map((s) => ({
          ...s,
          estimatedMinutes: Math.max(20, s.estimatedMinutes - 10),
          exercises: s.exercises.slice(0, Math.max(3, s.exercises.length - 1)),
        }));
      }
      // Move to per-session tweak
      const first = sessions[0];
      return push(
        { ...state, sessions, step: "tweak_session" },
        {
          text: `Let's fine-tune ${first.name}. Main lift is ${first.exercises[0]?.name}. Want to keep it, swap it, or trim a set?`,
          options: tweakOptions(first),
          proposal: { kind: "exercise", payload: first },
        },
        optionLabel
      );
    }
    case "tweak_session": {
      const sessions = structuredClone(state.sessions);
      const idx = 0;
      if (optionId === "swap_main") {
        const ex = sessions[idx].exercises[0];
        if (ex) {
          sessions[idx].exercises[0] = {
            ...ex,
            id: uid("ex"),
            name: swapName(ex.name, profile.equipment),
          };
        }
      } else if (optionId === "trim_set") {
        sessions[idx].exercises = sessions[idx].exercises.map((e, i) =>
          i === 0 ? { ...e, sets: Math.max(2, e.sets - 1) } : e
        );
      } else if (optionId === "add_accessory") {
        sessions[idx].exercises.push({
          id: uid("ex"),
          name: state.weakPoints[0] === "arms" ? "Incline Curl" : "Face Pull",
          pattern: state.weakPoints[0] === "arms" ? "elbow_flexion" : "rear_delt",
          muscleGroups:
            state.weakPoints[0] === "arms" ? ["biceps"] : ["shoulders", "back"],
          sets: 2,
          repRange: [12, 15],
        });
      } else if (optionId === "drop_last") {
        if (sessions[idx].exercises.length > 3) {
          sessions[idx].exercises.pop();
        }
      }
      // Validate then complete
      const validation = validateProgramVolume(sessions);
      const fixups = validation.warnings.length
        ? ` I checked volume guardrails: ${validation.warnings[0]} I'll keep an eye on it as you train.`
        : " Volume guardrails look healthy — roughly in the 10–20 hard sets zone where it matters.";

      return push(
        { ...state, sessions, step: "complete" },
        {
          text: `Locked in. ${sessions.length} sessions, movement-pattern balanced.${fixups} Save this as My Program?`,
          options: [
            { id: "save", label: "Save as My Program" },
            { id: "rename_focus", label: "Save — name it Focus Block" },
            { id: "restart", label: "Start over" },
          ],
          proposal: { kind: "complete", payload: sessions },
        },
        optionLabel
      );
    }
    case "complete": {
      if (optionId === "restart") {
        return initialCoachState(profile);
      }
      // save handled by UI
      return push(
        { ...state, step: "complete" },
        {
          text: "All set. Head to Programs to activate it, or jump into today's session from the Dashboard.",
          options: [{ id: "done", label: "Done" }],
        },
        optionLabel
      );
    }
    default:
      return state;
  }
}

function weakPointPrompt(goalId: string): string {
  const map: Record<string, string> = {
    lose_fat:
      "Fat-loss blocks love full-body density. Any muscle you especially want to protect or grow while the scale moves?",
    build_muscle:
      "Building season. Where do you want extra volume — a lagging body part?",
    both: "Recomp mode. We'll keep compounds honest. Any weak point to prioritize?",
    performance:
      "Strength focus noted. Any lift pattern that feels like a limiter — or a body part holding you back?",
    general_health:
      "Health & longevity vibe. Anything you want to reinforce (back, glutes, shoulders)?",
  };
  return map[goalId] ?? "Any weak points to prioritize?";
}

function lengthPrompt(days: number, goal?: string): string {
  if (days >= 5) {
    return "Five days is ambitious — shorter sessions usually win here. How long can you realistically train?";
  }
  if (goal === "lose_fat") {
    return "For fat loss, density beats marathon sessions. What's your real time budget per workout?";
  }
  return "How many minutes per session should we plan for?";
}

function structurePitch(sessions: ProgramSession[], warnings: string[]): string {
  const names = sessions.map((s) => s.name).join(", ");
  const base = `Here's the skeleton: ${sessions.length} sessions — ${names}. Each one covers squat/hinge/push/pull patterns so busy weeks still hit everything.`;
  if (warnings.length) {
    return `${base} Quick guardrail note: ${warnings[0]}`;
  }
  return `${base} Volume looks balanced so far.`;
}

function tweakOptions(session: ProgramSession) {
  return [
    { id: "keep_main", label: `Keep ${session.exercises[0]?.name ?? "main lift"}` },
    { id: "swap_main", label: "Swap the main lift" },
    { id: "trim_set", label: "Trim one set from the main lift" },
    { id: "add_accessory", label: "Add a small accessory" },
    { id: "drop_last", label: "Drop the last exercise" },
  ];
}

function swapName(name: string, equipment: Equipment): string {
  if (equipment === "dumbbells") {
    if (name.includes("Squat")) return "Goblet Squat";
    if (name.includes("Bench")) return "Dumbbell Bench";
    if (name.includes("Row")) return "One-Arm DB Row";
    return `DB ${name}`;
  }
  if (equipment === "bodyweight") {
    if (name.includes("Bench") || name.includes("Press")) return "Push-Up";
    if (name.includes("Squat")) return "Split Squat";
    if (name.includes("Dead") || name.includes("RDL")) return "Hip Hinge Good Morning";
    return name;
  }
  if (name.includes("Back Squat")) return "Front Squat";
  if (name.includes("Bench")) return "Incline Bench";
  if (name.includes("Row")) return "Chest-Supported Row";
  return name;
}

function inventSessions(opts: {
  days: number;
  minutes: number;
  equipment: Equipment;
  emphasis?: string;
  goal?: string;
  seed?: number;
}): ProgramSession[] {
  const count = Math.min(6, Math.max(2, opts.days));
  const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"];
  const names =
    opts.seed === 2
      ? ["Anchor A", "Anchor B", "Anchor C", "Anchor D", "Anchor E", "Anchor F"]
      : [
          "Session A — Squat bias",
          "Session B — Hinge bias",
          "Session C — Push/Pull",
          "Session D — Balanced",
          "Session E — Density",
          "Session F — Openers",
        ];

  const sessions: ProgramSession[] = [];
  for (let i = 0; i < count; i++) {
    const emphasis =
      i === 0
        ? opts.emphasis
        : i === 1 && opts.goal === "performance"
          ? "back"
          : undefined;
    sessions.push(
      buildSessionSkeleton({
        name: names[i],
        dayLabel: labels[i],
        equipment: opts.equipment,
        minutes: opts.minutes,
        emphasis,
      })
    );
  }
  return sessions;
}

export function finalizeCoachProgram(
  state: CoachBuilderState,
  name: string
): Program {
  return {
    id: uid("prog"),
    name,
    description: `Built with the Coach Builder — ${state.days} days, ~${state.minutes} min, focus: ${state.goalEmphasis ?? "balanced"}${state.weakPoints.length ? `, priority: ${state.weakPoints.join(", ")}` : ""}.`,
    weeks: 12,
    daysPerWeek: state.days,
    equipment: "any",
    goalFit: ["both", "build_muscle", "lose_fat", "general_health"],
    sessions: state.sessions,
    isCustom: true,
    createdAt: new Date().toISOString(),
  };
}
