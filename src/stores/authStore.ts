import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import {
  getCurrentUserProfile,
  createUserProfile,
  updateCurrentUserProfile,
  type CreateUserProfileData,
  type UpdateUserProfileData,
} from "@/services/userProfilesService";
import type { Database } from "@/types/database";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

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
    userData: CreateUserProfileData
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: UpdateUserProfileData) => Promise<void>;
  createProfile: (
    userId: string,
    userData: CreateUserProfileData
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
    userData: CreateUserProfileData
  ) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName || "",
            last_name: userData.lastName || "",
            phone: userData.phone || "",
          },
        },
      });

      if (error) {
        console.error("Supabase auth error:", error);
        set({ isLoading: false });
        throw error;
      }

      // If user is created immediately (email confirmation disabled)
      if (data.user && data.session) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
          // Try to get existing profile first
          const existingProfile = await getCurrentUserProfile();

          if (!existingProfile) {
            console.warn(
              "Database trigger didn't create profile, creating manually"
            );
            const newProfile = await createUserProfile(data.user.id, {
              ...userData,
              email: data.user.email || userData.email,
            });
            set({ profile: newProfile });
          } else {
            set({ profile: existingProfile });
          }
        } catch (createError) {
          console.error("Error handling profile creation:", createError);
          throw new Error("Failed to create user profile. Please try again.");
        }
      }

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

  updateProfile: async (updates: UpdateUserProfileData) => {
    try {
      set({ isLoading: true });
      const { profile } = get();
      if (!profile) {
        set({ isLoading: false });
        return;
      }

      const updatedProfile = await updateCurrentUserProfile(updates);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      console.error("Error updating profile:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createProfile: async (userId: string, userData: CreateUserProfileData) => {
    try {
      set({ isLoading: true });
      const newProfile = await createUserProfile(userId, userData);
      set({ profile: newProfile, isLoading: false });
      return newProfile;
    } catch (error) {
      console.error("Error creating profile:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  checkProfileTrigger: async (): Promise<boolean> => {
    try {
      // Check if the trigger exists
      const { data: triggerData, error: triggerError } = await supabase
        .from("information_schema.triggers")
        .select("*")
        .eq("trigger_name", "on_auth_user_created")
        .single();

      if (triggerError) {
        console.warn("Could not check trigger status:", triggerError);
        return false;
      }

      console.log("Trigger exists:", triggerData);
      return true;
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

        const fetchProfile = async (retries = 1) => {
          for (let i = 0; i < retries; i++) {
            try {
              const profile = await getCurrentUserProfile();
              if (profile) {
                set({ profile });
                break;
              } else if (i === retries - 1) {
                // Profile doesn't exist after all retries, create it manually
                console.warn(
                  "Profile not found after retries, creating manually"
                );
                try {
                  const newProfile = await get().createProfile(
                    session.user.id,
                    {
                      email: session.user.email || "",
                      firstName:
                        session.user.user_metadata?.first_name ||
                        session.user.user_metadata?.name ||
                        session.user.email?.split("@")[0] ||
                        "",
                      lastName: session.user.user_metadata?.last_name || "",
                      phone: session.user.user_metadata?.phone || "",
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
              } else {
                // Profile doesn't exist yet, wait and retry
                await new Promise((resolve) =>
                  setTimeout(resolve, 1000 * (i + 1))
                );
                continue;
              }
            } catch (error) {
              console.error("Error fetching profile:", error);
              if (i === retries - 1) break;
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * (i + 1))
              );
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

        const fetchProfile = async (retries = 1) => {
          for (let i = 0; i < retries; i++) {
            try {
              const profile = await getCurrentUserProfile();
              if (profile) {
                set({ profile });
                break;
              } else if (i === retries - 1) {
                // Profile doesn't exist after all retries, create it manually
                console.warn(
                  "Profile not found after retries, creating manually"
                );
                try {
                  const newProfile = await get().createProfile(
                    session.user.id,
                    {
                      email: session.user.email || "",
                      firstName:
                        session.user.user_metadata?.first_name ||
                        session.user.user_metadata?.name ||
                        session.user.email?.split("@")[0] ||
                        "",
                      lastName: session.user.user_metadata?.last_name || "",
                      phone: session.user.user_metadata?.phone || "",
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
              } else {
                // Profile doesn't exist yet, wait and retry
                await new Promise((resolve) =>
                  setTimeout(resolve, 1000 * (i + 1))
                );
                continue;
              }
            } catch (error) {
              console.error("Error fetching profile:", error);
              if (i === retries - 1) break;
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * (i + 1))
              );
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
