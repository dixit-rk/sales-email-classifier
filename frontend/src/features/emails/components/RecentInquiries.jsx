import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatListDate } from "../../../shared/lib/formatDate";
import { ROUTES } from "../../../shared/routes";
import { EmptyState, ErrorState, LoadingState, SenderIcon, Tag } from "../../../shared/ui";
import { useRecentEmails } from "../hooks/useRecentEmails";
import { productLabel } from "../lib/emailDisplay";

/** Latest inquiries panel for the Overview page; each row opens that email in the inbox. */
export function RecentInquiries() {
  const { data, error, reload } = useRecentEmails();

  const body = () => {
    if (error) return <ErrorState message={error.message} onRetry={reload} />;
    if (!data) return <LoadingState label="Loading inquiries…" />;
    if (data.length === 0) return <EmptyState title="No inquiries yet" hint="New pricing requests appear here as they arrive." />;

    return data.map((email) => (
      <Link key={email.id} to={`${ROUTES.inbox}?id=${email.id}`} className="inquiry">
        <SenderIcon name={email.fromName} />
        <div style={{ minWidth: 0 }}>
          <div className="sender">{email.fromName}</div>
          <div className="subject">{email.subject}</div>
          <div className="meta"><Tag>{productLabel(email)}</Tag></div>
        </div>
        <div className="time">{formatListDate(email.receivedAt)}</div>
      </Link>
    ));
  };

  return (
    <section className="panel recent-panel">
      <div className="panel-head">
        <h3>Recent inquiries</h3>
        <Link to={ROUTES.inbox} className="link">View all <ArrowUpRight size={12} aria-hidden="true" /></Link>
      </div>
      {body()}
    </section>
  );
}
