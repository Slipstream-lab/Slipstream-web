import { scoreToGrade, type GradeView } from "@/lib/grade";

const TONE_CLASSES: Record<GradeView["tone"], string> = {
  green: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  lime: "bg-lime-500/15 text-lime-300 ring-lime-500/30",
  amber: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  orange: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
  red: "bg-red-500/15 text-red-300 ring-red-500/30",
};

export interface GradeBadgeProps {
  score: number;
  /** Show the numeric score alongside the letter. */
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "text-lg h-9 w-9",
  md: "text-2xl h-12 w-12",
  lg: "text-4xl h-20 w-20",
} as const;

/** A letter-grade badge coloured by contention severity. */
export function GradeBadge({
  score,
  showScore = false,
  size = "md",
}: GradeBadgeProps) {
  const grade = scoreToGrade(score);
  return (
    <div className="inline-flex items-center gap-3" title={grade.label}>
      <span
        className={`inline-flex items-center justify-center rounded-xl font-bold ring-1 ${TONE_CLASSES[grade.tone]} ${SIZE_CLASSES[size]}`}
        aria-label={`Grade ${grade.letter}: ${grade.label}`}
        role="img"
      >
        {grade.letter}
      </span>
      {showScore && (
        <span className="flex flex-col leading-tight">
          <span className="text-xl font-semibold text-slate-100">
            {Math.round(score)}
            <span className="text-sm text-slate-400">/100</span>
          </span>
          <span className="text-xs text-slate-400">{grade.label}</span>
        </span>
      )}
    </div>
  );
}
