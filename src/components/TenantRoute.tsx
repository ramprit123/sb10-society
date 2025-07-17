import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";
import { useSocietyStore } from "@/stores/societyStore";
import { AlertCircle, Home } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";

interface TenantRouteState {
  isInitializing: boolean;
  error: string | null;
  hasAccess: boolean;
  isValidating: boolean;
}

enum TenantRole {
  SUPER_ADMIN = "super_admin",
  MANAGER = "manager",
  RESIDENT = "resident",
}

// Enhanced access control check
const checkUserAccess = (profile: any): boolean => {
  if (!profile) return false;
  if (profile.global_role === TenantRole.SUPER_ADMIN) return true;
  return false;
};

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
    restoreSocietyFromStorage,
  } = useSocietyStore();

  const [state, setState] = useState<TenantRouteState>({
    isInitializing: true,
    error: null,
    hasAccess: false,
    isValidating: false,
  });

  // Memoized society lookup
  const targetSociety = React.useMemo(() => {
    return tenantId ? societies.find((s) => s.id === tenantId) : null;
  }, [tenantId, societies]);

  // Enhanced access control check
  const hasAccess = React.useMemo(() => {
    return checkUserAccess(profile);
  }, [profile, tenantId, targetSociety]);

  // Check if society is already current to avoid unnecessary switching
  const needsSocietySwitch = React.useMemo(() => {
    return (
      tenantId &&
      targetSociety &&
      hasAccess &&
      (!currentSociety || currentSociety.id !== tenantId)
    );
  }, [tenantId, targetSociety, hasAccess, currentSociety]);

  // Handle society switching with better error handling
  const handleSocietySwitch = useCallback(async () => {
    if (!tenantId || !targetSociety || !hasAccess) return;

    setState((prev) => ({ ...prev, isValidating: true, error: null }));

    try {
      // Check if localStorage has the same society stored
      const storedSocietyId = localStorage.getItem("currentSociety");

      if (storedSocietyId === tenantId && currentSociety?.id === tenantId) {
        // Already switched, just update state
        setState((prev) => ({ ...prev, hasAccess: true, isValidating: false }));
        return;
      }

      switchSociety(tenantId);
      setGlobalView(false);

      // Small delay to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      setState((prev) => ({
        ...prev,
        error: null,
        hasAccess: true,
        isValidating: false,
      }));
    } catch (error) {
      console.error("Society switch failed:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to switch to the selected society. Please try again.",
        isValidating: false,
      }));
    }
  }, [
    tenantId,
    targetSociety,
    hasAccess,
    currentSociety,
    switchSociety,
    setGlobalView,
  ]);

  // Initialize and validate access with better error handling
  const initializeAccess = useCallback(async () => {
    if (!tenantId || authLoading) return;

    try {
      setState((prev) => ({ ...prev, isInitializing: true, error: null }));

      // Ensure societies are loaded
      if (societies.length === 0) {
        await fetchSocieties();
      }

      // Wait for profile to be available
      if (!profile) {
        setState((prev) => ({ ...prev, isInitializing: false }));
        return;
      }

      // Check if society exists
      const society = societies.find((s) => s.id === tenantId);
      if (!society) {
        setState((prev) => ({
          ...prev,
          error: "Society not found. Please check the URL and try again.",
          isInitializing: false,
        }));
        return;
      }

      // Check access
      const userHasAccess = checkUserAccess(profile);
      if (!userHasAccess) {
        setState((prev) => ({
          ...prev,
          error:
            "You do not have access to this society. Please contact your administrator.",
          isInitializing: false,
        }));
        return;
      }

      // Try to restore from localStorage first for better UX on page reload
      const restoredFromStorage = restoreSocietyFromStorage();
      if (restoredFromStorage && currentSociety?.id === tenantId) {
        setState((prev) => ({
          ...prev,
          hasAccess: true,
          isInitializing: false,
        }));
        return;
      }

      if (needsSocietySwitch) {
        await handleSocietySwitch();
      } else {
        setState((prev) => ({
          ...prev,
          hasAccess: true,
          isInitializing: false,
        }));
      }
    } catch (error) {
      console.error("Access initialization failed:", error);
      setState((prev) => ({
        ...prev,
        error:
          "Failed to initialize access. Please refresh the page and try again.",
        isInitializing: false,
      }));
    }
  }, [
    tenantId,
    authLoading,
    societies,
    profile,
    fetchSocieties,
    restoreSocietyFromStorage,
    currentSociety,
    needsSocietySwitch,
    handleSocietySwitch,
  ]);

  // Main initialization effect
  useEffect(() => {
    initializeAccess();
  }, [initializeAccess]);

  // Handle page reload and persisted state
  useEffect(() => {
    if (!tenantId || authLoading || societiesLoading) return;

    // Check if we're in a valid state after reload
    const storedSocietyId = localStorage.getItem("currentSociety");
    if (
      storedSocietyId === tenantId &&
      currentSociety?.id === tenantId &&
      hasAccess
    ) {
      setState((prev) => ({
        ...prev,
        hasAccess: true,
        isInitializing: false,
      }));
    }
  }, [tenantId, authLoading, societiesLoading, currentSociety, hasAccess]);

  // Show loading state
  if (
    authLoading ||
    societiesLoading ||
    state.isInitializing ||
    state.isValidating
  ) {
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
            {state.isValidating
              ? "Validating access..."
              : authLoading
              ? "Authenticating..."
              : "Loading society information..."}
          </p>
        </div>
      </div>
    );
  }

  // Redirect early if no tenant ID or profile
  if (!tenantId || !profile) {
    return <Navigate to="/" replace />;
  }

  // Show error state with enhanced error handling
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
              onClick={() => {
                setState((prev) => ({ ...prev, error: null }));
                initializeAccess();
              }}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Refresh Page
            </Button>
            <Button
              onClick={() => {
                // Clear localStorage and redirect to home
                localStorage.removeItem("currentSociety");
                window.location.href = "/";
              }}
              variant="ghost"
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if society not found (with better error context)
  if (!targetSociety) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location,
          error: `Society with ID "${tenantId}" not found. Please check the URL and try again.`,
        }}
      />
    );
  }

  // Redirect if no access (with better error context)
  if (!hasAccess) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location,
          error: `Access denied to society "${targetSociety.name}". Please contact your administrator.`,
        }}
      />
    );
  }

  // Success: render the outlet
  return <Outlet />;
};

export default TenantRoute;
