import styles from "./App.style";
import { useEffect } from "react";
import MuiTheme from "./MuiTheme";
import LoginPage from "pages/Login";
import { Box } from "@mui/material";
import RegisterPage from "pages/Register";
import SettingsPage from "pages/Settings";
import { ROUTES } from "constants/routes";
import DashboardPage from "pages/Dashboard";
import FreeSearchPage from "pages/FreeSearch";
import OnboardingPage from "pages/Onboarding";
import { AuthProvider } from "contexts/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeModeProvider } from "contexts/themeContext";
import { ProtectedRoute, PublicRoute } from "pages/AuthRender";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const queryClient = new QueryClient();

const appRoutes = [
  { path: ROUTES.LOGIN, component: <LoginPage />, isPublic: true },
  { path: ROUTES.REGISTER, component: <RegisterPage />, isPublic: true },
  { path: ROUTES.ONBOARDING, component: <OnboardingPage /> },
  { path: ROUTES.DASHBOARD, component: <DashboardPage /> },
  { path: ROUTES.FREE_SEARCH, component: <FreeSearchPage /> },
  { path: ROUTES.SETTINGS, component: <SettingsPage /> },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeModeProvider>
      <MuiTheme>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""}
        >
          <BrowserRouter>
            <ScrollToTop />
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
    </ThemeModeProvider>
  </QueryClientProvider>
);

export default App;
