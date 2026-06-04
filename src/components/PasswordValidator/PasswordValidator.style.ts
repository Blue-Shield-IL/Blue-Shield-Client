import { colors } from "constants/styles";

const styles = {
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
    backgroundColor: enable ? strengthColor : colors.disabled,
    transition: "background-color 0.2s",
  }),

  ruleItem: (passed: boolean) => ({
    fontSize: "13px",
    color: passed ? colors.successText : colors.errorText,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "4px",
  }),
};

export default styles;
