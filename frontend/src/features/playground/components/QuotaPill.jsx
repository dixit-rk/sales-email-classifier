/** How many free requests are left for this device and network. */
export function QuotaPill({ usage }) {
  if (!usage) return null;

  return (
    <span className={`pg-quota ${usage.remaining === 0 ? "empty" : ""}`} role="status">
      {usage.remaining} of {usage.limit} free requests left
    </span>
  );
}
