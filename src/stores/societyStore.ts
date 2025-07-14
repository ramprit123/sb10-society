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
  addSociety: (society: Omit<Society, "id">) => Promise<void>;
  updateSociety: (
    societyId: string,
    updates: Partial<Society>
  ) => Promise<void>;
  deleteSociety: (societyId: string) => Promise<void>;
  setGlobalView: (global: boolean) => void;
}

// Mock data for now - you can replace this with real data from Supabase
const mockSocieties: Society[] = [
  {
    id: "society-1",
    name: "Greenview Heights",
    address: "123 Park Avenue, Mumbai, MH 400001",
    totalUnits: 120,
    occupiedUnits: 98,
    totalResidents: 342,
    pendingDues: 125000,
    status: "active",
    settings: {
      currency: "INR",
      timezone: "Asia/Kolkata",
      maintenanceDay: 5,
    },
  },
  {
    id: "society-2",
    name: "Royal Residency",
    address: "456 Queens Road, Delhi, DL 110001",
    totalUnits: 80,
    occupiedUnits: 72,
    totalResidents: 245,
    pendingDues: 89000,
    status: "active",
    settings: {
      currency: "INR",
      timezone: "Asia/Kolkata",
      maintenanceDay: 10,
    },
  },
  {
    id: "society-3",
    name: "Sunset Villa",
    address: "789 Beach Road, Bangalore, KA 560001",
    totalUnits: 45,
    occupiedUnits: 42,
    totalResidents: 156,
    pendingDues: 45000,
    status: "maintenance",
    settings: {
      currency: "INR",
      timezone: "Asia/Kolkata",
      maintenanceDay: 15,
    },
  },
];

export const useSocietyStore = create<SocietyState>((set, get) => ({
  currentSociety: null,
  societies: [],
  isLoading: false,
  isGlobalView: true,

  fetchSocieties: async () => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.from("societies").select("*");
      if (error) {
        throw error;
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

      // Fallback to mock data if Supabase fails
      console.warn("Falling back to mock data due to error:", error);
      set({
        societies: mockSocieties,
        isLoading: false,
      });

      // Set current society from localStorage if available
      const savedSocietyId = localStorage.getItem("currentSociety");
      if (savedSocietyId) {
        const savedSociety = mockSocieties.find((s) => s.id === savedSocietyId);
        if (savedSociety) {
          set({ currentSociety: savedSociety });
        }
      }
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
  },
}));
