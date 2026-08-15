import { ROUTES } from "constants/routes";
import useAuth from "contexts/authContext";
import * as authService from "services/authService";
import { useMemo, useEffect, useState } from "react";
import useOnboardingStyles from "./OnboardingPage.style";
import * as keywordsService from "services/keywordsService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const ROLES = [
  {
    id: "analyst",
    title: "Analyst",
    description:
      "Focuses on trends, sentiment analysis, and data-driven insights.",
    defaultTopics: [
      "281b0f31-5474-473f-bdcd-c9df7317afad",
      "4befa062-7747-4798-94c6-2c6de5b52f16",
      "a1616a08-8aae-414e-8300-f8f250364c0c",
    ],
  },
  {
    id: "foreign-affairs",
    title: "Foreign Affairs",
    description:
      "Prioritizes geopolitical context, policy, and international relations.",
    defaultTopics: [
      "281b0f31-5474-473f-bdcd-c9df7317afad",
      "4befa062-7747-4798-94c6-2c6de5b52f16",
      "80ed0a90-dc9b-4b3c-bb78-14af1e50c881",
    ],
  },
  {
    id: "communications",
    title: "Communications",
    description:
      "Emphasizes media narratives, public opinion, and messaging strategy.",
    defaultTopics: [
      "281b0f31-5474-473f-bdcd-c9df7317afad",
      "4befa062-7747-4798-94c6-2c6de5b52f16",
      "80ed0a90-dc9b-4b3c-bb78-14af1e50c881",
      "d7cf627f-ec7b-40c6-bc3e-0c8168e79e0e",
    ],
  },
  {
    id: "researcher",
    title: "Researcher",
    description:
      "Dives deep into academic discourse, data distributions, and long-term patterns.",
    defaultTopics: [
      "281b0f31-5474-473f-bdcd-c9df7317afad",
      "4befa062-7747-4798-94c6-2c6de5b52f16",
      "80ed0a90-dc9b-4b3c-bb78-14af1e50c881",
      "a1616a08-8aae-414e-8300-f8f250364c0c",
      "d7cf627f-ec7b-40c6-bc3e-0c8168e79e0e",
    ],
  },
];

const ROLE_STORAGE_KEY = "blueshield.role";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, refreshAuth } = useAuth();
  const [searchParams] = useSearchParams();
  const [cameFromSettings] = useState(() => searchParams.has("edit"));
  const styles = useOnboardingStyles();

  const {
    data: topics = [],
    isLoading: isTopicsLoading,
    isError: isTopicsError,
  } = useQuery({
    queryKey: ["topics"],
    queryFn: keywordsService.getTopics,
  });

  const { data: existingKeywords } = useQuery({
    queryKey: ["keywords", "me"],
    queryFn: keywordsService.getMyKeywords,
    enabled: cameFromSettings,
  });

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [role, setRole] = useState<string>(
    user?.role ?? localStorage.getItem(ROLE_STORAGE_KEY) ?? "analyst"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Compute the initial topic selection from topics data
  const initialTopicIds = useMemo(() => {
    if (topics.length === 0) return [];

    if (cameFromSettings && existingKeywords && existingKeywords.length > 0) {
      const existingWords = new Set(existingKeywords.map(k => k.word));
      const matchedIds = topics
        .filter(t => t.keywords.some(kw => existingWords.has(kw.word)))
        .map(t => t.id);
      if (matchedIds.length > 0) return matchedIds;
    }

    if (!cameFromSettings) {
      const selectedRole = ROLES.find(r => r.id === role);
      const defaultNames = selectedRole?.defaultTopics ?? [];
      const matchedIds = topics
        .filter(t => defaultNames.includes(t.name))
        .map(t => t.id);
      return matchedIds.length > 0 ? matchedIds : topics.map(t => t.id);
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics, existingKeywords, cameFromSettings]);

  const [hasInitialized, setHasInitialized] = useState(false);

  // Sync initial selection once topics load
  if (initialTopicIds.length > 0 && !hasInitialized) {
    setSelectedTopicIds(initialTopicIds);
    setHasInitialized(true);
  }

  useEffect(() => {
    if (user?.isOnboarded && !cameFromSettings) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [user, navigate, cameFromSettings]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    if (!cameFromSettings && topics.length > 0) {
      const selectedRole = ROLES.find(r => r.id === newRole);
      const defaultNames = selectedRole?.defaultTopics ?? [];
      const matchedIds = topics
        .filter(t => defaultNames.includes(t.id))
        .map(t => t.id);
      setSelectedTopicIds(
        matchedIds.length > 0 ? matchedIds : topics.map(t => t.id)
      );
    }
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopicIds(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSkip = () =>
    navigate(cameFromSettings ? ROUTES.SETTINGS : ROUTES.DASHBOARD);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await keywordsService.submitOnboarding(selectedTopicIds);
      localStorage.setItem(ROLE_STORAGE_KEY, role);
      await authService.updateProfile({ role });
      await queryClient.invalidateQueries({ queryKey: ["keywords", "me"] });
      await refreshAuth();
      navigate(cameFromSettings ? ROUTES.SETTINGS : ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(
        axiosError?.response?.data?.message || "Failed to save preferences."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>
        {cameFromSettings ? "Edit Your Preferences" : "Welcome to Blue Shield"}
      </Typography>
      <Typography sx={styles.description}>
        {cameFromSettings
          ? "Update your topics and role to refine your dashboard experience."
          : "Select the topics you're interested in to personalize your dashboard."}
      </Typography>

      {(error || isTopicsError) && (
        <Alert severity="error" sx={styles.errorAlert} role="alert">
          {error || "Failed to load topics."}
        </Alert>
      )}

      {!cameFromSettings && (
        <Box sx={styles.roleSection}>
          <Typography sx={styles.roleLabel}>Your Role</Typography>
          <Select
            value={role}
            onChange={e => handleRoleChange(e.target.value)}
            size="small"
            disabled={isSubmitting}
            sx={styles.roleSelect}
          >
            {ROLES.map(r => (
              <MenuItem key={r.id} value={r.id}>
                {r.title}
              </MenuItem>
            ))}
          </Select>
          <Typography sx={styles.roleDescription}>
            {ROLES.find(r => r.id === role)?.description}
          </Typography>
        </Box>
      )}
      {isTopicsLoading ? (
        <Box sx={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={styles.grid}>
          {topics.map(topic => {
            const isSelected = selectedTopicIds.includes(topic.id);
            return (
              <Box
                key={topic.id}
                component="label"
                sx={isSelected ? styles.chipSelected : styles.chip}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleTopicToggle(topic.id)}
                  disabled={isSubmitting}
                  style={styles.hiddenCheckbox as React.CSSProperties}
                />
                <Typography component="span" sx={styles.chipIcon}>
                  {topic.icon || "📌"}
                </Typography>
                <Typography component="span">{topic.name}</Typography>
              </Box>
            );
          })}
        </Box>
      )}

      <Box sx={styles.actions}>
        <Button
          variant="outlined"
          onClick={handleSkip}
          disabled={isSubmitting}
          sx={styles.skipButton}
        >
          {cameFromSettings ? "Cancel" : "Skip"}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || selectedTopicIds.length === 0}
          sx={styles.continueButton}
        >
          {isSubmitting ? "Saving..." : cameFromSettings ? "Save" : "Continue"}
        </Button>
      </Box>
    </Box>
  );
};

export default OnboardingPage;
