import { Button } from "./Button";
import { Modal } from "./Modal";

/** Modal confirmation with a cancel and a confirm button. */
export function ConfirmDialog({ open, title, message, confirmLabel, busy, onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="confirm-actions">
        <Button onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button variant="primary" onClick={onConfirm} busy={busy} busyLabel="Working…">
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
