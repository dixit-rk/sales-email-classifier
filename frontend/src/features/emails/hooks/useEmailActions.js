import { useState } from "react";
import { useToast } from "../../../shared/toast/toastContext";
import { decideReview, setRead } from "../api/emailsApi";
import { useEmailCounts } from "../countsContext";

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

const decisionMessage = (decision, modified, requested) => {
  const skipped = requested - modified;
  const done = `${plural(modified, "email")} ${decision}`;

  return skipped > 0 ? `${done}, ${skipped} skipped (no product identified)` : done;
};

/** Bulk and single actions on emails with busy state, toasts and counter refresh. `onDone` runs after success. */
export function useEmailActions({ onDone }) {
  const { refresh } = useEmailCounts();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const run = async (request, message) => {
    setBusy(true);
    try {
      const result = await request();
      toast.show({ tone: "success", message: message(result) });
      refresh();
      onDone?.();
      return true;
    } catch (error) {
      toast.show({ tone: "error", message: error.message });
      return false;
    } finally {
      setBusy(false);
    }
  };

  return {
    busy,
    markRead: (selection, read) =>
      run(() => setRead(selection, read), ({ modified }) => `${plural(modified, "email")} marked ${read ? "read" : "unread"}`),
    decide: (selection, decision, requested) =>
      run(() => decideReview(selection, decision), ({ modified }) => decisionMessage(decision, modified, requested)),
    markOpened: (id) => setRead({ mode: "ids", ids: [id] }, true).then(refresh, () => {}),
  };
}
