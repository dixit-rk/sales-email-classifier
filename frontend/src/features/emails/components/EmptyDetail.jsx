import { MailOpen, Sparkles } from "lucide-react";
import { useEmailCounts } from "../countsContext";

/** Reading-pane placeholder shown until an email is opened. */
export function EmptyDetail() {
  const { counts } = useEmailCounts();

  return (
    <div className="empty-detail">
      <div className="empty-detail-art" aria-hidden="true">
        <span className="empty-detail-ring ring-outer" />
        <span className="empty-detail-ring ring-inner" />
        <span className="empty-detail-icon"><MailOpen size={34} /></span>
        <span className="empty-detail-spark"><Sparkles size={16} /></span>
      </div>
      <h2>Select a conversation</h2>
      <p>Pick an inquiry from the list to read the full email, see what the AI extracted and open the thread in Gmail.</p>
      {counts && (
        <div className="empty-detail-stats">
          <span><b>{counts.inbox}</b> inquiries</span>
          <span><b>{counts.unreadInbox}</b> unread</span>
        </div>
      )}
    </div>
  );
}
