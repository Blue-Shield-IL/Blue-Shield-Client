import { useTheme } from "@mui/material/styles";

const usePasswordValidatorStyles = () => {
  const theme = useTheme();

  return {
    root: {
      marginTop: "8px",
    },

    barContainer: {
      display: "flex",
      gap: "4px",
      marginBottom: "8px",
    },

    strengthLabel: {
      fontSize: "12px",
      margin: "0 0 8px 0",
      fontWeight: 500,
    },

    ruleList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },

    bar: (enable: boolean, strengthColor: string) => ({
      flex: 1,
      height: "4px",
      borderRadius: "2px",
      backgroundColor: enable ? strengthColor : theme.palette.divider,
      transition: "background-color 0.2s",
    }),

    ruleItem: (passed: boolean) => ({
      fontSize: "13px",
      color: passed ? theme.palette.success.main : theme.palette.error.main,
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "4px",
    }),
  };
};

export default usePasswordValidatorStyles;
