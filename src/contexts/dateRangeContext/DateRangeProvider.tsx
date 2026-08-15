import { useDateBounds } from "hooks/useDashboardData";
import { DateRangeContext, type RangePreset } from "./useDateRange";
import { type ReactNode, useCallback, useMemo, useState } from "react";

const getPresetDates = (
  preset: RangePreset,
  earliest?: string
): { startDate: string; endDate: string } => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const endDate = end.toISOString();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  switch (preset) {
    case "All Time":
      return {
        startDate: earliest || "",
        endDate,
      };
    case "Last 7 Days":
      start.setDate(start.getDate() - 7);
      break;
    case "Last 30 Days":
      start.setDate(start.getDate() - 30);
      break;
    case "Custom Range":
      start.setDate(start.getDate() - 30);
      break;
  }

  return { startDate: start.toISOString(), endDate };
};

export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
  const { data: bounds } = useDateBounds();
  const [preset, setPresetState] = useState<RangePreset>("All Time");
  const [dates, setDates] = useState<{ startDate: string; endDate: string }>({
    startDate: "",
    endDate: new Date().toISOString(),
  });
  const [keywords, setKeywords] = useState("");

  // Derive effective dates: override with bounds for "All Time" preset
  const effectiveDates =
    preset === "All Time" && bounds?.earliest
      ? getPresetDates("All Time", bounds.earliest)
      : dates;

  const setPreset = useCallback(
    (newPreset: RangePreset) => {
      setPresetState(newPreset);
      if (newPreset !== "Custom Range") {
        setDates(getPresetDates(newPreset, bounds?.earliest));
      }
    },
    [bounds?.earliest]
  );

  const setCustomRange = useCallback((start: string, end: string) => {
    setPresetState("Custom Range");
    setDates({ startDate: start, endDate: end });
  }, []);

  const value = useMemo(
    () => ({
      preset,
      startDate: effectiveDates.startDate,
      endDate: effectiveDates.endDate,
      keywords,
      setPreset,
      setCustomRange,
      setKeywords,
    }),
    [
      preset,
      effectiveDates.startDate,
      effectiveDates.endDate,
      keywords,
      setPreset,
      setCustomRange,
    ]
  );

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
};
