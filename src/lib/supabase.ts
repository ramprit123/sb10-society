import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "your-supabase-url";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "super_admin" | "admin" | "manager" | "staff";
          tenants: string[];
          avatar?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: "super_admin" | "admin" | "manager" | "staff";
          tenants?: string[];
          avatar?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: "super_admin" | "admin" | "manager" | "staff";
          tenants?: string[];
          avatar?: string;
        };
      };
      societies: {
        Row: {
          id: string;
          name: string;
          address: string;
          total_units: number;
          occupied_units: number;
          total_residents: number;
          pending_dues: number;
          status: "active" | "inactive" | "maintenance";
          logo?: string;
          settings: {
            currency: string;
            timezone: string;
            maintenance_day: number;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          address: string;
          total_units: number;
          occupied_units?: number;
          total_residents?: number;
          pending_dues?: number;
          status?: "active" | "inactive" | "maintenance";
          logo?: string;
          settings?: {
            currency: string;
            timezone: string;
            maintenance_day: number;
          };
        };
        Update: {
          name?: string;
          address?: string;
          total_units?: number;
          occupied_units?: number;
          total_residents?: number;
          pending_dues?: number;
          status?: "active" | "inactive" | "maintenance";
          logo?: string;
          settings?: {
            currency: string;
            timezone: string;
            maintenance_day: number;
          };
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
