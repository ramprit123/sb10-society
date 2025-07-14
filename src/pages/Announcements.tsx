import React, { useState } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Calendar,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Clock,
  Pin,
} from "lucide-react";
import CreateNoticeModal from "@/components/modals/CreateNoticeModal";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  category: "general" | "maintenance" | "event" | "emergency" | "billing";
  author: string;
  createdAt: string;
  expiryDate?: string;
  isPinned: boolean;
  views: number;
  targetAudience: "all" | "owners" | "tenants" | "specific";
  status: "active" | "expired" | "draft";
}

const Announcements: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [createNoticeOpen, setCreateNoticeOpen] = useState(false);

  const [announcements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Water Supply Maintenance",
      content:
        "Water supply will be temporarily suspended on Sunday, July 20th from 8:00 AM to 2:00 PM for routine maintenance of the overhead tank. Please store water accordingly.",
      priority: "high",
      category: "maintenance",
      author: "Society Management",
      createdAt: "2024-07-14T10:30:00Z",
      expiryDate: "2024-07-21T00:00:00Z",
      isPinned: true,
      views: 156,
      targetAudience: "all",
      status: "active",
    },
    {
      id: "2",
      title: "Annual General Meeting",
      content:
        "The Annual General Meeting is scheduled for July 28th, 2024 at 6:00 PM in the community hall. All residents are requested to attend. Agenda includes budget discussion, new projects approval, and committee elections.",
      priority: "urgent",
      category: "event",
      author: "Society Secretary",
      createdAt: "2024-07-12T15:45:00Z",
      expiryDate: "2024-07-28T18:00:00Z",
      isPinned: true,
      views: 243,
      targetAudience: "all",
      status: "active",
    },
    {
      id: "3",
      title: "Parking Rules Update",
      content:
        "New parking guidelines are now in effect. Visitor parking is limited to 2 hours. Any vehicle parked beyond this time will be towed at owner's expense. Please inform your guests accordingly.",
      priority: "normal",
      category: "general",
      author: "Security Team",
      createdAt: "2024-07-10T09:15:00Z",
      isPinned: false,
      views: 89,
      targetAudience: "all",
      status: "active",
    },
    {
      id: "4",
      title: "Maintenance Charges Due",
      content:
        "Monthly maintenance charges for July 2024 are due by July 31st. Late payment charges of 2% per month will be applicable after the due date. Please pay via the society app or bank transfer.",
      priority: "normal",
      category: "billing",
      author: "Accounts Department",
      createdAt: "2024-07-08T14:20:00Z",
      expiryDate: "2024-07-31T23:59:00Z",
      isPinned: false,
      views: 178,
      targetAudience: "all",
      status: "active",
    },
    {
      id: "5",
      title: "Lift Maintenance Completed",
      content:
        "Annual maintenance of all lifts has been completed successfully. All lifts are now operational and safe for use. Report any issues immediately to the maintenance team.",
      priority: "low",
      category: "maintenance",
      author: "Maintenance Team",
      createdAt: "2024-07-05T11:30:00Z",
      isPinned: false,
      views: 67,
      targetAudience: "all",
      status: "active",
    },
  ]);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      filterPriority === "all" || announcement.priority === filterPriority;
    const matchesCategory =
      filterCategory === "all" || announcement.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || announcement.status === filterStatus;

    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });

  const stats = {
    total: announcements.length,
    active: announcements.filter((a) => a.status === "active").length,
    pinned: announcements.filter((a) => a.isPinned).length,
    urgent: announcements.filter((a) => a.priority === "urgent").length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "event":
        return "bg-purple-100 text-purple-800";
      case "billing":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffDays = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 3 && diffDays > 0;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with society announcements and notices
          </p>
        </div>
        <button
          onClick={() => setCreateNoticeOpen(true)}
          className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Notice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notices</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Megaphone className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.active}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pinned</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.pinned}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Pin className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.urgent}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="maintenance">Maintenance</option>
              <option value="event">Event</option>
              <option value="emergency">Emergency</option>
              <option value="billing">Billing</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements
          .sort((a, b) => {
            // Sort by pinned first, then by priority, then by date
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;

            const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
            const priorityDiff =
              priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDiff !== 0) return priorityDiff;

            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow ${
                announcement.isPinned ? "ring-2 ring-purple-200" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    {announcement.isPinned && (
                      <Pin className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {announcement.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            announcement.priority
                          )}`}
                        >
                          {announcement.priority}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                            announcement.category
                          )}`}
                        >
                          {announcement.category}
                        </span>
                        {isExpiringSoon(announcement.expiryDate) && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Expiring Soon
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
                        {announcement.content}
                      </p>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                        <span>By {announcement.author}</span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(announcement.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {announcement.views} views
                        </span>
                        {announcement.expiryDate && (
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Expires: {formatDate(announcement.expiryDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0 sm:ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

        {filteredAnnouncements.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No announcements found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      <CreateNoticeModal
        isOpen={createNoticeOpen}
        onClose={() => setCreateNoticeOpen(false)}
      />
    </div>
  );
};

export default Announcements;
