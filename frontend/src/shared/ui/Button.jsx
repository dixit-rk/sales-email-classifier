/** Text button; `variant` is "primary" or "default"; shows `busyLabel` and disables itself while `busy`. */
export function Button({ variant = "default", icon: Icon, busy = false, busyLabel, children, ...props }) {
  return (
    <button type="button" className={`btn ${variant === "primary" ? "primary" : ""}`} disabled={busy || props.disabled} {...props}>
      {Icon && <Icon aria-hidden="true" />}
      {busy && busyLabel ? busyLabel : children}
    </button>
  );
}
