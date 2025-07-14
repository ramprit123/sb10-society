import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  global_role?: "super_admin" | "platform_admin";
  default_society_id?: string;
  avatar?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  createProfile: (
    userId: string,
    userData: Partial<UserProfile>
  ) => Promise<UserProfile>;
  checkProfileTrigger: () => Promise<boolean>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  isAuthenticated: false,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false });
        throw error;
      }

      // Auth state change listener will handle setting user, session, and isAuthenticated
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signUp: async (
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || "",
            global_role: userData.global_role || null,
            default_society_id: userData.default_society_id || null,
            avatar: userData.avatar || null,
            phone: userData.phone || null,
          },
        },
      });

      if (error) {
        set({ isLoading: false });
        throw error;
      }

      // If user is created immediately (email confirmation disabled)
      if (data.user && data.session) {
        // Wait a moment for the database trigger to create the profile
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Verify profile was created by the trigger
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError && profileError.code === "PGRST116") {
          // Profile doesn't exist, create it manually as fallback
          console.warn(
            "Database trigger didn't create profile, creating manually"
          );
          await get().createProfile(data.user.id, userData);
        } else if (profileError) {
          console.error("Error checking profile:", profileError);
        } else {
          // Profile exists, update store
          set({ profile });
        }
      }

      // Profile will be created automatically by database trigger
      // Auth state change listener will handle setting user, session, and isAuthenticated
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });

      const { error } = await supabase.auth.signOut();

      if (error) {
        set({ isLoading: false });
        throw error;
      }

      // Auth state change listener will handle clearing the state
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    try {
      set({ isLoading: true });
      const { profile } = get();
      if (!profile) {
        set({ isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id)
        .select()
        .single();

      if (error) {
        set({ isLoading: false });
        throw error;
      }

      set({ profile: { ...profile, ...data }, isLoading: false });
    } catch (error) {
      console.error("Error updating profile:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createProfile: async (userId: string, userData: Partial<UserProfile>) => {
    try {
      set({ isLoading: true });
      const { user } = get();

      const profileData = {
        id: userId,
        email: user?.email || userData.email || "",
        name: userData.name || "",
        global_role: userData.global_role || undefined,
        default_society_id: userData.default_society_id || undefined,
        avatar: userData.avatar,
        phone: userData.phone,
      };

      const { data, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single();

      if (error) {
        set({ isLoading: false });
        throw error;
      }

      // Update the store with the new profile
      set({ profile: data as UserProfile, isLoading: false });
      return data as UserProfile;
    } catch (error) {
      console.error("Error creating profile:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Utility function to check if profile creation trigger is working
  checkProfileTrigger: async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc("check_trigger_exists", {
        trigger_name: "on_auth_user_created",
      });

      if (error) {
        console.warn("Could not check trigger status:", error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.warn("Could not check trigger status:", error);
      return false;
    }
  },

  initialize: () => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
        });

        // Fetch user profile with retry logic
        const fetchProfile = async (retries = 3) => {
          for (let i = 0; i < retries; i++) {
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (error) {
              if (error.code === "PGRST116" && i === retries - 1) {
                // Profile doesn't exist after all retries, create it manually
                console.warn(
                  "Profile not found after retries, creating manually"
                );
                try {
                  const newProfile = await get().createProfile(
                    session.user.id,
                    {
                      email: session.user.email || "",
                      name:
                        session.user.user_metadata?.name ||
                        session.user.email?.split("@")[0] ||
                        "",
                    }
                  );
                  set({ profile: newProfile });
                } catch (createError) {
                  console.error(
                    "Error creating profile manually:",
                    createError
                  );
                }
                break;
              } else if (error.code === "PGRST116" && i < retries - 1) {
                // Profile doesn't exist yet, wait and retry
                await new Promise((resolve) =>
                  setTimeout(resolve, 1000 * (i + 1))
                );
                continue;
              } else {
                console.error("Error fetching profile:", error);
                break;
              }
            } else {
              set({ profile });
              break;
            }
          }
        };

        fetchProfile();
      }
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });

        // Fetch user profile with retry logic for new sign-ins
        const fetchProfile = async (retries = 3) => {
          for (let i = 0; i < retries; i++) {
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (error) {
              if (error.code === "PGRST116" && i === retries - 1) {
                // Profile doesn't exist after all retries, create it manually
                console.warn(
                  "Profile not found after retries, creating manually"
                );
                try {
                  const newProfile = await get().createProfile(
                    session.user.id,
                    {
                      email: session.user.email || "",
                      name:
                        session.user.user_metadata?.name ||
                        session.user.email?.split("@")[0] ||
                        "",
                    }
                  );
                  set({ profile: newProfile });
                } catch (createError) {
                  console.error(
                    "Error creating profile manually:",
                    createError
                  );
                }
                break;
              } else if (error.code === "PGRST116" && i < retries - 1) {
                // Profile doesn't exist yet, wait and retry
                await new Promise((resolve) =>
                  setTimeout(resolve, 1000 * (i + 1))
                );
                continue;
              } else {
                console.error("Error fetching profile:", error);
                break;
              }
            } else {
              set({ profile });
              break;
            }
          }
        };

        fetchProfile();
      } else if (event === "SIGNED_OUT") {
        set({
          user: null,
          session: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });
  },
}));
