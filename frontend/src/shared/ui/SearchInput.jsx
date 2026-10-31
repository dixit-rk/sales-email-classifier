import { Search } from "lucide-react";
import { useState } from "react";
import { SEARCH_DEBOUNCE_MS } from "../config";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";

/** Search box that reports the typed value after a short pause. */
export function SearchInput({ value, onSearch, placeholder, label }) {
  const [draft, setDraft] = useState(value);
  const reportSearch = useDebouncedCallback(onSearch, SEARCH_DEBOUNCE_MS);

  const handleChange = (event) => {
    setDraft(event.target.value);
    reportSearch(event.target.value.trim());
  };

  return (
    <div className="search" role="search">
      <Search aria-hidden="true" />
      <input type="search" aria-label={label} placeholder={placeholder} value={draft} onChange={handleChange} maxLength={100} />
    </div>
  );
}
