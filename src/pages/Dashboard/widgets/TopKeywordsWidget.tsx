import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Box, Button, Skeleton, Typography } from "@mui/material";

import { useTopKeywords } from "hooks/useDashboardData";

const TopKeywordsWidget = () => {
  const { data, isLoading, isError, refetch } = useTopKeywords();

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Top Keywords
        </Typography>
        <Skeleton variant="rectangular" height={300} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Top Keywords
        </Typography>
        <Typography color="error" gutterBottom>
          Failed to load top keywords data.
        </Typography>
        <Button variant="outlined" onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Top Keywords
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="keyword" width={100} />
          <Tooltip />
          <Bar dataKey="count" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TopKeywordsWidget;
