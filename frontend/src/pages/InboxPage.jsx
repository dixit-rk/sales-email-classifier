import { useEffect, useRef } from "react";
import { EmailDetail, EmailFilters, EmptyDetail, ThreadRow, useEmailDetail, useEmailListPage, VIEWS } from "../features/emails";
import { Button, EmptyState, ErrorState, LoadingState, Pagination, SelectionBar } from "../shared/ui";

function ThreadList({ list, params, selection, onOpen }) {
  const { data, loading, error, reload } = list;
  const listRef = useRef(null);
  const { page, limit, search, read, sort, order } = params;

  // A new page, filter or sort starts at the top of the list
  useEffect(() => {
    listRef.current?.scrollTo(0, 0);
  }, [page, limit, search, read, sort, order]);

  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (!data) return <LoadingState label="Loading inquiries…" />;
  if (data.data.length === 0) {
    const filtered = params.search || params.read !== "all";
    return <EmptyState title={filtered ? "No inquiries match these filters." : "No pricing inquiries yet."} hint={filtered ? "Try clearing the search or filter." : "New pricing requests appear here as they arrive."} />;
  }

  return (
    <ul className="threads" ref={listRef} aria-busy={loading}>
      {data.data.map((email) => (
        <ThreadRow
          key={email.id}
          email={email}
          active={email.id === params.id}
          checked={selection.isSelected(email.id)}
          onToggle={() => selection.toggle(email.id)}
          onOpen={onOpen}
        />
      ))}
    </ul>
  );
}

/** Pricing inbox: server-filtered list with cross-page selection on the left, the open email on the right. */
export default function InboxPage() {
  const { params, update, setPage, list, filters, selection, actions } = useEmailListPage(VIEWS.inbox);
  const detail = useEmailDetail(params.id);
  const meta = list.data?.meta;
  const total = meta?.total ?? 0;
  const selectedCount = selection.count(total);

  const open = (email) => {
    update({ id: email.id }, { resetPage: false });
    if (!email.isRead) {
      // The open email loads in parallel with the mark-read call, so refresh it too or its button keeps saying "Mark read"
      actions.markOpened(email.id).then(() => {
        list.reload();
        detail.reload();
      });
    }
  };

  const toggleOpenRead = async () => {
    const ok = await actions.markRead({ mode: "ids", ids: [detail.email.id] }, detail.email.isRead);
    if (ok) detail.reload();
  };

  return (
    <div className={`inbox-shell ${params.id ? "show-detail" : ""}`}>
      <div className="inbox-list">
        <div className="inbox-header">
          <div className="eyebrow" style={{ marginBottom: 9 }}>YOUR OPPORTUNITIES</div>
          <h1>Pricing inbox</h1>
          <div className="sub">All labeled conversations, in one focused view.</div>
          <EmailFilters params={params} update={update} showReadTabs />
        </div>
        {total > 0 && (
          <SelectionBar
            selectedCount={selectedCount}
            total={total}
            onToggleAll={selectedCount === total ? selection.clear : selection.selectAll}
            onClear={selection.clear}
          >
            <Button busy={actions.busy} onClick={() => actions.markRead(selection.toPayload(filters), true)}>Mark read</Button>
            <Button busy={actions.busy} onClick={() => actions.markRead(selection.toPayload(filters), false)}>Mark unread</Button>
          </SelectionBar>
        )}
        <ThreadList list={list} params={params} selection={selection} onOpen={open} />
        {total > 0 && <Pagination meta={meta} onPage={setPage} onLimit={(limit) => update({ limit })} />}
      </div>
      <div className="detail">
        {params.id ? (
          <EmailDetail state={detail} busy={actions.busy} onBack={() => update({ id: "" }, { resetPage: false })} onToggleRead={toggleOpenRead} />
        ) : (
          <EmptyDetail />
        )}
      </div>
    </div>
  );
}
