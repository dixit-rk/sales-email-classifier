import { Sparkles } from "lucide-react";
import { formatFullDate } from "../../../shared/lib/formatDate";
import { ErrorState, LoadingState } from "../../../shared/ui";
import { useEmailDetail } from "../hooks/useEmailDetail";
import { productLabel } from "../lib/emailDisplay";

/** Expanded original email beside the AI's reasoning, loaded on demand. */
export function ReviewFullEmail({ id }) {
  const { email, loading, error, reload } = useEmailDetail(id);

  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (loading || !email) return <LoadingState label="Loading email…" />;

  return (
    <div className="review-full" id={`review-email-${id}`}>
      <div className="review-mail-heading">
        <div><span className="review-mail-kicker">CUSTOMER MESSAGE</span><h4>Original email</h4></div>
        <span>{formatFullDate(email.receivedAt)}</span>
      </div>
      <div className="review-mail-layout">
        <div className="review-letter">
          <div className="review-mail-meta">
            <div><span>FROM</span><strong>{email.fromName} &lt;{email.fromEmail}&gt;</strong></div>
            <div><span>SUBJECT</span><strong>{email.subject}</strong></div>
          </div>
          <div className="email-body">{email.body}</div>
        </div>
        <aside className="review-context">
          <div className="context-icon"><Sparkles size={19} aria-hidden="true" /></div>
          <h4>Why this needs review</h4>
          <p>{email.reason || "The product identity needs human verification before this message can be treated as a qualified inquiry."}</p>
          <div className="context-divider" />
          <span className="context-label">AI suggestion</span><strong>{productLabel(email)}</strong>
          <span className="context-label">Quantity detected</span><strong>{email.quantity || "Not stated"}</strong>
        </aside>
      </div>
    </div>
  );
}
