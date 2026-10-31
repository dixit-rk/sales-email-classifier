import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useDismissOnOutside } from "../hooks/useDismissOnOutside";

const OPTION_HEIGHT = 38;
const MENU_PADDING = 12;

const nextIndex = (key, current, count) => {
  if (key === "ArrowDown") return Math.min(current + 1, count - 1);
  if (key === "ArrowUp") return Math.max(current - 1, 0);
  if (key === "Home") return 0;
  return count - 1;
};

/**
 * App-wide dropdown (replaces the native select so the menu matches the design).
 * `options` are `{ value, label }`; `sort` adds the sort icon. Keyboard: arrows, Home/End, Enter, Escape.
 */
export function SelectField({ label, value, options, onChange, sort = false }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [opensUp, setOpensUp] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));

  useDismissOnOutside(rootRef, open, () => setOpen(false));

  const openMenu = () => {
    const rect = rootRef.current.getBoundingClientRect();
    const needed = options.length * OPTION_HEIGHT + MENU_PADDING;
    const below = window.innerHeight - rect.bottom;

    setOpensUp(below < needed && rect.top > below);
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (index) => {
    setOpen(false);
    if (options[index].value !== value) onChange(options[index].value);
  };

  const handleKeyDown = (event) => {
    const { key } = event;

    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
      event.preventDefault();
      if (!open) openMenu();
      else setActive(nextIndex(key, active, options.length));
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else openMenu();
    } else if (key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="select-wrap" ref={rootRef}>
      <button
        type="button"
        className="select-button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        {sort && <ArrowUpDown size={13} aria-hidden="true" />}
        <span>{options[selectedIndex].label}</span>
        <ChevronDown size={13} className="select-chevron" aria-hidden="true" />
      </button>
      {open && (
        <ul id={listId} role="listbox" aria-label={label} className={`select-menu ${opensUp ? "opens-up" : ""}`}>
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={`select-option ${index === active ? "active" : ""}`}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {index === selectedIndex && <Check size={14} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
