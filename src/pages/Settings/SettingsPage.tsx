import { useEffect, useState } from "react";
import {
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
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import AppShell from "components/AppShell";
import { ROUTES } from "constants/routes";
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
      <Typography sx={{ fontSize: "16px", fontWeight: 600, color: theme.palette.text.primary }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary, mb: 2.5 }}>
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
  const { user, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<string>("analyst");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ROLE_STORAGE_KEY);
      if (stored) setRole(stored);
    } catch {
      // ignore
    }
  }, []);

  const handleRoleChange = (value: string) => {
    setRole(value);
    try {
      window.localStorage.setItem(ROLE_STORAGE_KEY, value);
    } catch {
      // ignore
    }
  };

  const { data: keywords = [], isLoading: keywordsLoading } = useQuery({
    queryKey: ["keywords"],
    queryFn: keywordsService.getMyKeywords,
  });

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

  const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: "10px" } };

  return (
    <AppShell
      title="Settings"
      subtitle="Manage your account and personalize your experience."
      maxWidth={820}
    >
      {/* Profile */}
      <SectionCard title="Profile" description="Update your personal information.">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: isDark ? "rgba(59,130,246,0.15)" : "#EFF6FF",
              color: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
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
            onChange={(e) => setFullName(e.target.value)}
            size="small"
            fullWidth
            sx={inputSx}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            fullWidth
            sx={inputSx}
          />
        </Box>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            backgroundColor: "#2563EB",
            "&:hover": { backgroundColor: "#1D4ED8" },
          }}
        >
          Save Changes
        </Button>
      </SectionCard>

      {/* Security */}
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
          <TextField label="Current Password" type="password" size="small" sx={inputSx} />
          <TextField label="New Password" type="password" size="small" sx={inputSx} />
          <TextField label="Confirm Password" type="password" size="small" sx={inputSx} />
        </Box>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            backgroundColor: "#2563EB",
            "&:hover": { backgroundColor: "#1D4ED8" },
          }}
        >
          Update Password
        </Button>
      </SectionCard>

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
            <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
              Current role
            </Typography>
            <Typography sx={{ fontSize: "14px", fontWeight: 600, color: theme.palette.text.primary }}>
              {ROLES.find((r) => r.id === role)?.title ?? "Analyst"}
            </Typography>
          </Box>
          <Select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            size="small"
            sx={{ minWidth: 200, borderRadius: "10px" }}
          >
            {ROLES.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.title}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </SectionCard>

      {/* Keywords */}
      <SectionCard
        title="My Keywords"
        description="Topics you are monitoring."
      >
        {keywordsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress size={22} sx={{ color: "#2563EB" }} />
          </Box>
        ) : keywords.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {keywords.map((keyword) => (
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
          <Typography sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>
            No keywords selected yet. Complete onboarding to set your preferences.
          </Typography>
        )}
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
    </AppShell>
  );
};

export default SettingsPage;
