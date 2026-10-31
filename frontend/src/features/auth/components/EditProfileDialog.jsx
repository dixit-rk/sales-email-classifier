import { useId, useState } from "react";
import { useToast } from "../../../shared/toast/toastContext";
import { Button, Modal } from "../../../shared/ui";
import { useAuth } from "../authContext";

const MAX_NAME_LENGTH = 60;

/** Dialog to change the display name used in the greeting; saving an empty name goes back to the Google name. */
export function EditProfileDialog({ open, onClose }) {
  const { user, saveDisplayName } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fieldId = useId();

  const close = () => {
    setName(user.name);
    setError("");
    onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveDisplayName(name);
      toast.show({ tone: "success", message: "Profile updated" });
      onClose();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title="Edit profile" onClose={close}>
      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor={fieldId}>Display name</label>
          <input
            id={fieldId}
            value={name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={`${fieldId}-help`}
            autoComplete="name"
          />
          <span id={`${fieldId}-help`} className={error ? "field-error" : "field-hint"} role={error ? "alert" : undefined}>
            {error || `Shown in your greeting. Leave empty to use your Google name (${user.googleName}).`}
          </span>
        </div>
        <div className="confirm-actions">
          <Button onClick={close} disabled={saving}>Cancel</Button>
          <Button variant="primary" type="submit" busy={saving} busyLabel="Saving…">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
