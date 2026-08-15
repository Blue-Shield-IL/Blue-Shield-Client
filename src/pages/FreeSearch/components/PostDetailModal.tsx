import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import { getScoreColor } from "../helpers";
import { useTranslation } from "hooks/useDashboardData";

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
  likes?: number;
  shares?: number;
  commentsCount?: number;
  popularity?: number;
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [showTranslation, setShowTranslation] = useState(false);
  const [copied, setCopied] = useState(false);

  const isNonEnglish =
    post?.language != null && post.language !== "en" && post.language !== "";

  const { data: translationData, isLoading: translating } = useTranslation(
    post?.textContent ?? "",
    post?.language ?? undefined,
    showTranslation && isNonEnglish
  );

  if (!post) return null;

  const score = post.antisemitismScore;
  const scoreColor = score !== null ? getScoreColor(score) : null;
  const scorePct = score !== null ? Math.round(score * 100) : null;

  const handleClose = () => {
    onClose();
    setShowTranslation(false);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post.textContent ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write failed silently
    }
  };

  const computedPopularity =
    post.popularity ??
    (post.views !== undefined ||
    post.likes !== undefined ||
    post.shares !== undefined
      ? (post.views ?? 0) * 0.5 +
        (post.likes ?? 0) * 0.3 +
        (post.shares ?? 0) * 0.2
      : undefined);

  const dtStyle = {
    fontSize: "12px",
    color: theme.palette.text.secondary,
  };

  const ddStyle = {
    fontSize: "14px",
    fontWeight: 500,
    color: theme.palette.text.primary,
    mt: 0.25,
  };

  const scrollbarStyles = {
    scrollbarWidth: "thin" as const,
    scrollbarColor: isDark
      ? "rgba(255,255,255,0.15) transparent"
      : "rgba(0,0,0,0.12) transparent",
    "&::-webkit-scrollbar": { width: 6 },
    "&::-webkit-scrollbar-track": { background: "transparent" },
    "&::-webkit-scrollbar-thumb": {
      background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
      borderRadius: 3,
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
          },
        },
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
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: 3,
          py: 2.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {post.channel || post.author}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: theme.palette.text.secondary,
              mt: 0.25,
            }}
          >
            {post.channel
              ? post.author
              : `@${post.author.replace(/\s+/g, "_").toLowerCase()}`}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          aria-label="Close"
          sx={{
            color: theme.palette.text.secondary,
            width: 32,
            height: 32,
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.text.primary,
            },
          }}
        >
          ✕
        </IconButton>
      </Box>

      {/* Body */}
      <Box
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          px: 3,
          py: 3,
          ...scrollbarStyles,
        }}
      >
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
              <CalendarIcon color={theme.palette.text.secondary} />
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
              <EyeIcon color={theme.palette.text.secondary} />
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
          {post.likes !== undefined && (
            <Box>
              <Typography sx={dtStyle}>Likes</Typography>
              <Typography sx={ddStyle}>{formatNumber(post.likes)}</Typography>
            </Box>
          )}
          {post.shares !== undefined && (
            <Box>
              <Typography sx={dtStyle}>Shares</Typography>
              <Typography sx={ddStyle}>{formatNumber(post.shares)}</Typography>
            </Box>
          )}
          {post.commentsCount !== undefined && (
            <Box>
              <Typography sx={dtStyle}>Comments</Typography>
              <Typography sx={ddStyle}>
                {formatNumber(post.commentsCount)}
              </Typography>
            </Box>
          )}
          {computedPopularity !== undefined && (
            <Box>
              <Tooltip
                title="Calculated as: views × 0.5 + likes × 0.3 + shares × 0.2"
                arrow
              >
                <Typography
                  sx={{
                    ...dtStyle,
                    width: "fit-content",
                    cursor: "help",
                    borderBottom: `1px dotted ${theme.palette.text.secondary}`,
                  }}
                >
                  Popularity
                </Typography>
              </Tooltip>
              <Typography sx={ddStyle}>
                {formatNumber(Math.round(computedPopularity))}
              </Typography>
            </Box>
          )}
        </Box>

        {/* IHRA Categories */}
        {post.ihraLabels.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography sx={dtStyle}>IHRA Categories</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
              {post.ihraLabels.map(c => (
                <Box
                  key={c}
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: isDark ? "#93C5FD" : "#2563EB",
                    backgroundColor: isDark
                      ? "rgba(37,99,235,0.15)"
                      : "#EFF6FF",
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
              {post.keywords.map(kw => (
                <Box
                  key={kw}
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: isDark ? "#D1D5DB" : "#475569",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "#F1F5F9",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography sx={dtStyle}>Full Post Content</Typography>
              <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} arrow>
                <IconButton
                  onClick={handleCopy}
                  size="small"
                  aria-label="Copy post content"
                  sx={{
                    width: 22,
                    height: 22,
                    color: copied
                      ? theme.palette.success.main
                      : theme.palette.text.secondary,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      color: copied
                        ? theme.palette.success.main
                        : theme.palette.text.primary,
                    },
                  }}
                >
                  {copied ? (
                    <CheckIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
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
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
              p: 2,
              maxHeight: 200,
              overflowY: "auto",
              ...scrollbarStyles,
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: theme.palette.text.primary,
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
                border: `1px solid ${isDark ? "rgba(59,130,246,0.3)" : "#DBEAFE"}`,
                backgroundColor: isDark ? "rgba(59,130,246,0.08)" : "#EFF6FF",
                p: 2,
                maxHeight: 200,
                overflowY: "auto",
                ...scrollbarStyles,
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: isDark ? "#93C5FD" : "#2563EB",
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
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Translating...
                  </Typography>
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: theme.palette.text.primary,
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {translationData?.translatedText ??
                    "Translation unavailable."}
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
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            borderRadius: "8px",
            fontWeight: 500,
            fontSize: "13px",
            textTransform: "none",
            px: 2.5,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

// ---- Inline icons ----

const CalendarIcon = ({ color }: { color: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color, flexShrink: 0 }}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const EyeIcon = ({ color }: { color: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color, flexShrink: 0 }}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default PostDetailModal;
