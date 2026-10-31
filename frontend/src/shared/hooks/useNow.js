import { useEffect, useState } from "react";

const REFRESH_MS = 60 * 1000;

/** The current time in the browser, refreshed every minute so greetings and dates stay correct on a page left open. */
export function useNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), REFRESH_MS);

    return () => clearInterval(timer);
  }, []);

  return now;
}
