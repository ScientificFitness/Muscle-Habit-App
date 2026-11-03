"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const { state, updateSettings, resetAll } = useApp();
  const [shopUrl, setShopUrl] = useState(state.settings.shopUrl);
  const [deficit, setDeficit] = useState(state.settings.deficitPercent);
  const [volMin, setVolMin] = useState(state.settings.volumeMinSets);
  const [volMax, setVolMax] = useState(state.settings.volumeMaxSets);

  return (
    <div className="mx-auto max-w-lg space-y-6 animate-fade-up">
      <header>
        <h1 className="text-3xl uppercase tracking-wide">Settings</h1>
        <p className="mt-2 text-[var(--mid-slate)]">
          Tunables for the coach engine. Everything stays on this device.
        </p>
      </header>

      <section className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 space-y-4">
        <div>
          <Label htmlFor="shop">Shop URL</Label>
          <Input
            id="shop"
            value={shopUrl}
            onChange={(e) => setShopUrl(e.target.value)}
            placeholder="https://musclehabit.shop"
          />
        </div>
        <div>
          <Label htmlFor="def">Default deficit %</Label>
          <Input
            id="def"
            type="number"
            min={10}
            max={25}
            value={deficit}
            onChange={(e) => setDeficit(Number(e.target.value))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="vmin">Volume min sets</Label>
            <Input
              id="vmin"
              type="number"
              value={volMin}
              onChange={(e) => setVolMin(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="vmax">Volume max sets</Label>
            <Input
              id="vmax"
              type="number"
              value={volMax}
              onChange={(e) => setVolMax(Number(e.target.value))}
            />
          </div>
        </div>
        <Button
          onClick={() =>
            updateSettings({
              shopUrl,
              deficitPercent: deficit,
              volumeMinSets: volMin,
              volumeMaxSets: volMax,
            })
          }
        >
          Save settings
        </Button>
      </section>

      <section className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 space-y-3">
        <h2 className="text-lg uppercase tracking-wide">Shortcuts</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/planner/numbers">
            <Button variant="outline" size="sm">
              My Numbers
            </Button>
          </Link>
          <Link href="/planner/programs/coach">
            <Button variant="outline" size="sm">
              Coach Builder
            </Button>
          </Link>
          <a href={state.settings.shopUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              Open Shop
            </Button>
          </a>
        </div>
      </section>

      <section className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4">
        <h2 className="text-lg uppercase tracking-wide">Data</h2>
        <p className="mt-2 text-sm text-[var(--mid-slate)]">
          All data lives in localStorage. Reset clears onboarding, logs, and programs on this
          browser.
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => {
            if (confirm("Reset all Muscle Habit data on this device?")) resetAll();
          }}
        >
          Reset local data
        </Button>
      </section>
    </div>
  );
}
