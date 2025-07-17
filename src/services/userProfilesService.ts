import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
type UserProfileInsert =
  Database["public"]["Tables"]["user_profiles"]["Insert"];
type UserProfileUpdate =
  Database["public"]["Tables"]["user_profiles"]["Update"];

export interface UserProfileWithSociety extends UserProfile {
  default_society?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface CreateUserProfileData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  globalRole?: UserProfile["global_role"];
  defaultSocietyId?: string;
  avatar?: string;
  flatOwnerType?: "owner" | "tenant";
  propertyType?: "residential" | "commercial" | "shop" | "office";
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  globalRole?: UserProfile["global_role"];
  defaultSocietyId?: string;
  avatar?: string;
  flatOwnerType?: "owner" | "tenant";
  propertyType?: "residential" | "commercial" | "shop" | "office";
}

// Get current user profile
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No profile found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
}

// Get user profile by ID
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No profile found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Get user profile with society details
export async function getUserProfileWithSociety(
  userId: string
): Promise<UserProfileWithSociety | null> {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select(
        `
        *,
        default_society:societies!default_society_id (
          id,
          name,
          address
        )
      `
      )
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No profile found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user profile with society:", error);
    throw error;
  }
}

// Create user profile
export async function createUserProfile(
  userId: string,
  data: CreateUserProfileData
): Promise<UserProfile> {
  try {
    const profileData: UserProfileInsert = {
      id: userId,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone || null,
      global_role: data.globalRole || "resident",
      default_society_id: data.defaultSocietyId || null,
      avatar: data.avatar || null,
      flat_owner_type: data.flatOwnerType || "owner",
      property_type: data.propertyType || "residential",
    };

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;

    return profile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  data: UpdateUserProfileData
): Promise<UserProfile> {
  try {
    const updateData: UserProfileUpdate = {};

    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.globalRole !== undefined) updateData.global_role = data.globalRole;
    if (data.defaultSocietyId !== undefined)
      updateData.default_society_id = data.defaultSocietyId;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.flatOwnerType !== undefined)
      updateData.flat_owner_type = data.flatOwnerType;
    if (data.propertyType !== undefined)
      updateData.property_type = data.propertyType;

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return profile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Update current user profile
export async function updateCurrentUserProfile(
  data: UpdateUserProfileData
): Promise<UserProfile> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    return await updateUserProfile(user.id, data);
  } catch (error) {
    console.error("Error updating current user profile:", error);
    throw error;
  }
}

// Delete user profile
export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
}

// Get users by society
export async function getUsersBySociety(
  societyId: string,
  limit?: number,
  offset?: number
): Promise<UserProfile[]> {
  try {
    let query = supabase
      .from("user_profiles")
      .select("*")
      .eq("default_society_id", societyId)
      .order("first_name", { ascending: true });

    if (limit) query = query.limit(limit);
    if (offset) query = query.range(offset, offset + (limit || 10) - 1);

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching users by society:", error);
    throw error;
  }
}

// Get users by role
export async function getUsersByRole(
  role: UserProfile["global_role"],
  societyId?: string
): Promise<UserProfile[]> {
  try {
    let query = supabase
      .from("user_profiles")
      .select("*")
      .eq("global_role", role)
      .order("first_name", { ascending: true });

    if (societyId) {
      query = query.eq("default_society_id", societyId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw error;
  }
}

// Search users
export async function searchUsers(
  searchTerm: string,
  societyId?: string,
  limit?: number
): Promise<UserProfile[]> {
  try {
    let query = supabase
      .from("user_profiles")
      .select("*")
      .or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
      )
      .order("first_name", { ascending: true });

    if (societyId) {
      query = query.eq("default_society_id", societyId);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
}

// Upload user avatar
export async function uploadUserAvatar(
  userId: string,
  file: File
): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase storage
    const { error } = await supabase.storage
      .from("user-avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("user-avatars")
      .getPublicUrl(filePath);

    // Update user profile with avatar URL
    await updateUserProfile(userId, {
      avatar: publicData.publicUrl,
    });

    return publicData.publicUrl;
  } catch (error) {
    console.error("Error uploading user avatar:", error);
    throw error;
  }
}

// Remove user avatar
export async function removeUserAvatar(userId: string): Promise<void> {
  try {
    // Get current profile to get avatar URL
    const profile = await getUserProfile(userId);
    if (!profile?.avatar) return;

    // Extract file path from URL
    const avatarPath = profile.avatar.split("/").pop();
    if (avatarPath) {
      // Remove file from storage
      const { error: storageError } = await supabase.storage
        .from("user-avatars")
        .remove([`avatars/${avatarPath}`]);

      if (storageError) {
        console.error("Error removing avatar from storage:", storageError);
        // Continue to update profile even if storage deletion fails
      }
    }

    // Update profile to remove avatar URL
    await updateUserProfile(userId, {
      avatar: undefined,
    });
  } catch (error) {
    console.error("Error removing user avatar:", error);
    throw error;
  }
}

// Check if user exists
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return false;
      }
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    throw error;
  }
}

// Get user statistics
export async function getUserStats(societyId?: string): Promise<{
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<string, number>;
  usersByPropertyType: Record<string, number>;
}> {
  try {
    let query = supabase
      .from("user_profiles")
      .select("global_role, property_type, created_at");

    if (societyId) {
      query = query.eq("default_society_id", societyId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats = {
      totalUsers: data?.length || 0,
      activeUsers: data?.length || 0, // Assuming all users are active for now
      usersByRole: {} as Record<string, number>,
      usersByPropertyType: {} as Record<string, number>,
    };

    // Calculate role distribution
    data?.forEach((user) => {
      stats.usersByRole[user.global_role] =
        (stats.usersByRole[user.global_role] || 0) + 1;
      stats.usersByPropertyType[user.property_type] =
        (stats.usersByPropertyType[user.property_type] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

// Subscribe to user profile changes
export function subscribeToUserProfile(
  userId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel("user_profile_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "user_profiles",
        filter: `id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

// Subscribe to users changes for a society
export function subscribeToSocietyUsers(
  societyId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel("society_users_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "user_profiles",
        filter: `default_society_id=eq.${societyId}`,
      },
      callback
    )
    .subscribe();
}
