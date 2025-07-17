import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

interface Tenant {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  totalResidents: number;
  pendingDues: number;
  status: "active" | "inactive" | "maintenance";
  logo?: string;
  settings: {
    currency: string;
    timezone: string;
    maintenanceDay: number;
  };
}

interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  setCurrentTenant: (tenant: Tenant | null) => void;
  switchTenant: (tenantId: string) => void;
  addTenant: (tenant: Omit<Tenant, "id">) => void;
  updateTenant: (tenantId: string, updates: Partial<Tenant>) => void;
  deleteTenant: (tenantId: string) => void;
  isGlobalView: boolean;
  setGlobalView: (global: boolean) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

export const TenantProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isGlobalView, setGlobalView] = useState(true);

  useEffect(() => {
    const savedTenantId = localStorage.getItem("currentTenant");
    if (savedTenantId && user) {
      const tenant = tenants.find((t) => t.id === savedTenantId);
      if (tenant && user.tenants.includes(tenant.id)) {
        setCurrentTenant(tenant);
        setGlobalView(false);
      }
    }
  }, [user, tenants]);

  const switchTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      setGlobalView(false);
      localStorage.setItem("currentTenant", tenantId);
    }
  };

  const addTenant = (tenantData: Omit<Tenant, "id">) => {
    const newTenant: Tenant = {
      ...tenantData,
      id: `society-${Date.now()}`,
    };
    setTenants((prev) => [...prev, newTenant]);
  };

  const updateTenant = (tenantId: string, updates: Partial<Tenant>) => {
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === tenantId ? { ...tenant, ...updates } : tenant
      )
    );

    if (currentTenant?.id === tenantId) {
      setCurrentTenant((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteTenant = (tenantId: string) => {
    setTenants((prev) => prev.filter((tenant) => tenant.id !== tenantId));

    if (currentTenant?.id === tenantId) {
      setCurrentTenant(null);
      setGlobalView(true);
      localStorage.removeItem("currentTenant");
    }
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        tenants,
        setCurrentTenant,
        switchTenant,
        addTenant,
        updateTenant,
        deleteTenant,
        isGlobalView,
        setGlobalView,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};
