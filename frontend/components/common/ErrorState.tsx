"use client";

import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state-panel" role="alert">
      <span className="state-panel__icon bg-danger-subtle text-danger-emphasis" aria-hidden="true">
        <i className="bi bi-exclamation-triangle" />
      </span>
      <h3 className="state-panel__title">{title}</h3>
      <p className="state-panel__message">{message}</p>
      {onRetry && (
        <Button variant="outline-primary" size="sm" icon="bi-arrow-clockwise" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
