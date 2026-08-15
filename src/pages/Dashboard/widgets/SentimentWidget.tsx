import { Box, Skeleton, Typography } from "@mui/material";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import EmptyState from "components/EmptyState";
import useCardStyles from "hooks/useCardStyles";
import { useSentimentDistribution } from "hooks/useDashboardData";
import useDateRange from "contexts/dateRangeContext/useDateRange";

const SENTIMENT_COLORS: Record<string, string> = {
  Supportive: "#4caf50",
  Neutral: "#9e9e9e",
  Negative: "#ff9800",
  Hostile: "#f44336",
};

const SentimentWidget = () => {
  const { startDate, endDate, keywords } = useDateRange();
  const { data, isLoading, isError } = useSentimentDistribution({
    startDate,
    endDate,
    keywords,
  });
  const styles = useCardStyles();

  const total = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;

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
        Sentiment Distribution
      </Typography>
      <Typography
        sx={{ fontSize: "12px", color: styles.text.secondary, mt: 0.25 }}
      >
        Post sentiment breakdown
      </Typography>

      <Box sx={{ height: 224, width: "100%", mt: 2 }}>
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            height="100%"
            sx={{ borderRadius: 2 }}
          />
        ) : isError ? (
          <EmptyState
            title="Unable to load sentiment"
            description="Try refreshing the dashboard."
            minHeight="100%"
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data ?? []}
                dataKey="count"
                nameKey="sentiment"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                stroke="none"
              >
                {(data ?? []).map(entry => (
                  <Cell
                    key={entry.sentiment}
                    fill={SENTIMENT_COLORS[entry.sentiment] ?? "#8884d8"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${styles.chart.tooltipBorder}`,
                  backgroundColor: styles.chart.tooltipBg,
                  boxShadow: "0 8px 24px rgb(15 23 42 / 0.08)",
                  fontSize: 12,
                  color: styles.text.primary,
                }}
                formatter={(value, name) => [
                  `${value} (${total ? Math.round((Number(value) / total) * 100) : 0}%)`,
                  name as string,
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: styles.text.secondary }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default SentimentWidget;
