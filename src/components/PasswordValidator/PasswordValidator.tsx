import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import usePasswordValidatorStyles from "./PasswordValidator.style";
import {
  PASSWORD_RULES,
  passwordStrengthIndicator,
} from "./PasswordValidator.utils";

const PasswordValidator = ({ password }: { password: string }) => {
  const styles = usePasswordValidatorStyles();
  const results = useMemo(
    () =>
      PASSWORD_RULES.map(rule => ({ ...rule, passed: rule.test(password) })),
    [password]
  );

  const { label, color, threshold } = useMemo(
    () => passwordStrengthIndicator(results),
    [results]
  );

  return (
    <Box sx={styles.root}>
      {password.length > 0 && (
        <>
          <Box sx={styles.barContainer}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Box
                key={index}
                sx={styles.bar((index + 1) / 4 <= threshold, color)}
              />
            ))}
          </Box>
          <Typography sx={{ ...styles.strengthLabel, color }}>
            {label}
          </Typography>
          <Box component="ul" sx={styles.ruleList}>
            {results.map(rule => (
              <Box
                component="li"
                key={rule.label}
                sx={styles.ruleItem(rule.passed)}
              >
                <Typography component="span">
                  {rule.passed ? "✓" : "✗"}
                </Typography>
                <Typography component="span">{rule.label}</Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default PasswordValidator;
