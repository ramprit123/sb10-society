import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type ComplaintRow = Database["public"]["Tables"]["complaints"]["Row"];
type ComplaintInsert = Database["public"]["Tables"]["complaints"]["Insert"];
type ComplaintUpdate = Database["public"]["Tables"]["complaints"]["Update"];

export interface ComplaintWithResident extends ComplaintRow {
  resident?: {
    id: string;
    name: string;
    flat_number: string;
    email: string;
    phone?: string;
  };
}

export class ComplaintsService {
  async createComplaint(complaint: ComplaintInsert): Promise<ComplaintRow> {
    const { data, error } = await supabase
      .from("complaints")
      .insert(complaint)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getComplaintsBySociety(
    societyId: string
  ): Promise<ComplaintWithResident[]> {
    const { data, error } = await supabase
      .from("complaints")
      .select(
        `
        *,
        resident:residents(
          id,
          name,
          flat_number,
          email,
          phone
        )
      `
      )
      .eq("society_id", societyId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as ComplaintWithResident[];
  }

  async getComplaintsByResident(residentId: string): Promise<ComplaintRow[]> {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("resident_id", residentId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateComplaintStatus(
    complaintId: string,
    status: "open" | "in_progress" | "resolved" | "closed",
    assignedTo?: string
  ): Promise<ComplaintRow> {
    const updateData: ComplaintUpdate = {
      status,
    };

    if (assignedTo) {
      updateData.assigned_to = assignedTo;
    }

    if (status === "resolved" || status === "closed") {
      updateData.resolved_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("complaints")
      .update(updateData)
      .eq("id", complaintId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update complaint
  async updateComplaint(
    complaintId: string,
    updates: ComplaintUpdate
  ): Promise<ComplaintRow> {
    const { data, error } = await supabase
      .from("complaints")
      .update(updates)
      .eq("id", complaintId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete complaint
  async deleteComplaint(complaintId: string): Promise<void> {
    const { error } = await supabase
      .from("complaints")
      .delete()
      .eq("id", complaintId);

    if (error) throw error;
  }

  // Get complaint statistics
  async getComplaintStatistics(societyId: string): Promise<{
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
    by_category: Record<string, number>;
    by_priority: Record<string, number>;
  }> {
    const { data, error } = await supabase
      .from("complaints")
      .select("status, category, priority")
      .eq("society_id", societyId);

    if (error) throw error;

    const stats = {
      total: data.length,
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      by_category: {} as Record<string, number>,
      by_priority: {} as Record<string, number>,
    };

    data.forEach((complaint) => {
      // Count by status
      stats[complaint.status as keyof typeof stats]++;

      // Count by category
      stats.by_category[complaint.category] =
        (stats.by_category[complaint.category] || 0) + 1;

      // Count by priority
      stats.by_priority[complaint.priority] =
        (stats.by_priority[complaint.priority] || 0) + 1;
    });

    return stats;
  }

  // Search complaints
  async searchComplaints(
    societyId: string,
    searchTerm: string,
    filters?: {
      status?: string;
      category?: string;
      priority?: string;
    }
  ): Promise<ComplaintWithResident[]> {
    let query = supabase
      .from("complaints")
      .select(
        `
        *,
        resident:residents(
          id,
          name,
          flat_number,
          email,
          phone
        )
      `
      )
      .eq("society_id", societyId);

    // Apply text search
    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
    }

    // Apply filters
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }
    if (filters?.priority) {
      query = query.eq("priority", filters.priority);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data as ComplaintWithResident[];
  }

  // Get complaint by ID
  async getComplaintById(
    complaintId: string
  ): Promise<ComplaintWithResident | null> {
    const { data, error } = await supabase
      .from("complaints")
      .select(
        `
        *,
        resident:residents(
          id,
          name,
          flat_number,
          email,
          phone
        )
      `
      )
      .eq("id", complaintId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }

    return data as ComplaintWithResident;
  }

  // Get complaint categories with counts
  async getComplaintCategories(societyId: string): Promise<
    Array<{
      category: string;
      count: number;
    }>
  > {
    const { data, error } = await supabase
      .from("complaints")
      .select("category")
      .eq("society_id", societyId);

    if (error) throw error;

    const categoryCounts = data.reduce((acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
  }

  // Get recent complaints
  async getRecentComplaints(
    societyId: string,
    limit: number = 5
  ): Promise<ComplaintWithResident[]> {
    const { data, error } = await supabase
      .from("complaints")
      .select(
        `
        *,
        resident:residents(
          id,
          name,
          flat_number,
          email,
          phone
        )
      `
      )
      .eq("society_id", societyId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as ComplaintWithResident[];
  }
}

export const complaintsService = new ComplaintsService();
