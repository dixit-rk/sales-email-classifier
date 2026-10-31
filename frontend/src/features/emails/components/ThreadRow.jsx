import { Checkbox, Tag } from "../../../shared/ui";
import { formatListDate } from "../../../shared/lib/formatDate";
import { productLabel } from "../lib/emailDisplay";

/** One inbox row: a selection checkbox and a button that opens the email. */
export function ThreadRow({ email, active, checked, onToggle, onOpen }) {
  return (
    <li className={`thread ${active ? "selected" : ""} ${email.isRead ? "" : "unread"}`}>
      <Checkbox checked={checked} onChange={onToggle} label={`Select email from ${email.fromName}`} />
      <button type="button" className="thread-body" aria-current={active} onClick={() => onOpen(email)}>
        <span className="thread-top">
          <span className="thread-title">{email.fromName}</span>
          <span className="time">{formatListDate(email.receivedAt)}</span>
        </span>
        <span className="thread-subject">{email.subject || "(no subject)"}</span>
        <span className="thread-snippet">{email.snippet}</span>
        <span className="meta">
          <Tag tone={email.needsReview ? "review" : ""}>{productLabel(email)}</Tag>
          <Tag tone="green">AI detected</Tag>
        </span>
      </button>
    </li>
  );
}
