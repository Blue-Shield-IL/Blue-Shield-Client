import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";

import { useTranslation } from "hooks/useDashboardData";
import { getScoreColor } from "../helpers";

export interface PostModalData {
  author: string;
  channel: string | null;
  country: string | null;
  createdAt: string | null;
  views: number;
  antisemitismScore: number | null;
  ihraLabels: string[];
  keywords: string[];
  textContent: string;
  language?: string | null;
  sentiment?: string | null;
}

interface PostDetailModalProps {
  post: PostModalData | null;
  open: boolean;
  onClose: () => void;
}

const formatDate = (iso: string | null): string => {
  if (!iso) return "Unknown date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return (
    d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
};

const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
};

const PostDetailModal = ({ post, open, onClose }: PostDetailModalProps) => {
  const [showTranslation, setShowTranslation] = useState(false);

  const isNonEnglish =
    post?.language != null && post.language !== "en" && post.language !== "";

  const { data: translationData, isLoading: translating } = useTranslation(
    post?.textContent ?? "",
    post?.language ?? undefined,
    showTranslation && isNonEnglish,
  );

  if (!post) return null;

  const score = post.antisemitismScore;
  const scoreColor = score !== null ? getScoreColor(score) : null;
  const scorePct = score !== null ? Math.round(score * 100) : null;

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setShowTranslation(false);
      }}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: "16px", overflow: "hidden" } },
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          borderBottom: "1px solid #E5E7EB",
          px: 3,
          py: 2.5,
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: "16px", fontWeight: 600, color: "#111827" }}
          >
            {post.channel || post.author}
          </Typography>
          <Typography sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.25 }}>
            {post.channel
              ? post.author
              : `@${post.author.replace(/\s+/g, "_").toLowerCase()}`}
          </Typography>
        </Box>
        <IconButton
          onClick={() => {
            onClose();
            setShowTranslation(false);
          }}
          size="small"
          aria-label="Close"
          sx={{
            color: "#9CA3AF",
            "&:hover": { backgroundColor: "#F1F5F9", color: "#374151" },
          }}
        >
          ✕
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ maxHeight: "70vh", overflowY: "auto", px: 3, py: 3 }}>
        {/* Meta grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2.5,
          }}
        >
          <Box>
            <Typography sx={dtStyle}>Country</Typography>
            <Typography sx={ddStyle}>{post.country || "Unknown"}</Typography>
          </Box>
          <Box>
            <Typography sx={dtStyle}>Published</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.25,
              }}
            >
              <CalendarIcon />
              <Typography sx={ddStyle}>{formatDate(post.createdAt)}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={dtStyle}>Views</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.25,
              }}
            >
              <EyeIcon />
              <Typography sx={ddStyle}>{formatNumber(post.views)}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={dtStyle}>Antisemitism Score</Typography>
            <Box sx={{ mt: 0.5 }}>
              {scorePct !== null && scoreColor ? (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: "999px",
                    px: 1,
                    py: 0.25,
                    fontSize: "12px",
                    fontWeight: 600,
                    backgroundColor: scoreColor.bg,
                    color: scoreColor.text,
                  }}
                >
                  {scorePct} / 100
                </Box>
              ) : (
                <Typography sx={ddStyle}>—</Typography>
              )}
            </Box>
          </Box>
          {post.language && (
            <Box>
              <Typography sx={dtStyle}>Language</Typography>
              <Typography sx={ddStyle}>
                {post.language.toUpperCase()}
              </Typography>
            </Box>
          )}
          {post.sentiment && (
            <Box>
              <Typography sx={dtStyle}>Sentiment</Typography>
              <Typography sx={ddStyle}>{post.sentiment}</Typography>
            </Box>
          )}
        </Box>

        {/* IHRA Categories */}
        {post.ihraLabels.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography sx={dtStyle}>IHRA Categories</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
              {post.ihraLabels.map((c) => (
                <Box
                  key={c}
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#2563EB",
                    backgroundColor: "#EFF6FF",
                    borderRadius: "999px",
                    px: 1.25,
                    py: 0.5,
                  }}
                >
                  {c}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Keywords */}
        {post.keywords.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography sx={dtStyle}>Keywords</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
              {post.keywords.map((kw) => (
                <Box
                  key={kw}
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#475569",
                    backgroundColor: "#F1F5F9",
                    borderRadius: "999px",
                    px: 1.25,
                    py: 0.5,
                  }}
                >
                  {kw}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Full Post Content */}
        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={dtStyle}>Full Post Content</Typography>
            {isNonEnglish && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowTranslation(!showTranslation)}
                sx={{
                  borderRadius: "8px",
                  fontSize: "11px",
                  textTransform: "none",
                  fontWeight: 500,
                  px: 1.5,
                  py: 0.25,
                  minHeight: 0,
                }}
              >
                {showTranslation ? "Show Original" : "Translate to English"}
              </Button>
            )}
          </Box>
          <Box
            sx={{
              mt: 1,
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              backgroundColor: "#F9FAFB",
              p: 2,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: "#374151",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {post.textContent || "No content available."}
            </Typography>
          </Box>

          {/* Translation output */}
          {showTranslation && isNonEnglish && (
            <Box
              sx={{
                mt: 1.5,
                borderRadius: "12px",
                border: "1px solid #DBEAFE",
                backgroundColor: "#EFF6FF",
                p: 2,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#2563EB",
                  mb: 0.75,
                }}
              >
                English Translation
              </Typography>
              {translating ? (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}
                >
                  <CircularProgress size={14} />
                  <Typography sx={{ fontSize: "13px", color: "#6B7280" }}>
                    Translating...
                  </Typography>
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#374151",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {translationData?.translatedText ?? "Translation unavailable."}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          borderTop: "1px solid #E5E7EB",
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={() => {
            onClose();
            setShowTranslation(false);
          }}
          variant="contained"
          sx={{
            borderRadius: "8px",
            backgroundColor: "#2563EB",
            fontWeight: 500,
            fontSize: "13px",
            textTransform: "none",
            px: 2.5,
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1D4ED8", boxShadow: "none" },
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

// ---- Inline icons ----

const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#6B7280", flexShrink: 0 }}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#6B7280", flexShrink: 0 }}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ---- Styles ----

const dtStyle = {
  fontSize: "12px",
  color: "#9CA3AF",
};

const ddStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#111827",
  mt: 0.25,
};

export default PostDetailModal;
