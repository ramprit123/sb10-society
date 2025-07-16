import { Bell, Menu, Search } from "lucide-react";
import React, { useEffect, useState, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useSocietyStore } from "../stores/societyStore";
import { TenantProvider } from "@/contexts/TenantContext";
import { getNavigationItems, NavigationItem } from "./navigationItems";
import SidebarContent from "./SidebarContent";

// Lazy load the ChatbotToggle component
const ChatbotToggle = React.lazy(() => import("@/components/ChatbotToggle"));

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

  const navigationItems = getNavigationItems(isGlobalView, currentSociety);

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {sidebarVisible && (
        <div className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:fixed lg:inset-y-0 bg-white shadow-lg border-r border-gray-200 lg:left-0 z-30">
          <SidebarContent
            sidebarVisible={sidebarVisible}
            toggleSidebarPosition={toggleSidebarPosition}
            setSidebarOpen={setSidebarOpen}
            tenantDropdownOpen={tenantDropdownOpen}
            setTenantDropdownOpen={setTenantDropdownOpen}
            isGlobalView={isGlobalView}
            currentSociety={currentSociety}
            societies={societies}
            handleSocietySwitch={handleSocietySwitch}
            filteredNavigationItems={filteredNavigationItems}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            isActivePath={isActivePath}
            profile={profile}
            signOut={signOut}
          />
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
          <SidebarContent
            sidebarVisible={sidebarVisible}
            toggleSidebarPosition={toggleSidebarPosition}
            setSidebarOpen={setSidebarOpen}
            tenantDropdownOpen={tenantDropdownOpen}
            setTenantDropdownOpen={setTenantDropdownOpen}
            isGlobalView={isGlobalView}
            currentSociety={currentSociety}
            societies={societies}
            handleSocietySwitch={handleSocietySwitch}
            filteredNavigationItems={filteredNavigationItems}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            isActivePath={isActivePath}
            profile={profile}
            signOut={signOut}
          />
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
          <Suspense fallback={null}>
            <ChatbotToggle />
          </Suspense>
        </TenantProvider>
      </div>
    </div>
  );
};

export default DashboardLayout;
