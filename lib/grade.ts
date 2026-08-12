/**
 * Score → letter-grade mapping and presentation helpers.
 *
 * Pure and deterministic. The score is a 0–100 contention score (higher is
 * better parallelism / lower contention) produced by `slipstream-api`; this
 * module only maps it to a letter and presentation metadata. The thresholds
 * MUST be kept in sync with the API's grade model (`slipstream-api`
 * `modules/analysis/grade.ts`).
 */

export type Letter = "A" | "B" | "C" | "D" | "F";

export interface GradeView {
  letter: Letter;
  /** A semantic color token (Tailwind-friendly) for the badge. */
  tone: "green" | "lime" | "amber" | "orange" | "red";
  /** A short human label. */
  label: string;
}

/** Inclusive lower bounds for each letter grade. */
export const GRADE_THRESHOLDS: ReadonlyArray<{ min: number; letter: Letter }> =
  [
    { min: 90, letter: "A" },
    { min: 75, letter: "B" },
    { min: 60, letter: "C" },
    { min: 40, letter: "D" },
    { min: 0, letter: "F" },
  ];

const LETTER_META: Record<Letter, Omit<GradeView, "letter">> = {
  A: { tone: "green", label: "Excellent parallelism" },
  B: { tone: "lime", label: "Good parallelism" },
  C: { tone: "amber", label: "Moderate contention" },
  D: { tone: "orange", label: "High contention" },
  F: { tone: "red", label: "Severe contention" },
};

/** Clamps a raw number into the valid 0–100 score range. */
export function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, score));
}

/** Maps a 0–100 score to its letter grade. */
export function scoreToLetter(score: number): Letter {
  const s = clampScore(score);
  for (const { min, letter } of GRADE_THRESHOLDS) {
    if (s >= min) return letter;
  }
  return "F";
}

/** Maps a 0–100 score to a full grade view (letter + presentation). */
export function scoreToGrade(score: number): GradeView {
  const letter = scoreToLetter(score);
  return { letter, ...LETTER_META[letter] };
}
