/** Base path for the interactive planner app. */
export const PLANNER = "/planner";

export const routes = {
  home: "/",
  planner: PLANNER,
  dashboard: `${PLANNER}/dashboard`,
  programs: `${PLANNER}/programs`,
  coach: `${PLANNER}/programs/coach`,
  workout: `${PLANNER}/workout`,
  numbers: `${PLANNER}/numbers`,
  lab: `${PLANNER}/lab`,
  settings: `${PLANNER}/settings`,
  onboarding: `${PLANNER}/onboarding`,
} as const;

export function workoutSessionHref(sessionId: string) {
  return `${routes.workout}?session=${sessionId}`;
}
