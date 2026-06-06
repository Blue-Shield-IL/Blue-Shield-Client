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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const appRoutes = [
  { path: ROUTES.LOGIN, component: <LoginPage />, isPublic: true },
  { path: ROUTES.REGISTER, component: <RegisterPage />, isPublic: true },
  { path: ROUTES.ONBOARDING, component: <OnboardingPage /> },
  { path: ROUTES.DASHBOARD, component: <DashboardPage /> },
  { path: ROUTES.PROFILE, component: <ProfilePage /> },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MuiTheme>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
        <BrowserRouter>
          <AuthProvider>
            <Box sx={styles.root}>
              <Routes>
                {appRoutes.map(({ path, component, isPublic }) => {
                  const Guard = isPublic ? PublicRoute : ProtectedRoute;
                  return (
                    <Route
                      key={path}
                      path={path}
                      element={<Guard>{component}</Guard>}
                    />
                  );
                })}
                <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
              </Routes>
            </Box>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </MuiTheme>
  </QueryClientProvider>
);

export default App;
