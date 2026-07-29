import { Box, Skeleton, Typography } from "@mui/material";
import { useDashboardStats } from "hooks/useDashboardData";
import useCardStyles from "hooks/useCardStyles";
import useDateRange from "contexts/dateRangeContext/useDateRange";
import { formatNumber } from "../dashboardHelpers";

const MiniStat = ({ value, label, styles }: { value: string; label: string; styles: ReturnType<typeof useCardStyles> }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      borderRadius: "16px",
      border: styles.card.border,
      backgroundColor: styles.card.backgroundColor,
      px: 2.5,
      py: 1.75,
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: styles.bg.accent,
        color: "#3B82F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 18,
        fontWeight: 700,
      }}
    >
      •
    </Box>
    <Box sx={{ lineHeight: 1.2 }}>
      <Typography sx={{ fontSize: "18px", fontWeight: 600, color: styles.text.primary }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: "12px", color: styles.text.secondary }}>{label}</Typography>
    </Box>
  </Box>
);

const ReachSummary = () => {
  const { startDate, endDate, preset } = useDateRange();
  const { data, isLoading } = useDashboardStats({ startDate, endDate });
  const styles = useCardStyles();

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
        border: styles.card.border,
        backgroundColor: styles.card.backgroundColor,
        p: { xs: 3, sm: 4 },
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          right: -64,
          top: -64,
          width: 256,
          height: 256,
          borderRadius: "50%",
          backgroundColor: styles.bg.accent,
          opacity: 0.7,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: { lg: "center" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: styles.text.secondary,
            }}
          >
            Total Reach
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mt: 1 }}>
            {isLoading ? (
              <Skeleton width={180} height={64} />
            ) : (
              <>
                <Typography
                  sx={{
                    fontSize: { xs: "44px", sm: "56px" },
                    fontWeight: 700,
                    lineHeight: 1,
                    color: styles.text.primary,
                  }}
                >
                  {formatNumber(data?.totalViews ?? 0)}
                </Typography>
                <Typography sx={{ fontSize: "18px", color: styles.text.secondary }}>
                  Views
                </Typography>
              </>
            )}
          </Box>
          {!isLoading && preset !== "All Time" && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  borderRadius: "999px",
                  backgroundColor:
                    (data?.totalViewsChange ?? 0) >= 0 ? "#ECFDF5" : "#FEF2F2",
                  color:
                    (data?.totalViewsChange ?? 0) >= 0 ? "#059669" : "#DC2626",
                  px: 1,
                  py: 0.25,
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {(data?.totalViewsChange ?? 0) >= 0 ? "▲" : "▼"}{" "}
                {(data?.totalViewsChange ?? 0) >= 0 ? "+" : ""}
                {data?.totalViewsChange ?? 0}%
              </Box>
              <Typography sx={{ fontSize: "12px", color: styles.text.muted }}>
                vs previous period
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 1.5,
          }}
        >
          <MiniStat
            value={formatNumber(data?.totalPosts ?? 0)}
            label="Posts Collected"
            styles={styles}
          />
          <MiniStat
            value={formatNumber(data?.activeSources ?? 0)}
            label="Active Sources"
            styles={styles}
          />
          <MiniStat
            value={formatNumber(data?.avgViewsPerPost ?? 0)}
            label="Avg. Views / Post"
            styles={styles}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ReachSummary;
