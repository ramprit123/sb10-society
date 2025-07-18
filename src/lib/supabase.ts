import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "your-supabase-url";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          global_role:
            | "super_admin"
            | "platform_admin"
            | "admin"
            | "secretary"
            | "chairman"
            | "treasurer"
            | "resident"
            | "staff"
            | "committee"
            | "security"
            | "other";
          default_society_id?: string;
          avatar?: string;
          flat_owner_type: "owner" | "tenant";
          property_type: "residential" | "commercial" | "shop" | "office";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          global_role?:
            | "super_admin"
            | "platform_admin"
            | "admin"
            | "secretary"
            | "chairman"
            | "treasurer"
            | "resident"
            | "staff"
            | "committee"
            | "security"
            | "other";
          default_society_id?: string;
          avatar?: string;
          flat_owner_type?: "owner" | "tenant";
          property_type?: "residential" | "commercial" | "shop" | "office";
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          global_role?:
            | "super_admin"
            | "platform_admin"
            | "admin"
            | "secretary"
            | "chairman"
            | "treasurer"
            | "resident"
            | "staff"
            | "committee"
            | "security"
            | "other";
          default_society_id?: string;
          avatar?: string;
          flat_owner_type?: "owner" | "tenant";
          property_type?: "residential" | "commercial" | "shop" | "office";
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
      polls_surveys: {
        Row: {
          id: string;
          society_id: string;
          title: string;
          description: string;
          type: "poll" | "survey";
          status: "draft" | "active" | "closed";
          created_by: string;
          created_at: string;
          updated_at: string;
          end_date: string;
          target_audience: "all" | "owners" | "tenants" | "specific";
          target_groups?: string[];
          settings?: any;
        };
        Insert: {
          society_id: string;
          title: string;
          description: string;
          type: "poll" | "survey";
          status?: "draft" | "active" | "closed";
          created_by: string;
          end_date: string;
          target_audience?: "all" | "owners" | "tenants" | "specific";
          target_groups?: string[];
          settings?: any;
        };
        Update: {
          title?: string;
          description?: string;
          type?: "poll" | "survey";
          status?: "draft" | "active" | "closed";
          end_date?: string;
          target_audience?: "all" | "owners" | "tenants" | "specific";
          target_groups?: string[];
          settings?: any;
        };
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          option_text: string;
          option_order: number;
          created_at: string;
        };
        Insert: {
          poll_id: string;
          option_text: string;
          option_order: number;
        };
        Update: {
          option_text?: string;
          option_order?: number;
        };
      };
      survey_questions: {
        Row: {
          id: string;
          poll_id: string;
          question_text: string;
          question_type:
            | "single_choice"
            | "multiple_choice"
            | "text"
            | "rating"
            | "scale";
          question_order: number;
          required: boolean;
          options?: string[];
          settings?: any;
          created_at: string;
        };
        Insert: {
          poll_id: string;
          question_text: string;
          question_type:
            | "single_choice"
            | "multiple_choice"
            | "text"
            | "rating"
            | "scale";
          question_order: number;
          required?: boolean;
          options?: string[];
          settings?: any;
        };
        Update: {
          question_text?: string;
          question_type?:
            | "single_choice"
            | "multiple_choice"
            | "text"
            | "rating"
            | "scale";
          question_order?: number;
          required?: boolean;
          options?: string[];
          settings?: any;
        };
      };
      residents: {
        Row: {
          id: string;
          society_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          flat_number: string;
          move_in_date: string;
          status: "active" | "inactive" | "pending";
          type: "owner" | "tenant";
          emergency_contact: string;
          avatar?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          flat_number: string;
          move_in_date: string;
          status?: "active" | "inactive" | "pending";
          type: "owner" | "tenant";
          emergency_contact: string;
          avatar?: string;
        };
        Update: {
          society_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          flat_number?: string;
          move_in_date?: string;
          status?: "active" | "inactive" | "pending";
          type?: "owner" | "tenant";
          emergency_contact?: string;
          avatar?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          resident_id: string;
          vehicle_number: string;
          vehicle_type: "car" | "bike" | "scooter" | "bicycle" | "other";
          model?: string;
          color?: string;
          is_primary: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          resident_id: string;
          vehicle_number: string;
          vehicle_type: "car" | "bike" | "scooter" | "bicycle" | "other";
          model?: string;
          color?: string;
          is_primary?: boolean;
          is_active?: boolean;
        };
        Update: {
          resident_id?: string;
          vehicle_number?: string;
          vehicle_type?: "car" | "bike" | "scooter" | "bicycle" | "other";
          model?: string;
          color?: string;
          is_primary?: boolean;
          is_active?: boolean;
        };
      };
      poll_responses: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          resident_id: string;
          responded_at: string;
        };
        Insert: {
          poll_id: string;
          option_id: string;
          resident_id: string;
        };
        Update: {
          option_id?: string;
        };
      };
      survey_responses: {
        Row: {
          id: string;
          poll_id: string;
          question_id: string;
          resident_id: string;
          response_text?: string;
          selected_options?: string[];
          rating?: number;
          responded_at: string;
        };
        Insert: {
          poll_id: string;
          question_id: string;
          resident_id: string;
          response_text?: string;
          selected_options?: string[];
          rating?: number;
        };
        Update: {
          response_text?: string;
          selected_options?: string[];
          rating?: number;
        };
      };
      poll_survey_participants: {
        Row: {
          id: string;
          poll_id: string;
          resident_id: string;
          completed: boolean;
          started_at: string;
          completed_at?: string;
        };
        Insert: {
          poll_id: string;
          resident_id: string;
          completed?: boolean;
        };
        Update: {
          completed?: boolean;
          completed_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_poll_results: {
        Args: {
          poll_uuid: string;
        };
        Returns: {
          option_id: string;
          option_text: string;
          vote_count: number;
          percentage: number;
        }[];
      };
      can_user_vote: {
        Args: {
          poll_uuid: string;
          user_uuid: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
