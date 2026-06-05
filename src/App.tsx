import styles from "./App.style";
import MuiTheme from "./MuiTheme";
import LoginPage from "pages/Login";
import { Box } from "@mui/material";
import ProfilePage from "pages/Profile";
import RegisterPage from "pages/Register";
import { ROUTES } from "constants/routes";
import DashboardPage from "pages/Dashboard";
import OnboardingPage from "pages/Onboarding";
import { AuthProvider } from "contexts/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProtectedRoute, PublicRoute } from "pages/AuthRender";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const App = () => (
  <MuiTheme>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <Box sx={styles.root}>
            <Routes>
              <Route
                path={ROUTES.LOGIN}
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path={ROUTES.REGISTER}
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              <Route
                path={ROUTES.ONBOARDING}
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={<Navigate to={ROUTES.LOGIN} replace />}
              />
            </Routes>
          </Box>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </MuiTheme>
);

export default App;
