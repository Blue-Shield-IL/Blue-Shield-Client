import { useTheme } from "@mui/material/styles";
import { useCallback, useRef, useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";

import EmptyState from "components/EmptyState";
import useDateRange from "contexts/dateRangeContext/useDateRange";
import { useGeographicDistribution } from "hooks/useDashboardData";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NAME_ALIASES: Record<string, string> = {
  "United States": "United States of America",
  "United Kingdom": "United Kingdom",
  Czechia: "Czech Republic",
};

const fillFor = (weight: number | undefined) => {
  if (weight === undefined) return "#E2E8F0";
  if (weight >= 0.8) return "#DC2626";
  if (weight >= 0.6) return "#F97316";
  if (weight >= 0.4) return "#F59E0B";
  if (weight >= 0.2) return "#60A5FA";
  return "#93C5FD";
};

const LEGEND = [
  { label: "Low", color: "#93C5FD" },
  { label: "Moderate", color: "#F59E0B" },
  { label: "High", color: "#F97316" },
  { label: "Critical", color: "#DC2626" },
];

const HotspotMap = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { startDate, endDate, keywords } = useDateRange();
  const {
    data = [],
    isLoading,
    isError,
  } = useGeographicDistribution({
    startDate,
    endDate,
    keywords,
  });
  const [hover, setHover] = useState<string | null>(null);
  const [rotation, setRotation] = useState<[number, number, number]>([
    -10, -25, 0,
  ]);
  const dragging = useRef(false);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setRotation(prev => {
      const sensitivity = 0.5;
      const newLon = prev[0] + dx * sensitivity;
      const newLat = Math.max(-90, Math.min(90, prev[1] - dy * sensitivity));
      return [newLon, newLat, prev[2]];
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const maxCount = data[0]?.count || 1;
  const weights = new Map<string, number>();
  data.forEach(item => {
    const mapName = NAME_ALIASES[item.country] || item.country;
    weights.set(mapName, item.count / maxCount);
  });

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
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        Hotspot Countries
      </Typography>
      <Typography
        sx={{ fontSize: "12px", color: theme.palette.text.secondary, mt: 0.25 }}
      >
        Countries shaded by volume of detected content
      </Typography>

      <Box
        sx={{
          position: "relative",
          mt: 1,
          minHeight: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {isLoading ? (
          <Skeleton variant="circular" width={240} height={240} />
        ) : isError ? (
          <EmptyState
            title="Unable to load locations"
            description="Try refreshing the dashboard."
            minHeight={260}
          />
        ) : (
          <ComposableMap
            projection="geoOrthographic"
            projectionConfig={{ rotate: rotation, scale: 150 }}
            width={340}
            height={300}
            style={{ width: "100%", height: "auto" }}
          >
            <Sphere
              id="sphere"
              fill={isDark ? "#1E293B" : "#F1F5F9"}
              stroke={theme.palette.divider}
              strokeWidth={0.5}
            />
            <Graticule stroke={theme.palette.divider} strokeWidth={0.4} />
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const name = geo.properties?.name as string;
                  const weight = weights.get(name);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHover(name)}
                      onMouseLeave={() => setHover(null)}
                      fill={fillFor(weight)}
                      stroke={theme.palette.background.paper}
                      strokeWidth={0.3}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", opacity: 0.85 },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        )}

        {hover && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              borderRadius: "999px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              px: 1.5,
              py: 0.5,
              fontSize: "12px",
              fontWeight: 500,
              color: theme.palette.text.primary,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {hover}
            {weights.get(hover) !== undefined
              ? ` · ${Math.round((weights.get(hover) as number) * 100)}% index`
              : " · no signal"}
          </Box>
        )}
      </Box>

      {!isLoading && !isError && data.some(item => item.count > 0) && (
        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {LEGEND.map(item => (
            <Box
              key={item.label}
              sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: item.color,
                }}
              />
              <Typography
                sx={{ fontSize: "12px", color: theme.palette.text.secondary }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HotspotMap;
