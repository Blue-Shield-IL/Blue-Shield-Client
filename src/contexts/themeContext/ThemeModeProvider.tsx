import { ThemeModeContext, type ThemeMode } from "./useThemeMode";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "blueshield.theme";
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

const getSystemTheme = (): ThemeMode =>
  window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light";

const getStoredTheme = (): ThemeMode | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    return null;
  }
};

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(
    () => getStoredTheme() ?? getSystemTheme()
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  useEffect(() => {
    const systemTheme = window.matchMedia(SYSTEM_THEME_QUERY);
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme() === null) {
        setMode(event.matches ? "dark" : "light");
      }
    };

    systemTheme.addEventListener("change", handleSystemThemeChange);
    return () =>
      systemTheme.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(prev => {
      const next = prev === "light" ? "dark" : "light";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Keep the selected theme for this session if storage is unavailable.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};
