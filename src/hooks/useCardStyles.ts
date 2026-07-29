import { useTheme } from "@mui/material/styles";

/** Returns common card/widget styles based on current theme mode */
const useCardStyles = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return {
    isDark,
    theme,
    card: {
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
    },
    text: {
      primary: theme.palette.text.primary,
      secondary: theme.palette.text.secondary,
      muted: isDark ? "#64748B" : "#9CA3AF",
    },
    bg: {
      subtle: theme.palette.background.default,
      hover: theme.palette.action.hover,
      accent: isDark ? "rgba(59,130,246,0.15)" : "#EFF6FF",
    },
    border: theme.palette.divider,
    chart: {
      grid: isDark ? "#334155" : "#E2E8F0",
      tick: isDark ? "#94A3B8" : "#64748B",
      tooltipBg: theme.palette.background.paper,
      tooltipBorder: theme.palette.divider,
    },
  };
};

export default useCardStyles;
