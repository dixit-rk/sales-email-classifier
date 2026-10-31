import { useEffect } from "react";

/** While `open`, calls `onClose` on a press outside `ref` or on Escape. */
export function useDismissOnOutside(ref, open, onClose) {
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!ref.current.contains(event.target)) onClose();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, open, onClose]);
}
