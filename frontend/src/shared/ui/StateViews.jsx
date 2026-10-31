import { Button } from "./Button";

/** Loading placeholder for an async view. */
export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="empty" role="status">
      {label}
    </div>
  );
}

/** Empty placeholder with an optional icon and hint. */
export function EmptyState({ title, hint, icon: Icon }) {
  return (
    <div className="empty">
      {Icon && <span className="empty-icon"><Icon size={26} aria-hidden="true" /></span>}
      <strong>{title}</strong>
      {hint && <p>{hint}</p>}
    </div>
  );
}

/** Error placeholder with a retry button. */
export function ErrorState({ message, onRetry }) {
  return (
    <div className="empty" role="alert">
      <strong>{message}</strong>
      {onRetry && (
        <p>
          <Button onClick={onRetry}>Try again</Button>
        </p>
      )}
    </div>
  );
}
