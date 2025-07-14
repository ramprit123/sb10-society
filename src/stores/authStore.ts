import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "manager" | "staff";
  tenants: string[];
  avatar?: string;
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
            role: userData.role || "staff",
          },
        },
      });

      if (error) {
        set({ isLoading: false });
        throw error;
      }

      if (data.user) {
        // Create user profile in the database
        const profileData: UserProfile = {
          id: data.user.id,
          email: data.user.email!,
          name: userData.name || "",
          role:
            userData.role ||
            ("staff" as "super_admin" | "admin" | "manager" | "staff"),
          tenants: userData.tenants || [],
          avatar: userData.avatar,
        };

        const { error: profileError } = await supabase
          .from("profiles")
          .insert(profileData);

        if (profileError) {
          console.error("Error creating profile:", profileError);
          set({ isLoading: false });
          throw new Error(`Profile creation failed: ${profileError.message}`);
        }

        // Set the profile in state immediately if creation was successful
        set({
          profile: profileData,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
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

      const profileData: UserProfile = {
        id: userId,
        email: user?.email || userData.email || "",
        name: userData.name || "",
        role: userData.role || "staff",
        tenants: userData.tenants || [],
        avatar: userData.avatar,
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
      set({ profile: data, isLoading: false });
      return data;
    } catch (error) {
      console.error("Error creating profile:", error);
      set({ isLoading: false });
      throw error;
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

        // Fetch user profile
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error("Error fetching profile:", error);
            } else {
              set({ profile });
            }
          });
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

        // Fetch user profile
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error("Error fetching profile:", error);
            } else {
              set({ profile });
            }
          });
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
