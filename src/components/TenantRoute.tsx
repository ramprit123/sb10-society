import React, { useEffect } from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext';
import { useAuth } from '../contexts/AuthContext';

const TenantRoute: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { user } = useAuth();
  const { tenants, switchTenant, currentTenant, setGlobalView } = useTenant();

  useEffect(() => {
    if (tenantId) {
      const tenant = tenants.find(t => t.id === tenantId);
      if (tenant && user?.tenants.includes(tenant.id)) {
        switchTenant(tenantId);
        setGlobalView(false);
      }
    }
  }, [tenantId, tenants, switchTenant, user, setGlobalView]);

  // Check if user has access to this tenant
  if (tenantId && user && !user.tenants.includes(tenantId)) {
    return <Navigate to="/" replace />;
  }

  // Check if tenant exists
  if (tenantId && !tenants.find(t => t.id === tenantId)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default TenantRoute;