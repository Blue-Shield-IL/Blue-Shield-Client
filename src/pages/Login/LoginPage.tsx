import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./LoginPage.style";
import { ROUTES } from "constants/routes";
import useAuth from "contexts/authContext";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Alert,
  Button,
  Checkbox,
  TextField,
  IconButton,
  Typography,
  FormControlLabel,
} from "@mui/material";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, googleAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    try {
      const user = await login(data);
      navigate(user.isOnboarded ? ROUTES.DASHBOARD : ROUTES.ONBOARDING);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError?.response?.data?.message || "Login failed.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return setError("Google authentication failed.");

    setError("");
    try {
      const user = await googleAuth({ token: credentialResponse.credential, rememberMe });
      navigate(user.isOnboarded ? ROUTES.DASHBOARD : ROUTES.ONBOARDING);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError?.response?.data?.message || "Google login failed.");
    }
  };

  return (
    <Box sx={styles.layout}>
      <Box sx={styles.leftPanel}>
        <Box sx={styles.brand}>
          <Box sx={styles.brandIcon}>
            <svg width="160" height="160" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L5 7.5v8.5c0 7.5 11 13 11 13s11-5.5 11-13V7.5L16 3z" stroke="white" strokeWidth="1.5" fill="none" />
              <clipPath id="leftHalfLogin">
                <rect x="5" y="3" width="11" height="26" />
              </clipPath>
              <path d="M16 3L5 7.5v8.5c0 7.5 11 13 11 13s11-5.5 11-13V7.5L16 3z" fill="white" clipPath="url(#leftHalfLogin)" />
            </svg>
          </Box>
          <Typography sx={styles.brandTitle}>Blue Shield</Typography>
          <Typography sx={styles.brandSubtitle}>
            Monitor, analyze, and visualize global online discourse.
          </Typography>
        </Box>
      </Box>

      <Box sx={styles.rightPanel}>
        <Box sx={styles.form}>
          <Typography sx={styles.title}>Log In</Typography>
          <Typography sx={styles.subtitle}>
            or <Link to={ROUTES.REGISTER}>create an account</Link>
          </Typography>

          {error && <Alert severity="error" sx={styles.errorAlert}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={styles.field}>
              <Typography component="label" htmlFor="email" sx={styles.fieldLabel}>
                Email Address
              </Typography>
              <TextField
                id="email"
                type="email"
                fullWidth
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={styles.textField}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
            </Box>

            <Box sx={styles.field}>
              <Typography component="label" htmlFor="password" sx={styles.fieldLabel}>
                Password
              </Typography>
              <Box sx={styles.passwordWrapper}>
                <TextField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={styles.textField}
                  {...register("password", { required: "Password is required" })}
                />
                <IconButton
                  sx={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </IconButton>
              </Box>
              <Typography sx={styles.hint}>
                Must be at least 8 characters with letters, numbers, and symbols.
              </Typography>
            </Box>

            <Box sx={styles.rememberRow}>
              <FormControlLabel
                sx={styles.rememberLabel}
                control={
                  <Checkbox
                    disabled={isSubmitting}
                    sx={styles.checkbox}
                    size="small"
                    {...register("rememberMe")}
                  />
                }
                label="Remember me"
              />
            </Box>

            <Button type="submit" variant="contained" disabled={isSubmitting} sx={styles.submitButton}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <Box sx={styles.divider}>
            <Box sx={styles.dividerLine} />
            <Typography sx={styles.dividerText}>or</Typography>
            <Box sx={styles.dividerLine} />
          </Box>

          <Box sx={styles.googleWrapper}>
            {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <Box sx={styles.googleButtonContainer}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google authentication failed.")}
                  theme="outline"
                  size="large"
                  width="400"
                  text="signin_with"
                  shape="rectangular"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
