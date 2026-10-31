import { CircleCheck, LoaderCircle, Mail, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "../../../shared/ui";
import { formatFullDate } from "../../../shared/lib/formatDate";
import { googleLoginUrl } from "../../auth";

const PILLS = {
  checking: { className: "pill-muted", text: "Checking…" },
  connected: { className: "online", text: "Connected" },
  "not-syncing": { className: "pill-warn", text: "Not receiving emails" },
  expired: { className: "pill-warn", text: "Needs attention" },
  unavailable: { className: "pill-muted", text: "Unavailable" },
};

const statusOf = ({ data, error, loading }) => {
  if (loading) return "checking";
  if (error) return "unavailable";

  // A valid Google token alone is not enough: Gmail must also be set to notify us of new emails.
  if (data.status === "connected" && !data.watching) return "not-syncing";

  return data.status;
};

function Body({ status, connection }) {
  const { data, error } = connection;

  if (status === "checking") {
    return <p className="connection-note"><LoaderCircle className="spin" size={16} aria-hidden="true" /> Checking your connection with Google…</p>;
  }

  if (status === "not-syncing") {
    return (
      <div className="notice warn" role="alert">
        <TriangleAlert size={18} aria-hidden="true" />
        <div>
          <b>Signed in, but new emails are not being picked up</b>
          <p>Your Google account is connected, but we couldn’t start receiving notifications for {data.email}. Press “Check connection again” to retry. If it keeps happening, reconnect with “Manage connection”.</p>
        </div>
      </div>
    );
  }

  if (status === "connected") {
    return (
      <dl className="detail-list">
        <div><dt>Account</dt><dd>{data.email}</dd></div>
        <div><dt>New emails</dt><dd>Being received</dd></div>
        <div><dt>Last checked</dt><dd>{formatFullDate(data.checkedAt)}</dd></div>
      </dl>
    );
  }

  if (status === "expired") {
    return (
      <div className="notice warn" role="alert">
        <TriangleAlert size={18} aria-hidden="true" />
        <div>
          <b>Your Gmail access has expired</b>
          <p>Google no longer lets ChemQuote read this inbox, so new emails are not being classified. Reconnect to start again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notice" role="alert">
      <TriangleAlert size={18} aria-hidden="true" />
      <div>
        <b>Couldn’t check the connection</b>
        <p>{error?.message ?? "Google could not be reached. Your connection may still be fine."}</p>
      </div>
    </div>
  );
}

/** Gmail connection status, checked live on every visit, with a way to reconnect when it has expired. */
export function ConnectionCard({ connection }) {
  const status = statusOf(connection);
  const pill = PILLS[status];
  const needsReconnect = status === "expired" || status === "not-syncing";

  return (
    <section className="panel settings-card" aria-busy={status === "checking"}>
      <header className="settings-card-head">
        <span className="stat-icon"><Mail aria-hidden="true" /></span>
        <div>
          <h3>Gmail connection</h3>
          <p>Your Gmail inbox powers the real-time inquiry classifier.</p>
        </div>
        <span className={`status-pill ${pill.className}`}>
          {status === "connected" && <CircleCheck size={13} aria-hidden="true" />}
          {pill.text}
        </span>
      </header>
      <div className="settings-card-body"><Body status={status} connection={connection} /></div>
      <footer className="settings-card-foot">
        <a className={`btn ${needsReconnect ? "primary" : ""}`} href={googleLoginUrl}>Manage connection</a>
        <Button icon={RefreshCw} onClick={connection.reload} disabled={status === "checking"}>Check connection again</Button>
      </footer>
    </section>
  );
}
