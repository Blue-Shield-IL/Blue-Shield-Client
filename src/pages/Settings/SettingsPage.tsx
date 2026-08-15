import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { ROUTES } from "constants/routes";
import AppShell from "components/AppShell";
import useAuth from "contexts/authContext";
import * as authService from "services/authService";
import * as keywordsService from "services/keywordsService";

const ROLES = [
  { id: "analyst", title: "Analyst" },
  { id: "foreign-affairs", title: "Foreign Affairs" },
  { id: "communications", title: "Communications" },
  { id: "researcher", title: "Researcher" },
];

const ROLE_STORAGE_KEY = "blueshield.role";

const SectionCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        p: 3,
      }}
    >
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{ fontSize: "13px", color: theme.palette.text.secondary, mb: 2.5 }}
      >
        {description}
      </Typography>
      {children}
    </Box>
  );
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user, logout, refreshAuth } = useAuth();

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<string>(
    user?.role ?? localStorage.getItem(ROLE_STORAGE_KEY) ?? "analyst"
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [pendingPic, setPendingPic] = useState<File | null>(null);
  const [pendingPicPreview, setPendingPicPreview] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const picUploading = profileSaving && pendingPic !== null;
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const profileDirty =
    fullName !== (user?.name ?? "") ||
    email !== (user?.email ?? "") ||
    pendingPic !== null;

  // Sync role from user when it arrives (without useEffect + setState)
  if (user?.role && user.role !== role) {
    setRole(user.role);
  }

  const handleRoleChange = async (value: string) => {
    setRole(value);
    try {
      window.localStorage.setItem(ROLE_STORAGE_KEY, value);
    } catch {
      // ignore
    }
    await authService.updateProfile({ role: value });
    await refreshAuth();
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      if (pendingPic) {
        await authService.uploadProfilePic(pendingPic);
      }
      await authService.updateProfile({ name: fullName, email, role });
      await refreshAuth();
      setPendingPic(null);
      setPendingPicPreview(null);
      showSnackbar("Profile saved successfully.", "success");
    } catch {
      showSnackbar("Failed to save profile.", "error");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePicSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPendingPic(file);
    const url = URL.createObjectURL(file);
    setPendingPicPreview(url);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      showSnackbar("Passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showSnackbar("Password must be at least 6 characters.", "error");
      return;
    }
    setPasswordSaving(true);
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      showSnackbar("Password updated successfully.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      showSnackbar("Failed to change password.", "error");
    } finally {
      setPasswordSaving(false);
    }
  };

  const { data: keywords = [], isLoading: keywordsLoading } = useQuery({
    queryKey: ["keywords", "me"],
    queryFn: keywordsService.getMyKeywords,
  });

  const handleDelete = async () => {
    setIsModalOpen(false);
    setIsDeleting(true);
    try {
      await authService.deleteAccount();
      window.localStorage.clear();
      await logout();
      navigate(ROUTES.LOGIN);
    } catch {
      setIsDeleting(false);
    }
  };

  const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: "10px" } };

  return (
    <AppShell
      title="Settings"
      subtitle="Manage your account and personalize your experience."
      maxWidth={820}
    >
      {/* Profile */}
      <SectionCard
        title="Profile"
        description="Update your personal information."
      >
        <Box sx={{ mb: 3 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePicSelect}
          />
          <Box
            onClick={() => !picUploading && fileInputRef.current?.click()}
            sx={{
              position: "relative",
              width: 72,
              height: 72,
              borderRadius: "50%",
              cursor: picUploading ? "default" : "pointer",
              "&:hover .camera-overlay": { opacity: 1 },
            }}
          >
            {(pendingPicPreview ?? user?.profilePicUrl) ? (
              <Avatar
                src={pendingPicPreview ?? user?.profilePicUrl ?? undefined}
                alt={user?.name ?? user?.email ?? "User"}
                sx={{ width: 72, height: 72 }}
              />
            ) : (
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  backgroundColor: isDark ? "rgba(59,130,246,0.15)" : "#EFF6FF",
                  color: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  fontWeight: 700,
                }}
              >
                {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
              </Box>
            )}
            <Box
              className="camera-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
            >
              {picUploading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                <CameraAltIcon sx={{ color: "#fff", fontSize: 22 }} />
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mb: 2.5,
          }}
        >
          <TextField
            label="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            size="small"
            fullWidth
            sx={inputSx}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size="small"
            fullWidth
            sx={inputSx}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleProfileSave}
            disabled={profileSaving || !profileDirty}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              backgroundColor: "#2563EB",
              "&:hover": { backgroundColor: "#1D4ED8" },
            }}
          >
            {profileSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </SectionCard>

      {/* Security — only for local auth users (not Google) */}
      {user?.authProvider !== "google" ? (
        <SectionCard
          title="Security"
          description="Change your password to keep your account secure."
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
              mb: 2.5,
            }}
          >
            <TextField
              label="Current Password"
              type="password"
              size="small"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              sx={inputSx}
            />
            <TextField
              label="New Password"
              type="password"
              size="small"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              sx={inputSx}
            />
            <TextField
              label="Confirm Password"
              type="password"
              size="small"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              sx={inputSx}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handlePasswordChange}
              disabled={passwordSaving}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                backgroundColor: "#2563EB",
                "&:hover": { backgroundColor: "#1D4ED8" },
              }}
            >
              {passwordSaving ? "Updating..." : "Update Password"}
            </Button>
          </Box>
        </SectionCard>
      ) : (
        <SectionCard
          title="Security"
          description="Your account is linked to Google."
        >
          <Typography
            sx={{ fontSize: "14px", color: theme.palette.text.secondary }}
          >
            You signed in with Google. Password management is handled through
            your Google account.
          </Typography>
        </SectionCard>
      )}

      {/* Personalization */}
      <SectionCard
        title="Personalization"
        description="Tailor Blue Shield to how you work."
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              sx={{ fontSize: "12px", color: theme.palette.text.secondary }}
            >
              Current role
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {ROLES.find(r => r.id === role)?.title ?? "Analyst"}
            </Typography>
          </Box>
          <Select
            value={role}
            onChange={e => handleRoleChange(e.target.value)}
            size="small"
            sx={{ minWidth: 200, borderRadius: "10px" }}
          >
            {ROLES.map(r => (
              <MenuItem key={r.id} value={r.id}>
                {r.title}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </SectionCard>

      {/* Keywords */}
      <SectionCard title="My Keywords" description="Topics you are monitoring.">
        {keywordsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress size={22} sx={{ color: "#2563EB" }} />
          </Box>
        ) : keywords.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {keywords.map(keyword => (
              <Chip
                key={keyword.id}
                label={keyword.word}
                sx={{
                  backgroundColor: isDark ? "rgba(59,130,246,0.15)" : "#EFF6FF",
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography
            sx={{ fontSize: "14px", color: theme.palette.text.secondary }}
          >
            No keywords selected yet. Complete onboarding to set your
            preferences.
          </Typography>
        )}
        <Button
          variant="outlined"
          onClick={() => navigate(`${ROUTES.ONBOARDING}?edit`)}
          sx={{
            mt: 2,
            textTransform: "none",
            borderRadius: "10px",
            fontWeight: 500,
          }}
        >
          Edit Keywords
        </Button>
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard
        title="Danger Zone"
        description="Permanently delete your account and all associated data."
      >
        <Button
          variant="outlined"
          color="error"
          disabled={isDeleting}
          onClick={() => setIsModalOpen(true)}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px" }}
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </Button>
      </SectionCard>

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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "10px", fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppShell>
  );
};

export default SettingsPage;
