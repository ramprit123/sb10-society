import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, Database } from "@/lib/supabase";

export type SocietyRow = Database["public"]["Tables"]["societies"]["Row"];
export type SocietyInsert = Database["public"]["Tables"]["societies"]["Insert"];
export type SocietyUpdate = Database["public"]["Tables"]["societies"]["Update"];

// Query keys
export const SOCIETIES_KEYS = {
  all: ["societies"] as const,
  byId: (id: string) => ["societies", id] as const,
};

// Fetch all societies
export const useSocieties = () => {
  return useQuery<SocietyRow[]>({
    queryKey: SOCIETIES_KEYS.all,
    queryFn: async (): Promise<SocietyRow[]> => {
      const { data, error } = await supabase
        .from("societies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch single society by ID
export const useSociety = (id: string) => {
  return useQuery<SocietyRow>({
    queryKey: SOCIETIES_KEYS.byId(id),
    queryFn: async (): Promise<SocietyRow> => {
      const { data, error } = await supabase
        .from("societies")
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

// Create a new society
export const useCreateSociety = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (society: SocietyInsert): Promise<SocietyRow> => {
      const { data, error } = await supabase
        .from("societies")
        .insert(society)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIETIES_KEYS.all });
    },
  });
};

// Update existing society
export const useUpdateSociety = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: SocietyUpdate;
    }): Promise<SocietyRow> => {
      const { data, error } = await supabase
        .from("societies")
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
      queryClient.invalidateQueries({ queryKey: SOCIETIES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SOCIETIES_KEYS.byId(data.id) });
    },
  });
};

// Delete a society
export const useDeleteSociety = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase.from("societies").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIETIES_KEYS.all });
    },
  });
};

// Bulk create societies (for sample data)
export const createSocieties = async (
  societies: SocietyInsert[]
): Promise<SocietyRow[]> => {
  const { data, error } = await supabase
    .from("societies")
    .insert(societies)
    .select();

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};
