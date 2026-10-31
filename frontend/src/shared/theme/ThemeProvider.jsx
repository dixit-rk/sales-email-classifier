import { useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../lib/storage";
import { ThemeContext } from "./themeContext";

const STORAGE_KEY = "chemquote-theme";

const initialTheme = () =>
  readStorage(STORAGE_KEY) ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

/** Holds the light/dark theme, applies it to the document and remembers it. */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")) }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
