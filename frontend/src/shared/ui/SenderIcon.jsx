/** Round avatar with the sender's initial. */
export function SenderIcon({ name = "" }) {
  return (
    <span className="sender-avatar" aria-hidden="true">
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
