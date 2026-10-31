import { X } from "lucide-react";
import { Link } from "react-router-dom";
import "./toast.css";

function ToastBody({ toast }) {
  return (
    <>
      {toast.title && <strong>{toast.title}</strong>}
      <span>{toast.message}</span>
    </>
  );
}

/** Stack of dismissible messages; a toast with `to` is a link to that route. */
export function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.tone}`}>
          {toast.to ? (
            <Link to={toast.to} className="toast-body" onClick={() => onDismiss(toast.id)}>
              <ToastBody toast={toast} />
            </Link>
          ) : (
            <div className="toast-body">
              <ToastBody toast={toast} />
            </div>
          )}
          <button type="button" className="icon-btn" aria-label="Dismiss message" onClick={() => onDismiss(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
