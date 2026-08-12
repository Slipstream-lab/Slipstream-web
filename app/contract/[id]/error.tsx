"use client";

import { ErrorState } from "@/components/states/ErrorState";

export default function ContractError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      message={`Could not load this contract: ${error.message}`}
      onRetry={reset}
    />
  );
}
