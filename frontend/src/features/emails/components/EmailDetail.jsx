import { ArrowLeft, ExternalLink, Mail, MailOpen, Sparkles } from "lucide-react";
import { formatFullDate } from "../../../shared/lib/formatDate";
import { Button, ErrorState, IconButton, LoadingState, SenderIcon, Tag } from "../../../shared/ui";
import { gmailThreadUrl, productLabel } from "../lib/emailDisplay";

function Insights({ email }) {
  return (
    <div className="insight">
      <div className="insight-head"><Sparkles size={17} aria-hidden="true" /> AI-extracted details</div>
      <div className="insight-grid">
        <div><small>Product</small><strong>{productLabel(email)}</strong></div>
        <div><small>Quantity</small><strong>{email.quantity || "Not stated"}</strong></div>
        <div><small>Classification</small><strong>{email.needsReview ? "Approved after review" : "Pricing inquiry"}</strong></div>
        <div><small>Reason</small><strong>{email.reason || "—"}</strong></div>
      </div>
    </div>
  );
}

/** Reading pane for one email; `onBack` is the phone-width way back to the list. */
export function EmailDetail({ state, onBack, onToggleRead, busy }) {
  const { email, loading, error, reload } = state;

  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (loading || !email) return <LoadingState label="Loading email…" />;

  return (
    <>
      <div className="detail-head">
        <IconButton icon={ArrowLeft} label="Back to inbox" className="detail-back" onClick={onBack} />
        <h2>{email.subject || "(no subject)"}</h2>
        <div className="meta"><Tag tone="green">Pricing inquiry</Tag><Tag>AI detected</Tag></div>
      </div>
      <div className="detail-body">
        <div className="from-row">
          <SenderIcon name={email.fromName} />
          <div><b>{email.fromName}</b><small>{email.fromEmail} · {formatFullDate(email.receivedAt)}</small></div>
        </div>
        <div className="email-body">{email.body}</div>
        <Insights email={email} />
      </div>
      <div className="detail-foot">
        <a className="btn primary" href={gmailThreadUrl(email)} target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden="true" /> Open in Gmail
        </a>
        <Button icon={email.isRead ? Mail : MailOpen} onClick={onToggleRead} busy={busy} busyLabel="Saving…">
          {email.isRead ? "Mark unread" : "Mark read"}
        </Button>
      </div>
    </>
  );
}
