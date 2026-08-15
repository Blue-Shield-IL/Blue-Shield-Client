import { Box, Skeleton, Tooltip, Typography } from "@mui/material";

import useCardStyles from "hooks/useCardStyles";
import { useTopKeywords } from "hooks/useDashboardData";
import useDateRange from "contexts/dateRangeContext/useDateRange";

const TopKeywordsWidget = () => {
  const { startDate, endDate, keywords } = useDateRange();
  const { data, isLoading } = useTopKeywords({
    startDate,
    endDate,
    keywords,
    limit: 10,
  });
  const styles = useCardStyles();

  const maxCount = Math.max(...(data ?? []).map(d => d.count), 1);

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
        Top Keywords
      </Typography>
      <Typography
        sx={{ fontSize: "12px", color: styles.text.secondary, mt: 0.25 }}
      >
        Most frequent trope labels
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          mt: 2,
          maxHeight: 300,
          overflowY: "auto",
          pr: 1,
          scrollbarWidth: "thin",
          scrollbarColor: styles.isDark
            ? "rgba(255,255,255,0.15) transparent"
            : "rgba(0,0,0,0.12) transparent",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: styles.isDark
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.12)",
            borderRadius: 3,
          },
        }}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={28}
                sx={{ borderRadius: 1 }}
              />
            ))
          : (data ?? []).map(item => (
              <Tooltip
                key={item.keyword}
                title={item.keyword}
                arrow
                placement="top-start"
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 1,
                      mb: 0.25,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: styles.text.primary,
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {item.keyword}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#3B82F6",
                        flexShrink: 0,
                      }}
                    >
                      {item.count}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 6,
                      borderRadius: "3px",
                      backgroundColor: styles.bg.hover,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${(item.count / maxCount) * 100}%`,
                        borderRadius: "3px",
                        backgroundColor: "#3B82F6",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </Box>
                </Box>
              </Tooltip>
            ))}
      </Box>
    </Box>
  );
};

export default TopKeywordsWidget;
