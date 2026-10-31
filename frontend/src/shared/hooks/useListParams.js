import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_KEY = "page";

/** Keeps list state (filters, sort, page) in the URL; `defaults` names every key and its default. */
export function useListParams(defaults) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(
    () => Object.fromEntries(Object.keys(defaults).map((key) => [key, searchParams.get(key) ?? defaults[key]])),
    [searchParams, defaults],
  );

  const update = useCallback(
    (changes, { resetPage = true } = {}) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);

          for (const [key, value] of Object.entries(changes)) {
            if (value == null || value === "" || value === defaults[key]) next.delete(key);
            else next.set(key, String(value));
          }

          if (resetPage) next.delete(PAGE_KEY);

          return next;
        },
        { replace: true },
      );
    },
    [defaults, setSearchParams],
  );

  return { params, update };
}
