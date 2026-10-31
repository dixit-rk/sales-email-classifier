import { CircleCheck, SearchX } from "lucide-react";
import { useState } from "react";
import { EmailFilters, ReviewCard, useEmailListPage, VIEWS } from "../features/emails";
import { Button, ConfirmDialog, EmptyState, ErrorState, LoadingState, PageHeader, Pagination, SelectionBar } from "../shared/ui";

const idSelection = (id) => ({ mode: "ids", ids: [id] });

/** Needs-review queue: approve or dismiss one email or a selection that can span pages. */
export default function ReviewPage() {
  const { params, update, setPage, list, filters, selection, actions } = useEmailListPage(VIEWS.review);
  const [expandedId, setExpandedId] = useState(null);
  const [pendingDismiss, setPendingDismiss] = useState(null);
  const { data, error, loading, reload } = list;
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const selectedCount = selection.count(total);

  const confirmDismiss = async () => {
    await actions.decide(pendingDismiss.selection, "dismissed", pendingDismiss.count);
    setPendingDismiss(null);
  };

  const body = () => {
    if (error) return <ErrorState message={error.message} onRetry={reload} />;
    if (!data) return <LoadingState label="Loading reviews…" />;
    if (data.data.length === 0) {
      return (
        <div className="panel">
          <EmptyState
            icon={params.search ? SearchX : CircleCheck}
            title={params.search ? "No reviews match this search" : "You’re all caught up"}
            hint={params.search ? "Try a different search term." : "Emails the AI is unsure about will appear here for a quick check."}
          />
        </div>
      );
    }

    return (
      <ul className="review-list" aria-busy={loading}>
        {data.data.map((email) => (
          <ReviewCard
            key={email.id}
            email={email}
            checked={selection.isSelected(email.id)}
            onToggle={() => selection.toggle(email.id)}
            expanded={expandedId === email.id}
            onToggleExpand={() => setExpandedId(expandedId === email.id ? null : email.id)}
            onApprove={() => actions.decide(idSelection(email.id), "approved", 1)}
            onDismiss={() => setPendingDismiss({ selection: idSelection(email.id), count: 1 })}
            busy={actions.busy}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="content review-list-wrap">
      <PageHeader eyebrow="HUMAN IN THE LOOP" title="Needs review" subtitle="Expand a request to read the complete customer email before making a decision." />
      <EmailFilters params={params} update={update} inline />
      {total > 0 && (
        <SelectionBar selectedCount={selectedCount} total={total} onToggleAll={selectedCount === total ? selection.clear : selection.selectAll} onClear={selection.clear}>
          <Button variant="primary" busy={actions.busy} onClick={() => actions.decide(selection.toPayload(filters), "approved", selectedCount)}>Approve selected</Button>
          <Button busy={actions.busy} onClick={() => setPendingDismiss({ selection: selection.toPayload(filters), count: selectedCount })}>Dismiss selected</Button>
        </SelectionBar>
      )}
      {body()}
      {total > 0 && <Pagination meta={meta} onPage={setPage} onLimit={(limit) => update({ limit })} />}
      <ConfirmDialog
        open={pendingDismiss !== null}
        title="Dismiss from review?"
        message={`${pendingDismiss?.count ?? 0} email(s) will be removed from the review queue and will not appear in the inbox.`}
        confirmLabel="Dismiss"
        busy={actions.busy}
        onConfirm={confirmDismiss}
        onCancel={() => setPendingDismiss(null)}
      />
    </div>
  );
}
