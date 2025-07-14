import {
  BarChart3,
  Bell,
  Building,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Cog,
  CreditCard,
  Eye,
  FileText,
  Home,
  Lock,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Shield,
  TrendingUp,
  UserCog,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useSocietyStore } from "../stores/societyStore";

interface NavigationItem {
  name: string;
  icon: React.ComponentType<any>;
  path?: string;
  globalOnly?: boolean;
  tenantOnly?: boolean;
  roles?: string[];
  children?: NavigationItem[];
}

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Overview",
  ]);
  const { profile, signOut } = useAuthStore();
  const {
    currentSociety,
    societies,
    switchSociety,
    isGlobalView,
    setGlobalView,
    fetchSocieties,
  } = useSocietyStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch societies when component mounts
  useEffect(() => {
    if (societies.length === 0) {
      fetchSocieties();
    }
  }, [societies.length, fetchSocieties]);

  // Handle URL-based society selection on page reload or navigation
  useEffect(() => {
    const urlPath = location.pathname;
    const tenantMatch = urlPath.match(/^\/tenant\/([^\/]+)/);

    if (tenantMatch) {
      const societyIdFromUrl = tenantMatch[1];

      // Only switch if we have societies loaded and the current society doesn't match
      if (societies.length > 0) {
        const targetSociety = societies.find((s) => s.id === societyIdFromUrl);

        if (targetSociety) {
          // If we're in global view or have a different society selected
          if (isGlobalView || currentSociety?.id !== societyIdFromUrl) {
            setGlobalView(false);
            switchSociety(societyIdFromUrl);
          }
        } else {
          // Society not found, redirect to global view
          console.warn(
            `Society ${societyIdFromUrl} not found, redirecting to global view`
          );
          setGlobalView(true);
          navigate("/");
        }
      }
    } else if (urlPath === "/" || urlPath === "") {
      // Root path should show global view
      if (!isGlobalView) {
        setGlobalView(true);
      }
    }
  }, [
    location.pathname,
    societies,
    currentSociety?.id,
    isGlobalView,
    switchSociety,
    setGlobalView,
    navigate,
  ]);

  const navigationItems: { category: string; items: NavigationItem[] }[] = [
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

  const handleSocietySwitch = (societyId: string) => {
    if (societyId === "global") {
      setGlobalView(true);
      navigate("/");
    } else {
      switchSociety(societyId);
      navigate(`/tenant/${societyId}/dashboard`);
    }
    setTenantDropdownOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const toggleSection = (category: string) => {
    setExpandedSections((prev) =>
      prev.includes(category)
        ? prev.filter((section) => section !== category)
        : [...prev, category]
    );
  };

  const hasPermission = (item: NavigationItem) => {
    if (!item.roles) return true;
    return item.roles.includes(profile?.global_role || "");
  };

  const filteredNavigationItems = navigationItems
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        if (!hasPermission(item)) return false;
        if (item.globalOnly && !isGlobalView) return false;
        if (item.tenantOnly && (isGlobalView || !currentSociety)) return false;

        return true;
      }),
    }))
    .filter((category) => category.items.length > 0);

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-purple-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            Society Connect
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Tenant Selector */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <button
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <Building className="h-5 w-5 text-gray-500 mr-3" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  {isGlobalView
                    ? "All Societies"
                    : currentSociety?.name || "Select Society"}
                </div>
                <div className="text-xs text-gray-500">
                  {isGlobalView
                    ? `${societies.length} societies`
                    : "Current Society"}
                </div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {tenantDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              <button
                onClick={() => handleSocietySwitch("global")}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                  isGlobalView ? "bg-purple-50 text-purple-700" : ""
                }`}
              >
                <div className="font-medium">All Societies</div>
                <div className="text-sm text-gray-500">Global Overview</div>
              </button>
              {societies.map((society) => (
                <button
                  key={society.id}
                  onClick={() => handleSocietySwitch(society.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-t border-gray-100 ${
                    currentSociety?.id === society.id && !isGlobalView
                      ? "bg-purple-50 text-purple-700"
                      : ""
                  }`}
                >
                  <div className="font-medium">{society.name}</div>
                  <div className="text-sm text-gray-500">
                    {society.totalUnits} units
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {filteredNavigationItems.map((category) => {
          const isExpanded = expandedSections.includes(category.category);
          const hasMultipleItems = category.items.length > 1;

          return (
            <div key={category.category}>
              {hasMultipleItems ? (
                // Collapsible section for multiple items
                <>
                  <button
                    onClick={() => toggleSection(category.category)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {category.category}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-3 space-y-1 mt-2">
                      {category.items.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (item.path) {
                              navigate(item.path);
                              setSidebarOpen(false);
                            }
                          }}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            item.path && isActivePath(item.path)
                              ? "bg-purple-100 text-purple-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Single item - no collapsing needed
                <div>
                  <div className="px-3 py-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {category.category}
                    </span>
                  </div>
                  {category.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        if (item.path) {
                          navigate(item.path);
                          setSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        item.path && isActivePath(item.path)
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-3">
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {profile?.name}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {profile?.global_role?.replace("_", " ")}
            </div>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-lg border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex flex-col w-64 h-full bg-white shadow-xl">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 lg:ml-0 text-xl sm:text-2xl font-semibold text-gray-900">
                {isGlobalView
                  ? "Global Dashboard"
                  : `${currentSociety?.name || "Dashboard"}`}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
