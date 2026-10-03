import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  message?: string;
  /** Bootstrap Icons class */
  icon?: string;
  /** Optional call to action, e.g. a link button */
  action?: ReactNode;
}

export default function EmptyState({ title, message, icon = "bi-inbox", action }: EmptyStateProps) {
  return (
    <div className="state-panel">
      <span className="state-panel__icon bg-primary-subtle text-primary-emphasis" aria-hidden="true">
        <i className={`bi ${icon}`} />
      </span>
      <h3 className="state-panel__title">{title}</h3>
      {message && <p className="state-panel__message">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
