import {
  useCreateSociety,
  useDeleteSociety,
  useSocieties,
  useUpdateSociety,
  type SocietyInsert,
  type SocietyRow,
  type SocietyUpdate,
} from "@/services/societiesService";
import { useAuthStore } from "@/stores/authStore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface TenantContextType {
  currentTenant: SocietyRow | null;
  tenants: SocietyRow[];
  setCurrentTenant: (tenant: SocietyRow | null) => void;
  switchTenant: (tenantId: string) => void;
  addTenant: (tenantData: SocietyInsert) => void;
  updateTenant: (tenantId: string, updates: SocietyUpdate) => void;
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
  const { profile } = useAuthStore();
  const [currentTenant, setCurrentTenant] = useState<SocietyRow | null>(null);
  const { data: societies = [] } = useSocieties();
  // All societies are available to user; membership filtering not implemented
  const tenants = societies;

  const createSociety = useCreateSociety();
  const updateSociety = useUpdateSociety();
  const deleteSociety = useDeleteSociety();
  const [isGlobalView, setGlobalView] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const saved = localStorage.getItem("currentTenant");
    const defaultId = profile.default_society_id;
    const tenantId = saved ?? defaultId;
    if (tenantId) {
      const tenant = tenants.find((t) => t.id === tenantId);
      if (tenant) {
        setCurrentTenant(tenant);
        setGlobalView(false);
      }
    }
  }, [profile, tenants]);

  const switchTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      setGlobalView(false);
      localStorage.setItem("currentTenant", tenantId);
    }
  };

  const addTenant = (tenantData: SocietyInsert) => {
    createSociety.mutate(tenantData);
  };

  const updateTenant = (tenantId: string, updates: SocietyUpdate) => {
    updateSociety.mutate({ id: tenantId, updates });
    if (currentTenant?.id === tenantId) {
      setCurrentTenant((prev: SocietyRow | null) =>
        prev ? { ...prev, ...updates } : null
      );
    }
  };

  const deleteTenant = (tenantId: string) => {
    deleteSociety.mutate(tenantId);
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
