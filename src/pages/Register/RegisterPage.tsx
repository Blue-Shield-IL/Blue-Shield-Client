import { useState } from "react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
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

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: authRegister, googleAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: RegisterFormValues) => {
    setError("");
    setFieldErrors([]);

    if (data.password !== data.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await authRegister({ name: data.name, email: data.email, password: data.password });
      navigate(ROUTES.ONBOARDING);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      if (axiosError.response?.status === 409) {
        setError("An account with this email already exists");
      } else if (axiosError.response?.status === 400) {
        const apiData = axiosError.response.data;
        if (apiData?.errors?.length) {
          setFieldErrors(apiData.errors);
        } else {
          setError(apiData?.message || "Validation failed");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return setError("Google sign-up failed.");

    setError("");
    setFieldErrors([]);
    try {
      await googleAuth({ token: credentialResponse.credential });
      navigate(ROUTES.ONBOARDING);
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || "Google sign-up failed.");
    }
  };

  return (
    <Box sx={styles.layout}>
      <Box sx={styles.leftPanel}>
        <Box sx={styles.brand}>
          <Box sx={styles.brandIcon}>
            <svg width="160" height="160" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L5 7.5v8.5c0 7.5 11 13 11 13s11-5.5 11-13V7.5L16 3z" stroke="white" strokeWidth="1.5" fill="none" />
              <clipPath id="leftHalfRegister">
                <rect x="5" y="3" width="11" height="26" />
              </clipPath>
              <path d="M16 3L5 7.5v8.5c0 7.5 11 13 11 13s11-5.5 11-13V7.5L16 3z" fill="white" clipPath="url(#leftHalfRegister)" />
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

          {error && <Alert severity="error" sx={styles.errorAlert}>{error}</Alert>}
          {fieldErrors.length > 0 && (
            <Alert severity="error" sx={styles.errorAlert}>
              <ul>{fieldErrors.map((fe, i) => <li key={i}>{fe}</li>)}</ul>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={styles.field}>
              <Typography component="label" htmlFor="name" sx={styles.fieldLabel}>Full Name</Typography>
              <TextField id="name" type="text" fullWidth placeholder="Your full name" autoComplete="name" disabled={isSubmitting} sx={styles.textField} {...register("name", { required: true })} />
            </Box>

            <Box sx={styles.field}>
              <Typography component="label" htmlFor="email" sx={styles.fieldLabel}>Email Address</Typography>
              <TextField id="email" type="email" fullWidth placeholder="you@example.com" autoComplete="email" disabled={isSubmitting} sx={styles.textField} {...register("email", { required: true })} />
            </Box>

            <Box sx={styles.field}>
              <Typography component="label" htmlFor="password" sx={styles.fieldLabel}>Password</Typography>
              <Box sx={styles.passwordWrapper}>
                <TextField id="password" type={showPassword ? "text" : "password"} fullWidth placeholder="Create a password" autoComplete="new-password" disabled={isSubmitting} sx={styles.textField} {...register("password", { required: true, minLength: 8 })} />
                <IconButton sx={styles.eyeButton} onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </IconButton>
              </Box>
              <PasswordStrengthIndicator password={password} />
            </Box>

            <Box sx={styles.field}>
              <Typography component="label" htmlFor="confirmPassword" sx={styles.fieldLabel}>Confirm Password</Typography>
              <TextField id="confirmPassword" type="password" fullWidth placeholder="Confirm your password" autoComplete="new-password" disabled={isSubmitting} sx={styles.textField} {...register("confirmPassword", { required: true })} />
              {confirmPassword && password !== confirmPassword && (
                <Typography sx={styles.fieldError}>Passwords do not match</Typography>
              )}
            </Box>

            <Button type="submit" variant="contained" disabled={isSubmitting} sx={styles.submitButton}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <Box sx={styles.divider}>
            <Box sx={styles.dividerLine} />
            <Typography sx={styles.dividerText}>or</Typography>
            <Box sx={styles.dividerLine} />
          </Box>

          {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <Box sx={styles.googleContainer}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign-up failed.")}
                text="signup_with"
                theme="outline"
                size="large"
                width="400"
                shape="rectangular"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
