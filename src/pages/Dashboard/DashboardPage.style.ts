import { colors, radius, shadows } from "constants/styles";

const styles = {
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: colors.background,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    background: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: shadows.default,
    "@media (max-width: 768px)": {
      padding: "12px 16px",
    },
  },

  headerTitle: {
    fontSize: "20px",
    fontWeight: 700,
    margin: 0,
    color: colors.text,
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  email: {
    fontSize: "14px",
    color: colors.textSecondary,
  },

  signOutButton: {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: radius.default,
    backgroundColor: "transparent",
    color: colors.text,
    border: `1px solid ${colors.border}`,
    "&:hover": {
      backgroundColor: colors.background,
      borderColor: colors.borderHover,
    },
    "&.Mui-disabled": {
      opacity: 0.6,
    },
  },

  main: {
    padding: "32px",
    maxWidth: "1200px",
    margin: "0 auto",
    "@media (max-width: 768px)": {
      padding: "16px",
    },
  },

  welcome: {
    fontSize: "16px",
    color: colors.textSecondary,
  },
};

export default styles;
