import { useCallback, useEffect, useRef, useState } from "react";

const IDLE = { key: null, data: null, error: null };

/**
 * Loads data when `key` changes (null = do not load). Keeps the previous data while the next
 * request is in flight; `reload` repeats the current request. The fetcher receives an AbortSignal.
 */
export function useAsyncResource(key, fetcher) {
  const [result, setResult] = useState(IDLE);
  const [reloadToken, setReloadToken] = useState(0);
  const fetcherRef = useRef(fetcher);
  const requestKey = key === null ? null : `${key}#${reloadToken}`;

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    if (requestKey === null) return undefined;

    const controller = new AbortController();

    fetcherRef.current(controller.signal)
      .then((data) => setResult({ key: requestKey, data, error: null }))
      .catch((error) => {
        if (!controller.signal.aborted) setResult((previous) => ({ key: requestKey, data: previous.data, error }));
      });

    return () => controller.abort();
  }, [requestKey]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);
  const settled = result.key === requestKey;

  return {
    data: result.data,
    error: settled ? result.error : null,
    loading: requestKey !== null && !settled,
    reload,
  };
}
