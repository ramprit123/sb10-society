import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  Building2,
  BarChart3,
  Users,
  CreditCard,
  FileText,
  TrendingUp,
  MessageSquare,
  Megaphone,
  Calendar,
  Shield,
  Eye,
  Lock,
  Settings,
  UserCog,
  Cog,
  LogOut,
  Building,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';

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
    'Overview',
  ]);
  const { user, logout } = useAuth();
  const { currentTenant, tenants, switchTenant, isGlobalView, setGlobalView } =
    useTenant();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: { category: string; items: NavigationItem[] }[] = [
    {
      category: 'Overview',
      items: [
        {
          name: 'Dashboard',
          icon: Home,
          path: isGlobalView ? '/' : `/tenant/${currentTenant?.id}/dashboard`,
        },
        {
          name: 'All Societies',
          icon: Building2,
          path: '/societies',
          globalOnly: true,
          roles: ['super_admin', 'admin'],
        },
        {
          name: 'Analytics',
          icon: BarChart3,
          path: '/analytics',
          globalOnly: true,
          roles: ['super_admin', 'admin', 'manager'],
        },
      ],
    },
    {
      category: 'Residents & Finance',
      items: [
        {
          name: 'Residents',
          icon: Users,
          path: `/tenant/${currentTenant?.id}/residents`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager', 'staff'],
        },
        {
          name: 'Maintenance & Bills',
          icon: CreditCard,
          path: `/tenant/${currentTenant?.id}/maintenance`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager'],
        },
        {
          name: 'Payments',
          icon: FileText,
          path: `/tenant/${currentTenant?.id}/payments`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager'],
        },
        {
          name: 'Financial Reports',
          icon: TrendingUp,
          path: `/tenant/${currentTenant?.id}/financial-reports`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager'],
        },
      ],
    },
    {
      category: 'Operations',
      items: [
        {
          name: 'Complaints',
          icon: MessageSquare,
          path: `/tenant/${currentTenant?.id}/complaints`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager', 'staff'],
        },
        {
          name: 'Facilities',
          icon: Building,
          path: `/tenant/${currentTenant?.id}/facilities`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager'],
        },
      ],
    },
    {
      category: 'Communication',
      items: [
        {
          name: 'Events & Notices',
          icon: Calendar,
          path: `/tenant/${currentTenant?.id}/events`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager'],
        },
        {
          name: 'Announcements',
          icon: Megaphone,
          path: `/tenant/${currentTenant?.id}/announcements`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager'],
        },
        {
          name: 'Meetings',
          icon: Users,
          path: `/tenant/${currentTenant?.id}/meetings`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager'],
        },
      ],
    },
    {
      category: 'Security',
      items: [
        {
          name: 'Security Guards',
          icon: Shield,
          path: `/tenant/${currentTenant?.id}/security`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager'],
        },
        {
          name: 'Visitor Logs',
          icon: Eye,
          path: `/tenant/${currentTenant?.id}/visitor-logs`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager', 'staff'],
        },
        {
          name: 'Access Control',
          icon: Lock,
          path: `/tenant/${currentTenant?.id}/access-control`,
          tenantOnly: true,
          roles: ['super_admin', 'admin', 'manager'],
        },
      ],
    },
    {
      category: 'Settings',
      items: [
        {
          name: 'Society Settings',
          icon: Settings,
          path: `/tenant/${currentTenant?.id}/settings`,
          tenantOnly: true,
          roles: ['super_admin', 'admin'],
        },
        {
          name: 'User Management',
          icon: UserCog,
          path: `/tenant/${currentTenant?.id}/user-management`,
          tenantOnly: true,
          roles: ['super_admin', 'admin'],
        },
        {
          name: 'System Settings',
          icon: Cog,
          path: `/tenant/${currentTenant?.id}/system-settings`,
          tenantOnly: true,
          roles: ['super_admin'],
        },
      ],
    },
  ];

  const handleTenantSwitch = (tenantId: string) => {
    if (tenantId === 'global') {
      setGlobalView(true);
      navigate('/');
    } else {
      switchTenant(tenantId);
      navigate(`/tenant/${tenantId}/dashboard`);
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
    return item.roles.includes(user?.role || '');
  };

  const filteredNavigationItems = navigationItems
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        // Check role permissions
        if (!hasPermission(item)) return false;

        // Check global/tenant context
        if (item.globalOnly && !isGlobalView) return false;
        if (item.tenantOnly && (isGlobalView || !currentTenant)) return false;

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
            SocietyHub
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
                    ? 'All Societies'
                    : currentTenant?.name || 'Select Society'}
                </div>
                <div className="text-xs text-gray-500">
                  {isGlobalView
                    ? `${tenants.length} societies`
                    : 'Current Society'}
                </div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {tenantDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              <button
                onClick={() => handleTenantSwitch('global')}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                  isGlobalView ? 'bg-purple-50 text-purple-700' : ''
                }`}
              >
                <div className="font-medium">All Societies</div>
                <div className="text-sm text-gray-500">Global Overview</div>
              </button>
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => handleTenantSwitch(tenant.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-t border-gray-100 ${
                    currentTenant?.id === tenant.id && !isGlobalView
                      ? 'bg-purple-50 text-purple-700'
                      : ''
                  }`}
                >
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-sm text-gray-500">
                    {tenant.totalUnits} units
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
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-700 hover:bg-gray-100'
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
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-700 hover:bg-gray-100'
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
          <img
            src={
              user?.avatar ||
              'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
            }
            alt="Profile"
            className="h-8 w-8 rounded-full"
          />
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {user?.role.replace('_', ' ')}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
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
          sidebarOpen ? 'block' : 'hidden'
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
                  ? 'Global Dashboard'
                  : `${currentTenant?.name || 'Dashboard'}`}
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
