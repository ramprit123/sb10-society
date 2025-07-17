import React, { useState } from "react";
import {
  Users,
  CreditCard,
  MessageSquare,
  Calendar,
  UserPlus,
  FileText,
  Megaphone,
  CalendarPlus,
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
} from "lucide-react";
import { useSocietyStore } from "@/stores/societyStore";
import AddResidentModal from "@/components/modals/AddResidentModal";
import GenerateBillModal from "@/components/modals/GenerateBillModal";
import CreateNoticeModal from "@/components/modals/CreateNoticeModal";
import ScheduleMeetingModal from "@/components/modals/ScheduleMeetingModal";

const Dashboard: React.FC = () => {
  const { currentSociety, societies, isGlobalView } = useSocietyStore();
  const [addResidentOpen, setAddResidentOpen] = useState(false);
  const [generateBillOpen, setGenerateBillOpen] = useState(false);
  const [createNoticeOpen, setCreateNoticeOpen] = useState(false);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);

  // Global statistics
  const globalStats = {
    totalSocieties: societies.length,
    totalUnits: societies.reduce((sum, tenant) => sum + tenant.totalUnits, 0),
    totalResidents: societies.reduce(
      (sum, tenant) => sum + tenant.totalResidents,
      0
    ),
    totalPendingDues: societies.reduce(
      (sum, tenant) => sum + tenant.pendingDues,
      0
    ),
  };

  const stats = isGlobalView
    ? [
        {
          title: "Total Societies",
          value: globalStats.totalSocieties,
          icon: Building2,
          color: "bg-blue-500",
          change: "+2 this month",
        },
        {
          title: "Total Units",
          value: globalStats.totalUnits.toLocaleString(),
          icon: Users,
          color: "bg-green-500",
          change: "+12 this month",
        },
        {
          title: "Total Residents",
          value: globalStats.totalResidents.toLocaleString(),
          icon: Users,
          color: "bg-purple-500",
          change: "+45 this month",
        },
        {
          title: "Pending Dues",
          value: `₹${globalStats.totalPendingDues.toLocaleString()}`,
          icon: DollarSign,
          color: "bg-orange-500",
          change: "-8% from last month",
        },
      ]
    : [
        {
          title: "Total Residents",
          value: currentSociety?.totalResidents.toLocaleString() || "0",
          icon: Users,
          color: "bg-blue-500",
          change: "+12 this month",
        },
        {
          title: "Pending Dues",
          value: `₹${currentSociety?.pendingDues.toLocaleString() || "0"}`,
          icon: CreditCard,
          color: "bg-green-500",
          change: "-5% from last month",
        },
        {
          title: "Active Complaints",
          value: "8",
          icon: MessageSquare,
          color: "bg-orange-500",
          change: "+2 this week",
        },
        {
          title: "Upcoming Events",
          value: "3",
          icon: Calendar,
          color: "bg-purple-500",
          change: "Next: Society Meeting",
        },
      ];

  const quickActions = [
    {
      title: "Add Resident",
      description: "Register new resident",
      icon: UserPlus,
      color: "bg-purple-600",
      onClick: () => setAddResidentOpen(true),
    },
    {
      title: "Generate Bill",
      description: "Create maintenance bill",
      icon: FileText,
      color: "bg-blue-600",
      onClick: () => setGenerateBillOpen(true),
    },
    {
      title: "Create Notice",
      description: "Send notice to residents",
      icon: Megaphone,
      color: "bg-green-600",
      onClick: () => setCreateNoticeOpen(true),
    },
    {
      title: "Schedule Meeting",
      description: "Organize society meeting",
      icon: CalendarPlus,
      color: "bg-orange-600",
      onClick: () => setScheduleMeetingOpen(true),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      date: "2024-02-10",
      activity: "New resident registered - Flat 304",
      status: "Completed",
      type: "success",
    },
    {
      id: 2,
      date: "2024-02-09",
      activity: "Maintenance bill generated",
      status: "Completed",
      type: "success",
    },
    {
      id: 3,
      date: "2024-02-09",
      activity: "Complaint: Water supply issue - Block B",
      status: "In Progress",
      type: "warning",
    },
    {
      id: 4,
      date: "2024-02-08",
      activity: "Society meeting scheduled",
      status: "Pending",
      type: "info",
    },
    {
      id: 5,
      date: "2024-02-08",
      activity: "Security guard shift updated",
      status: "Completed",
      type: "success",
    },
  ];

  const monthlyData = [
    { month: "Jan", amount: 85000 },
    { month: "Feb", amount: 92000 },
    { month: "Mar", amount: 78000 },
    { month: "Apr", amount: 95000 },
    { month: "May", amount: 88000 },
    { month: "Jun", amount: 98000 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isGlobalView ? "Global Dashboard" : `Welcome, Admin`}
          </h1>
          <p className="text-gray-600 mt-1">
            {isGlobalView
              ? `Managing ${societies.length} societies with ${globalStats.totalResidents} residents`
              : `Here's what's happening at ${
                  currentSociety?.name || "your society"
                } today.`}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {stat.change.includes("+") || stat.change.includes("-8%") ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      stat.change.includes("+") || stat.change.includes("-8%")
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions - Only show for tenant-specific view */}
      {!isGlobalView && currentSociety && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  className={`${action.color} p-3 rounded-lg mb-3 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 text-center">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 text-center mt-1">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Collection Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {isGlobalView
              ? "Global Revenue Overview"
              : "Monthly Collection Overview"}
          </h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-purple-500 rounded-t w-full transition-all duration-300 hover:bg-purple-600"
                  style={{
                    height: `${
                      (data.amount /
                        Math.max(...monthlyData.map((d) => d.amount))) *
                      200
                    }px`,
                  }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.activity}
                  </p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activity.type === "success"
                      ? "bg-green-100 text-green-800"
                      : activity.type === "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddResidentModal
        isOpen={addResidentOpen}
        onClose={() => setAddResidentOpen(false)}
      />
      <GenerateBillModal
        isOpen={generateBillOpen}
        onClose={() => setGenerateBillOpen(false)}
      />
      <CreateNoticeModal
        isOpen={createNoticeOpen}
        onClose={() => setCreateNoticeOpen(false)}
      />
      <ScheduleMeetingModal
        isOpen={scheduleMeetingOpen}
        onClose={() => setScheduleMeetingOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
