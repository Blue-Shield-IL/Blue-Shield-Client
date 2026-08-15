import Logo from "components/Svg/Logo";
import { ROUTES } from "constants/routes";
import useAuth from "contexts/authContext";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import useThemeMode from "contexts/themeContext/useThemeMode";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";

export const SIDEBAR_WIDTH = 248;

type IconName = "dashboard" | "search" | "settings";

const Icon = ({ name }: { name: IconName }) => {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "dashboard") {
    return (
      <svg {...common}>
        <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
};

const NAV: { label: string; route: string; icon: IconName }[] = [
  { label: "Dashboard", route: ROUTES.DASHBOARD, icon: "dashboard" },
  { label: "Post Search", route: ROUTES.FREE_SEARCH, icon: "search" },
  { label: "Settings", route: ROUTES.SETTINGS, icon: "settings" },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useThemeMode();
  const theme = useTheme();
  const { logout } = useAuth();
  const isDark = mode === "dark";

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box
      component="aside"
      sx={{
        position: "fixed",
        insetBlock: 0,
        left: 0,
        zIndex: 30,
        width: SIDEBAR_WIDTH,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          height: 64,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Logo width={24} height={24} />
        </Box>
        <Box sx={{ lineHeight: 1.2 }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Blue Shield
          </Typography>
          <Typography
            sx={{ fontSize: "12px", color: theme.palette.text.secondary }}
          >
            Threat Intelligence
          </Typography>
        </Box>
      </Box>

      {/* Nav */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          p: 2,
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {NAV.map(item => {
            const active =
              location.pathname === item.route ||
              location.pathname.startsWith(item.route + "/");
            return (
              <Box
                key={item.route}
                onClick={() => navigate(item.route)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1.25,
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 500,
                  color: active ? "#3B82F6" : theme.palette.text.secondary,
                  backgroundColor: active
                    ? isDark
                      ? "#1E3A5F"
                      : "#EFF6FF"
                    : "transparent",
                  transition: "all 0.15s",
                  "&:hover": {
                    backgroundColor: active
                      ? isDark
                        ? "#1E3A5F"
                        : "#EFF6FF"
                      : isDark
                        ? "#334155"
                        : "#F9FAFB",
                    color: active ? "#3B82F6" : theme.palette.text.primary,
                  },
                }}
              >
                <Icon name={item.icon} />
                {item.label}
              </Box>
            );
          })}
        </Box>

        <Tooltip title="Log out" placement="right" arrow>
          <IconButton
            onClick={handleLogout}
            aria-label="Log out"
            sx={{
              width: 36,
              height: 36,
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: isDark ? "#334155" : "#F1F5F9",
                color: theme.palette.error.main,
              },
            }}
          >
            <LogoutIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default AppSidebar;
