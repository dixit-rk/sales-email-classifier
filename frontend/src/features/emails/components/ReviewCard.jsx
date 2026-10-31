import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button, Checkbox, Tag } from "../../../shared/ui";
import { productLabel } from "../lib/emailDisplay";
import { ReviewFullEmail } from "./ReviewFullEmail";

/** One email waiting for a human decision, with select, approve, dismiss and a full-email toggle. */
export function ReviewCard({ email, checked, onToggle, expanded, onToggleExpand, onApprove, onDismiss, busy }) {
  const hasProduct = email.products.length > 0;

  return (
    <li className="review-card review-expanded">
      <div className="review-summary">
        <div className="review-heading">
          <Checkbox checked={checked} onChange={onToggle} label={`Select email from ${email.fromName}`} className="review-check" />
          <div className="review-heading-copy">
            <div className="meta" style={{ margin: "0 0 12px" }}>
              <Tag tone="review">Needs verification</Tag>
              <Tag>AI suggestion · {productLabel(email)}</Tag>
            </div>
            <h3>{email.subject || "(no subject)"}</h3>
            <p>{email.fromName} · {email.fromEmail}</p>
          </div>
          <div className="review-top-actions">
            <Button icon={X} onClick={onDismiss} disabled={busy}>Dismiss</Button>
            <Button
              variant="primary"
              icon={Check}
              onClick={onApprove}
              disabled={busy || !hasProduct}
              title={hasProduct ? undefined : "No catalog product identified, so this cannot be approved"}
            >
              Approve as Inquiry
            </Button>
          </div>
        </div>
        <p className="sub" style={{ marginTop: 8 }}>{email.snippet}</p>
        <div className="review-insights">
          <div><small>AI identified</small><b>{productLabel(email)}</b></div>
          <div><small>Quantity mentioned</small><b>{email.quantity || "Not stated"}</b></div>
          <div><small>Reason for review</small><b>{email.reason || "Product name is ambiguous"}</b></div>
        </div>
        <button type="button" className="review-toggle" aria-expanded={expanded} aria-controls={`review-email-${email.id}`} onClick={onToggleExpand}>
          {expanded ? <ChevronUp size={17} aria-hidden="true" /> : <ChevronDown size={17} aria-hidden="true" />}
          {expanded ? "Hide full email" : "Read full email"}
        </button>
      </div>
      {expanded && <ReviewFullEmail id={email.id} />}
    </li>
  );
}
