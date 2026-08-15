import AppShell from "components/AppShell";
import useAuth from "contexts/authContext";
import HotspotMap from "./widgets/HotspotMap";
import MostViewed from "./widgets/MostViewed";
import TopSources from "./widgets/TopSources";
import EmptyState from "components/EmptyState";
import RangeFilter from "./widgets/RangeFilter";
import TrendCharts from "./widgets/TrendCharts";
import { useQuery } from "@tanstack/react-query";
import ReachSummary from "./widgets/ReachSummary";
import MyTopicsWidget from "./widgets/MyTopicsWidget";
import SentimentWidget from "./widgets/SentimentWidget";
import { getMyKeywords } from "services/keywordsService";
import { useDashboardStats } from "hooks/useDashboardData";
import { getPanelOrder, type PanelId } from "./panelConfig";
import TopKeywordsWidget from "./widgets/TopKeywordsWidget";
import { useEffect, useMemo, useRef, useState } from "react";
import { DateRangeProvider } from "contexts/dateRangeContext";
import IhraCategoryWidget from "./widgets/IhraCategoryWidget";
import useDateRange from "contexts/dateRangeContext/useDateRange";
import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

const threeColGrid = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" },
  gap: 3,
  minWidth: 0,
};

const panelComponents: Record<PanelId, React.ReactNode> = {
  kpi: <ReachSummary key="kpi" />,
  trends: <TrendCharts key="trends" />,
  distributions: (
    <Box key="distributions" sx={threeColGrid}>
      <SentimentWidget />
      <TopKeywordsWidget />
      <IhraCategoryWidget />
    </Box>
  ),
  intelligence: (
    <Box key="intelligence" sx={threeColGrid}>
      <HotspotMap />
      <TopSources />
      <MostViewed />
    </Box>
  ),
  myTopics: <MyTopicsWidget key="myTopics" />,
};

const DashboardContent = () => {
  const { user } = useAuth();
  const { startDate, endDate, keywords, setKeywords } = useDateRange();
  const [viewMode, setViewMode] = useState<"all" | "myTopics">("myTopics");
  const initializedRef = useRef(false);

  const { data: myKeywords, isSuccess: myKeywordsLoaded } = useQuery({
    queryKey: ["keywords", "me"],
    queryFn: getMyKeywords,
    staleTime: 5 * 60 * 1000,
  });

  const statsQuery = useDashboardStats({ startDate, endDate, keywords });
  const hasNoConfiguredKeywords =
    myKeywordsLoaded && (myKeywords?.length ?? 0) === 0;
  const hasNoPosts =
    statsQuery.isSuccess && Number(statsQuery.data.totalPosts) === 0;
  const showMyTopicsEmptyState =
    viewMode === "myTopics" && (hasNoConfiguredKeywords || hasNoPosts);

  const role = user?.role;
  const panelOrder = getPanelOrder(role ?? undefined);

  const userKeywordsCsv = useMemo(
    () => (myKeywords ?? []).map(k => k.word).join(","),
    [myKeywords]
  );

  const handleViewModeChange = (_: unknown, val: "all" | "myTopics" | null) => {
    if (!val) return;
    setViewMode(val);
    if (val === "myTopics") {
      setKeywords(userKeywordsCsv);
    } else {
      setKeywords("");
    }
  };

  useEffect(() => {
    if (!initializedRef.current && userKeywordsCsv && viewMode === "myTopics") {
      initializedRef.current = true;
      setKeywords(userKeywordsCsv);
    }
  }, [userKeywordsCsv, viewMode, setKeywords]);

  const topbarContent = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewModeChange}
        size="small"
        sx={{
          gap: 1,
          "& .MuiToggleButton-root": {
            textTransform: "none",
            fontSize: "12px",
            fontWeight: 500,
            px: 1.5,
            py: 0.5,
            borderRadius: "8px !important",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <ToggleButton value="myTopics">My Topics</ToggleButton>
        <ToggleButton value="all">All Posts</ToggleButton>
      </ToggleButtonGroup>
      <RangeFilter />
    </Box>
  );

  return (
    <AppShell
      title="Overview Dashboard"
      subtitle="Real-time monitoring of antisemitic content collected across sources."
      topbarContent={topbarContent}
    >
      {showMyTopicsEmptyState ? (
        <Box
          sx={{
            minHeight: 360,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "16px",
            backgroundColor: "background.paper",
            p: 3,
          }}
        >
          <EmptyState
            title="No My Topics results"
            description="Switch to All Posts to explore the full dashboard."
            minHeight={140}
            illustrationSrc="/dashboard-empty-state.svg"
            illustrationDarkSrc="/dashboard-empty-state-dark.svg"
          />
          <Button
            variant="contained"
            onClick={() => handleViewModeChange(null, "all")}
          >
            View All Posts
          </Button>
        </Box>
      ) : (
        panelOrder.map(id => panelComponents[id])
      )}
    </AppShell>
  );
};

const DashboardPage = () => (
  <DateRangeProvider>
    <DashboardContent />
  </DateRangeProvider>
);

export default DashboardPage;
