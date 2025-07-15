// TypeScript interfaces for Society Management System
// These interfaces match the Supabase database schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          global_role?: "super_admin" | "platform_admin";
          default_society_id?: string;
          avatar?: string;
          phone?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          global_role?: "super_admin" | "platform_admin";
          default_society_id?: string;
          avatar?: string;
          phone?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          global_role?: "super_admin" | "platform_admin";
          default_society_id?: string;
          avatar?: string;
          phone?: string;
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
          id: string;
          name: string;
          address: string;
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
        Update: {
          id?: string;
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
      user_society_memberships: {
        Row: {
          id: string;
          user_id: string;
          society_id: string;
          role: "admin" | "manager" | "staff" | "resident";
          status: "active" | "inactive" | "pending" | "suspended";
          invited_by?: string;
          joined_at?: string;
          permissions: {
            can_view: boolean;
            can_edit: boolean;
            can_delete: boolean;
            can_invite: boolean;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          society_id: string;
          role?: "admin" | "manager" | "staff" | "resident";
          status?: "active" | "inactive" | "pending" | "suspended";
          invited_by?: string;
          joined_at?: string;
          permissions?: {
            can_view: boolean;
            can_edit: boolean;
            can_delete: boolean;
            can_invite: boolean;
          };
        };
        Update: {
          role?: "admin" | "manager" | "staff" | "resident";
          status?: "active" | "inactive" | "pending" | "suspended";
          invited_by?: string;
          joined_at?: string;
          permissions?: {
            can_view: boolean;
            can_edit: boolean;
            can_delete: boolean;
            can_invite: boolean;
          };
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
          move_out_date?: string;
          status: "active" | "inactive" | "pending";
          type: "owner" | "tenant";
          resident_category: "home" | "shop" | "office" | "other";
          emergency_contact?: string;
          avatar?: string;
          owner_id?: string; // For tenants to link to their owner
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
          move_out_date?: string;
          status?: "active" | "inactive" | "pending";
          type?: "owner" | "tenant";
          resident_category?: "home" | "shop" | "office" | "other";
          emergency_contact?: string;
          avatar?: string;
          owner_id?: string; // For tenants to link to their owner
        };
        Update: {
          society_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          flat_number?: string;
          move_in_date?: string;
          move_out_date?: string;
          status?: "active" | "inactive" | "pending";
          type?: "owner" | "tenant";
          resident_category?: "home" | "shop" | "office" | "other";
          emergency_contact?: string;
          avatar?: string;
          owner_id?: string; // For tenants to link to their owner
        };
      };
      units: {
        Row: {
          id: string;
          society_id: string;
          unit_number: string;
          floor_number?: number;
          unit_type?:
            | "1BHK"
            | "2BHK"
            | "3BHK"
            | "4BHK"
            | "penthouse"
            | "studio";
          status: "occupied" | "vacant" | "maintenance";
          monthly_maintenance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          unit_number: string;
          floor_number?: number;
          unit_type?:
            | "1BHK"
            | "2BHK"
            | "3BHK"
            | "4BHK"
            | "penthouse"
            | "studio";
          status?: "occupied" | "vacant" | "maintenance";
          monthly_maintenance?: number;
        };
        Update: {
          society_id?: string;
          unit_number?: string;
          floor_number?: number;
          unit_type?:
            | "1BHK"
            | "2BHK"
            | "3BHK"
            | "4BHK"
            | "penthouse"
            | "studio";
          status?: "occupied" | "vacant" | "maintenance";
          monthly_maintenance?: number;
        };
      };
      maintenance_bills: {
        Row: {
          id: string;
          society_id: string;
          unit_id: string;
          resident_id?: string;
          bill_type: string;
          amount: number;
          due_date: string;
          status: "paid" | "pending" | "overdue";
          description?: string;
          paid_date?: string;
          late_fee: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          unit_id: string;
          resident_id?: string;
          bill_type: string;
          amount: number;
          due_date: string;
          status?: "paid" | "pending" | "overdue";
          description?: string;
          paid_date?: string;
          late_fee?: number;
        };
        Update: {
          society_id?: string;
          unit_id?: string;
          resident_id?: string;
          bill_type?: string;
          amount?: number;
          due_date?: string;
          status?: "paid" | "pending" | "overdue";
          description?: string;
          paid_date?: string;
          late_fee?: number;
        };
      };
      payments: {
        Row: {
          id: string;
          society_id: string;
          transaction_id: string;
          unit_id: string;
          amount: number;
          payment_method: "online" | "cash" | "cheque" | "bank_transfer";
          status: "completed" | "pending" | "failed" | "refunded";
          bill_type: string;
          description?: string;
          gateway?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          transaction_id: string;
          unit_id: string;
          amount: number;
          payment_method: "online" | "cash" | "cheque" | "bank_transfer";
          status?: "completed" | "pending" | "failed" | "refunded";
          bill_type: string;
          description?: string;
          gateway?: string;
        };
        Update: {
          society_id?: string;
          transaction_id?: string;
          unit_id?: string;
          amount?: number;
          payment_method?: "online" | "cash" | "cheque" | "bank_transfer";
          status?: "completed" | "pending" | "failed" | "refunded";
          bill_type?: string;
          description?: string;
          gateway?: string;
        };
      };
      complaints: {
        Row: {
          id: string;
          society_id: string;
          resident_id?: string;
          title: string;
          description: string;
          category: string;
          priority: "low" | "medium" | "high" | "urgent";
          status: "open" | "in_progress" | "resolved" | "closed";
          assigned_to?: string;
          submitted_date: string;
          resolved_date?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          resident_id?: string;
          title: string;
          description: string;
          category: string;
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "open" | "in_progress" | "resolved" | "closed";
          assigned_to?: string;
          submitted_date?: string;
          resolved_date?: string;
        };
        Update: {
          society_id?: string;
          resident_id?: string;
          title?: string;
          description?: string;
          category?: string;
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "open" | "in_progress" | "resolved" | "closed";
          assigned_to?: string;
          submitted_date?: string;
          resolved_date?: string;
        };
      };
      facilities: {
        Row: {
          id: string;
          society_id: string;
          name: string;
          type: string;
          description?: string;
          capacity: number;
          location: string;
          status: "available" | "occupied" | "maintenance" | "closed";
          amenities: string[];
          operating_hours: {
            start: string;
            end: string;
          };
          booking_required: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          name: string;
          type: string;
          description?: string;
          capacity?: number;
          location: string;
          status?: "available" | "occupied" | "maintenance" | "closed";
          amenities?: string[];
          operating_hours?: {
            start: string;
            end: string;
          };
          booking_required?: boolean;
        };
        Update: {
          society_id?: string;
          name?: string;
          type?: string;
          description?: string;
          capacity?: number;
          location?: string;
          status?: "available" | "occupied" | "maintenance" | "closed";
          amenities?: string[];
          operating_hours?: {
            start: string;
            end: string;
          };
          booking_required?: boolean;
        };
      };
      events: {
        Row: {
          id: string;
          society_id: string;
          title: string;
          description: string;
          type:
            | "meeting"
            | "celebration"
            | "maintenance"
            | "emergency"
            | "social";
          event_date: string;
          event_time: string;
          location: string;
          organizer: string;
          max_attendees?: number;
          current_attendees: number;
          status: "upcoming" | "ongoing" | "completed" | "cancelled";
          is_public: boolean;
          rsvp_required: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          title: string;
          description: string;
          type:
            | "meeting"
            | "celebration"
            | "maintenance"
            | "emergency"
            | "social";
          event_date: string;
          event_time: string;
          location: string;
          organizer: string;
          max_attendees?: number;
          current_attendees?: number;
          status?: "upcoming" | "ongoing" | "completed" | "cancelled";
          is_public?: boolean;
          rsvp_required?: boolean;
        };
        Update: {
          society_id?: string;
          title?: string;
          description?: string;
          type?:
            | "meeting"
            | "celebration"
            | "maintenance"
            | "emergency"
            | "social";
          event_date?: string;
          event_time?: string;
          location?: string;
          organizer?: string;
          max_attendees?: number;
          current_attendees?: number;
          status?: "upcoming" | "ongoing" | "completed" | "cancelled";
          is_public?: boolean;
          rsvp_required?: boolean;
        };
      };
      notices: {
        Row: {
          id: string;
          society_id: string;
          title: string;
          content: string;
          priority: "low" | "normal" | "high" | "urgent";
          category:
            | "general"
            | "maintenance"
            | "emergency"
            | "billing"
            | "social";
          published_date: string;
          expiry_date?: string;
          published_by: string;
          target_audience: "all" | "owners" | "tenants" | "committee";
          is_active: boolean;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          title: string;
          content: string;
          priority?: "low" | "normal" | "high" | "urgent";
          category:
            | "general"
            | "maintenance"
            | "emergency"
            | "billing"
            | "social";
          published_date?: string;
          expiry_date?: string;
          published_by: string;
          target_audience?: "all" | "owners" | "tenants" | "committee";
          is_active?: boolean;
          views?: number;
        };
        Update: {
          society_id?: string;
          title?: string;
          content?: string;
          priority?: "low" | "normal" | "high" | "urgent";
          category?:
            | "general"
            | "maintenance"
            | "emergency"
            | "billing"
            | "social";
          published_date?: string;
          expiry_date?: string;
          published_by?: string;
          target_audience?: "all" | "owners" | "tenants" | "committee";
          is_active?: boolean;
          views?: number;
        };
      };
      visitor_logs: {
        Row: {
          id: string;
          society_id: string;
          host_resident_id?: string;
          visitor_name: string;
          visitor_phone?: string;
          purpose: string;
          entry_time: string;
          exit_time?: string;
          vehicle_number?: string;
          status: "entered" | "exited" | "denied";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          host_resident_id?: string;
          visitor_name: string;
          visitor_phone?: string;
          purpose: string;
          entry_time?: string;
          exit_time?: string;
          vehicle_number?: string;
          status?: "entered" | "exited" | "denied";
        };
        Update: {
          society_id?: string;
          host_resident_id?: string;
          visitor_name?: string;
          visitor_phone?: string;
          purpose?: string;
          entry_time?: string;
          exit_time?: string;
          vehicle_number?: string;
          status?: "entered" | "exited" | "denied";
        };
      };
      vehicles: {
        Row: {
          id: string;
          society_id: string;
          resident_id: string;
          vehicle_number: string;
          vehicle_type: "car" | "motorcycle" | "bicycle" | "other";
          brand?: string;
          model?: string;
          color?: string;
          parking_slot?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          resident_id: string;
          vehicle_number: string;
          vehicle_type: "car" | "motorcycle" | "bicycle" | "other";
          brand?: string;
          model?: string;
          color?: string;
          parking_slot?: string;
          is_active?: boolean;
        };
        Update: {
          society_id?: string;
          resident_id?: string;
          vehicle_number?: string;
          vehicle_type?: "car" | "motorcycle" | "bicycle" | "other";
          brand?: string;
          model?: string;
          color?: string;
          parking_slot?: string;
          is_active?: boolean;
        };
      };
      polls_surveys: {
        Row: {
          id: string;
          society_id: string;
          title: string;
          description: string;
          type: "poll" | "survey";
          status: "draft" | "active" | "closed" | "archived";
          start_date: string;
          end_date: string;
          target_audience: "all" | "owners" | "tenants" | "specific";
          is_anonymous: boolean;
          allow_multiple_responses: boolean;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          society_id: string;
          title: string;
          description: string;
          type?: "poll" | "survey";
          status?: "draft" | "active" | "closed" | "archived";
          start_date?: string;
          end_date: string;
          target_audience?: "all" | "owners" | "tenants" | "specific";
          is_anonymous?: boolean;
          allow_multiple_responses?: boolean;
          created_by?: string;
        };
        Update: {
          society_id?: string;
          title?: string;
          description?: string;
          type?: "poll" | "survey";
          status?: "draft" | "active" | "closed" | "archived";
          start_date?: string;
          end_date?: string;
          target_audience?: "all" | "owners" | "tenants" | "specific";
          is_anonymous?: boolean;
          allow_multiple_responses?: boolean;
          created_by?: string;
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
          option_order?: number;
        };
        Update: {
          poll_id?: string;
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
            | "rating";
          question_order: number;
          required: boolean;
          options?: string[];
          created_at: string;
        };
        Insert: {
          poll_id: string;
          question_text: string;
          question_type?:
            | "single_choice"
            | "multiple_choice"
            | "text"
            | "rating";
          question_order?: number;
          required?: boolean;
          options?: string[];
        };
        Update: {
          poll_id?: string;
          question_text?: string;
          question_type?:
            | "single_choice"
            | "multiple_choice"
            | "text"
            | "rating";
          question_order?: number;
          required?: boolean;
          options?: string[];
        };
      };
      poll_responses: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          resident_id?: string;
          response_date: string;
        };
        Insert: {
          poll_id: string;
          option_id: string;
          resident_id?: string;
          response_date?: string;
        };
        Update: {
          poll_id?: string;
          option_id?: string;
          resident_id?: string;
          response_date?: string;
        };
      };
      survey_responses: {
        Row: {
          id: string;
          poll_id: string;
          question_id: string;
          resident_id?: string;
          response_text?: string;
          selected_options?: string[];
          rating?: number;
          response_date: string;
        };
        Insert: {
          poll_id: string;
          question_id: string;
          resident_id?: string;
          response_text?: string;
          selected_options?: string[];
          rating?: number;
          response_date?: string;
        };
        Update: {
          poll_id?: string;
          question_id?: string;
          resident_id?: string;
          response_text?: string;
          selected_options?: string[];
          rating?: number;
          response_date?: string;
        };
      };
      poll_survey_participants: {
        Row: {
          id: string;
          poll_id: string;
          resident_id?: string;
          completed: boolean;
          completed_at?: string;
          created_at: string;
        };
        Insert: {
          poll_id: string;
          resident_id?: string;
          completed?: boolean;
          completed_at?: string;
        };
        Update: {
          poll_id?: string;
          resident_id?: string;
          completed?: boolean;
          completed_at?: string;
        };
      };
    };
  };
}

// Simplified interfaces for frontend use
export interface Society {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  totalResidents: number;
  pendingDues: number;
  status: "active" | "inactive" | "maintenance";
  logo?: string;
  settings: {
    currency: string;
    timezone: string;
    maintenanceDay: number;
  };
}

export interface Resident {
  id: string;
  societyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  flatNumber: string;
  moveInDate: string;
  status: "active" | "inactive" | "pending";
  type: "owner" | "tenant";
  residentCategory: "home" | "shop" | "office" | "other";
  emergencyContact?: string;
  avatar?: string;
}

export interface MaintenanceBill {
  id: string;
  societyId: string;
  unitId: string;
  residentId?: string;
  billType: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  description?: string;
  paidDate?: string;
  lateFee: number;
}

export interface Payment {
  id: string;
  societyId: string;
  transactionId: string;
  unitId: string;
  amount: number;
  paymentMethod: "online" | "cash" | "cheque" | "bank_transfer";
  status: "completed" | "pending" | "failed" | "refunded";
  billType: string;
  description?: string;
  gateway?: string;
  paymentDate: string;
}

export interface Complaint {
  id: string;
  societyId: string;
  residentId?: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo?: string;
  submittedDate: string;
  resolvedDate?: string;
}

export interface Facility {
  id: string;
  societyId: string;
  name: string;
  type: string;
  description?: string;
  capacity: number;
  location: string;
  status: "available" | "occupied" | "maintenance" | "closed";
  amenities: string[];
  operatingHours: {
    start: string;
    end: string;
  };
  bookingRequired: boolean;
}

export interface Event {
  id: string;
  societyId: string;
  title: string;
  description: string;
  type: "meeting" | "celebration" | "maintenance" | "emergency" | "social";
  eventDate: string;
  eventTime: string;
  location: string;
  organizer: string;
  maxAttendees?: number;
  currentAttendees: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  isPublic: boolean;
  rsvpRequired: boolean;
}

export interface Notice {
  id: string;
  societyId: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  category: "general" | "maintenance" | "emergency" | "billing" | "social";
  publishedDate: string;
  expiryDate?: string;
  publishedBy: string;
  targetAudience: "all" | "owners" | "tenants" | "committee";
  isActive: boolean;
  views: number;
}

export interface VisitorLog {
  id: string;
  societyId: string;
  hostResidentId?: string;
  visitorName: string;
  visitorPhone?: string;
  purpose: string;
  entryTime: string;
  exitTime?: string;
  vehicleNumber?: string;
  status: "entered" | "exited" | "denied";
}

export interface Vehicle {
  id: string;
  societyId: string;
  residentId: string;
  vehicleNumber: string;
  vehicleType: "car" | "motorcycle" | "bicycle" | "other";
  brand?: string;
  model?: string;
  color?: string;
  parkingSlot?: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  globalRole?: "super_admin" | "platform_admin";
  defaultSocietyId?: string;
  avatar?: string;
  phone?: string;
}

export interface UserSocietyMembership {
  id: string;
  userId: string;
  societyId: string;
  role: "admin" | "manager" | "staff" | "resident";
  status: "active" | "inactive" | "pending" | "suspended";
  invitedBy?: string;
  joinedAt?: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canInvite: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Helper interface for user with society context
export interface UserWithSocietyRole extends UserProfile {
  societyRole?: "admin" | "manager" | "staff" | "resident";
  societyStatus?: "active" | "inactive" | "pending" | "suspended";
  societyPermissions?: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canInvite: boolean;
  };
}
