/** Icon-only button; `label` is its accessible name. */
export function IconButton({ icon: Icon, label, size = 18, className = "", ...props }) {
  return (
    <button type="button" className={`icon-btn ${className}`} aria-label={label} title={label} {...props}>
      <Icon size={size} aria-hidden="true" />
    </button>
  );
}
