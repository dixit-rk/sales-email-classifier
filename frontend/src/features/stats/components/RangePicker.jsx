import { useState } from "react";
import { todayKey } from "../../../shared/lib/dateKeys";
import { Button, DatePicker, SelectField } from "../../../shared/ui";
import { RANGE_OPTIONS, validateCustomRange } from "../lib/dateRanges";

/**
 * Date-range control: presets in a dropdown, plus a custom from/to pair that is validated before it is applied.
 * `value` is `{ range, from, to }` from the URL; `resolved` holds the concrete dates in use.
 */
export function RangePicker({ value, resolved, onChange }) {
  const [editing, setEditing] = useState(value.range === "custom");
  const [draft, setDraft] = useState({ from: resolved.from, to: resolved.to });
  const [problem, setProblem] = useState(null);
  const max = todayKey();

  const choosePreset = (range) => {
    setProblem(null);
    if (range === "custom") {
      setEditing(true);
      setDraft({ from: resolved.from, to: resolved.to });
      return;
    }
    setEditing(false);
    onChange({ range });
  };

  const apply = () => {
    const found = validateCustomRange(draft);
    setProblem(found);
    if (!found) onChange({ range: "custom", ...draft });
  };

  const setDate = (field) => (day) => setDraft({ ...draft, [field]: day });

  return (
    <>
      <SelectField label="Date range" value={editing ? "custom" : value.range} options={RANGE_OPTIONS} onChange={choosePreset} />
      {editing && (
        <>
          <DatePicker label="From date" value={draft.from} max={max} invalid={problem?.field === "from"} describedBy={problem ? "range-error" : undefined} onChange={setDate("from")} />
          <DatePicker label="To date" value={draft.to} min={draft.from || undefined} max={max} invalid={problem?.field === "to"} describedBy={problem ? "range-error" : undefined} onChange={setDate("to")} />
          <Button variant="primary" onClick={apply}>Apply</Button>
          {problem && <p id="range-error" role="alert" className="field-error range-error">{problem.message}</p>}
        </>
      )}
    </>
  );
}
