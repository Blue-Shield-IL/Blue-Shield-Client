import { useState } from "react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { ROUTES } from "constants/routes";
import { PASSWORD_VALIDATION_RULES } from "constants/validation";
import styles from "./RegisterPage.style";
import useAuth from "contexts/authContext";
import type { ApiError } from "interfaces/auth";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { Logo, EyeOpen, EyeClosed } from "components/Svg";
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
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormValues>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setError("");
    setFieldErrors([]);

    try {
      await authRegister({
        name: data.name,
        email: data.email,
        password: data.password,
      });
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

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    if (!credentialResponse.credential) {
      return setError("Google sign-up failed.");
    }

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
            <Logo width="160" height="160" />
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
            <Alert severity="error" sx={styles.errorAlert}>
              {error}
            </Alert>
          )}
          {fieldErrors.length > 0 && (
            <Alert severity="error" sx={styles.errorAlert}>
              <ul>
                {fieldErrors.map((fe, i) => (
                  <li key={i}>{fe}</li>
                ))}
              </ul>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                placeholder="Your full name"
                autoComplete="name"
                disabled={isSubmitting}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={styles.textField}
                {...register("name", { required: "Name is required" })}
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  sx={styles.textField}
                  {...register("password", PASSWORD_VALIDATION_RULES)}
                />
                <IconButton
                  sx={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
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
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={isSubmitting}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={styles.textField}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: v => v === password || "Passwords do not match",
                })}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={styles.submitButton}
            >
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
