import { Checkbox } from "./Checkbox";

/**
 * Select-all header for a paginated list. Ticking it selects every row matching
 * the filters across all pages; `children` are the bulk actions shown once something is selected.
 */
export function SelectionBar({ selectedCount, total, onToggleAll, onClear, children }) {
  const allSelected = total > 0 && selectedCount === total;

  return (
    <div className="selection-bar">
      <Checkbox
        checked={allSelected}
        indeterminate={selectedCount > 0 && !allSelected}
        onChange={onToggleAll}
        label={`Select all ${total} matching`}
      />
      {selectedCount > 0 ? (
        <>
          <span className="selection-count" aria-live="polite">
            {selectedCount} of {total} selected
          </span>
          <div className="selection-actions">
            {children}
            <button type="button" className="link" onClick={onClear}>Clear</button>
          </div>
        </>
      ) : (
        <span className="selection-count">Select all {total}</span>
      )}
    </div>
  );
}
