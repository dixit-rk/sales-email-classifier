import { createContext, useContext } from "react";

export const ThemeContext = createContext(null);

/** Current theme ("light" | "dark") and a toggle. */
export const useTheme = () => useContext(ThemeContext);
