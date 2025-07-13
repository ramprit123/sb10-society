import React, { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  Megaphone,
  Bell,
  Star,
  CheckCircle,
} from "lucide-react";
import CreateNoticeModal from "../components/modals/CreateNoticeModal";
import ScheduleMeetingModal from "../components/modals/ScheduleMeetingModal";

interface Event {
  id: string;
  title: string;
  description: string;
  type: "meeting" | "celebration" | "maintenance" | "emergency" | "social";
  date: string;
  time: string;
  location: string;
  organizer: string;
  maxAttendees?: number;
  currentAttendees: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  isPublic: boolean;
  rsvpRequired: boolean;
}

interface Notice {
  id: string;
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

const EventsNotices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"events" | "notices">("events");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [createNoticeOpen, setCreateNoticeOpen] = useState(false);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);

  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Monthly Society Meeting",
      description:
        "Discussion on upcoming maintenance work and budget allocation for next quarter.",
      type: "meeting",
      date: "2024-02-25",
      time: "18:00",
      location: "Community Hall",
      organizer: "Society Committee",
      maxAttendees: 100,
      currentAttendees: 45,
      status: "upcoming",
      isPublic: true,
      rsvpRequired: true,
    },
    {
      id: "2",
      title: "Holi Celebration",
      description:
        "Join us for a colorful Holi celebration with music, dance, and traditional sweets.",
      type: "celebration",
      date: "2024-03-08",
      time: "16:00",
      location: "Garden Area",
      organizer: "Cultural Committee",
      maxAttendees: 200,
      currentAttendees: 78,
      status: "upcoming",
      isPublic: true,
      rsvpRequired: false,
    },
    {
      id: "3",
      title: "Elevator Maintenance",
      description:
        "Scheduled maintenance for all elevators. Please use stairs during this time.",
      type: "maintenance",
      date: "2024-02-20",
      time: "09:00",
      location: "All Blocks",
      organizer: "Maintenance Team",
      currentAttendees: 0,
      status: "completed",
      isPublic: true,
      rsvpRequired: false,
    },
    {
      id: "4",
      title: "Fire Safety Drill",
      description:
        "Mandatory fire safety drill for all residents. Please participate for your safety.",
      type: "emergency",
      date: "2024-02-28",
      time: "10:00",
      location: "All Blocks",
      organizer: "Safety Committee",
      currentAttendees: 0,
      status: "upcoming",
      isPublic: true,
      rsvpRequired: false,
    },
    {
      id: "5",
      title: "Yoga Classes",
      description: "Weekly yoga sessions for residents. Bring your own mat.",
      type: "social",
      date: "2024-02-18",
      time: "07:00",
      location: "Rooftop Garden",
      organizer: "Wellness Committee",
      maxAttendees: 20,
      currentAttendees: 15,
      status: "ongoing",
      isPublic: true,
      rsvpRequired: true,
    },
  ]);

  const [notices] = useState<Notice[]>([
    {
      id: "1",
      title: "Water Supply Interruption",
      content:
        "Water supply will be interrupted on February 20th from 10 AM to 2 PM due to tank cleaning. Please store water in advance.",
      priority: "high",
      category: "maintenance",
      publishedDate: "2024-02-15",
      expiryDate: "2024-02-21",
      publishedBy: "Maintenance Team",
      targetAudience: "all",
      isActive: true,
      views: 156,
    },
    {
      id: "2",
      title: "New Parking Rules",
      content:
        "New parking guidelines are now in effect. Visitor parking is limited to 2 hours. Please ensure your guests follow the new rules.",
      priority: "normal",
      category: "general",
      publishedDate: "2024-02-10",
      publishedBy: "Society Committee",
      targetAudience: "all",
      isActive: true,
      views: 203,
    },
    {
      id: "3",
      title: "Maintenance Fee Due",
      content:
        "Monthly maintenance fees for February are now due. Please pay by February 25th to avoid late fees.",
      priority: "urgent",
      category: "billing",
      publishedDate: "2024-02-01",
      expiryDate: "2024-02-25",
      publishedBy: "Accounts Department",
      targetAudience: "all",
      isActive: true,
      views: 298,
    },
    {
      id: "4",
      title: "Security Alert",
      content:
        "Please be vigilant and report any suspicious activities. Do not allow unknown persons into the building.",
      priority: "high",
      category: "emergency",
      publishedDate: "2024-02-12",
      publishedBy: "Security Team",
      targetAudience: "all",
      isActive: true,
      views: 187,
    },
    {
      id: "5",
      title: "Gym Equipment Upgrade",
      content:
        "New fitness equipment has been installed in the gym. Please read the usage instructions before using.",
      priority: "normal",
      category: "general",
      publishedDate: "2024-02-08",
      publishedBy: "Amenities Committee",
      targetAudience: "all",
      isActive: true,
      views: 142,
    },
  ]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || event.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && notice.isActive) ||
      (filterStatus === "expired" && !notice.isActive);

    return matchesSearch && matchesStatus;
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800";
      case "celebration":
        return "bg-purple-100 text-purple-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      case "social":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => e.status === "upcoming").length,
    activeNotices: notices.filter((n) => n.isActive).length,
    totalViews: notices.reduce((sum, notice) => sum + notice.views, 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events & Notices</h1>
          <p className="text-gray-600 mt-1">
            Manage society events and announcements
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setCreateNoticeOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Megaphone className="h-5 w-5 mr-2" />
            Create Notice
          </button>
          <button
            onClick={() => setScheduleMeetingOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Event
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalEvents}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {stats.upcomingEvents}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Notices
              </p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {stats.activeNotices}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {stats.totalViews}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("events")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("notices")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "notices"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Notices
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {activeTab === "events" ? (
                <>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </>
              )}
            </select>
          </div>

          {/* Content */}
          {activeTab === "events" ? (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {event.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(
                              event.type
                            )}`}
                          >
                            {event.type}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getEventStatusColor(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {event.currentAttendees}
                            {event.maxAttendees && `/${event.maxAttendees}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Organized by:{" "}
                          <span className="font-medium text-gray-900">
                            {event.organizer}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {event.rsvpRequired && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              RSVP Required
                            </span>
                          )}
                          {event.isPublic && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Eye className="h-4 w-4" />
                      </button>
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
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {notice.title}
                          </h3>
                          <p className="text-gray-600 mb-3">{notice.content}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                              notice.priority
                            )}`}
                          >
                            {notice.priority}
                          </span>
                          {notice.isActive ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              Expired
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            Published:{" "}
                            {new Date(
                              notice.publishedDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {notice.expiryDate && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                              Expires:{" "}
                              {new Date(notice.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{notice.targetAudience}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Eye className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{notice.views} views</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Published by:{" "}
                          <span className="font-medium text-gray-900">
                            {notice.publishedBy}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {notice.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Eye className="h-4 w-4" />
                      </button>
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
            </div>
          )}
        </div>
      </div>

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

export default EventsNotices;
