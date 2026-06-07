export const PASSWORD_VALIDATION_RULES = {
  required: "Password is required",
  minLength: { value: 8, message: "At least 8 characters" },
  validate: {
    hasLetter: (v: string) => /[a-zA-Z]/.test(v) || "Must contain a letter",
    hasNumber: (v: string) => /\d/.test(v) || "Must contain a number",
    hasSymbol: (v: string) => /[^a-zA-Z0-9]/.test(v) || "Must contain a symbol",
  },
};
