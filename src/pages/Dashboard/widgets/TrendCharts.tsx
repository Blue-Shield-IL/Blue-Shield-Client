import { Box, Skeleton, Typography } from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import useCardStyles from "hooks/useCardStyles";
import useDateRange from "contexts/dateRangeContext/useDateRange";
import { formatMonthDay, formatNumber } from "../dashboardHelpers";
import { useActivityTrend, useThreatTrend } from "hooks/useDashboardData";

interface ChartCardProps {
  title: string;
  subtitle: string;
  data: { date: string; value: number }[];
  gradientId: string;
  formatY: (v: number) => string;
  tipSuffix: string;
  loading: boolean;
  allowDecimals?: boolean;
  styles: ReturnType<typeof useCardStyles>;
}

const ChartCard = ({
  title,
  subtitle,
  data,
  gradientId,
  formatY,
  tipSuffix,
  loading,
  allowDecimals = true,
  styles,
}: ChartCardProps) => (
  <Box
    sx={{
      borderRadius: "16px",
      backgroundColor: styles.card.backgroundColor,
      p: 2.5,
      minWidth: 0,
      overflow: "hidden",
    }}
  >
    <Typography
      sx={{ fontSize: "14px", fontWeight: 600, color: styles.text.primary }}
    >
      {title}
    </Typography>
    <Typography
      sx={{ fontSize: "12px", color: styles.text.secondary, mt: 0.25 }}
    >
      {subtitle}
    </Typography>
    <Box sx={{ height: 224, width: "100%", mt: 2 }}>
      {loading ? (
        <Skeleton
          variant="rectangular"
          height="100%"
          sx={{ borderRadius: 2 }}
        />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke={styles.chart.grid}
              fillOpacity={0}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: styles.chart.tick, fontSize: 11 }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fill: styles.chart.tick, fontSize: 11 }}
              tickFormatter={formatY}
              allowDecimals={allowDecimals}
            />
            <Tooltip
              cursor={{ stroke: "#3B82F6", strokeOpacity: 0.3 }}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${styles.chart.tooltipBorder}`,
                backgroundColor: styles.chart.tooltipBg,
                boxShadow: "0 8px 24px rgb(15 23 42 / 0.08)",
                fontSize: 12,
                color: styles.text.primary,
              }}
              separator=""
              formatter={value => [
                `${formatNumber(Number(value))} ${tipSuffix}`,
                "",
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Box>
  </Box>
);

const TrendCharts = () => {
  const { startDate, endDate, keywords } = useDateRange();
  const { data = [], isLoading } = useActivityTrend({
    startDate,
    endDate,
    keywords,
    interval: "day",
  });
  const { data: threatData = [], isLoading: threatLoading } = useThreatTrend({
    startDate,
    endDate,
    keywords,
    interval: "day",
  });
  const styles = useCardStyles();

  const reachData = data.map(d => ({
    date: formatMonthDay(d.date),
    value: d.views,
  }));
  const postsData = data.map(d => ({
    date: formatMonthDay(d.date),
    value: d.posts,
  }));
  const scoreData = threatData.map(d => ({
    date: formatMonthDay(d.date),
    value: d.avgScore,
  }));

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" },
        gap: 3,
        minWidth: 0,
      }}
    >
      <ChartCard
        title="Content Reach Trend"
        subtitle="Total views over time"
        data={reachData}
        gradientId="reachGradient"
        formatY={v => formatNumber(v)}
        tipSuffix="views"
        loading={isLoading}
        styles={styles}
      />
      <ChartCard
        title="Posts Trend"
        subtitle="Collected posts over time"
        data={postsData}
        gradientId="postsGradient"
        formatY={v => formatNumber(v)}
        tipSuffix="posts"
        loading={isLoading}
        allowDecimals={false}
        styles={styles}
      />
      <ChartCard
        title="Threat Score Trend"
        subtitle="Average antisemitism score over time"
        data={scoreData}
        gradientId="threatGradient"
        formatY={v => v.toFixed(2)}
        tipSuffix="avg score"
        loading={threatLoading}
        styles={styles}
      />
    </Box>
  );
};

export default TrendCharts;
