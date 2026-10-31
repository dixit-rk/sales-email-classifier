import { AlertCircle, Inbox, Mail, Sparkles } from "lucide-react";
import { toStatCards } from "../lib/formatStats";

const ICONS = { mail: Mail, inbox: Inbox, sparkles: Sparkles, "alert-circle": AlertCircle };

/** The four headline numbers at the top of Overview and Analytics; `period` words the change note. */
export function StatCards({ cards, period }) {
  return (
    <div className="stats">
      {toStatCards(cards, period).map(({ label, value, note, icon }) => {
        const Icon = ICONS[icon];

        return (
          <div className="stat" key={label}>
            <div className="stat-top">{label}<span className="stat-icon"><Icon aria-hidden="true" /></span></div>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        );
      })}
    </div>
  );
}
