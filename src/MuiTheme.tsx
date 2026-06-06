import { CssBaseline } from "@mui/material";
import type { PropsWithChildren } from "react";
import { colors, fonts } from "constants/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  direction: "ltr",
  typography: {
    fontFamily: `${fonts.main}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
    allVariants: {
      fontFamily: `${fonts.main}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
    },
  },
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryHover,
      light: colors.primaryLight,
    },
    error: {
      main: colors.error,
    },
    success: {
      main: colors.success,
    },
    text: {
      primary: colors.text,
      secondary: colors.textSecondary,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          fontFamily: `${fonts.main}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "#root": {
          height: "100%",
          width: "100%",
        },
        "html, body": {
          height: "100%",
          width: "100%",
          overflow: "auto",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
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
  },
});

const MuiTheme = ({ children }: PropsWithChildren) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default MuiTheme;
