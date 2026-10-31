import { useState } from "react";
import { Button, Modal } from "../../../shared/ui";

const MAX_NAME = 80;
const MAX_CODE = 40;
const MAX_FORMULA = 40;
const EMPTY = { name: "", itemCode: "", formula: "", aliases: "" };

/** Form dialog for adding one product; the name is required, aliases are comma-separated. */
export function AddProductDialog({ open, saving, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState("");

  const close = () => {
    setForm(EMPTY);
    setNameError("");
    setServerError("");
    onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    setServerError("");

    if (!form.name.trim()) {
      setNameError("Enter the product name");
      return;
    }

    setNameError("");
    const error = await onSubmit(form);

    if (error) setServerError(error);
    else close();
  };

  const bind = (field) => ({
    value: form[field],
    onChange: (event) => setForm({ ...form, [field]: event.target.value }),
  });

  return (
    <Modal open={open} title="Add product" onClose={close}>
      <form onSubmit={submit} noValidate className="catalog-form">
        <div className="field">
          <label htmlFor="product-name">Product name</label>
          <input id="product-name" maxLength={MAX_NAME} aria-invalid={Boolean(nameError)} aria-describedby={nameError ? "product-name-error" : undefined} autoComplete="off" {...bind("name")} />
          {nameError && <span id="product-name-error" className="field-error" role="alert">{nameError}</span>}
        </div>
        <div className="field">
          <label htmlFor="product-code">Item code <span className="field-hint">(optional)</span></label>
          <input id="product-code" maxLength={MAX_CODE} aria-describedby="product-code-help" autoComplete="off" {...bind("itemCode")} />
          <span id="product-code-help" className="field-hint">Your own code for the product, for example PCFG228. Customers often use it instead of the name.</span>
        </div>
        <div className="field">
          <label htmlFor="product-formula">Formula <span className="field-hint">(optional)</span></label>
          <input id="product-formula" maxLength={MAX_FORMULA} autoComplete="off" {...bind("formula")} />
        </div>
        <div className="field">
          <label htmlFor="product-aliases">Aliases <span className="field-hint">(optional)</span></label>
          <textarea id="product-aliases" rows={3} aria-describedby="product-aliases-help" {...bind("aliases")} />
          <span id="product-aliases-help" className="field-hint">Other names customers use, separated by commas. Misspellings customers often make work well here.</span>
        </div>
        {serverError && <p className="field-error" role="alert">{serverError}</p>}
        <div className="confirm-actions">
          <Button onClick={close} disabled={saving}>Cancel</Button>
          <Button variant="primary" type="submit" busy={saving} busyLabel="Saving…">Add product</Button>
        </div>
      </form>
    </Modal>
  );
}
