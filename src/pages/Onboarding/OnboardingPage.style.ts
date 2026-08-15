import { radius } from "constants/styles";
import { useTheme } from "@mui/material/styles";

const useOnboardingStyles = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return {
    container: {
      maxWidth: "640px",
      margin: "0 auto",
      padding: "60px 24px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },

    title: {
      fontSize: "28px",
      fontWeight: 700,
      margin: "0 0 8px 0",
      color: theme.palette.text.primary,
    },

    description: {
      fontSize: "15px",
      color: theme.palette.text.secondary,
      margin: "0 0 32px 0",
    },

    errorAlert: {
      marginBottom: "20px",
      backgroundColor: isDark ? "rgba(220, 38, 38, 0.1)" : "#FEF2F2",
      color: isDark ? "#FCA5A5" : "#DC2626",
      border: `1px solid ${isDark ? "rgba(220, 38, 38, 0.3)" : "#FECACA"}`,
      borderRadius: radius.default,
      "& .MuiAlert-icon": {
        color: isDark ? "#FCA5A5" : "#DC2626",
      },
    },

    profileSection: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "16px",
      marginBottom: "24px",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: radius.lg,
      backgroundColor: theme.palette.background.paper,
    },

    profileAvatar: {
      width: 72,
      height: 72,
      flexShrink: 0,
      backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF",
      color: theme.palette.primary.main,
      fontSize: "26px",
      fontWeight: 700,
    },

    profileDetails: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "6px",
      minWidth: 0,
    },

    profileLabel: {
      fontSize: "14px",
      fontWeight: 600,
      color: theme.palette.text.primary,
    },

    profileHelp: {
      fontSize: "12px",
      color: theme.palette.text.secondary,
    },

    profileButton: {
      marginTop: "2px",
      textTransform: "none",
      borderColor: theme.palette.divider,
    },

    grid: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "12px",
      marginBottom: "36px",
    },

    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      py: 4,
    },

    roleSection: {
      marginBottom: "24px",
    },

    roleLabel: {
      fontSize: "14px",
      fontWeight: 600,
      color: theme.palette.text.primary,
      marginBottom: "8px",
    },

    roleSelect: {
      minWidth: 200,
      borderRadius: "10px",
      backgroundColor: isDark ? theme.palette.background.paper : undefined,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.divider,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: isDark ? "#475569" : "#D1D5DB",
      },
      "& .MuiSelect-select": {
        color: theme.palette.text.primary,
      },
    },

    roleDescription: {
      fontSize: "13px",
      color: theme.palette.text.secondary,
      marginTop: "8px",
      fontStyle: "italic",
    },

    chip: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "14px 16px",
      width: "calc(50% - 6px)",
      boxSizing: "border-box",
      "@media (max-width: 480px)": { width: "100%" },
      border: `2px solid ${theme.palette.divider}`,
      borderRadius: radius.lg,
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "14px",
      fontWeight: 500,
      color: theme.palette.text.primary,
      background: isDark ? theme.palette.background.paper : "#FFFFFF",
      userSelect: "none",
      "&:hover": {
        borderColor: isDark ? "#475569" : "#D1D5DB",
        background: isDark ? "#334155" : "#F9FAFB",
      },
    },

    chipSelected: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "14px 16px",
      width: "calc(50% - 6px)",
      boxSizing: "border-box",
      "@media (max-width: 480px)": { width: "100%" },
      border: `2px solid ${theme.palette.primary.main}`,
      borderRadius: radius.lg,
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "14px",
      fontWeight: 500,
      color: theme.palette.primary.main,
      background: isDark ? "rgba(59, 130, 246, 0.1)" : "#EFF6FF",
      userSelect: "none",
      "&:hover": {
        borderColor: theme.palette.primary.main,
        background: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF",
      },
    },

    chipIcon: {
      fontSize: "20px",
    },

    hiddenCheckbox: {
      position: "absolute",
      opacity: 0,
      width: 1,
      height: 1,
    },

    actions: {
      display: "flex",
      justifyContent: "space-between",
      gap: "16px",
    },

    skipButton: {
      minWidth: "120px",
      padding: "14px 20px",
      fontSize: "16px",
      fontWeight: 600,
      borderRadius: radius.default,
      backgroundColor: isDark ? theme.palette.background.paper : "#FFFFFF",
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.divider}`,
      "&:hover": {
        backgroundColor: isDark ? "#334155" : "#F9FAFB",
      },
    },

    continueButton: {
      minWidth: "120px",
      padding: "14px 20px",
      fontSize: "16px",
      fontWeight: 600,
      borderRadius: radius.default,
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
      "&:active": {
        transform: "scale(0.98)",
      },
      "&.Mui-disabled": {
        opacity: 0.6,
        backgroundColor: theme.palette.primary.main,
        color: "#FFFFFF",
      },
    },
  };
};

export default useOnboardingStyles;
