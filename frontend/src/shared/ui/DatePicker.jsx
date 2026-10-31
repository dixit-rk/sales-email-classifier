import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDismissOnOutside } from "../hooks/useDismissOnOutside";
import { addDays, addMonths, formatDateKey, mondayOf, todayKey } from "../lib/dateKeys";
import "./DatePicker.css";

const GRID_DAYS = 42;
const POPOVER_WIDTH = 296;
const FIRST_MONDAY = "2024-01-01";
const KEY_MOVES = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

const monthTitle = (key) => formatDateKey(key, { month: "long", year: "numeric" });
const weekdays = Array.from({ length: 7 }, (_, index) => formatDateKey(addDays(FIRST_MONDAY, index), { weekday: "short" }));

/**
 * Calendar date picker for YYYY-MM-DD values (replaces the native date input so the popup matches the design).
 * Keyboard: arrows move by day or week, Home/End by week edge, PageUp/PageDown by month, Escape closes.
 */
export function DatePicker({ label, value, onChange, min, max, invalid = false, describedBy }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(value || todayKey());
  const [alignEnd, setAlignEnd] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const gridRef = useRef(null);
  const moveFocus = useRef(false);
  const today = todayKey();
  const viewMonth = focused.slice(0, 7);

  useDismissOnOutside(rootRef, open, () => setOpen(false));

  useEffect(() => {
    if (open && moveFocus.current) {
      moveFocus.current = false;
      gridRef.current.querySelector(`[data-day="${focused}"]`)?.focus();
    }
  }, [open, focused]);

  const blocked = (day) => (max && day > max) || (min && day < min);

  const openPicker = () => {
    const rect = rootRef.current.getBoundingClientRect();
    const start = value || (max && today > max ? max : today);

    setAlignEnd(rect.left + POPOVER_WIDTH > window.innerWidth);
    setFocused(start);
    moveFocus.current = true;
    setOpen(true);
  };

  const choose = (day) => {
    if (blocked(day)) return;
    onChange(day);
    setOpen(false);
    buttonRef.current.focus();
  };

  const goTo = (day, viaKeyboard) => {
    if (blocked(day)) return;
    moveFocus.current = viaKeyboard;
    setFocused(day);
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    let next = null;

    if (key in KEY_MOVES) next = addDays(focused, KEY_MOVES[key]);
    else if (key === "Home") next = mondayOf(focused);
    else if (key === "End") next = addDays(mondayOf(focused), 6);
    else if (key === "PageUp") next = addMonths(focused, -1);
    else if (key === "PageDown") next = addMonths(focused, 1);
    else if (key === "Escape") {
      setOpen(false);
      buttonRef.current.focus();
    }

    if (next) {
      event.preventDefault();
      goTo(next, true);
    }
  };

  const gridStart = mondayOf(`${viewMonth}-01`);
  const days = Array.from({ length: GRID_DAYS }, (_, index) => addDays(gridStart, index));

  return (
    <div className="date-picker" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="date-button"
        aria-label={`${label}: ${value ? formatDateKey(value, { dateStyle: "long" }) : "not set"}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openPicker())}
      >
        <Calendar size={14} aria-hidden="true" />
        <span className={value ? "" : "date-placeholder"}>
          {value ? formatDateKey(value, { day: "numeric", month: "short", year: "numeric" }) : label}
        </span>
      </button>
      {open && (
        <div className={`date-popover ${alignEnd ? "align-end" : ""}`} role="dialog" aria-label={`Choose ${label.toLowerCase()}`} onKeyDown={handleKeyDown}>
          <div className="date-head">
            <button type="button" className="icon-btn" aria-label="Previous month" disabled={Boolean(min) && addMonths(`${viewMonth}-01`, -1) < `${min.slice(0, 7)}-01`} onClick={() => goTo(addMonths(focused, -1), false)}>
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <strong aria-live="polite">{monthTitle(focused)}</strong>
            <button type="button" className="icon-btn" aria-label="Next month" disabled={Boolean(max) && addMonths(`${viewMonth}-01`, 1) > max} onClick={() => goTo(addMonths(focused, 1), false)}>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="date-weekdays" aria-hidden="true">
            {weekdays.map((name) => <span key={name}>{name}</span>)}
          </div>
          <div className="date-grid" ref={gridRef}>
            {days.map((day) => (
              <button
                key={day}
                type="button"
                data-day={day}
                className={`date-day ${day.slice(0, 7) === viewMonth ? "" : "outside"} ${day === today ? "today" : ""}`}
                tabIndex={day === focused ? 0 : -1}
                disabled={Boolean(blocked(day))}
                aria-pressed={day === value}
                aria-label={formatDateKey(day, { dateStyle: "full" })}
                onClick={() => choose(day)}
              >
                {Number(day.slice(8))}
              </button>
            ))}
          </div>
          <div className="date-foot">
            <button type="button" className="link" disabled={Boolean(blocked(today))} onClick={() => choose(today)}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}
