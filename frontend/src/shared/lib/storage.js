/** localStorage read that never throws (private mode, blocked storage). */
export function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** localStorage write that never throws. */
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage is a convenience only; the UI works without it.
  }
}
