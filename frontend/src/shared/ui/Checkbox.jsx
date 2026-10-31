import { useEffect, useRef } from "react";

/** Labelled checkbox with an optional indeterminate state. */
export function Checkbox({ checked, indeterminate = false, onChange, label, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className={`check ${className}`}
      checked={checked}
      onChange={onChange}
      aria-label={label}
    />
  );
}
