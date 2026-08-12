"use client";

import { ErrorState } from "@/components/states/ErrorState";

export default function LeaderboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      message={`Could not load the leaderboard: ${error.message}`}
      onRetry={reset}
    />
  );
}
