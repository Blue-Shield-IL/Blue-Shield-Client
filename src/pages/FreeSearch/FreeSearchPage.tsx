import { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  InputBase,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme, type Theme } from "@mui/material/styles";

import AppShell from "components/AppShell";
import CountryFlag from "components/CountryFlag";
import DateRangePicker from "components/DateRangePicker";
import type { RangePreset } from "components/DateRangePicker";
import { COUNTRY_ISO2 } from "constants/countryFlags";
import {
  usePostSearch,
  useTopKeywords,
  useTopSources,
} from "hooks/useDashboardData";
import type { PostItem } from "interfaces/dashboard";
import PostDetailModal from "./components/PostDetailModal";
import { getScoreColor } from "./helpers";

const PAGE_SIZE = 12;

const COUNTRY_OPTIONS = Object.keys(COUNTRY_ISO2).filter(
  (c) => !["USA", "US", "UK", "Great Britain", "Czech Republic"].includes(c),
);

const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
};

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return (
    d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
};

const FreeSearchPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Filter state
  const [searchText, setSearchText] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Date range state (same pattern as main page)
  const [datePreset, setDatePreset] = useState<RangePreset>("All Time");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Applied filters (only sent to API on Search click)
  const [applied, setApplied] = useState({
    search: "",
    sources: [] as string[],
    keywords: [] as string[],
    countries: [] as string[],
    startDate: "",
    endDate: "",
  });

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  // Fetch dropdown options
  const { data: keywordsData } = useTopKeywords({ limit: 50 });
  const { data: sourcesData } = useTopSources({ limit: 50 });

  const keywordOptions = useMemo(
    () => (keywordsData || []).map((k) => k.keyword),
    [keywordsData],
  );
  const sourceOptions = useMemo(
    () => (sourcesData || []).map((s) => s.name),
    [sourcesData],
  );

  const { data, isLoading, isError, refetch, isFetching } = usePostSearch({
    page,
    pageSize: PAGE_SIZE,
    search: applied.search || undefined,
    author: applied.sources.length ? applied.sources.join(",") : undefined,
    keywords: applied.keywords.length ? applied.keywords.join(",") : undefined,
    country: applied.countries.length ? applied.countries.join(",") : undefined,
    startDate: applied.startDate || undefined,
    endDate: applied.endDate || undefined,
    sortBy,
    sortOrder,
  });

  const handlePresetChange = (preset: RangePreset) => {
    setDatePreset(preset);
    if (preset === "All Time") {
      setStartDate("");
      setEndDate("");
    } else if (preset === "Last 7 Days") {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      setStartDate(start.toISOString());
      setEndDate(end.toISOString());
    } else if (preset === "Last 30 Days") {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      setStartDate(start.toISOString());
      setEndDate(end.toISOString());
    }
  };

  const handleCustomRange = (start: string, end: string) => {
    setDatePreset("Custom Range");
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearch = () => {
    setApplied({
      search: searchText,
      sources: selectedSources,
      keywords: selectedKeywords,
      countries: selectedCountries,
      startDate,
      endDate,
    });
    setPage(1);
  };

  const handleClear = () => {
    setSearchText("");
    setSelectedSources([]);
    setSelectedKeywords([]);
    setSelectedCountries([]);
    setDatePreset("All Time");
    setStartDate("");
    setEndDate("");
    setApplied({
      search: "",
      sources: [],
      keywords: [],
      countries: [],
      startDate: "",
      endDate: "",
    });
    setPage(1);
  };

  const totalPages = data?.totalPages || 1;
  const pageNumbers = useMemo(
    () => buildPageNumbers(page, totalPages),
    [page, totalPages],
  );

  const inputStyle = {
    width: "100%",
    height: 40,
    borderRadius: "8px",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    px: 1.5,
    fontSize: "14px",
    transition: "border-color 0.15s",
    "&:focus-within": {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 3px ${isDark ? "rgba(59,130,246,0.15)" : "rgba(37,99,235,0.08)"}`,
    },
  };

  const autocompleteStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontSize: "14px",
      minHeight: 40,
      padding: "3px 8px",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.divider,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.light,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
  };

  return (
    <AppShell
      title="Post Search"
      subtitle="Search and filter collected posts."
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}
      >
        {/* Filter Card */}
        <Box
          sx={{
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            p: 2.5,
          }}
        >
          {/* Free text search - full width */}
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: theme.palette.text.secondary,
                mb: 0.75,
              }}
            >
              Search
            </Typography>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.palette.text.secondary,
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SearchIcon />
              </Box>
              <InputBase
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Free text search across posts, authors, channels..."
                sx={{ ...inputStyle, pl: "36px" }}
              />
            </Box>
          </Box>

          {/* Filter row */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            {/* Sources - multi-select dropdown */}
            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  mb: 0.75,
                }}
              >
                Sources
              </Typography>
              <Autocomplete
                multiple
                size="small"
                options={sourceOptions}
                value={selectedSources}
                onChange={(_, newVal) => setSelectedSources(newVal)}
                disableCloseOnSelect
                limitTags={2}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option}>
                    <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
                    <Typography sx={{ fontSize: "13px" }}>{option}</Typography>
                  </li>
                )}
                renderValue={(value, getItemProps) =>
                  value.map((option, index) => {
                    const itemProps = getItemProps({ index });
                    return (
                      <CompactChip
                        key={option}
                        label={option}
                        onDelete={itemProps.onDelete}
                        theme={theme}
                        isDark={isDark}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={
                      selectedSources.length === 0 ? "Select sources..." : ""
                    }
                  />
                )}
                sx={autocompleteStyle}
              />
            </Box>

            {/* Keywords - multi-select dropdown */}
            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  mb: 0.75,
                }}
              >
                Keywords
              </Typography>
              <Autocomplete
                multiple
                size="small"
                options={keywordOptions}
                value={selectedKeywords}
                onChange={(_, newVal) => setSelectedKeywords(newVal)}
                disableCloseOnSelect
                limitTags={2}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option}>
                    <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
                    <Typography sx={{ fontSize: "13px" }}>{option}</Typography>
                  </li>
                )}
                renderValue={(value, getItemProps) =>
                  value.map((option, index) => {
                    const itemProps = getItemProps({ index });
                    return (
                      <CompactChip
                        key={option}
                        label={option}
                        onDelete={itemProps.onDelete}
                        theme={theme}
                        isDark={isDark}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={
                      selectedKeywords.length === 0 ? "Select keywords..." : ""
                    }
                  />
                )}
                sx={autocompleteStyle}
              />
            </Box>

            {/* Countries - multi-select with flags only */}
            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  mb: 0.75,
                }}
              >
                Countries
              </Typography>
              <Autocomplete
                multiple
                size="small"
                options={COUNTRY_OPTIONS}
                value={selectedCountries}
                onChange={(_, newVal) => setSelectedCountries(newVal)}
                disableCloseOnSelect
                limitTags={4}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option}>
                    <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
                    <CountryFlag country={option} width={18} />
                    <Typography sx={{ fontSize: "13px", ml: 1 }}>
                      {option}
                    </Typography>
                  </li>
                )}
                renderValue={(value, getItemProps) =>
                  value.map((option, index) => {
                    const itemProps = getItemProps({ index });
                    return (
                      <CountryChip
                        key={option}
                        country={option}
                        onDelete={itemProps.onDelete}
                        theme={theme}
                        isDark={isDark}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={
                      selectedCountries.length === 0
                        ? "Select countries..."
                        : ""
                    }
                  />
                )}
                sx={autocompleteStyle}
              />
            </Box>
          </Box>

          {/* Date Range + Actions row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            <DateRangePicker
              preset={datePreset}
              startDate={startDate}
              endDate={endDate}
              onPresetChange={handlePresetChange}
              onCustomRange={handleCustomRange}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: "auto" }}>
              <Button
                onClick={handleSearch}
                variant="contained"
                sx={{
                  height: 36,
                  px: 2.5,
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13px",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                🔍 Search
              </Button>
              <Button
                onClick={handleClear}
                variant="outlined"
                sx={{
                  height: 36,
                  px: 2.5,
                  borderRadius: "8px",
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  fontSize: "13px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.divider,
                  },
                }}
              >
                Clear Filters
              </Button>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                }}
              >
                {data ? `${data.total.toLocaleString()} results` : ""}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Results Table */}
        <Box
          sx={{
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "160px 130px 1fr 80px 90px 150px 160px 60px",
              alignItems: "center",
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.action.hover,
              fontSize: "11px",
              fontWeight: 600,
              color: theme.palette.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                cursor: "pointer",
                "&:hover": { color: theme.palette.primary.main },
              }}
              onClick={() =>
                toggleSort(
                  "author",
                  sortBy,
                  sortOrder,
                  setSortBy,
                  setSortOrder,
                  setPage,
                )
              }
            >
              Source{" "}
              {sortBy === "author" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </Box>
            <Box>Country</Box>
            <Box>Post Preview</Box>
            <Box
              sx={{
                cursor: "pointer",
                "&:hover": { color: theme.palette.primary.main },
              }}
              onClick={() =>
                toggleSort(
                  "antisemitism_score",
                  sortBy,
                  sortOrder,
                  setSortBy,
                  setSortOrder,
                  setPage,
                )
              }
            >
              Score{" "}
              {sortBy === "antisemitism_score"
                ? sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </Box>
            <Box
              sx={{
                cursor: "pointer",
                "&:hover": { color: theme.palette.primary.main },
              }}
              onClick={() =>
                toggleSort(
                  "views",
                  sortBy,
                  sortOrder,
                  setSortBy,
                  setSortOrder,
                  setPage,
                )
              }
            >
              Views{" "}
              {sortBy === "views" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </Box>
            <Box
              sx={{
                cursor: "pointer",
                "&:hover": { color: theme.palette.primary.main },
              }}
              onClick={() =>
                toggleSort(
                  "created_at",
                  sortBy,
                  sortOrder,
                  setSortBy,
                  setSortOrder,
                  setPage,
                )
              }
            >
              Published{" "}
              {sortBy === "created_at"
                ? sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </Box>
            <Box>Keywords</Box>
            <Box sx={{ textAlign: "right" }}>Actions</Box>
          </Box>

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
                gap: 1,
              }}
            >
              <CircularProgress
                size={32}
                sx={{ color: theme.palette.primary.main }}
              />
            </Box>
          ) : isError ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
                gap: 1,
              }}
            >
              <Typography sx={{ color: theme.palette.error.main, mb: 1 }}>
                Failed to load posts.
              </Typography>
              <Button variant="outlined" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            </Box>
          ) : data && data.items.length > 0 ? (
            <Box
              sx={{
                opacity: isFetching ? 0.6 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {data.items.map((post) => (
                <Box
                  key={post.postId}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "160px 130px 1fr 80px 90px 150px 160px 60px",
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                    borderBottom: `1px solid ${isDark ? theme.palette.divider : "#F1F5F9"}`,
                    transition: "background-color 0.12s",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                    "&:last-child": { borderBottom: "none" },
                    minWidth: 0,
                  }}
                  onClick={() => setSelectedPost(post)}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.channel || post.author}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: theme.palette.text.secondary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.channel
                        ? post.author
                        : `@${post.author.replace(/\s+/g, "_").toLowerCase()}`}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      minWidth: 0,
                    }}
                  >
                    {post.country ? (
                      <>
                        <CountryFlag country={post.country} width={18} />
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: theme.palette.text.secondary,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {post.country}
                        </Typography>
                      </>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        —
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 0, pr: 1 }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.text.secondary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.textContent
                        ? post.textContent.length > 100
                          ? post.textContent.slice(0, 100) + "…"
                          : post.textContent
                        : "—"}
                    </Typography>
                  </Box>
                  <Box>
                    {post.antisemitismScore !== null ? (
                      <ScoreBadge score={post.antisemitismScore} />
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        —
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {formatNumber(post.views)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: theme.palette.text.secondary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(post.createdAt)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      minWidth: 0,
                    }}
                  >
                    {(post.ihraLabels.length > 0
                      ? post.ihraLabels
                      : post.keywords
                    )
                      .slice(0, 2)
                      .map((tag) => (
                        <Box
                          key={tag}
                          sx={{
                            fontSize: "10px",
                            fontWeight: 500,
                            color: theme.palette.primary.main,
                            backgroundColor: isDark
                              ? "rgba(59,130,246,0.15)"
                              : "#EFF6FF",
                            borderRadius: "999px",
                            px: 0.8,
                            py: 0.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 70,
                          }}
                        >
                          {tag}
                        </Box>
                      ))}
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                      }}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 30,
                        height: 30,
                        borderRadius: "8px",
                        color: theme.palette.text.secondary,
                        cursor: "pointer",
                        transition: "all 0.12s",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                          color: theme.palette.text.primary,
                        },
                      }}
                      role="button"
                      aria-label={`View details for post by ${post.author}`}
                    >
                      ⋮
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
                gap: 1,
              }}
            >
              <Typography sx={{ color: theme.palette.text.secondary }}>
                No posts match your filters.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {data && data.total > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              sx={{ fontSize: "13px", color: theme.palette.text.secondary }}
            >
              {data.total.toLocaleString()} results
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                ml: "auto",
              }}
            >
              <PagerButton
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                theme={theme}
              >
                ‹ Previous
              </PagerButton>
              {pageNumbers.map((p, i) =>
                p === "..." ? (
                  <Typography
                    key={`e${i}`}
                    sx={{
                      color: theme.palette.text.secondary,
                      px: 0.5,
                      fontSize: "13px",
                    }}
                  >
                    …
                  </Typography>
                ) : (
                  <Box
                    key={p}
                    onClick={() => setPage(p as number)}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      color:
                        p === page ? "#FFFFFF" : theme.palette.text.secondary,
                      backgroundColor:
                        p === page
                          ? theme.palette.primary.main
                          : "transparent",
                      fontWeight: p === page ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.12s",
                      "&:hover": {
                        backgroundColor:
                          p === page
                            ? theme.palette.primary.dark
                            : theme.palette.action.hover,
                        color:
                          p === page
                            ? "#FFFFFF"
                            : theme.palette.primary.main,
                      },
                    }}
                  >
                    {p}
                  </Box>
                ),
              )}
              <PagerButton
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                theme={theme}
              >
                Next ›
              </PagerButton>
            </Box>
          </Box>
        )}
      </Box>

      <PostDetailModal
        post={selectedPost}
        open={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
      />
    </AppShell>
  );
};

/* ─── Compact Chip for Sources / Keywords ──────────────────────────────── */
const CompactChip = ({
  label,
  onDelete,
  theme,
  isDark,
}: {
  label: string;
  onDelete: (e: any) => void;
  theme: Theme;
  isDark: boolean;
}) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.5,
      height: 24,
      borderRadius: "999px",
      border: `1px solid ${theme.palette.primary.main}`,
      backgroundColor: isDark ? "rgba(59,130,246,0.1)" : "#EFF6FF",
      pl: 1,
      pr: 0.5,
      maxWidth: 110,
    }}
  >
    <Typography
      sx={{
        fontSize: "11px",
        fontWeight: 500,
        color: theme.palette.primary.main,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      {label}
    </Typography>
    <CloseIcon
      onClick={onDelete}
      sx={{
        fontSize: 13,
        color: theme.palette.primary.main,
        cursor: "pointer",
        opacity: 0.7,
        flexShrink: 0,
        "&:hover": { opacity: 1 },
      }}
    />
  </Box>
);

/* ─── Country Chip: flag only + close ──────────────────────────────────── */
const CountryChip = ({
  country,
  onDelete,
  theme,
  isDark,
}: {
  country: string;
  onDelete: (e: any) => void;
  theme: Theme;
  isDark: boolean;
}) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.25,
      height: 24,
      borderRadius: "999px",
      border: `1px solid ${theme.palette.primary.main}`,
      backgroundColor: isDark ? "rgba(59,130,246,0.1)" : "#EFF6FF",
      pl: 0.5,
      pr: 0.25,
    }}
    title={country}
  >
    <CountryFlag country={country} width={16} />
    <CloseIcon
      onClick={onDelete}
      sx={{
        fontSize: 13,
        color: theme.palette.primary.main,
        cursor: "pointer",
        opacity: 0.7,
        flexShrink: 0,
        "&:hover": { opacity: 1 },
      }}
    />
  </Box>
);

/* ─── Score Badge ──────────────────────────────────────────────────────── */
const ScoreBadge = ({ score }: { score: number }) => {
  const pct = Math.round(score * 100);
  const c = getScoreColor(score);
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "999px",
        px: 1,
        py: 0.25,
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.text,
      }}
    >
      {pct}
    </Box>
  );
};

/* ─── Pager Button ─────────────────────────────────────────────────────── */
const PagerButton = ({
  children,
  disabled,
  onClick,
  theme,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  theme: Theme;
}) => (
  <Box
    onClick={disabled ? undefined : onClick}
    sx={{
      fontSize: "13px",
      color: disabled
        ? theme.palette.text.secondary
        : theme.palette.primary.main,
      cursor: disabled ? "default" : "pointer",
      px: 1,
      fontWeight: 500,
      opacity: disabled ? 0.5 : 1,
      "&:hover": { textDecoration: disabled ? "none" : "underline" },
    }}
  >
    {children}
  </Box>
);

/* ─── Search Icon ──────────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/* ─── Helpers ──────────────────────────────────────────────────────────── */
const toggleSort = (
  field: string,
  sortBy: string,
  sortOrder: "asc" | "desc",
  setSortBy: (f: string) => void,
  setSortOrder: (o: "asc" | "desc") => void,
  setPage: (p: number) => void,
) => {
  if (sortBy === field) {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  } else {
    setSortBy(field);
    setSortOrder("desc");
  }
  setPage(1);
};

const buildPageNumbers = (
  current: number,
  total: number,
): (number | "...")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);
  return pages;
};

export default FreeSearchPage;
