import { Box, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTopSources } from "hooks/useDashboardData";
import useDateRange from "contexts/dateRangeContext/useDateRange";
import { formatNumber } from "../dashboardHelpers";

const TopSources = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { startDate, endDate, keywords } = useDateRange();
  const { data = [], isLoading } = useTopSources({ startDate, endDate, keywords, limit: 5 });

  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        p: 2.5,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <Typography sx={{ fontSize: "14px", fontWeight: 600, color: theme.palette.text.primary }}>
        Top Sources
      </Typography>
      <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary, mt: 0.25 }}>
        Top 5 sources by activity
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={52} sx={{ borderRadius: 2 }} />
            ))
          : data.map((source) => (
              <Box
                key={source.handle + source.rank}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  borderRadius: "12px",
                  border: "1px solid transparent",
                  backgroundColor: theme.palette.action.hover,
                  px: 1.5,
                  py: 1.25,
                  transition: "all 0.15s",
                  "&:hover": {
                    borderColor: theme.palette.divider,
                    backgroundColor: theme.palette.action.selected,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: isDark ? "rgba(59,130,246,0.15)" : "#EFF6FF",
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {source.rank}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {source.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: theme.palette.text.secondary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {source.handle}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 500, color: theme.palette.text.primary }}>
                    {formatNumber(source.posts)} Posts
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                    {formatNumber(source.views)} Views
                  </Typography>
                </Box>
              </Box>
            ))}
      </Box>
    </Box>
  );
};

export default TopSources;
