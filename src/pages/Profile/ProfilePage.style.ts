import { colors, radius, shadows } from "constants/styles";

const styles = {
  root: {
    minHeight: "100dvh",
    flex: 1,
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

  backButton: {
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
  },

  main: {
    padding: "32px",
    maxWidth: "800px",
    width: "100%",
    margin: "0 auto",
    "@media (max-width: 768px)": {
      padding: "16px",
    },
  },

  card: {
    background: colors.white,
    borderRadius: radius.lg,
    padding: "32px",
    boxShadow: shadows.default,
    marginBottom: "24px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: colors.text,
    marginBottom: "16px",
  },

  infoRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    gap: "8px",
  },

  infoLabel: {
    fontSize: "14px",
    fontWeight: 500,
    color: colors.textSecondary,
    minWidth: "100px",
  },

  infoValue: {
    fontSize: "14px",
    color: colors.text,
  },

  providerChip: {
    fontSize: "12px",
    fontWeight: 500,
    textTransform: "capitalize",
  },

  keywordsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px",
  },

  keywordChip: {
    borderRadius: radius.default,
    fontSize: "13px",
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    fontWeight: 500,
  },

  emptyKeywords: {
    fontSize: "14px",
    color: colors.textMuted,
    fontStyle: "italic",
  },

  placeholder: {
    fontSize: "14px",
    color: colors.textMuted,
    textAlign: "center",
    padding: "16px 0",
  },
};

export default styles;
