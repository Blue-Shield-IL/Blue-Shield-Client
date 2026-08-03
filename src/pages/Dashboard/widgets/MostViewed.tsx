import { useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMostViewed } from "hooks/useDashboardData";
import useDateRange from "contexts/dateRangeContext/useDateRange";
import { formatDateShort, formatNumber } from "../dashboardHelpers";
import type { MostViewedItem } from "interfaces/dashboard";
import PostDetailModal from "pages/FreeSearch/components/PostDetailModal";
import type { PostModalData } from "pages/FreeSearch/components/PostDetailModal";

const toModalData = (post: MostViewedItem): PostModalData => ({
  author: post.source,
  channel: post.channel,
  country: post.country,
  createdAt: post.date,
  views: post.views,
  antisemitismScore: post.antisemitismScore,
  ihraLabels: post.ihraLabels,
  keywords: post.keywords,
  textContent: post.preview,
});

const MostViewed = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { startDate, endDate, keywords } = useDateRange();
  const { data = [], isLoading } = useMostViewed({ startDate, endDate, keywords, limit: 5 });
  const [selectedPost, setSelectedPost] = useState<PostModalData | null>(null);

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
        Most Viewed Posts
      </Typography>
      <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary, mt: 0.25 }}>
        Top 5 posts by reach
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: 2 }} />
            ))
          : data.map((post, i) => (
              <Box
                key={post.handle + i}
                onClick={() => setSelectedPost(toModalData(post))}
                sx={{
                  borderRadius: "12px",
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                  px: 2,
                  py: 1.5,
                  transition: "background-color 0.15s",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.source}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: theme.palette.primary.main,
                      flexShrink: 0,
                    }}
                  >
                    {formatNumber(post.views)} views
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: "12px",
                    color: theme.palette.text.secondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  "{post.preview}"
                </Typography>
                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                    {formatDateShort(post.date)}
                  </Typography>
                  <Box
                    sx={{
                      borderRadius: "999px",
                      backgroundColor: isDark ? "rgba(59,130,246,0.15)" : "#EFF6FF",
                      color: theme.palette.primary.main,
                      px: 1,
                      py: 0.25,
                      fontSize: "12px",
                      fontWeight: 500,
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.category}
                  </Box>
                </Box>
              </Box>
            ))}
      </Box>

      <PostDetailModal
        post={selectedPost}
        open={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
      />
    </Box>
  );
};

export default MostViewed;
