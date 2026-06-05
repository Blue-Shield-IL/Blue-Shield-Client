import { colors } from "constants/styles";
import { Box, Typography, keyframes } from "@mui/material";

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
`;

const shimmer = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`;

const LoadingScreen = () => (
  <Box
    sx={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: `linear-gradient(135deg, ${colors.backgroundDark} 0%, ${colors.backgroundGradientMid} 50%, ${colors.primary} 100%)`,
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: "-30%",
        right: "-30%",
        width: "80%",
        height: "80%",
        background:
          "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: "-20%",
        left: "-20%",
        width: "60%",
        height: "60%",
        background:
          "radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%)",
        borderRadius: "50%",
      },
    }}
  >
    <Box
      sx={{
        animation: `${pulse} 2s ease-in-out infinite`,
        position: "relative",
        zIndex: 1,
      }}
    >
      <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 3L5 7.5v8.5c0 7.5 11 13 11 13s11-5.5 11-13V7.5L16 3z"
          stroke="white"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <clipPath id="leftHalfLoading">
          <rect x="5" y="3" width="11" height="26" />
        </clipPath>
        <path
          d="M16 3L5 7.5v8.5c0 7.5 11 13 11 13s11-5.5 11-13V7.5L16 3z"
          fill="white"
          clipPath="url(#leftHalfLoading)"
        />
      </svg>
    </Box>

    <Typography
      sx={{
        color: colors.white,
        fontSize: "24px",
        fontWeight: 600,
        mt: "24px",
        letterSpacing: "-0.5px",
        animation: `${shimmer} 2s ease-in-out infinite`,
        position: "relative",
        zIndex: 1,
      }}
    >
      Blue Shield
    </Typography>
  </Box>
);

export default LoadingScreen;
