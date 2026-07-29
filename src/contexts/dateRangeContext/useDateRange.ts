import { createContext, useContext } from "react";

export type RangePreset = "All Time" | "Last 7 Days" | "Last 30 Days" | "Custom Range";

export interface DateRangeContextType {
  preset: RangePreset;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  setPreset: (preset: RangePreset) => void;
  setCustomRange: (start: string, end: string) => void;
}

export const DateRangeContext = createContext<DateRangeContextType>(
  {} as DateRangeContextType,
);

const useDateRange = () => useContext(DateRangeContext);

export default useDateRange;
