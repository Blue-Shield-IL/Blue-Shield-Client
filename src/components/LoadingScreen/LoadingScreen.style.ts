import { keyframes } from "@mui/material";
import { colors } from "constants/styles";

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
`;

const shimmer = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`;

const styles = {
  container: {
    minHeight: "100dvh",
    width: "100%",
    flex: 1,
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
  },
  iconWrapper: {
    animation: `${pulse} 2s ease-in-out infinite`,
    position: "relative",
    zIndex: 1,
  },
  text: {
    color: colors.white,
    fontSize: "24px",
    fontWeight: 600,
    mt: "24px",
    letterSpacing: "-0.5px",
    animation: `${shimmer} 2s ease-in-out infinite`,
    position: "relative",
    zIndex: 1,
  },
};

export default styles;
