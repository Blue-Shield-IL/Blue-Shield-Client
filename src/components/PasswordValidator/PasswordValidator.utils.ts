import { colors } from "constants/styles";

interface PasswordRule {
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", test: p => p.length >= 8 },
  { label: "At least one letter", test: p => /[a-zA-Z]/.test(p) },
  { label: "At least one number", test: p => /\d/.test(p) },
  { label: "At least one symbol", test: p => /[^a-zA-Z0-9]/.test(p) },
];

const RATE_STRENGTH = [
  {
    threshold: 0.25,
    label: "Weak",
    color: colors.errorText,
  },
  {
    threshold: 0.5,
    label: "Fair",
    color: colors.warningText,
  },
  {
    threshold: 0.75,
    label: "Good",
    color: colors.yellow,
  },
  {
    threshold: 1,
    label: "Strong",
    color: colors.successText,
  },
];

export const passwordStrengthIndicator = (
  results: (PasswordRule & { passed: boolean })[]
) => {
  const passRate =
    results.filter(({ passed }) => passed).length / results.length;

  return (
    RATE_STRENGTH.find(({ threshold }) => passRate <= threshold) ||
    RATE_STRENGTH[0]
  );
};
