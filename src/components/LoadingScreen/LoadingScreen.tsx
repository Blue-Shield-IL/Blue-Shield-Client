import { Box, Typography } from "@mui/material";
import { Logo } from "components/Svg";
import styles from "./LoadingScreen.style";

const LoadingScreen = () => (
  <Box sx={styles.container}>
    <Box sx={styles.iconWrapper}>
      <Logo width="120" height="120" strokeWidth="1" strokeOpacity="0.6" />
    </Box>

    <Typography sx={styles.text}>Blue Shield</Typography>
  </Box>
);

export default LoadingScreen;
