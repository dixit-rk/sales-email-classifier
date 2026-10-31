/** Small pill; `tone` is "review", "green", "manual" or empty for the accent colour. */
export function Tag({ tone = "", children }) {
  return <span className={`tag ${tone}`}>{children}</span>;
}
