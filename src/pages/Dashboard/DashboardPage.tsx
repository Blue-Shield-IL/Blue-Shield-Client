import { Box } from "@mui/material";
import AppShell from "components/AppShell";
import { DateRangeProvider } from "contexts/dateRangeContext";
import ReachSummary from "./widgets/ReachSummary";
import TrendCharts from "./widgets/TrendCharts";
import HotspotMap from "./widgets/HotspotMap";
import TopSources from "./widgets/TopSources";
import MostViewed from "./widgets/MostViewed";
import RangeFilter from "./widgets/RangeFilter";

const DashboardPage = () => {
  return (
    <DateRangeProvider>
      <AppShell
        title="Overview Dashboard"
        subtitle="Real-time monitoring of antisemitic content collected across sources."
        topbarContent={<RangeFilter />}
      >
        <ReachSummary />
        <TrendCharts />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" },
            gap: 3,
            minWidth: 0,
          }}
        >
          <HotspotMap />
          <TopSources />
          <MostViewed />
        </Box>
      </AppShell>
    </DateRangeProvider>
  );
};

export default DashboardPage;
