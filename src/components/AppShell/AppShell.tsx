import AppTopbar from "./AppTopbar";
import { useLocation } from "react-router-dom";
import AppSidebar, { SIDEBAR_WIDTH } from "./AppSidebar";
import { useEffect, useRef, type ReactNode } from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface AppShellProps {
  title?: string;
  subtitle?: string;
  /** Optional content rendered on the left side of the topbar (e.g. filters). */
  topbarContent?: ReactNode;
  /** Constrain the main content width (e.g. settings uses a narrower column). */
  maxWidth?: number | string;
  children: ReactNode;
}

const AppShell = ({
  title,
  subtitle,
  topbarContent,
  maxWidth,
  children,
}: AppShellProps) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <AppSidebar />
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          pl: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <AppTopbar>{topbarContent}</AppTopbar>
        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            p: 3,
            width: "100%",
            maxWidth: maxWidth ?? "none",
            mx: maxWidth ? "auto" : 0,
          }}
        >
          {title && (
            <Box>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: "14px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppShell;
