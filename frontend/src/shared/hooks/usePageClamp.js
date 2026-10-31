import { useEffect } from "react";

/** Moves to the last page when the current one no longer exists (for example after the last row was removed). */
export function usePageClamp(meta, page, setPage) {
  useEffect(() => {
    if (meta && page > 1 && page > meta.totalPages) setPage(Math.max(1, meta.totalPages));
  }, [meta, page, setPage]);
}
