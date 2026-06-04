import { ROUTES } from "constants/routes";
import useAuth from "contexts/authContext";
import { useEffect, useState } from "react";
import styles from "./OnboardingPage.style";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import * as keywordsService from "services/keywordsService";
import type { Topic } from "services/keywordsService";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.isOnboarded) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await keywordsService.getTopics();
        setTopics(data);
      } catch {
        setError("Failed to load topics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

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

  if (user?.isOnboarded) return null;

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>Welcome to Blue Shield</Typography>
      <Typography sx={styles.description}>
        Select the topics you're interested in to personalize your dashboard.
      </Typography>

      {error && (
        <Alert severity="error" sx={styles.errorAlert} role="alert">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
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
                  style={{ display: "none" }}
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
