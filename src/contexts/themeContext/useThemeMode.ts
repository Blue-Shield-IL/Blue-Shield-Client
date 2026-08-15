import { createContext, useContext } from "react";

export type ThemeMode = "light" | "dark";

export interface ThemeModeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextType>(
  {} as ThemeModeContextType
);

const useThemeMode = () => useContext(ThemeModeContext);

export default useThemeMode;
