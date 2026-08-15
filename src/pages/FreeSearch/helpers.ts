export const SENTIMENT_COLORS: Record<string, { bg: string; text: string }> = {
  Supportive: { bg: "#DCFCE7", text: "#16A34A" },
  Neutral: { bg: "#F1F5F9", text: "#64748B" },
  Negative: { bg: "#FEF3C7", text: "#D97706" },
  Hostile: { bg: "#FEE2E2", text: "#DC2626" },
};

// Color for the negativity score: green (low) -> red (high)
export const getScoreColor = (score: number): { bg: string; text: string } => {
  if (score >= 0.75) return { bg: "#FEE2E2", text: "#DC2626" };
  if (score >= 0.5) return { bg: "#FEF3C7", text: "#D97706" };
  if (score >= 0.25) return { bg: "#DBEAFE", text: "#2563EB" };
  return { bg: "#DCFCE7", text: "#16A34A" };
};

export const PLATFORM_OPTIONS = [
  "telegram",
  "twitter",
  "facebook",
  "instagram",
  "youtube",
  "tiktok",
  "reddit",
];

export const LANGUAGE_OPTIONS: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "he", label: "Hebrew" },
  { code: "ru", label: "Russian" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "nl", label: "Dutch" },
  { code: "pl", label: "Polish" },
  { code: "uk", label: "Ukrainian" },
  { code: "tr", label: "Turkish" },
  { code: "fa", label: "Persian" },
  { code: "ur", label: "Urdu" },
  { code: "id", label: "Indonesian" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
];

export const SENTIMENT_OPTIONS = [
  "Supportive",
  "Neutral",
  "Negative",
  "Hostile",
];
