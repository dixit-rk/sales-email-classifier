/** A small mouse pointer that the animations move around. */
export function Cursor({ className }) {
  return (
    <svg className={`m-cursor ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3l14 8-6 2-2 6z" />
    </svg>
  );
}
