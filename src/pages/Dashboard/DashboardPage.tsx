import { useState } from "react";
import { ROUTES } from "constants/routes";
import useAuth from "contexts/authContext";
import styles from "./DashboardPage.style";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch {
      navigate(ROUTES.LOGIN);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Box sx={styles.root}>
      <Box component="header" sx={styles.header}>
        <Typography sx={styles.headerTitle}>Dashboard</Typography>
        <Box sx={styles.userSection}>
          {user && (
            <Typography sx={styles.email}>{user.name ?? user.email}</Typography>
          )}
          <Button
            variant="outlined"
            onClick={() => navigate(ROUTES.PROFILE)}
            aria-label="Profile"
            sx={styles.signOutButton}
          >
            Profile
          </Button>
          <Button
            variant="outlined"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            aria-label="Sign out"
            sx={styles.signOutButton}
          >
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </Box>
      </Box>
      <Box component="main" sx={styles.main}>
        <Typography sx={styles.welcome}>
          Welcome to Blue Shield. Your personalized dashboard is ready.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;
