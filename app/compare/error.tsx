"use client";

import { ErrorState } from "@/components/states/ErrorState";

export default function CompareError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      message={`Could not load the comparison: ${error.message}`}
      onRetry={reset}
    />
  );
}
