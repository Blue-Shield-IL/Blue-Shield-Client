import { Box, Typography, useTheme } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

interface EmptyStateProps {
  title: string;
  description?: string;
  minHeight?: number | string;
  illustrationSrc?: string;
  illustrationDarkSrc?: string;
}

const EmptyState = ({
  title,
  description,
  minHeight = 160,
  illustrationSrc,
  illustrationDarkSrc,
}: EmptyStateProps) => {
  const theme = useTheme();
  const resolvedIllustrationSrc =
    theme.palette.mode === "dark"
      ? (illustrationDarkSrc ?? illustrationSrc)
      : illustrationSrc;

  return (
    <Box
      role="status"
      sx={{
        minHeight,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        py: 2,
      }}
    >
      {resolvedIllustrationSrc ? (
        <Box
          component="img"
          src={resolvedIllustrationSrc}
          alt=""
          aria-hidden
          sx={{
            width: { xs: 280, sm: 400 },
            maxWidth: "95%",
            height: "auto",
            mb: 1.5,
          }}
        />
      ) : (
        <InboxOutlinedIcon
          aria-hidden
          sx={theme => ({
            fontSize: 36,
            color: theme.palette.text.disabled,
            mb: 1,
          })}
        />
      )}
      <Typography
        sx={theme => ({
          fontSize: "14px",
          fontWeight: 600,
          color: theme.palette.text.primary,
        })}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          sx={theme => ({
            mt: 0.5,
            maxWidth: 320,
            fontSize: "12px",
            color: theme.palette.text.secondary,
          })}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;
