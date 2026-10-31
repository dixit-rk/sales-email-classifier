import { MAX_BODY, MAX_SUBJECT } from "../constants";

/** The sample customer email: an optional subject and the text of the message. */
export function EmailEditor({ email, error, onChange }) {
  return (
    <section className="panel pg-card" aria-labelledby="pg-email-title">
      <header className="pg-card-head">
        <div>
          <span className="pg-step">Step 2</span>
          <h2 id="pg-email-title">A customer email</h2>
          <p>Write or paste any email. It is not saved.</p>
        </div>
      </header>
      <div className="pg-form">
        <div className="pg-field">
          <label htmlFor="pg-subject">Subject (optional)</label>
          <input id="pg-subject" value={email.subject} maxLength={MAX_SUBJECT} autoComplete="off" onChange={(event) => onChange({ ...email, subject: event.target.value })} />
        </div>
        <div className="pg-field">
          <label htmlFor="pg-body">Email text</label>
          <textarea
            id="pg-body"
            rows={9}
            value={email.body}
            maxLength={MAX_BODY}
            aria-invalid={Boolean(error)}
            aria-describedby="pg-body-count"
            onChange={(event) => onChange({ ...email, body: event.target.value })}
          />
          <div className="pg-body-meta">
            {error ? <span className="field-error" role="alert">{error}</span> : <span />}
            <span id="pg-body-count" className="field-hint">{email.body.length} / {MAX_BODY}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
