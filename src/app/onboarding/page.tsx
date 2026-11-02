"use client";

import { Button } from "@/components/ui/Button";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { useApp } from "@/context/AppContext";
import type {
  Equipment,
  Experience,
  Goal,
  PersonalProfile,
  SessionMinutes,
  Sex,
} from "@/lib/types";
import { BrandLogo } from "@/components/BrandLogo";
import { useMemo, useState } from "react";

const TOTAL = 6;

export default function OnboardingPage() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(35);
  const [heightCm, setHeightCm] = useState(175);
  const [currentWeightKg, setCurrentWeightKg] = useState(80);
  const [goalWeightKg, setGoalWeightKg] = useState(75);
  const [experience, setExperience] = useState<Experience>("returning");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [sessionMinutes, setSessionMinutes] = useState<SessionMinutes>(45);
  const [equipment, setEquipment] = useState<Equipment>("full_gym");
  const [goal, setGoal] = useState<Goal>("both");

  const profile: PersonalProfile = useMemo(
    () => ({
      sex,
      age,
      heightCm,
      currentWeightKg,
      goalWeightKg,
      experience,
      daysPerWeek,
      sessionMinutes,
      equipment,
      goal,
    }),
    [
      sex,
      age,
      heightCm,
      currentWeightKg,
      goalWeightKg,
      experience,
      daysPerWeek,
      sessionMinutes,
      equipment,
      goal,
    ]
  );

  const next = () => setStep((s) => Math.min(TOTAL, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-lg animate-fade-up">
        <BrandLogo size="lg" priority className="mb-8" />
        <ProgressDots total={TOTAL} current={step} />

        <div className="mt-8 space-y-6">
          {step === 1 && (
            <section>
              <h1 className="text-3xl uppercase tracking-wide">Baseline</h1>
              <p className="mt-2 text-[var(--mid-slate)]">
                Quick vitals so projections and loads make sense. You can edit anytime.
              </p>
              <div className="mt-6 grid gap-4">
                <div>
                  <Label>Sex</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        ["male", "Male"],
                        ["female", "Female"],
                        ["other", "Other"],
                      ] as const
                    ).map(([id, label]) => (
                      <ChoiceCard
                        key={id}
                        title={label}
                        selected={sex === id}
                        onClick={() => setSex(id)}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min={18}
                      max={80}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      min={120}
                      max={230}
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Current weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min={40}
                      max={250}
                      step={0.1}
                      value={currentWeightKg}
                      onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goalW">Goal weight (kg)</Label>
                    <Input
                      id="goalW"
                      type="number"
                      min={40}
                      max={250}
                      step={0.1}
                      value={goalWeightKg}
                      onChange={(e) => setGoalWeightKg(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h1 className="text-3xl uppercase tracking-wide">Experience</h1>
              <p className="mt-2 text-[var(--mid-slate)]">
                No judgment — this tunes starting volume and complexity.
              </p>
              <div className="mt-6 grid gap-3">
                <ChoiceCard
                  title="Beginner"
                  description="New to structured lifting, or less than a year consistent."
                  selected={experience === "beginner"}
                  onClick={() => setExperience("beginner")}
                />
                <ChoiceCard
                  title="Returning"
                  description="You've trained before. Ready to rebuild the habit."
                  selected={experience === "returning"}
                  onClick={() => setExperience("returning")}
                />
                <ChoiceCard
                  title="Intermediate"
                  description="Comfortable with main lifts and progressive overload."
                  selected={experience === "intermediate"}
                  onClick={() => setExperience("intermediate")}
                />
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h1 className="text-3xl uppercase tracking-wide">Time budget</h1>
              <p className="mt-2 text-[var(--mid-slate)]">
                Be honest. Sustainable beats heroic.
              </p>
              <div className="mt-6 space-y-5">
                <div>
                  <Label>Days per week</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {[2, 3, 4, 5, 6].map((d) => (
                      <ChoiceCard
                        key={d}
                        title={String(d)}
                        selected={daysPerWeek === d}
                        onClick={() => setDaysPerWeek(d)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Minutes per session</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {([20, 30, 45, 60] as SessionMinutes[]).map((m) => (
                      <ChoiceCard
                        key={m}
                        title={`${m}m`}
                        selected={sessionMinutes === m}
                        onClick={() => setSessionMinutes(m)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <h1 className="text-3xl uppercase tracking-wide">Equipment</h1>
              <p className="mt-2 text-[var(--mid-slate)]">
                We&apos;ll only prescribe what you can actually do.
              </p>
              <div className="mt-6 grid gap-3">
                <ChoiceCard
                  title="Full gym"
                  description="Barbells, racks, cables — the works."
                  selected={equipment === "full_gym"}
                  onClick={() => setEquipment("full_gym")}
                />
                <ChoiceCard
                  title="Dumbbells only"
                  description="Home setup, hotel gym, or adjustable DBs."
                  selected={equipment === "dumbbells"}
                  onClick={() => setEquipment("dumbbells")}
                />
                <ChoiceCard
                  title="Bodyweight"
                  description="Travel weeks, parks, living-room sessions."
                  selected={equipment === "bodyweight"}
                  onClick={() => setEquipment("bodyweight")}
                />
              </div>
            </section>
          )}

          {step === 5 && (
            <section>
              <h1 className="text-3xl uppercase tracking-wide">Goal</h1>
              <p className="mt-2 text-[var(--mid-slate)]">
                This steers the predictor and how the coach adapts.
              </p>
              <div className="mt-6 grid gap-3">
                <ChoiceCard
                  title="Lose fat"
                  description="Keep muscle, tighten the trend."
                  selected={goal === "lose_fat"}
                  onClick={() => setGoal("lose_fat")}
                />
                <ChoiceCard
                  title="Build muscle"
                  description="Progressive overload with hypertrophy volume."
                  selected={goal === "build_muscle"}
                  onClick={() => setGoal("build_muscle")}
                />
                <ChoiceCard
                  title="Both"
                  description="Recomp — patient, protein-forward, strong compounds."
                  selected={goal === "both"}
                  onClick={() => setGoal("both")}
                />
                <ChoiceCard
                  title="General health"
                  description="Feel capable, move well, stay consistent."
                  selected={goal === "general_health"}
                  onClick={() => setGoal("general_health")}
                />
              </div>
            </section>
          )}

          {step === 6 && (
            <section>
              <h1 className="text-3xl uppercase tracking-wide">You&apos;re ready</h1>
              <p className="mt-2 text-[var(--mid-slate)]">
                Next you&apos;ll pick or build a program, then log lifts in My Numbers.
                Partial data is fine — we fill gaps as you train.
              </p>
              <div className="mt-6 rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 text-sm text-[var(--navy)] space-y-1">
                <p>
                  <span className="text-[var(--mid-slate)]">Profile:</span> {age}y ·{" "}
                  {heightCm} cm · {currentWeightKg} → {goalWeightKg} kg
                </p>
                <p>
                  <span className="text-[var(--mid-slate)]">Schedule:</span>{" "}
                  {daysPerWeek}×/{sessionMinutes} min · {equipment.replace("_", " ")}
                </p>
                <p>
                  <span className="text-[var(--mid-slate)]">Aim:</span> {goal.replace("_", " ")} ·{" "}
                  {experience}
                </p>
              </div>
            </section>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={back} disabled={step === 1}>
            Back
          </Button>
          {step < TOTAL ? (
            <Button onClick={next}>Continue</Button>
          ) : (
            <Button onClick={() => completeOnboarding(profile)}>
              Enter Muscle Habit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
