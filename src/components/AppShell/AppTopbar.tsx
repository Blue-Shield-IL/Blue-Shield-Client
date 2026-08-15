import type { ReactNode } from "react";
import { ROUTES } from "constants/routes";
import useAuth from "contexts/authContext";
import { useNavigate } from "react-router-dom";
import useThemeMode from "contexts/themeContext/useThemeMode";
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

const SunIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const AppTopbar = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const displayName = user?.name ?? user?.email ?? "User";

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: 3,
        py: 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor:
          mode === "dark" ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Box sx={{ display: "flex", flex: 1, minWidth: 0, alignItems: "center" }}>
        {children}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"} arrow>
          <IconButton
            onClick={toggleMode}
            aria-label="Toggle theme"
            sx={{
              width: 36,
              height: 36,
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: mode === "dark" ? "#334155" : "#F1F5F9",
                color: theme.palette.text.primary,
              },
            }}
          >
            {mode === "dark" ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Tooltip>

        <Box
          onClick={() => navigate(ROUTES.SETTINGS)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderRadius: "999px",
            py: 0.5,
            pl: 0.5,
            pr: 1.5,
            cursor: "pointer",
            transition: "background-color 0.15s",
            "&:hover": {
              backgroundColor: mode === "dark" ? "#334155" : "#F1F5F9",
            },
          }}
        >
          {user?.profilePicUrl ? (
            <Avatar
              src={user.profilePicUrl}
              alt={displayName}
              sx={{ width: 36, height: 36 }}
            />
          ) : (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: mode === "dark" ? "#1E3A5F" : "#EFF6FF",
                color: "#3B82F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Box>
          )}
          <Box sx={{ display: { xs: "none", sm: "block" }, lineHeight: 1.2 }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {displayName}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.secondary,
                textTransform: "capitalize",
              }}
            >
              {user?.role?.replace("-", " ") ?? "Analyst"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppTopbar;
