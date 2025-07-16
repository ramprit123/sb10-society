import {
  BarChart3,
  Building,
  Building2,
  Calendar,
  Cog,
  CreditCard,
  Eye,
  FileText,
  HelpCircle,
  Home,
  Lock,
  Megaphone,
  MessageSquare,
  Settings,
  Shield,
  TrendingUp,
  UserCog,
  Users,
  Vote,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  icon: React.ComponentType<any>;
  path?: string;
  globalOnly?: boolean;
  tenantOnly?: boolean;
  roles?: string[];
  children?: NavigationItem[];
}

export const getNavigationItems = (
  isGlobalView: boolean,
  currentSociety: any
): { category: string; items: NavigationItem[] }[] => [
  {
    category: "Overview",
    items: [
      {
        name: "Dashboard",
        icon: Home,
        path: isGlobalView ? "/" : `/tenant/${currentSociety?.id}/dashboard`,
      },
      {
        name: "All Societies",
        icon: Building2,
        path: "/societies",
        globalOnly: true,
        roles: ["super_admin", "admin"],
      },
      {
        name: "Analytics",
        icon: BarChart3,
        path: "/analytics",
        globalOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
    ],
  },
  {
    category: "Residents & Finance",
    items: [
      {
        name: "Residents",
        icon: Users,
        path: `/tenant/${currentSociety?.id}/residents`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager", "staff"],
      },
      {
        name: "Maintenance & Bills",
        icon: CreditCard,
        path: `/tenant/${currentSociety?.id}/maintenance`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
      {
        name: "Payments",
        icon: FileText,
        path: `/tenant/${currentSociety?.id}/payments`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
      {
        name: "Financial Reports",
        icon: TrendingUp,
        path: `/tenant/${currentSociety?.id}/financial-reports`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
    ],
  },
  {
    category: "Operations",
    items: [
      {
        name: "Complaints",
        icon: MessageSquare,
        path: `/tenant/${currentSociety?.id}/complaints`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager", "staff"],
      },
      {
        name: "Facilities",
        icon: Building,
        path: `/tenant/${currentSociety?.id}/facilities`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
    ],
  },
  {
    category: "Communication",
    items: [
      {
        name: "Events & Notices",
        icon: Calendar,
        path: `/tenant/${currentSociety?.id}/events`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
      {
        name: "Announcements",
        icon: Megaphone,
        path: `/tenant/${currentSociety?.id}/announcements`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
      {
        name: "Polls & Surveys",
        icon: Vote,
        path: `/tenant/${currentSociety?.id}/polls-surveys`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
      {
        name: "Meetings",
        icon: Users,
        path: `/tenant/${currentSociety?.id}/meetings`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
    ],
  },
  {
    category: "Security",
    items: [
      {
        name: "Security Guards",
        icon: Shield,
        path: `/tenant/${currentSociety?.id}/security`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
      {
        name: "Visitor Logs",
        icon: Eye,
        path: `/tenant/${currentSociety?.id}/visitor-logs`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager", "staff"],
      },
      {
        name: "Access Control",
        icon: Lock,
        path: `/tenant/${currentSociety?.id}/access-control`,
        tenantOnly: true,
        roles: ["super_admin", "admin", "manager"],
      },
    ],
  },
  {
    category: "Settings",
    items: [
      {
        name: "Society Settings",
        icon: Settings,
        path: `/tenant/${currentSociety?.id}/settings`,
        tenantOnly: true,
        roles: ["super_admin", "admin"],
      },
      {
        name: "FAQ Management",
        icon: HelpCircle,
        path: `/tenant/${currentSociety?.id}/faq-management`,
        tenantOnly: true,
        roles: ["super_admin", "admin"],
      },
      {
        name: "User Management",
        icon: UserCog,
        path: `/tenant/${currentSociety?.id}/user-management`,
        tenantOnly: true,
        roles: ["super_admin", "admin"],
      },
      {
        name: "System Settings",
        icon: Cog,
        path: `/tenant/${currentSociety?.id}/system-settings`,
        tenantOnly: true,
        roles: ["super_admin"],
      },
    ],
  },
];
