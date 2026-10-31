import { useState } from "react";

const MODE_IDS = "ids";
const MODE_ALL = "all";

const emptyState = (scopeKey) => ({ scopeKey, mode: MODE_IDS, ids: new Set(), excluded: new Set() });

const toggled = (set, id) => {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

/**
 * Selection that spans pages. "Select all" selects every row matching the current
 * filters (not only the visible page); individual unticks are kept as exclusions.
 * The selection resets itself when `scopeKey` (the active filters) changes.
 */
export function useSelection(scopeKey) {
  const [stored, setStored] = useState(() => emptyState(scopeKey));
  const state = stored.scopeKey === scopeKey ? stored : emptyState(scopeKey);

  const isAll = state.mode === MODE_ALL;

  return {
    isSelected: (id) => (isAll ? !state.excluded.has(id) : state.ids.has(id)),
    count: (total) => (isAll ? Math.max(0, total - state.excluded.size) : state.ids.size),
    toggle: (id) =>
      setStored(isAll ? { ...state, excluded: toggled(state.excluded, id) } : { ...state, ids: toggled(state.ids, id) }),
    selectAll: () => setStored({ ...emptyState(scopeKey), mode: MODE_ALL }),
    clear: () => setStored(emptyState(scopeKey)),
    /** Request body fragment: explicit ids, or the filters plus exclusions for a select-all. */
    toPayload: (filters) =>
      isAll
        ? { mode: MODE_ALL, filters, excludeIds: [...state.excluded] }
        : { mode: MODE_IDS, ids: [...state.ids] },
  };
}
