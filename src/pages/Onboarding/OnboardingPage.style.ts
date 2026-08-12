import { colors, radius } from "constants/styles";

const styles = {
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
    color: colors.text,
  },

  description: {
    fontSize: "15px",
    color: colors.textSecondary,
    margin: "0 0 32px 0",
  },

  errorAlert: {
    marginBottom: "20px",
    backgroundColor: colors.errorBg,
    color: colors.error,
    border: `1px solid ${colors.errorBorder}`,
    borderRadius: radius.default,
    "& .MuiAlert-icon": {
      color: colors.error,
    },
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

  chip: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    width: "calc(50% - 6px)",
    boxSizing: "border-box",
    "@media (max-width: 480px)": { width: "100%" },
    border: `2px solid ${colors.border}`,
    borderRadius: radius.lg,
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.text,
    background: colors.white,
    userSelect: "none",
    "&:hover": {
      borderColor: colors.borderHover,
      background: colors.background,
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
    border: `2px solid ${colors.primary}`,
    borderRadius: radius.lg,
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.primary,
    background: colors.primaryLight,
    userSelect: "none",
    "&:hover": {
      borderColor: colors.primary,
      background: colors.primaryLight,
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
    backgroundColor: colors.white,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    "&:hover": {
      backgroundColor: colors.background,
    },
  },

  continueButton: {
    minWidth: "120px",
    padding: "14px 20px",
    fontSize: "16px",
    fontWeight: 600,
    borderRadius: radius.default,
    backgroundColor: colors.primary,
    "&:hover": {
      backgroundColor: colors.primaryHover,
    },
    "&:active": {
      transform: "scale(0.98)",
    },
    "&.Mui-disabled": {
      opacity: 0.6,
      backgroundColor: colors.primary,
      color: colors.white,
    },
  },
};

export default styles;
