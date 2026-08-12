export type PanelId =
  | "kpi"
  | "trends"
  | "distributions"
  | "intelligence"
  | "myTopics";

const DEFAULT_ORDER: PanelId[] = [
  "kpi",
  "trends",
  "distributions",
  "intelligence",
  "myTopics",
];

const ROLE_PANEL_ORDER: Record<string, PanelId[]> = {
  analyst: ["kpi", "trends", "distributions", "intelligence", "myTopics"],
  "foreign-affairs": [
    "kpi",
    "distributions",
    "trends",
    "intelligence",
    "myTopics",
  ],
  communications: [
    "kpi",
    "intelligence",
    "trends",
    "distributions",
    "myTopics",
  ],
  researcher: ["kpi", "distributions", "trends", "intelligence", "myTopics"],
};

export const getPanelOrder = (role?: string): PanelId[] => {
  if (!role) return DEFAULT_ORDER;
  return ROLE_PANEL_ORDER[role] ?? DEFAULT_ORDER;
};
