import { Box, Skeleton, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useIhraBreakdown } from "hooks/useDashboardData";
import useCardStyles from "hooks/useCardStyles";
import useDateRange from "contexts/dateRangeContext/useDateRange";

const IhraCategoryWidget = () => {
  const { startDate, endDate, keywords } = useDateRange();
  const { data, isLoading } = useIhraBreakdown({ startDate, endDate, keywords });
  const styles = useCardStyles();

  return (
    <Box
      sx={{
        borderRadius: "16px",
        backgroundColor: styles.card.backgroundColor,
        border: styles.card.border,
        p: 2.5,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{ fontSize: "14px", fontWeight: 600, color: styles.text.primary }}
      >
        IHRA Category Breakdown
      </Typography>
      <Typography
        sx={{ fontSize: "12px", color: styles.text.secondary, mt: 0.25 }}
      >
        Posts by IHRA working definition categories
      </Typography>

      <Box sx={{ height: 224, width: "100%", mt: 2 }}>
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            height="100%"
            sx={{ borderRadius: 2 }}
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data ?? []}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                horizontal={false}
                stroke={styles.chart.grid}
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: styles.chart.tick, fontSize: 11 }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={130}
                tickLine={false}
                axisLine={false}
                tick={{ fill: styles.chart.tick, fontSize: 10 }}
              />
              <Tooltip
                cursor={{ fill: styles.bg.hover }}
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${styles.chart.tooltipBorder}`,
                  backgroundColor: styles.chart.tooltipBg,
                  boxShadow: "0 8px 24px rgb(15 23 42 / 0.08)",
                  fontSize: 12,
                  color: styles.text.primary,
                }}
              />
              <Bar
                dataKey="count"
                fill="#F59E0B"
                radius={[0, 4, 4, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default IhraCategoryWidget;
