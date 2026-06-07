import { colors, radius } from "constants/styles";

const styles = {
  layout: {
    display: "flex",
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  leftPanel: {
    flex: 1,
    background: `linear-gradient(135deg, ${colors.backgroundDark} 0%, ${colors.backgroundGradientMid} 50%, ${colors.primary} 100%)`,
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
    color: colors.white,
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
    color: colors.white,
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
    background: colors.white,
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
    color: colors.text,
    letterSpacing: "-0.5px",
  },

  subtitle: {
    fontSize: "16px",
    color: colors.textSecondary,
    margin: "0 0 32px 0",
    "& a": {
      color: colors.primary,
      textDecoration: "none",
      fontWeight: 500,
      "&:hover": {
        textDecoration: "underline",
      },
    },
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

  field: {
    marginBottom: "20px",
  },

  fieldLabel: {
    display: "block",
    marginBottom: "6px",
    fontSize: "16px",
    fontWeight: 500,
    color: colors.text,
  },

  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: radius.default,
      fontSize: "16px",
      "& fieldset": {
        borderColor: colors.border,
      },
      "&:hover fieldset": {
        borderColor: colors.border,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.borderFocus,
        boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
      },
    },
    "& .MuiInputBase-input": {
      padding: "14px 16px",
    },
    "& .MuiInputBase-input::placeholder": {
      color: colors.textMuted,
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
    color: colors.textMuted,
    padding: "4px",
    "&:hover": {
      color: colors.textSecondary,
    },
  },

  hint: {
    fontSize: "12px",
    color: colors.textMuted,
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
      color: colors.text,
    },
  },

  checkbox: {
    color: colors.border,
    "&.Mui-checked": {
      color: colors.primary,
    },
  },

  submitButton: {
    width: "100%",
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

  divider: {
    display: "flex",
    alignItems: "center",
    margin: "24px 0",
    gap: "16px",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: colors.border,
  },

  dividerText: {
    fontSize: "13px",
    color: colors.textMuted,
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
    backgroundColor: colors.white,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    "&:hover": {
      backgroundColor: colors.background,
      borderColor: colors.borderHover,
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
      border: `2px solid ${colors.primary} !important`,
    },
  },
};

export default styles;
