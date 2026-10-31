import { useEffect, useId, useRef } from "react";

/** Modal built on the native dialog element (focus trap and Escape come for free); `wide` allows more content. */
export function Modal({ open, title, onClose, children, wide = false }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className={`confirm-dialog ${wide ? "wide" : ""}`} onCancel={onClose} aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      {children}
    </dialog>
  );
}
