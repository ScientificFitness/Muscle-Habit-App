export type Sex = "male" | "female" | "other";
export type Experience = "beginner" | "returning" | "intermediate";
export type Equipment = "full_gym" | "dumbbells" | "bodyweight";
export type Goal = "lose_fat" | "build_muscle" | "both" | "general_health";
export type SessionMinutes = 20 | 30 | 45 | 60;

export type LiftId =
  | "squat"
  | "bench"
  | "ohp"
  | "deadlift"
  | "row"
  | "pullup";

export interface WeighIn {
  id: string;
  date: string; // ISO date
  weightKg: number;
}

export interface LiftEntry {
  id: string;
  liftId: LiftId;
  date: string;
  weightKg: number;
  reps: number;
  isWorkingWeight: boolean;
  estimated1RM: number;
}

export interface PersonalProfile {
  sex: Sex;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg: number;
  experience: Experience;
  daysPerWeek: number;
  sessionMinutes: SessionMinutes;
  equipment: Equipment;
  goal: Goal;
}

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "biceps"
  | "triceps"
  | "core"
  | "calves";

export interface ProgramExercise {
  id: string;
  name: string;
  pattern: string;
  muscleGroups: MuscleGroup[];
  sets: number;
  repRange: [number, number];
  rpeTarget?: number;
  notes?: string;
  linkedLift?: LiftId;
}

export interface ProgramSession {
  id: string;
  name: string;
  dayLabel: string;
  exercises: ProgramExercise[];
  estimatedMinutes: number;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  weeks: number;
  daysPerWeek: number;
  equipment: Equipment | "any";
  goalFit: Goal[];
  sessions: ProgramSession[];
  isCustom?: boolean;
  createdAt?: string;
}

export interface LoggedSet {
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  name: string;
  linkedLift?: LiftId;
  sets: LoggedSet[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  sessionId: string;
  sessionName: string;
  exercises: LoggedExercise[];
  durationMinutes?: number;
  recoveryScore?: number; // 1–5
  notes?: string;
}

export interface AdaptationEntry {
  id: string;
  date: string;
  summary: string;
  detail: string;
  rule: string;
}

export interface ResearchUpdate {
  id: string;
  date: string;
  title: string;
  summary: string;
  source: string;
  ruleTarget:
    | "volume"
    | "rep_zones"
    | "deload"
    | "progression"
    | "recovery"
    | "nutrition";
  proposedChange: {
    setting: string;
    from: string;
    to: string;
    explanation: string;
  };
  applied?: boolean;
  dismissed?: boolean;
}

export interface CoachMessage {
  id: string;
  role: "coach" | "user";
  text: string;
  options?: { id: string; label: string }[];
  proposal?: {
    kind: "session" | "exercise" | "complete";
    payload: unknown;
  };
}

export interface AppSettings {
  volumeMinSets: number;
  volumeMaxSets: number;
  deficitPercent: number;
  deloadWeeks: number[];
  shopUrl: string;
  researchNotificationsSeen: string[];
}

export interface AppState {
  onboarded: boolean;
  profile: PersonalProfile | null;
  weighIns: WeighIn[];
  liftEntries: LiftEntry[];
  activeProgramId: string | null;
  customPrograms: Program[];
  workoutLogs: WorkoutLog[];
  adaptations: AdaptationEntry[];
  researchApplied: string[];
  researchDismissed: string[];
  habitStrength: number;
  lastOpenDate: string | null;
  celebrationQueue: string[];
  settings: AppSettings;
  coachDraft: CoachMessage[];
}

export const MAIN_LIFTS: { id: LiftId; name: string; pattern: string }[] = [
  { id: "squat", name: "Squat", pattern: "squat" },
  { id: "bench", name: "Bench Press", pattern: "horizontal_push" },
  { id: "ohp", name: "Overhead Press", pattern: "vertical_push" },
  { id: "deadlift", name: "Deadlift / RDL", pattern: "hinge" },
  { id: "row", name: "Row", pattern: "horizontal_pull" },
  { id: "pullup", name: "Pull-up / Lat Pulldown", pattern: "vertical_pull" },
];

export const DEFAULT_SETTINGS: AppSettings = {
  volumeMinSets: 10,
  volumeMaxSets: 20,
  deficitPercent: 20,
  deloadWeeks: [4, 8],
  shopUrl: "https://musclehabit.shop",
  researchNotificationsSeen: [],
};

export const EMPTY_STATE: AppState = {
  onboarded: false,
  profile: null,
  weighIns: [],
  liftEntries: [],
  activeProgramId: null,
  customPrograms: [],
  workoutLogs: [],
  adaptations: [],
  researchApplied: [],
  researchDismissed: [],
  habitStrength: 20,
  lastOpenDate: null,
  celebrationQueue: [],
  settings: DEFAULT_SETTINGS,
  coachDraft: [],
};
