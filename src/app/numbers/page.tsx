"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useApp } from "@/context/AppContext";
import { estimate1RM } from "@/lib/formulas";
import { MAIN_LIFTS, type LiftId } from "@/lib/types";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";

export default function NumbersPage() {
  const { state, addWeighIn, addLiftEntry, updateProfile } = useApp();
  const [weight, setWeight] = useState(state.profile?.currentWeightKg ?? 80);
  const [height, setHeight] = useState(state.profile?.heightCm ?? 175);

  const [liftId, setLiftId] = useState<LiftId>("bench");
  const [liftWeight, setLiftWeight] = useState(60);
  const [reps, setReps] = useState(8);
  const [working, setWorking] = useState(true);

  const e1rm = working ? estimate1RM(liftWeight, reps) : estimate1RM(liftWeight, reps);

  const liftHistory = useMemo(() => {
    return MAIN_LIFTS.map((lift) => {
      const entries = state.liftEntries
        .filter((e) => e.liftId === lift.id)
        .sort((a, b) => a.date.localeCompare(b.date));
      return { lift, entries };
    });
  }, [state.liftEntries]);

  const weighData = [...state.weighIns]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((w) => ({ date: w.date.slice(5), kg: w.weightKg }));

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-up">
      <header>
        <h1 className="text-3xl uppercase tracking-wide md:text-4xl">My Numbers</h1>
        <p className="mt-2 text-[var(--mid-slate)]">
          Personal stats and lift history. Skip what you don&apos;t know — partial data still works.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 md:p-5">
          <h2 className="text-xl uppercase tracking-wide">Personal stats</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="h">Height (cm)</Label>
              <Input
                id="h"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="w">Weigh-in (kg)</Label>
              <Input
                id="w"
                type="number"
                step={0.1}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                updateProfile({ heightCm: height, currentWeightKg: weight });
                addWeighIn(weight);
              }}
            >
              Log weigh-in
            </Button>
            <Button
              variant="outline"
              onClick={() => updateProfile({ heightCm: height })}
            >
              Save height
            </Button>
          </div>
          {weighData.length > 1 && (
            <div className="mt-6 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weighData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2B3B4C22" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis domain={["auto", "auto"]} width={36} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="kg"
                    stroke="#FF4A00"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {weighData.length <= 1 && (
            <p className="mt-4 text-sm text-[var(--mid-slate)]">
              Log a few weigh-ins to see your trend. We coach off four-week trends, not single mornings.
            </p>
          )}
        </section>

        <section className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 md:p-5">
          <h2 className="text-xl uppercase tracking-wide">Lift entry</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Label>Lift</Label>
              <div className="grid grid-cols-2 gap-2">
                {MAIN_LIFTS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLiftId(l.id)}
                    className={`rounded-md border px-3 py-2 text-left text-sm transition-colors duration-200 ${
                      liftId === l.id
                        ? "border-[var(--orange)] bg-[var(--orange-soft)]"
                        : "border-[var(--navy)]/12 hover:border-[var(--navy)]/30"
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="lw">Weight (kg)</Label>
                <Input
                  id="lw"
                  type="number"
                  min={0}
                  step={0.5}
                  value={liftWeight}
                  onChange={(e) => setLiftWeight(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="lr">Reps</Label>
                <Input
                  id="lr"
                  type="number"
                  min={1}
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--navy)]">
              <input
                type="checkbox"
                checked={working}
                onChange={(e) => setWorking(e.target.checked)}
                className="h-4 w-4 accent-[var(--orange)]"
              />
              Working weight (train weight for reps — used for estimated 1RM)
            </label>
            {working && (
              <p className="text-sm text-[var(--navy)]">
                Estimated 1RM:{" "}
                <span className="font-heading text-lg">{e1rm} kg</span>
              </p>
            )}
            <Button
              onClick={() =>
                addLiftEntry({
                  liftId,
                  weightKg: liftWeight,
                  reps,
                  isWorkingWeight: working,
                })
              }
            >
              Save lift entry
            </Button>
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-xl uppercase tracking-wide">Lift progression</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {liftHistory.map(({ lift, entries }) => (
            <div
              key={lift.id}
              className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-heading uppercase tracking-wide">{lift.name}</h3>
                {entries.length > 0 ? (
                  <span className="text-sm text-[var(--mid-slate)]">
                    e1RM {entries[entries.length - 1].estimated1RM} kg
                  </span>
                ) : (
                  <span className="text-sm text-[var(--mid-slate)]">No data yet</span>
                )}
              </div>
              {entries.length > 0 ? (
                <div className="mt-3 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={entries.map((e) => ({
                        date: e.date.slice(5),
                        e1rm: e.estimated1RM,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2B3B4C22" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} hide />
                      <YAxis domain={["auto", "auto"]} width={36} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="e1rm"
                        stroke="#2B3B4C"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#FF4A00" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mt-3 text-sm text-[var(--mid-slate)]">
                  Optional — add when ready.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
