import { cx } from "@/lib/cx";

interface LoadingProps {
  label?: string;
  className?: string;
}

export default function Loading({ label = "Loading…", className }: LoadingProps) {
  return (
    <div className={cx("state-panel", className)} role="status" aria-live="polite">
      <div className="spinner-border text-primary" aria-hidden="true" />
      <p className="state-panel__message">{label}</p>
    </div>
  );
}
