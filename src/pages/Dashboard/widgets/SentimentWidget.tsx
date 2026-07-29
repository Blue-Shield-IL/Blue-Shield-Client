import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Box, Button, Skeleton, Typography } from "@mui/material";

import { useSentimentDistribution } from "hooks/useDashboardData";

const SENTIMENT_COLORS: Record<string, string> = {
  Supportive: "#4caf50",
  Neutral: "#9e9e9e",
  Negative: "#ff9800",
  Hostile: "#f44336",
};

const SentimentWidget = () => {
  const { data, isLoading, isError, refetch } = useSentimentDistribution();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sentiment Distribution
      </Typography>

      {isLoading && (
        <Skeleton variant="rectangular" width="100%" height={250} />
      )}

      {isError && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 250,
          }}
        >
          <Typography color="error" gutterBottom>
            Failed to load sentiment data.
          </Typography>
          <Button variant="outlined" onClick={() => refetch()}>
            Retry
          </Button>
        </Box>
      )}

      {!isLoading && !isError && data && (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="sentiment"
              innerRadius={60}
              outerRadius={90}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.sentiment}
                  fill={SENTIMENT_COLORS[entry.sentiment] ?? "#8884d8"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default SentimentWidget;
