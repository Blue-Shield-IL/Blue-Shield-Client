import { ROUTES } from "constants/routes";
import useAuth from "contexts/authContext";
import { useEffect, useState } from "react";
import styles from "./OnboardingPage.style";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as keywordsService from "services/keywordsService";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, refreshAuth } = useAuth();

  const {
    data: topics = [],
    isLoading: isTopicsLoading,
    isError: isTopicsError,
  } = useQuery({
    queryKey: ["topics"],
    queryFn: keywordsService.getTopics,
  });

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.isOnboarded) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [user, navigate]);

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopicIds(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSkip = () => navigate(ROUTES.DASHBOARD);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await keywordsService.submitOnboarding(selectedTopicIds);
      await refreshAuth();
      navigate(ROUTES.DASHBOARD);
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
      <Typography sx={styles.title}>Welcome to Blue Shield</Typography>
      <Typography sx={styles.description}>
        Select the topics you're interested in to personalize your dashboard.
      </Typography>

      {(error || isTopicsError) && (
        <Alert severity="error" sx={styles.errorAlert} role="alert">
          {error || "Failed to load topics."}
        </Alert>
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
          Skip
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || selectedTopicIds.length === 0}
          sx={styles.continueButton}
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </Box>
    </Box>
  );
};

export default OnboardingPage;
