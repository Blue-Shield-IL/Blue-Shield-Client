import { useState } from "react";
import { AxiosError } from "axios";
import { ROUTES } from "constants/routes";
import styles from "./RegisterPage.style";
import useAuth from "contexts/authContext";
import type { ApiError } from "interfaces/auth";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthIndicator from "components/PasswordValidator";
import {
  Box,
  Alert,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, googleAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordValid = () =>
    password.length >= 8 &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^a-zA-Z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors([]);

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!isPasswordValid()) {
      setError("Password does not meet the required policy");
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password });
      navigate(ROUTES.ONBOARDING);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      if (axiosError.response?.status === 409) {
        setError("An account with this email already exists");
      } else if (axiosError.response?.status === 400) {
        const data = axiosError.response.data;
        if (data?.errors && data.errors.length > 0) {
          setFieldErrors(data.errors);
        } else {
          setError(data?.message || "Validation failed");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    if (!credentialResponse.credential) {
      setError("Google sign-up failed.");
      return;
    }
    setIsLoading(true);
    setError("");
    setFieldErrors([]);
    try {
      await googleAuth({ token: credentialResponse.credential });
      navigate(ROUTES.ONBOARDING);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || "Google sign-up failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={styles.layout}>
      <Box sx={styles.leftPanel}>
        <Box sx={styles.brand}>
          <Box sx={styles.brandIcon}>
            <svg width="160" height="160" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 3L5 7.5v8.5c0 7.5 11 13 11 13s11-5.5 11-13V7.5L16 3z"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <clipPath id="leftHalfRegister">
                <rect x="5" y="3" width="11" height="26" />
              </clipPath>
              <path
                d="M16 3L5 7.5v8.5c0 7.5 11 13 11 13s11-5.5 11-13V7.5L16 3z"
                fill="white"
                clipPath="url(#leftHalfRegister)"
              />
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
          <Typography sx={styles.title}>Create Account</Typography>
          <Typography sx={styles.subtitle}>
            or <Link to={ROUTES.LOGIN}>sign in to your account</Link>
          </Typography>

          {error && (
            <Alert severity="error" sx={styles.errorAlert} role="alert">
              {error}
            </Alert>
          )}
          {fieldErrors.length > 0 && (
            <Alert severity="error" sx={styles.errorAlert} role="alert">
              <ul>
                {fieldErrors.map((fe, i) => (
                  <li key={i}>{fe}</li>
                ))}
              </ul>
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Box sx={styles.field}>
              <Typography
                component="label"
                htmlFor="name"
                sx={styles.fieldLabel}
              >
                Full Name
              </Typography>
              <TextField
                id="name"
                type="text"
                fullWidth
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                disabled={isLoading}
                sx={styles.textField}
              />
            </Box>

            <Box sx={styles.field}>
              <Typography
                component="label"
                htmlFor="email"
                sx={styles.fieldLabel}
              >
                Email Address
              </Typography>
              <TextField
                id="email"
                type="email"
                fullWidth
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
                sx={styles.textField}
              />
            </Box>

            <Box sx={styles.field}>
              <Typography
                component="label"
                htmlFor="password"
                sx={styles.fieldLabel}
              >
                Password
              </Typography>
              <Box sx={styles.passwordWrapper}>
                <TextField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  sx={styles.textField}
                />
                <IconButton
                  sx={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </IconButton>
              </Box>
              <PasswordStrengthIndicator password={password} />
            </Box>

            <Box sx={styles.field}>
              <Typography
                component="label"
                htmlFor="confirmPassword"
                sx={styles.fieldLabel}
              >
                Confirm Password
              </Typography>
              <TextField
                id="confirmPassword"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={isLoading}
                sx={styles.textField}
              />
              {confirmPassword && password !== confirmPassword && (
                <Typography sx={styles.fieldError}>
                  Passwords do not match
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={styles.submitButton}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <Box sx={styles.divider}>
            <Box sx={styles.dividerLine} />
            <Typography sx={styles.dividerText}>or</Typography>
            <Box sx={styles.dividerLine} />
          </Box>

          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <Box sx={styles.googleContainer}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign-up failed.")}
                text="signup_with"
                width="400"
              />
            </Box>
          ) : (
            <Button variant="outlined" disabled sx={styles.googleButton}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
