import { Button, Modal } from "../../../shared/ui";
import { MAX_ERRORS_SHOWN } from "../constants";

/** Summary of an Excel upload: how many products were added, updated and skipped, with the reason for each skipped row. */
export function ImportResultDialog({ result, onClose }) {
  const shown = result?.errors.slice(0, MAX_ERRORS_SHOWN) ?? [];
  const more = (result?.errors.length ?? 0) - shown.length;

  return (
    <Modal open={result !== null} title="Upload finished" onClose={onClose} wide>
      {result && (
        <>
          <div className="import-summary">
            <span><b>{result.created}</b> added</span>
            <span><b>{result.updated}</b> updated</span>
            <span><b>{result.skipped}</b> skipped</span>
          </div>
          {shown.length > 0 && (
            <ul className="import-errors" aria-label="Skipped rows">
              {shown.map((error) => (
                <li key={error.row}>
                  <b>Row {error.row}</b>{error.name ? ` · ${error.name}` : ""}<span>{error.message}</span>
                </li>
              ))}
              {more > 0 && <li>…and {more} more</li>}
            </ul>
          )}
          <div className="confirm-actions"><Button variant="primary" onClick={onClose}>Done</Button></div>
        </>
      )}
    </Modal>
  );
}
