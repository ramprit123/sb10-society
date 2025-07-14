import React, { useEffect } from "react";
import { Outlet, useParams, Navigate } from "react-router-dom";
import { useSocietyStore } from "../stores/societyStore";
import { useAuthStore } from "../stores/authStore";

const TenantRoute: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { profile } = useAuthStore();
  const { societies, switchSociety, setGlobalView, fetchSocieties } =
    useSocietyStore();

  useEffect(() => {
    // Fetch societies if not already loaded
    if (societies.length === 0) {
      fetchSocieties();
    }
  }, [societies.length, fetchSocieties]);

  useEffect(() => {
    if (tenantId) {
      const society = societies.find((s) => s.id === tenantId);
      if (society && profile?.tenants.includes(society.id)) {
        switchSociety(tenantId);
        setGlobalView(false);
      }
    }
  }, [tenantId, societies, switchSociety, profile, setGlobalView]);

  // Check if user has access to this tenant/society
  if (tenantId && profile && !profile.tenants.includes(tenantId)) {
    return <Navigate to="/" replace />;
  }

  // Check if society exists
  if (tenantId && !societies.find((s) => s.id === tenantId)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default TenantRoute;
