import { useCallback, useMemo, useState } from "react";
import { Box, IconButton, Popover, Typography, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { Theme } from "@mui/material/styles";

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

export interface DateRangeFilterProps {
  /** ISO start date string (or empty) */
  startDate: string;
  /** ISO end date string (or empty) */
  endDate: string;
  /** Called when a date range is applied */
  onChange: (start: string, end: string) => void;
  /** Called to clear the range */
  onClear?: () => void;
}

/**
 * An inline date range filter that shows two date input fields.
 * Clicking either field opens a calendar popover for picking a range.
 * Reusable across search page, dashboard, etc.
 */
const DateRangeFilter = ({
  startDate,
  endDate,
  onChange,
  onClear: _onClear,
}: DateRangeFilterProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [pickStart, setPickStart] = useState<Date | null>(
    startDate ? new Date(startDate) : null,
  );
  const [pickEnd, setPickEnd] = useState<Date | null>(
    endDate ? new Date(endDate) : null,
  );
  const [pickingStart, setPickingStart] = useState(true);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setPickStart(startDate ? new Date(startDate) : new Date());
    setPickEnd(endDate ? new Date(endDate) : new Date());
    setPickingStart(true);
    setAnchorEl(e.currentTarget);
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
      onChange(start.toISOString(), end.toISOString());
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

  const formatDisplay = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const inputBoxStyle = {
    flex: 1,
    height: 40,
    borderRadius: "8px",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    alignItems: "center",
    px: 1.5,
    cursor: "pointer",
    transition: "border-color 0.15s",
    "&:hover": { borderColor: theme.palette.primary.light },
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1 }} onClick={handleOpen}>
        <Box sx={inputBoxStyle}>
          <Typography
            sx={{
              fontSize: "13px",
              color: startDate
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
              flex: 1,
            }}
          >
            {formatDisplay(startDate) || "dd/mm/yyyy"}
          </Typography>
          <CalendarTodayIcon
            sx={{ fontSize: 16, color: theme.palette.text.secondary }}
          />
        </Box>
        <Box sx={inputBoxStyle}>
          <Typography
            sx={{
              fontSize: "13px",
              color: endDate
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
              flex: 1,
            }}
          >
            {formatDisplay(endDate) || "dd/mm/yyyy"}
          </Typography>
          <CalendarTodayIcon
            sx={{ fontSize: 16, color: theme.palette.text.secondary }}
          />
        </Box>
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
                ? isDark
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
                ? isDark
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
              cursor: pickStart && pickEnd ? "pointer" : "not-allowed",
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

export default DateRangeFilter;
