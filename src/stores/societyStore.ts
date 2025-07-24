import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface Society {
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

interface SocietyState {
  currentSociety: Society | null;
  societies: Society[];
  isLoading: boolean;
  isGlobalView: boolean;

  // Actions
  fetchSocieties: () => Promise<void>;
  setCurrentSociety: (society: Society | null) => void;
  switchSociety: (societyId: string) => void;
  restoreSocietyFromStorage: () => boolean;
  addSociety: (society: Omit<Society, "id">) => Promise<void>;
  updateSociety: (
    societyId: string,
    updates: Partial<Society>
  ) => Promise<void>;
  deleteSociety: (societyId: string) => Promise<void>;
  setGlobalView: (global: boolean) => void;
}

export const useSocietyStore = create<SocietyState>((set, get) => ({
  currentSociety: null,
  societies: [],
  isLoading: false,
  isGlobalView: JSON.parse(localStorage.getItem("isGlobalView") || "true"),

  fetchSocieties: async () => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.from("societies").select("*");

      if (error) {
        console.warn("Error fetching societies from database:", error);
        console.log("Using mock societies as fallback");

        return;
      }

      // Transform the data to match our interface
      const societies: Society[] =
        data?.map((society) => ({
          id: society.id,
          name: society.name,
          address: society.address,
          totalUnits: society.total_units,
          occupiedUnits: society.occupied_units,
          totalResidents: society.total_residents,
          pendingDues: society.pending_dues,
          status: society.status,
          logo: society.logo,
          settings: {
            currency: society.settings?.currency || "INR",
            timezone: society.settings?.timezone || "Asia/Kolkata",
            maintenanceDay: society.settings?.maintenance_day || 5,
          },
        })) || [];

      set({
        societies,
        isLoading: false,
      });

      // Set current society from localStorage if available
      const savedSocietyId = localStorage.getItem("currentSociety");
      if (savedSocietyId) {
        const savedSociety = societies.find((s) => s.id === savedSocietyId);
        if (savedSociety) {
          set({ currentSociety: savedSociety });
        }
      }
    } catch (error) {
      console.error("Error fetching societies:", error);
      console.warn("Falling back to mock data due to error:", error);
    }
  },

  setCurrentSociety: (society: Society | null) => {
    set({ currentSociety: society });
    if (society) {
      localStorage.setItem("currentSociety", society.id);
    } else {
      localStorage.removeItem("currentSociety");
    }
  },

  switchSociety: (societyId: string) => {
    const { societies } = get();
    const society = societies.find((s) => s.id === societyId);
    if (society) {
      get().setCurrentSociety(society);
      get().setGlobalView(false);

      // Persist the switch in localStorage for page reloads
      try {
        localStorage.setItem("currentSociety", society.id);
        localStorage.setItem("lastSocietySwitch", Date.now().toString());
      } catch (error) {
        console.warn(
          "Failed to persist society switch to localStorage:",
          error
        );
      }
    } else {
      console.warn(`Society with ID ${societyId} not found`);
    }
  },

  restoreSocietyFromStorage: () => {
    try {
      const { societies } = get();
      const storedSocietyId = localStorage.getItem("currentSociety");

      if (!storedSocietyId || societies.length === 0) {
        return false;
      }

      const society = societies.find((s) => s.id === storedSocietyId);
      if (society) {
        get().setCurrentSociety(society);
        get().setGlobalView(false);
        return true;
      }

      // Clean up invalid stored society ID
      localStorage.removeItem("currentSociety");
      localStorage.removeItem("lastSocietySwitch");
      return false;
    } catch (error) {
      console.warn("Failed to restore society from localStorage:", error);
      return false;
    }
  },

  addSociety: async (societyData: Omit<Society, "id">) => {
    try {
      set({ isLoading: true });

      // Transform data to match database schema
      const dbData = {
        name: societyData.name,
        address: societyData.address,
        total_units: societyData.totalUnits,
        occupied_units: societyData.occupiedUnits,
        total_residents: societyData.totalResidents,
        pending_dues: societyData.pendingDues,
        status: societyData.status,
        logo: societyData.logo,
        settings: {
          currency: societyData.settings.currency,
          timezone: societyData.settings.timezone,
          maintenance_day: societyData.settings.maintenanceDay,
        },
      };

      const { data, error } = await supabase
        .from("societies")
        .insert(dbData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform back to our interface
      const newSociety: Society = {
        id: data.id,
        name: data.name,
        address: data.address,
        totalUnits: data.total_units,
        occupiedUnits: data.occupied_units,
        totalResidents: data.total_residents,
        pendingDues: data.pending_dues,
        status: data.status,
        logo: data.logo,
        settings: {
          currency: data.settings.currency,
          timezone: data.settings.timezone,
          maintenanceDay: data.settings.maintenance_day,
        },
      };

      const { societies } = get();
      set({
        societies: [...societies, newSociety],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error adding society:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateSociety: async (societyId: string, updates: Partial<Society>) => {
    try {
      set({ isLoading: true });

      // Transform updates to match database schema
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.totalUnits !== undefined)
        dbUpdates.total_units = updates.totalUnits;
      if (updates.occupiedUnits !== undefined)
        dbUpdates.occupied_units = updates.occupiedUnits;
      if (updates.totalResidents !== undefined)
        dbUpdates.total_residents = updates.totalResidents;
      if (updates.pendingDues !== undefined)
        dbUpdates.pending_dues = updates.pendingDues;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.logo !== undefined) dbUpdates.logo = updates.logo;
      if (updates.settings !== undefined) {
        dbUpdates.settings = {
          currency: updates.settings.currency,
          timezone: updates.settings.timezone,
          maintenance_day: updates.settings.maintenanceDay,
        };
      }

      const { data, error } = await supabase
        .from("societies")
        .update(dbUpdates)
        .eq("id", societyId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform back to our interface
      const updatedSociety: Society = {
        id: data.id,
        name: data.name,
        address: data.address,
        totalUnits: data.total_units,
        occupiedUnits: data.occupied_units,
        totalResidents: data.total_residents,
        pendingDues: data.pending_dues,
        status: data.status,
        logo: data.logo,
        settings: {
          currency: data.settings.currency,
          timezone: data.settings.timezone,
          maintenanceDay: data.settings.maintenance_day,
        },
      };

      const { societies, currentSociety } = get();
      const updatedSocieties = societies.map((society) =>
        society.id === societyId ? updatedSociety : society
      );

      set({
        societies: updatedSocieties,
        currentSociety:
          currentSociety?.id === societyId ? updatedSociety : currentSociety,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error updating society:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteSociety: async (societyId: string) => {
    try {
      set({ isLoading: true });

      const { error } = await supabase
        .from("societies")
        .delete()
        .eq("id", societyId);

      if (error) {
        throw error;
      }

      const { societies, currentSociety } = get();
      const updatedSocieties = societies.filter(
        (society) => society.id !== societyId
      );

      set({
        societies: updatedSocieties,
        currentSociety:
          currentSociety?.id === societyId ? null : currentSociety,
        isLoading: false,
      });

      if (currentSociety?.id === societyId) {
        localStorage.removeItem("currentSociety");
      }
    } catch (error) {
      console.error("Error deleting society:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  setGlobalView: (global: boolean) => {
    set({ isGlobalView: global });
    localStorage.setItem("isGlobalView", JSON.stringify(global));

    // If switching to global view, clear current society
    if (global) {
      set({ currentSociety: null });
      localStorage.removeItem("currentSociety");
    }
  },
}));
