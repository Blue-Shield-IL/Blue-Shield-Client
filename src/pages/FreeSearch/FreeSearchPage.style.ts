const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#F9FAFB",
  },

  content: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
  },

  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    color: "#2563EB",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    cursor: "pointer",
    transition: "all 0.15s",
    "&:hover": { backgroundColor: "#EFF6FF", transform: "rotate(90deg)" },
  },

  filterBar: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    padding: "12px",
  },

  select: {
    minWidth: 150,
    height: 44,
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    fontSize: "14px",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#BFDBFE" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2563EB",
    },
  },

  searchBtn: {
    height: 44,
    px: 3,
    borderRadius: "10px",
    backgroundColor: "#2563EB",
    fontWeight: 600,
    fontSize: "14px",
    textTransform: "none",
    boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
    "&:hover": { backgroundColor: "#1D4ED8" },
  },

  tableCard: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    overflow: "hidden",
    flex: 1,
  },

  tableHeader: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    borderBottom: "1px solid #F1F5F9",
    backgroundColor: "#FAFBFF",
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },

  row: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    borderBottom: "1px solid #F8FAFC",
    transition: "background-color 0.12s",
    "&:hover": { backgroundColor: "#FAFBFF" },
  },

  col: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    px: 1,
    minWidth: 0,
  },
  colCreator: { flex: "0 0 180px" },
  colCountry: { flex: "0 0 150px" },
  colTitle: { flex: 1 },
  colTags: { flex: "0 0 170px", flexWrap: "wrap" },
  colScore: { flex: "0 0 130px", flexWrap: "wrap" },
  colHashtags: { flex: "0 0 170px", flexWrap: "wrap" },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 600,
    flexShrink: 0,
  },

  creatorName: {
    fontSize: "14px",
    color: "#374151",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  platformIcon: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    backgroundColor: "#1E293B",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    flexShrink: 0,
    marginLeft: "auto",
  },

  cellText: {
    fontSize: "14px",
    color: "#374151",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  contentText: {
    fontSize: "14px",
    color: "#374151",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
  },

  muted: { fontSize: "13px", color: "#CBD5E1" },

  dataTag: {
    fontSize: "11px",
    color: "#475569",
    backgroundColor: "#F1F5F9",
    borderRadius: "6px",
    px: 0.8,
    py: 0.3,
    maxWidth: 80,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  hashtag: {
    fontSize: "11px",
    color: "#2563EB",
    backgroundColor: "#EFF6FF",
    borderRadius: "6px",
    px: 0.8,
    py: 0.3,
    fontWeight: 500,
    maxWidth: 80,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  moreTag: {
    fontSize: "11px",
    color: "#94A3B8",
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "6px",
    px: 0.6,
    py: 0.3,
    cursor: "default",
  },

  sentimentTag: {
    fontSize: "10px",
    fontWeight: 600,
    borderRadius: "5px",
    px: 0.6,
    py: 0.2,
  },

  centerState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: 1,
  },

  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 2,
  },

  resultCount: {
    fontSize: "13px",
    color: "#9CA3AF",
  },

  pager: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginLeft: "auto",
  },

  pageNum: {
    minWidth: 32,
    height: 32,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    color: "#475569",
    cursor: "pointer",
    transition: "all 0.12s",
    "&:hover": { backgroundColor: "#EFF6FF", color: "#2563EB" },
  },

  pageNumActive: {
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    fontWeight: 600,
    "&:hover": { backgroundColor: "#1D4ED8", color: "#FFFFFF" },
  },

  ellipsis: {
    color: "#CBD5E1",
    px: 0.5,
    fontSize: "13px",
  },
};

export default styles;
