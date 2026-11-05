export interface LibraryVideo {
  id: string;
  youtubeId: string;
  title: string;
  runtime: string;
  description: string;
  topic: string;
}

/**
 * Curated evidence / habit library embeds (public education videos).
 * Replace youtubeId with official @MuscleHabit uploads as they publish.
 */
export const LIBRARY_VIDEOS: LibraryVideo[] = [
  {
    id: "eating-window",
    youtubeId: "qq9ExcIQRmU",
    title: "12-Hour Eating Window + Exercise Protocol",
    runtime: "18 min",
    description:
      "Frontiers-in-Nutrition–aligned framing: a sustainable ~12-hour window that supports training, muscle retention, and fat loss without extreme 16-hour fasting.",
    topic: "Nutrition",
  },
  {
    id: "anabolic-ledger",
    youtubeId: "lu_BObG6dj8",
    title: "The Anabolic Ledger: Stress, Cortisol, and Muscle Protein Synthesis",
    runtime: "22 min",
    description:
      "How recovery debt and training stress shift the anabolic ledger — and why sleep, deloads, and habit strength protect muscle protein synthesis.",
    topic: "Recovery",
  },
  {
    id: "hypertrophy-essentials",
    youtubeId: "V7Tt_h6UuEI",
    title: "Hypertrophy Essentials: Progressive Overload & Deload Rules",
    runtime: "16 min",
    description:
      "Double progression, hard-set volume ranges, and when a 5% load deload (or scheduled cutback) keeps progress moving.",
    topic: "Training",
  },
  {
    id: "habit-stacking",
    youtubeId: "Si-EgVxY1Gk",
    title: "Sustainable Habit Stacking for Busy Lifters",
    runtime: "14 min",
    description:
      "Time-efficient programming choices and consistency habits that survive real workweeks — stack small wins, not heroic sessions.",
    topic: "Habits",
  },
];
