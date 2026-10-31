import { useState } from "react";
import { useAsyncResource } from "../../../shared/hooks/useAsyncResource";
import { useToast } from "../../../shared/toast/toastContext";
import { fetchLabel, saveLabel } from "../api/gmailApi";

/** The current label plus `save`, which resolves to an error message or null. */
export function useLabel() {
  const { data, error, reload } = useAsyncResource("gmail-label", fetchLabel);
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  return {
    label: data,
    error,
    reload,
    saving,
    save: async (name) => {
      setSaving(true);
      try {
        const result = await saveLabel(name);
        toast.show({
          tone: "success",
          message: result.createdInGmail ? `"${result.name}" created in Gmail and set as your label` : `"${result.name}" is now your label`,
        });
        reload();
        return null;
      } catch (failure) {
        return failure.message;
      } finally {
        setSaving(false);
      }
    },
  };
}
