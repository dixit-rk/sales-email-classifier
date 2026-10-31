import { Check, Tag } from "lucide-react";
import { useState } from "react";
import { Button, ErrorState, LoadingState } from "../../../shared/ui";
import { useLabel } from "../hooks/useLabel";

const MAX_NAME = 60;

/** The one Gmail label put on pricing inquiries; it can be replaced and is created in Gmail when missing. */
export function LabelCard() {
  const { label, error, reload, saving, save } = useLabel();
  const [draft, setDraft] = useState(null);
  const [problem, setProblem] = useState("");

  const value = draft ?? label?.name ?? "";
  const unchanged = draft === null || draft.trim() === label?.name;

  const submit = async (event) => {
    event.preventDefault();

    if (!value.trim()) {
      setProblem("Enter a label name");
      return;
    }

    const failure = await save(value);

    setProblem(failure ?? "");
    if (!failure) setDraft(null);
  };

  const body = () => {
    if (error) return <ErrorState message={error.message} onRetry={reload} />;
    if (!label) return <LoadingState label="Loading label…" />;

    return (
      <dl className="detail-list">
        <div><dt>Current label</dt><dd><span className="label-chip"><Tag size={14} aria-hidden="true" /> {label.name}</span></dd></div>
      </dl>
    );
  };

  return (
    <section className="panel settings-card">
      <header className="settings-card-head">
        <span className="stat-icon"><Tag aria-hidden="true" /></span>
        <div>
          <h3>Gmail label</h3>
          <p>Qualified pricing inquiries are marked with this label in Gmail.</p>
        </div>
      </header>
      <div className="settings-card-body">{body()}</div>
      <form className="settings-card-foot label-form" onSubmit={submit} noValidate>
        <label htmlFor="label-name" className="label-form-title">Use a different label</label>
        <div className="label-input">
          <input
            id="label-name"
            value={value}
            maxLength={MAX_NAME}
            disabled={!label}
            autoComplete="off"
            aria-invalid={Boolean(problem)}
            aria-describedby="label-name-help"
            onChange={(event) => setDraft(event.target.value)}
          />
          <Button variant="primary" icon={Check} type="submit" disabled={!label || unchanged} busy={saving} busyLabel="Saving…">Save label</Button>
        </div>
        <span id="label-name-help" className={problem ? "field-error" : "field-hint"} role={problem ? "alert" : undefined}>
          {problem || "If the label does not exist in your Gmail yet, we create it for you. Threads that already have the old label keep it."}
        </span>
      </form>
    </section>
  );
}
