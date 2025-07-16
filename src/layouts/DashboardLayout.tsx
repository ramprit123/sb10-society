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
  HelpCircle,
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
  Vote,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useSocietyStore } from "../stores/societyStore";
import { TenantProvider } from "@/contexts/TenantContext";
import ChatbotToggle from "@/components/ChatbotToggle";

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
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarVisible");
    return saved !== null ? JSON.parse(saved) : true;
  });
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle mobile sidebar with Ctrl/Cmd + B
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        setSidebarOpen((prev) => !prev);
      }

      // Toggle desktop sidebar visibility with Ctrl/Cmd + Shift + B
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "B"
      ) {
        event.preventDefault();
        toggleSidebarPosition();
      }

      // Close mobile sidebar with Escape
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, sidebarVisible]);

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

  const toggleSidebarPosition = () => {
    const newVisibility = !sidebarVisible;
    setSidebarVisible(newVisibility);
    localStorage.setItem("sidebarVisible", JSON.stringify(newVisibility));
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
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-200">
        <div className="flex items-center min-w-0">
          <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
          <span className="ml-2 text-base sm:text-xl font-bold text-gray-900 truncate">
            Society Connect
          </span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Desktop sidebar toggle */}
          <button
            onClick={toggleSidebarPosition}
            className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            title={`${sidebarVisible ? "Hide" : "Show"} sidebar (⌘+Shift+B)`}
            aria-label={`${sidebarVisible ? "Hide" : "Show"} sidebar`}
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Mobile sidebar close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* Tenant Selector */}
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <div className="relative">
          <button
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center min-w-0">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2 sm:mr-3 flex-shrink-0" />
              <div className="text-left min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {isGlobalView
                    ? "All Societies"
                    : currentSociety?.name || "Select Society"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {isGlobalView
                    ? `${societies.length} societies`
                    : "Current Society"}
                </div>
              </div>
            </div>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
          </button>

          {tenantDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 sm:max-h-64 overflow-y-auto">
              <button
                onClick={() => handleSocietySwitch("global")}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 ${
                  isGlobalView ? "bg-purple-50 text-purple-700" : ""
                }`}
              >
                <div className="font-medium text-sm sm:text-base">
                  All Societies
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Global Overview
                </div>
              </button>
              {societies.map((society) => (
                <button
                  key={society.id}
                  onClick={() => handleSocietySwitch(society.id)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 border-t border-gray-100 ${
                    currentSociety?.id === society.id && !isGlobalView
                      ? "bg-purple-50 text-purple-700"
                      : ""
                  }`}
                >
                  <div className="font-medium text-sm sm:text-base truncate">
                    {society.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {society.totalUnits} units
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 sm:px-4 py-3 sm:py-4 space-y-1 sm:space-y-2 overflow-y-auto">
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
                    className="w-full flex items-center justify-between px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {category.category}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-2 sm:ml-3 space-y-1 mt-1 sm:mt-2">
                      {category.items.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (item.path) {
                              navigate(item.path);
                              setSidebarOpen(false);
                            }
                          }}
                          className={`w-full flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            item.path && isActivePath(item.path)
                              ? "bg-purple-100 text-purple-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Single item - no collapsing needed
                <div>
                  <div className="px-2 sm:px-3 py-2">
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
                      className={`w-full flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        item.path && isActivePath(item.path)
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="flex items-center mb-2 sm:mb-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm sm:text-base font-medium text-purple-600">
              {profile?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {profile?.name || "User"}
            </div>
            <div className="text-xs text-gray-500 capitalize truncate">
              {profile?.global_role?.replace("_", " ") || "Member"}
            </div>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {sidebarVisible && (
        <div className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:fixed lg:inset-y-0 bg-white shadow-lg border-r border-gray-200 lg:left-0 z-30">
          <SidebarContent />
        </div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex flex-col w-64 sm:w-72 md:w-80 h-full bg-white shadow-xl transform transition-transform">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarVisible ? "lg:ml-64 xl:ml-72" : "lg:ml-0"
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center min-w-0 flex-1">
              {/* Mobile hamburger menu */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2 flex-shrink-0 transition-colors"
                title="Open sidebar"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Desktop hamburger menu (when sidebar is hidden) */}
              {!sidebarVisible && (
                <button
                  onClick={toggleSidebarPosition}
                  className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2 flex-shrink-0 transition-colors"
                  title="Show sidebar (⌘+Shift+B)"
                  aria-label="Show sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}

              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                {isGlobalView
                  ? "Global Dashboard"
                  : `${currentSociety?.name || "Dashboard"}`}
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-32 sm:w-48 md:w-64 lg:w-48 xl:w-64 transition-all duration-200"
                />
              </div>

              {/* Mobile search button */}
              <button
                className="sm:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => {
                  // You can implement a mobile search modal here
                  console.log("Open mobile search");
                }}
                title="Search"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Notification bell */}
              <button
                className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <TenantProvider>
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
          <ChatbotToggle />
        </TenantProvider>
      </div>
    </div>
  );
};

export default DashboardLayout;
