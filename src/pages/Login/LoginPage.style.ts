import { radius } from "constants/styles";
import { useTheme } from "@mui/material/styles";

const useLoginStyles = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return {
    layout: {
      display: "flex",
      flex: 1,
      width: "100%",
      overflow: "hidden",
    },

    leftPanel: {
      flex: 1,
      background: isDark
        ? "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #2563EB 100%)"
        : "linear-gradient(135deg, #1E293B 0%, #1E40AF 50%, #2563EB 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: "-30%",
        right: "-30%",
        width: "80%",
        height: "80%",
        background:
          "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: "-20%",
        left: "-20%",
        width: "60%",
        height: "60%",
        background:
          "radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%)",
        borderRadius: "50%",
      },
      "@media (max-width: 768px)": {
        display: "none",
      },
    },

    brand: {
      position: "relative",
      zIndex: 1,
      textAlign: "center",
      color: "#FFFFFF",
    },

    brandIcon: {
      width: "200px",
      height: "200px",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 24px",
      backdropFilter: "blur(4px)",
    },

    brandTitle: {
      fontSize: "48px",
      fontWeight: 700,
      margin: "0 0 12px 0",
      letterSpacing: "-1px",
      color: "#FFFFFF",
    },

    brandSubtitle: {
      fontSize: "18px",
      color: "rgba(255, 255, 255, 0.7)",
      margin: 0,
      maxWidth: "300px",
    },

    rightPanel: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
      background: isDark ? "#1E293B" : "#FFFFFF",
      overflowY: "auto",
      "@media (max-width: 768px)": {
        padding: "24px",
      },
    },

    form: {
      width: "100%",
      maxWidth: "400px",
    },

    title: {
      fontSize: "34px",
      fontWeight: 700,
      margin: "0 0 6px 0",
      color: theme.palette.text.primary,
      letterSpacing: "-0.5px",
    },

    subtitle: {
      fontSize: "16px",
      color: theme.palette.text.secondary,
      margin: "0 0 32px 0",
      "& a": {
        color: theme.palette.primary.main,
        textDecoration: "none",
        fontWeight: 500,
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },

    errorAlert: {
      marginBottom: "20px",
      backgroundColor: isDark ? "rgba(239, 68, 68, 0.08)" : "#FEF2F2",
      color: isDark ? "#FCA5A5" : "#DC2626",
      border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.2)" : "#FECACA"}`,
      borderRadius: radius.default,
      "& .MuiAlert-icon": {
        color: isDark ? "#FCA5A5" : "#DC2626",
      },
    },

    field: {
      marginBottom: "20px",
    },

    fieldLabel: {
      display: "block",
      marginBottom: "6px",
      fontSize: "16px",
      fontWeight: 500,
      color: theme.palette.text.primary,
    },

    textField: {
      "& .MuiOutlinedInput-root": {
        borderRadius: radius.default,
        fontSize: "16px",
        backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
        "& fieldset": {
          borderColor: isDark ? "#334155" : "#E5E7EB",
        },
        "&:hover fieldset": {
          borderColor: isDark ? "#475569" : "#D1D5DB",
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 3px ${isDark ? "rgba(59, 130, 246, 0.12)" : "rgba(37, 99, 235, 0.1)"}`,
        },
      },
      "& .MuiInputBase-input": {
        padding: "14px 16px",
        color: theme.palette.text.primary,
      },
      "& .MuiInputBase-input::placeholder": {
        color: isDark ? "#64748B" : "#9CA3AF",
        opacity: 1,
      },
    },

    passwordWrapper: {
      position: "relative",
    },

    eyeButton: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: isDark ? "#64748B" : "#9CA3AF",
      padding: "4px",
      "&:hover": {
        color: theme.palette.text.primary,
      },
    },

    hint: {
      fontSize: "12px",
      color: isDark ? "#64748B" : "#9CA3AF",
      margin: "6px 0 0 0",
    },

    rememberRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },

    rememberLabel: {
      "& .MuiFormControlLabel-label": {
        fontSize: "14px",
        color: theme.palette.text.primary,
      },
    },

    checkbox: {
      color: isDark ? "#475569" : "#E5E7EB",
      "&.Mui-checked": {
        color: theme.palette.primary.main,
      },
    },

    submitButton: {
      width: "100%",
      padding: "14px 20px",
      fontSize: "16px",
      fontWeight: 600,
      borderRadius: radius.default,
      backgroundColor: theme.palette.primary.main,
      color: "#FFFFFF",
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

    divider: {
      display: "flex",
      alignItems: "center",
      margin: "24px 0",
      gap: "16px",
    },

    dividerLine: {
      flex: 1,
      height: "1px",
      backgroundColor: isDark ? "#334155" : "#E5E7EB",
    },

    dividerText: {
      fontSize: "13px",
      color: isDark ? "#64748B" : "#9CA3AF",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },

    googleContainer: {
      display: "flex",
      justifyContent: "center",
    },

    googleButton: {
      width: "100%",
      padding: "14px 20px",
      fontSize: "16px",
      fontWeight: 600,
      borderRadius: radius.default,
      backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
      color: theme.palette.text.primary,
      border: `1px solid ${isDark ? "#334155" : "#E5E7EB"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      "&:hover": {
        backgroundColor: isDark ? "#162032" : "#F9FAFB",
        borderColor: isDark ? "#475569" : "#D1D5DB",
      },
    },

    googleWrapper: {
      width: "100%",
    },

    googleButtonContainer: {
      display: "flex",
      justifyContent: "center",
      "& > div": {
        width: "100% !important",
      },
      "& iframe": {
        borderRadius: `${radius.default} !important`,
        border: `2px solid ${theme.palette.primary.main} !important`,
      },
    },
  };
};

export default useLoginStyles;
