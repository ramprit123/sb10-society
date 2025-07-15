import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, supabase } from "@/lib/supabase";

type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];
type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];
type VehicleUpdate = Database["public"]["Tables"]["vehicles"]["Update"];

// Query keys
export const VEHICLES_KEYS = {
  all: ["vehicles"] as const,
  byResident: (residentId: string) =>
    ["vehicles", "resident", residentId] as const,
  byId: (id: string) => ["vehicles", id] as const,
};

// Fetch all vehicles for a resident
export const useVehicles = (residentId: string) => {
  return useQuery({
    queryKey: VEHICLES_KEYS.byResident(residentId),
    queryFn: async (): Promise<VehicleRow[]> => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("resident_id", residentId)
        .eq("is_active", true)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!residentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch single vehicle
export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: VEHICLES_KEYS.byId(id),
    queryFn: async (): Promise<VehicleRow> => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id,
  });
};

// Create vehicle
export const useCreateVehicle = (residentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: VehicleInsert): Promise<VehicleRow> => {
      // If this is marked as primary, first unset all other primary vehicles for this resident
      if (vehicle.is_primary) {
        await supabase
          .from("vehicles")
          .update({ is_primary: false })
          .eq("resident_id", residentId)
          .eq("is_primary", true);
      }

      const { data, error } = await supabase
        .from("vehicles")
        .insert(vehicle)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: VEHICLES_KEYS.byResident(residentId),
      });
    },
  });
};

// Update vehicle
export const useUpdateVehicle = (residentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: VehicleUpdate;
    }): Promise<VehicleRow> => {
      // If this is being marked as primary, first unset all other primary vehicles for this resident
      if (updates.is_primary) {
        await supabase
          .from("vehicles")
          .update({ is_primary: false })
          .eq("resident_id", residentId)
          .eq("is_primary", true)
          .neq("id", id);
      }

      const { data, error } = await supabase
        .from("vehicles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: VEHICLES_KEYS.byResident(residentId),
      });
      queryClient.invalidateQueries({
        queryKey: VEHICLES_KEYS.byId(data.id),
      });
    },
  });
};

// Delete vehicle (soft delete by setting is_active to false)
export const useDeleteVehicle = (residentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from("vehicles")
        .update({ is_active: false })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: VEHICLES_KEYS.byResident(residentId),
      });
    },
  });
};

// Bulk create vehicles (for dummy data)
export const createVehicles = async (
  vehicles: VehicleInsert[]
): Promise<VehicleRow[]> => {
  const { data, error } = await supabase
    .from("vehicles")
    .insert(vehicles)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};
