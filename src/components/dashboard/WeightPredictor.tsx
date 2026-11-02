"use client";

import { useApp } from "@/context/AppContext";
import { projectWeight } from "@/lib/formulas";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function WeightPredictor() {
  const { state } = useApp();
  if (!state.profile) return null;

  const { points, goalIsRealistic, message, realisticGoalKg } = projectWeight(
    state.profile,
    state.weighIns,
    state.settings.deficitPercent
  );

  const data = points.map((p) => ({
    week: `W${p.week}`,
    projected: p.projected,
    low: p.low,
    high: p.high,
    actual: p.actual ?? null,
  }));

  return (
    <section className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl uppercase tracking-wide">Weight path</h2>
          <p className="text-sm text-[var(--mid-slate)] mt-1">
            12-week projection with confidence band
            {!goalIsRealistic && (
              <> · healthy 12-week target ~{realisticGoalKg} kg</>
            )}
          </p>
        </div>
      </div>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2B3B4C22" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} />
            <YAxis
              domain={["auto", "auto"]}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                borderColor: "#2B3B4C22",
                fontSize: 13,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="high"
              stroke="#FF4A0055"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              name="Upper band"
            />
            <Line
              type="monotone"
              dataKey="low"
              stroke="#FF4A0055"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              name="Lower band"
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#2B3B4C"
              strokeWidth={2.5}
              dot={false}
              name="Projected"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#FF4A00"
              strokeWidth={2.5}
              connectNulls={false}
              name="Actual"
              dot={{ r: 4, fill: "#FF4A00" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-sm text-[var(--mid-slate)]">{message}</p>
    </section>
  );
}
