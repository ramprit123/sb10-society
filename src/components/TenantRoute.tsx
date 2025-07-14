import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useParams, Navigate, useLocation } from "react-router-dom";
import { useSocietyStore } from "../stores/societyStore";
import { useAuthStore } from "../stores/authStore";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "../components/ui/button";

interface TenantRouteState {
  isInitializing: boolean;
  error: string | null;
  hasAccess: boolean;
}

enum TenantRole {
  SUPER_ADMIN = "super_admin",
  MANAGER = "manager",
}
const TenantRoute: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const location = useLocation();
  const { profile, isLoading: authLoading } = useAuthStore();
  const {
    societies,
    currentSociety,
    isLoading: societiesLoading,
    switchSociety,
    setGlobalView,
    fetchSocieties,
  } = useSocietyStore();

  const [state, setState] = useState<TenantRouteState>({
    isInitializing: true,
    error: null,
    hasAccess: false,
  });

  // Memoized society lookup
  const targetSociety = React.useMemo(() => {
    return tenantId ? societies.find((s) => s.id === tenantId) : null;
  }, [tenantId, societies]);

  // Check if user has access to the society
  const hasAccess = React.useMemo(() => {
    if (!profile || !tenantId || !targetSociety) return false;
    return profile.global_role === TenantRole.SUPER_ADMIN;
  }, [profile, tenantId, targetSociety]);

  // Handle society switching
  const handleSocietySwitch = useCallback(async () => {
    if (!tenantId || !targetSociety || !hasAccess) return;

    try {
      switchSociety(tenantId);
      setGlobalView(false);
      setState((prev) => ({ ...prev, error: null, hasAccess: true }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to switch to the selected society. Please try again.",
      }));
    }
  }, [tenantId, targetSociety, hasAccess, switchSociety, setGlobalView]);

  // Initialize societies and handle switching
  useEffect(() => {
    const initializeSocieties = async () => {
      try {
        setState((prev) => ({ ...prev, isInitializing: true, error: null }));

        // Fetch societies if not already loaded
        if (societies.length === 0) {
          await fetchSocieties();
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Failed to load societies. Please refresh the page.",
        }));
      } finally {
        setState((prev) => ({ ...prev, isInitializing: false }));
      }
    };

    initializeSocieties();
  }, [societies.length, fetchSocieties]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!state.isInitializing && tenantId && targetSociety && hasAccess) {
        if (!currentSociety || currentSociety.id !== tenantId) {
          handleSocietySwitch();
        } else {
          setState((prev) => ({ ...prev, hasAccess: true }));
        }
      } else if (!state.isInitializing && tenantId && !hasAccess) {
        setState((prev) => ({
          ...prev,
          error: "You do not have access to this society.",
        }));
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeout);
  }, [
    state.isInitializing,
    tenantId,
    targetSociety,
    hasAccess,
    currentSociety,
    handleSocietySwitch,
  ]);

  // Show loading state
  if (authLoading || societiesLoading || state.isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="space-y-4 w-full max-w-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          <p className="text-center text-sm text-gray-500">
            Loading society information...
          </p>
        </div>
      </div>
    );
  }

  if (authLoading || societiesLoading || state.isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="space-y-4 w-full max-w-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          <p className="text-center text-sm text-gray-500">
            Loading society information...
          </p>
        </div>
      </div>
    );
  }

  if (!tenantId || !profile) {
    return <Navigate to="/" replace />;
  }

  // Show error state
  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if society not found
  if (!targetSociety) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location,
          error: "Society not found",
        }}
      />
    );
  }

  // Redirect if no access
  if (!hasAccess) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location,
          error: "Access denied to this society",
        }}
      />
    );
  }

  return <Outlet />;
};

export default TenantRoute;
