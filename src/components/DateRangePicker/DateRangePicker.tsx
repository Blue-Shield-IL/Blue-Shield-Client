import { useCallback, useMemo, useState } from "react";
import { Box, IconButton, Popover, Typography, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Theme } from "@mui/material/styles";

export type RangePreset =
  | "All Time"
  | "Last 7 Days"
  | "Last 30 Days"
  | "Custom Range";

const PRESETS: RangePreset[] = [
  "All Time",
  "Last 30 Days",
  "Last 7 Days",
  "Custom Range",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isBetween = (d: Date, start: Date, end: Date) =>
  d.getTime() > start.getTime() && d.getTime() < end.getTime();

interface MiniCalendarProps {
  selectedStart: Date | null;
  selectedEnd: Date | null;
  onSelect: (date: Date) => void;
  theme: Theme;
}

const MiniCalendar = ({
  selectedStart,
  selectedEnd,
  onSelect,
  theme,
}: MiniCalendarProps) => {
  const [viewDate, setViewDate] = useState(() => selectedStart ?? new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      cells.push(new Date(year, month, d));
    return cells;
  }, [year, month]);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const today = new Date();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <IconButton
          size="small"
          onClick={prevMonth}
          sx={{ color: theme.palette.text.secondary }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {MONTHS[month]} {year}
        </Typography>
        <IconButton
          size="small"
          onClick={nextMonth}
          sx={{ color: theme.palette.text.secondary }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.25,
          mb: 0.5,
        }}
      >
        {DAYS.map((d) => (
          <Typography
            key={d}
            sx={{
              fontSize: "11px",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              textAlign: "center",
              py: 0.5,
            }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.25,
        }}
      >
        {days.map((date, i) => {
          if (!date)
            return <Box key={`empty-${i}`} sx={{ width: 36, height: 36 }} />;

          const isStart = selectedStart && isSameDay(date, selectedStart);
          const isEnd = selectedEnd && isSameDay(date, selectedEnd);
          const isSelected = isStart || isEnd;
          const inRange =
            selectedStart &&
            selectedEnd &&
            isBetween(date, selectedStart, selectedEnd);
          const isToday = isSameDay(date, today);

          return (
            <Box
              key={date.toISOString()}
              onClick={() => onSelect(date)}
              sx={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: isSelected ? "50%" : inRange ? "4px" : "50%",
                fontSize: "12px",
                fontWeight: isSelected || isToday ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.1s",
                color: isSelected
                  ? "#FFFFFF"
                  : inRange
                    ? theme.palette.primary.main
                    : isToday
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                backgroundColor: isSelected
                  ? theme.palette.primary.main
                  : inRange
                    ? isDark
                      ? "rgba(59,130,246,0.15)"
                      : "#EFF6FF"
                    : "transparent",
                border:
                  isToday && !isSelected
                    ? `1px solid ${theme.palette.primary.main}`
                    : "1px solid transparent",
                "&:hover": {
                  backgroundColor: isSelected
                    ? theme.palette.primary.dark
                    : theme.palette.action.hover,
                },
              }}
            >
              {date.getDate()}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export interface DateRangePickerProps {
  /** Current preset selection */
  preset: RangePreset;
  /** Start ISO string */
  startDate: string;
  /** End ISO string */
  endDate: string;
  /** Called when a preset (non-custom) is selected */
  onPresetChange: (preset: RangePreset) => void;
  /** Called when custom range is applied */
  onCustomRange: (start: string, end: string) => void;
}

const DateRangePicker = ({
  preset,
  startDate,
  endDate,
  onPresetChange,
  onCustomRange,
}: DateRangePickerProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [pickStart, setPickStart] = useState<Date | null>(
    () => (startDate ? new Date(startDate) : new Date()),
  );
  const [pickEnd, setPickEnd] = useState<Date | null>(
    () => (endDate ? new Date(endDate) : new Date()),
  );
  const [pickingStart, setPickingStart] = useState(true);

  const handleClick = (range: RangePreset, el: HTMLElement) => {
    if (range === "Custom Range") {
      if (preset === "Custom Range" && startDate && endDate) {
        setPickStart(new Date(startDate));
        setPickEnd(new Date(endDate));
      } else {
        const today = new Date();
        setPickStart(today);
        setPickEnd(today);
      }
      setPickingStart(true);
      setAnchorEl(el);
    } else {
      onPresetChange(range);
      setAnchorEl(null);
    }
  };

  const handleDaySelect = useCallback(
    (date: Date) => {
      if (pickingStart) {
        setPickStart(date);
        setPickEnd(null);
        setPickingStart(false);
      } else {
        if (pickStart && date < pickStart) {
          setPickEnd(pickStart);
          setPickStart(date);
        } else {
          setPickEnd(date);
        }
        setPickingStart(true);
      }
    },
    [pickingStart, pickStart],
  );

  const handleApply = () => {
    if (pickStart && pickEnd) {
      const start = new Date(pickStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(pickEnd);
      end.setHours(23, 59, 59, 999);
      onCustomRange(start.toISOString(), end.toISOString());
    }
    setAnchorEl(null);
  };

  const formatShort = (d: Date | null) => {
    if (!d) return "—";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          borderRadius: "999px",
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          p: 0.5,
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            pl: 1.5,
            pr: 0.5,
            fontSize: "12px",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            userSelect: "none",
          }}
        >
          Range
        </Typography>
        {PRESETS.map((range) => (
          <Box
            key={range}
            onClick={(e) =>
              handleClick(range, e.currentTarget as HTMLElement)
            }
            sx={{
              borderRadius: "999px",
              px: 1.5,
              py: 0.75,
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
              color:
                preset === range ? "#FFFFFF" : theme.palette.text.secondary,
              backgroundColor:
                preset === range ? theme.palette.primary.main : "transparent",
              boxShadow:
                preset === range ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
              "&:hover": {
                color:
                  preset === range ? "#FFFFFF" : theme.palette.text.primary,
              },
            }}
          >
            {range}
          </Box>
        ))}

        {preset === "Custom Range" && (
          <Typography
            sx={{
              pl: 1,
              pr: 1.5,
              fontSize: "11px",
              fontWeight: 500,
              color: theme.palette.primary.main,
              whiteSpace: "nowrap",
            }}
          >
            {formatShort(new Date(startDate))} –{" "}
            {formatShort(new Date(endDate))}
          </Typography>
        )}
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              p: 3,
              borderRadius: "16px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 320,
            },
          },
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Select Date Range
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: "10px",
            backgroundColor: theme.palette.action.hover,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              py: 0.5,
              borderRadius: "6px",
              backgroundColor: pickingStart
                ? theme.palette.mode === "dark"
                  ? "rgba(59,130,246,0.15)"
                  : "#EFF6FF"
                : "transparent",
              border: pickingStart
                ? `1px solid ${theme.palette.primary.main}`
                : "1px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onClick={() => setPickingStart(true)}
          >
            <Typography
              sx={{
                fontSize: "10px",
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              FROM
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {formatShort(pickStart)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 16,
              height: 1,
              backgroundColor: theme.palette.divider,
            }}
          />
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              py: 0.5,
              borderRadius: "6px",
              backgroundColor: !pickingStart
                ? theme.palette.mode === "dark"
                  ? "rgba(59,130,246,0.15)"
                  : "#EFF6FF"
                : "transparent",
              border: !pickingStart
                ? `1px solid ${theme.palette.primary.main}`
                : "1px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onClick={() => setPickingStart(false)}
          >
            <Typography
              sx={{
                fontSize: "10px",
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              TO
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {formatShort(pickEnd)}
            </Typography>
          </Box>
        </Box>

        <MiniCalendar
          selectedStart={pickStart}
          selectedEnd={pickEnd}
          onSelect={handleDaySelect}
          theme={theme}
        />

        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
          <Box
            onClick={() => setAnchorEl(null)}
            sx={{
              flex: 1,
              borderRadius: "10px",
              py: 1,
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              textAlign: "center",
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.action.hover,
              transition: "all 0.15s",
              "&:hover": {
                backgroundColor: theme.palette.action.selected,
              },
            }}
          >
            Cancel
          </Box>
          <Box
            onClick={handleApply}
            sx={{
              flex: 1,
              borderRadius: "10px",
              py: 1,
              fontSize: "13px",
              fontWeight: 600,
              cursor:
                pickStart && pickEnd ? "pointer" : "not-allowed",
              textAlign: "center",
              color: "#FFFFFF",
              backgroundColor:
                pickStart && pickEnd
                  ? theme.palette.primary.main
                  : theme.palette.primary.light,
              transition: "all 0.15s",
              "&:hover": {
                backgroundColor:
                  pickStart && pickEnd
                    ? theme.palette.primary.dark
                    : theme.palette.primary.light,
              },
            }}
          >
            Apply
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default DateRangePicker;
