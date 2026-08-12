import { Box, Skeleton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useTopicBreakdown } from "hooks/useDashboardData";
import useCardStyles from "hooks/useCardStyles";
import useDateRange from "contexts/dateRangeContext/useDateRange";
import { formatNumber } from "../dashboardHelpers";

const TOPIC_ICONS: Record<string, string> = {
  "Conspiracy Theories": "🕵️",
  "Classic Antisemitic Tropes": "✡️",
  "Holocaust & Historical Violence": "📜",
  "Israel-Related Antisemitism": "🌍",
  "Conflict & Escalation": "⚡",
};

const MyTopicsWidget = () => {
  const navigate = useNavigate();
  const { startDate, endDate, keywords } = useDateRange();
  const { data, isLoading } = useTopicBreakdown({ startDate, endDate, keywords });
  const styles = useCardStyles();

  if (isLoading) {
    return (
      <Box
        sx={{
          borderRadius: "16px",
          backgroundColor: styles.card.backgroundColor,
          border: styles.card.border,
          p: 2.5,
        }}
      >
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => b.totalViews - a.totalViews);

  return (
    <Box
      sx={{
        borderRadius: "16px",
        backgroundColor: styles.card.backgroundColor,
        border: styles.card.border,
        p: 2.5,
      }}
    >
      <Typography
        sx={{ fontSize: "14px", fontWeight: 600, color: styles.text.primary }}
      >
        My Topics Overview
      </Typography>
      <Typography
        sx={{ fontSize: "12px", color: styles.text.secondary, mt: 0.25, mb: 2 }}
      >
        Topic ranking by total views
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: `repeat(${Math.min(sorted.length, 5)}, 1fr)`,
          },
          gap: 1.5,
        }}
      >
        {sorted.map((topic, idx) => (
          <Box
            key={topic.topic}
            onClick={() =>
              navigate(
                `/search?keywords=${encodeURIComponent(topic.keywords.join(","))}`,
              )
            }
            sx={{
              borderRadius: "12px",
              border: styles.card.border,
              backgroundColor: styles.bg.subtle,
              p: 2,
              cursor: "pointer",
              transition: "all 0.15s",
              "&:hover": {
                backgroundColor: styles.bg.hover,
                borderColor: styles.theme.palette.primary.main,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Typography sx={{ fontSize: "18px" }}>
                {TOPIC_ICONS[topic.topic] ?? "📊"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: styles.text.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                #{idx + 1}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: styles.text.primary,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {topic.topic}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: styles.text.primary,
                  }}
                >
                  {formatNumber(topic.totalViews)}
                </Typography>
                <Typography
                  sx={{ fontSize: "10px", color: styles.text.secondary }}
                >
                  views
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: styles.text.primary,
                  }}
                >
                  {topic.postCount}
                </Typography>
                <Typography
                  sx={{ fontSize: "10px", color: styles.text.secondary }}
                >
                  posts
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MyTopicsWidget;
