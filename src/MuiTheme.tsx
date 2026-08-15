import { fonts } from "constants/styles";
import { CssBaseline } from "@mui/material";
import type { PropsWithChildren } from "react";
import useThemeMode from "contexts/themeContext/useThemeMode";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const baseTypography = {
  fontFamily: `${fonts.main}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  allVariants: {
    fontFamily: `${fonts.main}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  },
};

const baseComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none" as const,
        fontWeight: 600,
        borderRadius: "8px",
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
      },
    },
  },
};

const lightTheme = createTheme({
  direction: "ltr",
  typography: baseTypography,
  palette: {
    mode: "light",
    primary: { main: "#2563EB", dark: "#1D4ED8", light: "#EFF6FF" },
    error: { main: "#DC2626" },
    success: { main: "#16A34A" },
    text: { primary: "#111827", secondary: "#6B7280" },
    background: { default: "#F9FAFB", paper: "#FFFFFF" },
    divider: "#E5E7EB",
  },
  components: {
    ...baseComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          fontFamily: baseTypography.fontFamily,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "#root": { height: "100%", width: "100%" },
        "html, body": { height: "100%", width: "100%", overflow: "auto" },
      },
    },
  },
});

const darkTheme = createTheme({
  direction: "ltr",
  typography: baseTypography,
  palette: {
    mode: "dark",
    primary: { main: "#3B82F6", dark: "#2563EB", light: "#1E3A5F" },
    error: { main: "#EF4444" },
    success: { main: "#22C55E" },
    text: { primary: "#F9FAFB", secondary: "#9CA3AF" },
    background: { default: "#0F172A", paper: "#1E293B" },
    divider: "#334155",
  },
  components: {
    ...baseComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          fontFamily: baseTypography.fontFamily,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          backgroundColor: "#0F172A",
          color: "#F9FAFB",
        },
        "#root": { height: "100%", width: "100%" },
        "html, body": { height: "100%", width: "100%", overflow: "auto" },
      },
    },
  },
});

const MuiTheme = ({ children }: PropsWithChildren) => {
  const { mode } = useThemeMode();
  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiTheme;
