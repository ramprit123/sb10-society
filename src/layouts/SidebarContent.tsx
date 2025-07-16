import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Building2,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavigationItem } from "./navigationItems";

interface SidebarContentProps {
  sidebarVisible: boolean;
  toggleSidebarPosition: () => void;
  setSidebarOpen: (open: boolean) => void;
  tenantDropdownOpen: boolean;
  setTenantDropdownOpen: (open: boolean) => void;
  isGlobalView: boolean;
  currentSociety: any;
  societies: any[];
  handleSocietySwitch: (societyId: string) => void;
  filteredNavigationItems: { category: string; items: NavigationItem[] }[];
  expandedSections: string[];
  toggleSection: (category: string) => void;
  isActivePath: (path: string) => boolean;
  profile: any;
  signOut: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  sidebarVisible,
  toggleSidebarPosition,
  setSidebarOpen,
  tenantDropdownOpen,
  setTenantDropdownOpen,
  isGlobalView,
  currentSociety,
  societies,
  handleSocietySwitch,
  filteredNavigationItems,
  expandedSections,
  toggleSection,
  isActivePath,
  profile,
  signOut,
}) => {
  const navigate = useNavigate();

  return (
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
};

export default SidebarContent;
