"use client";

import researchSeed from "@/data/research.json";
import {
  applyResearchChange,
  runAdaptations,
} from "@/lib/adaptation";
import { estimate1RM, todayISO, uid } from "@/lib/formulas";
import { getProgramById } from "@/lib/programs";
import {
  formatStreak,
  pickWelcome,
  pickWeighInPraise,
  pickWorkoutPraise,
  trainingStreakWeeks,
  updateHabitStrength,
} from "@/lib/reinforcement";
import type {
  AdaptationEntry,
  AppState,
  CoachMessage,
  LiftEntry,
  LiftId,
  PersonalProfile,
  Program,
  ResearchUpdate,
  WeighIn,
  WorkoutLog,
} from "@/lib/types";
import { EMPTY_STATE } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "muscle-habit-v1";

interface AppContextValue {
  ready: boolean;
  state: AppState;
  research: ResearchUpdate[];
  welcomeMessage: string;
  pendingResearch: ResearchUpdate[];
  activeProgram: Program | null;
  streakWeeks: number;
  streakPhrase: string;
  celebration: string | null;
  clearCelebration: () => void;
  completeOnboarding: (profile: PersonalProfile, initialWeighIn?: boolean) => void;
  updateProfile: (patch: Partial<PersonalProfile>) => void;
  addWeighIn: (weightKg: number, date?: string) => void;
  addLiftEntry: (input: {
    liftId: LiftId;
    weightKg: number;
    reps: number;
    isWorkingWeight: boolean;
    date?: string;
  }) => void;
  setActiveProgram: (programId: string) => void;
  saveCustomProgram: (program: Program, activate?: boolean) => void;
  logWorkout: (log: Omit<WorkoutLog, "id">) => void;
  applyResearch: (id: string) => void;
  dismissResearch: (id: string) => void;
  markResearchSeen: (id: string) => void;
  setCoachDraft: (messages: CoachMessage[]) => void;
  runEngine: () => AdaptationEntry[];
  resetAll: () => void;
  updateSettings: (patch: Partial<AppState["settings"]>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadState(): AppState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as AppState;
    return {
      ...EMPTY_STATE,
      ...parsed,
      settings: { ...EMPTY_STATE.settings, ...parsed.settings },
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to Muscle Habit.");
  const [celebration, setCelebration] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadState();
    const today = todayISO();
    let habitStrength = loaded.habitStrength;
    if (loaded.lastOpenDate && loaded.lastOpenDate !== today) {
      const idle = Math.floor(
        (Date.now() - new Date(loaded.lastOpenDate).getTime()) / 86400000
      );
      habitStrength = updateHabitStrength(habitStrength, { idleDays: idle });
    }
    const daySeed = new Date().getDate() + new Date().getMonth() * 31;
    setWelcomeMessage(pickWelcome(daySeed));
    const next = { ...loaded, habitStrength, lastOpenDate: today };
    setState(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const research = researchSeed as ResearchUpdate[];

  const pendingResearch = useMemo(
    () =>
      research.filter(
        (r) =>
          !state.researchApplied.includes(r.id) &&
          !state.researchDismissed.includes(r.id)
      ),
    [research, state.researchApplied, state.researchDismissed]
  );

  const activeProgram = useMemo(
    () => getProgramById(state.activeProgramId, state.customPrograms),
    [state.activeProgramId, state.customPrograms]
  );

  const streakWeeks = useMemo(
    () => trainingStreakWeeks(state.workoutLogs.map((w) => w.date)),
    [state.workoutLogs]
  );

  const streakPhrase = useMemo(
    () => formatStreak(streakWeeks),
    [streakWeeks]
  );

  const completeOnboarding = useCallback(
    (profile: PersonalProfile, initialWeighIn = true) => {
      const weighIns: WeighIn[] = initialWeighIn
        ? [
            {
              id: uid("wi"),
              date: todayISO(),
              weightKg: profile.currentWeightKg,
            },
          ]
        : [];
      setState((s) => ({
        ...s,
        onboarded: true,
        profile,
        weighIns: weighIns.length ? weighIns : s.weighIns,
        habitStrength: Math.max(s.habitStrength, 25),
      }));
      setCelebration("You're set. Let's build the habit.");
    },
    []
  );

  const updateProfile = useCallback((patch: Partial<PersonalProfile>) => {
    setState((s) =>
      s.profile ? { ...s, profile: { ...s.profile, ...patch } } : s
    );
  }, []);

  const addWeighIn = useCallback((weightKg: number, date?: string) => {
    const entry: WeighIn = {
      id: uid("wi"),
      date: date ?? todayISO(),
      weightKg,
    };
    setState((s) => ({
      ...s,
      weighIns: [...s.weighIns, entry],
      profile: s.profile
        ? { ...s.profile, currentWeightKg: weightKg }
        : s.profile,
      habitStrength: updateHabitStrength(s.habitStrength, { weighIn: true }),
    }));
    setCelebration(pickWeighInPraise());
  }, []);

  const addLiftEntry = useCallback(
    (input: {
      liftId: LiftId;
      weightKg: number;
      reps: number;
      isWorkingWeight: boolean;
      date?: string;
    }) => {
      const estimated1RM = input.isWorkingWeight
        ? estimate1RM(input.weightKg, input.reps)
        : input.reps === 1
          ? input.weightKg
          : estimate1RM(input.weightKg, input.reps);
      const entry: LiftEntry = {
        id: uid("lift"),
        liftId: input.liftId,
        date: input.date ?? todayISO(),
        weightKg: input.weightKg,
        reps: input.reps,
        isWorkingWeight: input.isWorkingWeight,
        estimated1RM,
      };
      setState((s) => ({ ...s, liftEntries: [...s.liftEntries, entry] }));
    },
    []
  );

  const setActiveProgram = useCallback((programId: string) => {
    setState((s) => ({ ...s, activeProgramId: programId }));
    setCelebration("Program activated. Show up — we'll adapt as you go.");
  }, []);

  const saveCustomProgram = useCallback(
    (program: Program, activate = true) => {
      setState((s) => ({
        ...s,
        customPrograms: [
          ...s.customPrograms.filter((p) => p.id !== program.id),
          program,
        ],
        activeProgramId: activate ? program.id : s.activeProgramId,
      }));
      setCelebration(`Saved “${program.name}”.`);
    },
    []
  );

  const logWorkout = useCallback((log: Omit<WorkoutLog, "id">) => {
    const full: WorkoutLog = { ...log, id: uid("wo") };
    // Also mirror top sets into lift history
    const newLifts: LiftEntry[] = [];
    for (const ex of full.exercises) {
      if (!ex.linkedLift) continue;
      const tops = ex.sets.filter((s) => s.completed && s.weightKg > 0);
      if (!tops.length) continue;
      const best = tops.reduce((a, b) =>
        estimate1RM(a.weightKg, a.reps) >= estimate1RM(b.weightKg, b.reps)
          ? a
          : b
      );
      newLifts.push({
        id: uid("lift"),
        liftId: ex.linkedLift,
        date: full.date,
        weightKg: best.weightKg,
        reps: best.reps,
        isWorkingWeight: true,
        estimated1RM: estimate1RM(best.weightKg, best.reps),
      });
    }
    setState((s) => ({
      ...s,
      workoutLogs: [...s.workoutLogs, full],
      liftEntries: [...s.liftEntries, ...newLifts],
      habitStrength: updateHabitStrength(s.habitStrength, {
        completedWorkout: true,
      }),
    }));
    setCelebration(pickWorkoutPraise(full.sessionName));
  }, []);

  const applyResearch = useCallback(
    (id: string) => {
      const item = research.find((r) => r.id === id);
      if (!item) return;
      setState((s) => {
        let customPrograms = s.customPrograms;
        let activeProgramId = s.activeProgramId;
        const prog = getProgramById(s.activeProgramId, s.customPrograms);
        if (prog) {
          const updated = applyResearchChange(
            prog,
            item.proposedChange.setting,
            item.proposedChange.to
          );
          if (prog.isCustom) {
            customPrograms = customPrograms.map((p) =>
              p.id === prog.id ? updated : p
            );
          } else {
            const copy = {
              ...updated,
              id: uid("prog"),
              name: `${prog.name} (Lab-tuned)`,
              isCustom: true,
              createdAt: new Date().toISOString(),
            };
            customPrograms = [...customPrograms, copy];
            activeProgramId = copy.id;
          }
        }
        const adaptation: AdaptationEntry = {
          id: uid("adapt"),
          date: todayISO(),
          summary: `Habit Lab: ${item.title}`,
          detail: item.proposedChange.explanation,
          rule: `research_${item.id}`,
        };
        return {
          ...s,
          customPrograms,
          activeProgramId,
          researchApplied: [...s.researchApplied, id],
          adaptations: [adaptation, ...s.adaptations],
          settings: {
            ...s.settings,
            researchNotificationsSeen: [
              ...s.settings.researchNotificationsSeen,
              id,
            ],
          },
        };
      });
      setCelebration("Research applied. Changelog updated.");
    },
    [research]
  );

  const dismissResearch = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      researchDismissed: [...s.researchDismissed, id],
      settings: {
        ...s.settings,
        researchNotificationsSeen: [
          ...s.settings.researchNotificationsSeen,
          id,
        ],
      },
    }));
  }, []);

  const markResearchSeen = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        researchNotificationsSeen: Array.from(
          new Set([...s.settings.researchNotificationsSeen, id])
        ),
      },
    }));
  }, []);

  const setCoachDraft = useCallback((messages: CoachMessage[]) => {
    setState((s) => ({ ...s, coachDraft: messages }));
  }, []);

  const runEngine = useCallback((): AdaptationEntry[] => {
    let created: AdaptationEntry[] = [];
    setState((s) => {
      if (!s.profile) return s;
      const prog = getProgramById(s.activeProgramId, s.customPrograms);
      if (!prog) return s;
      const result = runAdaptations({
        program: prog,
        profile: s.profile,
        liftEntries: s.liftEntries,
        workoutLogs: s.workoutLogs,
        weighIns: s.weighIns,
        settings: s.settings,
        existingAdaptations: s.adaptations,
      });
      if (result.entries.length === 0) return s;
      created = result.entries;
      let customPrograms = s.customPrograms;
      let activeProgramId = s.activeProgramId;
      if (prog.isCustom) {
        customPrograms = customPrograms.map((p) =>
          p.id === prog.id ? result.program : p
        );
      } else {
        const copy = {
          ...result.program,
          id: uid("prog"),
          name: `${prog.name} (Adapted)`,
          isCustom: true,
          createdAt: new Date().toISOString(),
        };
        customPrograms = [...customPrograms, copy];
        activeProgramId = copy.id;
      }
      return {
        ...s,
        customPrograms,
        activeProgramId,
        adaptations: [...result.entries, ...s.adaptations],
      };
    });
    return created;
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(EMPTY_STATE);
    setCelebration(null);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<AppState["settings"]>) => {
      setState((s) => ({
        ...s,
        settings: { ...s.settings, ...patch },
      }));
    },
    []
  );

  const clearCelebration = useCallback(() => setCelebration(null), []);

  const value: AppContextValue = {
    ready,
    state,
    research,
    welcomeMessage,
    pendingResearch,
    activeProgram,
    streakWeeks,
    streakPhrase,
    celebration,
    clearCelebration,
    completeOnboarding,
    updateProfile,
    addWeighIn,
    addLiftEntry,
    setActiveProgram,
    saveCustomProgram,
    logWorkout,
    applyResearch,
    dismissResearch,
    markResearchSeen,
    setCoachDraft,
    runEngine,
    resetAll,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
