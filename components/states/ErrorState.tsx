export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-start gap-3 rounded-lg bg-red-500/10 p-4 ring-1 ring-red-600/30 dark:ring-red-500/30"
      role="alert"
    >
      <p className="text-sm text-red-700 dark:text-red-200">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded bg-red-500/20 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-500/30 dark:text-red-100"
        >
          Retry
        </button>
      )}
    </div>
  );
}
