import { useState } from "react";
import styles from "./ProfilePage.style";
import { ROUTES } from "constants/routes";
import useAuth from "contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as authService from "services/authService";

import * as keywordsService from "services/keywordsService";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: keywords = [], isLoading } = useQuery({
    queryKey: ["keywords"],
    queryFn: keywordsService.getMyKeywords,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsModalOpen(false);
    setIsDeleting(true);
    try {
      await authService.deleteAccount();
      await logout();
      navigate(ROUTES.LOGIN);
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={styles.root}>
      <Box component="header" sx={styles.header}>
        <Typography sx={styles.headerTitle}>Profile</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          sx={styles.backButton}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Box component="main" sx={styles.main}>
        <Box sx={styles.card}>
          <Typography sx={styles.sectionTitle}>Account Information</Typography>

          <Box sx={styles.infoRow}>
            <Typography sx={styles.infoLabel}>Name</Typography>
            <Typography sx={styles.infoValue}>
              {user?.name || "Not set"}
            </Typography>
          </Box>

          <Box sx={styles.infoRow}>
            <Typography sx={styles.infoLabel}>Email</Typography>
            <Typography sx={styles.infoValue}>{user?.email}</Typography>
          </Box>

          <Box sx={styles.infoRow}>
            <Typography sx={styles.infoLabel}>Provider</Typography>
            <Chip
              label={user?.authProvider || "local"}
              size="small"
              color={user?.authProvider === "google" ? "primary" : "default"}
              sx={styles.providerChip}
            />
          </Box>
        </Box>

        <Box sx={styles.card}>
          <Typography sx={styles.sectionTitle}>My Keywords</Typography>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : keywords.length > 0 ? (
            <Box sx={styles.keywordsContainer}>
              {keywords.map(keyword => (
                <Chip
                  key={keyword.id}
                  label={keyword.word}
                  sx={styles.keywordChip}
                />
              ))}
            </Box>
          ) : (
            <Typography sx={styles.emptyKeywords}>
              No keywords selected yet. Complete onboarding to set your
              preferences.
            </Typography>
          )}
        </Box>

        <Box sx={styles.card}>
          <Typography sx={styles.sectionTitle} color="error">
            Danger Zone
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "text.secondary", mb: 2 }}>
            Permanently delete your account and all associated data.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            disabled={isDeleting}
            onClick={() => setIsModalOpen(true)}
            sx={{ fontWeight: 600 }}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </Box>
      </Box>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slotProps={{ paper: { sx: { padding: "8px", borderRadius: "12px" } } }}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete your account?
            <br /> This action cannot be undone and all your data will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
