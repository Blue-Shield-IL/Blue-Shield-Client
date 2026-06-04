import type { ReactNode } from "react";
import { ROUTES } from "constants/routes";
import useAuth from "contexts/authContext";
import { Navigate } from "react-router-dom";
import LoadingScreen from "components/LoadingScreen";

interface RouteGuardProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  return isLoading ? (
    <LoadingScreen />
  ) : !isAuthenticated ? (
    <Navigate to={ROUTES.LOGIN} replace />
  ) : (
    <>{children}</>
  );
};

export const PublicRoute = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated) {
    const destination =
      user?.isOnboarded === false ? ROUTES.ONBOARDING : ROUTES.DASHBOARD;
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};
