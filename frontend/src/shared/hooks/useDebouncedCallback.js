import { useEffect, useRef } from "react";

/** Returns a function that calls `callback` after `delay` ms of quiet; the latest callback wins. */
export function useDebouncedCallback(callback, delay) {
  const callbackRef = useRef(callback);
  const timerRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
  };
}
