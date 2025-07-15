import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, supabase } from "@/lib/supabase";

type ResidentRow = Database["public"]["Tables"]["residents"]["Row"];
type ResidentInsert = Database["public"]["Tables"]["residents"]["Insert"];
type ResidentUpdate = Database["public"]["Tables"]["residents"]["Update"];

// Query keys
export const RESIDENTS_KEYS = {
  all: ["residents"] as const,
  bySociety: (societyId: string) =>
    ["residents", "society", societyId] as const,
  byId: (id: string) => ["residents", id] as const,
};

// Fetch all residents for a society with their vehicles
export const useResidents = (societyId: string) => {
  return useQuery({
    queryKey: RESIDENTS_KEYS.bySociety(societyId),
    queryFn: async (): Promise<(ResidentRow & { vehicles: any[] })[]> => {
      const { data, error } = await supabase
        .from("residents")
        .select(
          `
          *,
          vehicles:vehicles(*)
        `
        )
        .eq("society_id", societyId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch single resident with vehicles
export const useResident = (id: string) => {
  return useQuery({
    queryKey: RESIDENTS_KEYS.byId(id),
    queryFn: async (): Promise<ResidentRow & { vehicles: any[] }> => {
      const { data, error } = await supabase
        .from("residents")
        .select(
          `
          *,
          vehicles:vehicles(*)
        `
        )
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

// Create resident
export const useCreateResident = (societyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resident: ResidentInsert): Promise<ResidentRow> => {
      const { data, error } = await supabase
        .from("residents")
        .insert({ ...resident, society_id: societyId })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RESIDENTS_KEYS.bySociety(societyId),
      });
    },
  });
};

// Update resident
export const useUpdateResident = (societyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ResidentUpdate;
    }): Promise<ResidentRow> => {
      const { data, error } = await supabase
        .from("residents")
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
        queryKey: RESIDENTS_KEYS.bySociety(societyId),
      });
      queryClient.invalidateQueries({
        queryKey: RESIDENTS_KEYS.byId(data.id),
      });
    },
  });
};

// Delete resident
export const useDeleteResident = (societyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.from("residents").delete().eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RESIDENTS_KEYS.bySociety(societyId),
      });
    },
  });
};

// Bulk create residents (for dummy data)
export const createResidents = async (
  residents: ResidentInsert[]
): Promise<ResidentRow[]> => {
  const { data, error } = await supabase
    .from("residents")
    .insert(residents)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};
