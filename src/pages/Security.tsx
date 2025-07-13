import React, { useState } from "react";
import {
  Plus,
  Search,
  Shield,
  Clock,
  User,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  Users,
  Camera,
} from "lucide-react";

interface SecurityGuard {
  id: string;
  name: string;
  phone: string;
  email: string;
  shift: "morning" | "evening" | "night";
  location: string;
  status: "on_duty" | "off_duty" | "on_leave";
  joinDate: string;
  emergencyContact: string;
  licenseNumber: string;
  avatar?: string;
}

interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  type: "theft" | "vandalism" | "suspicious_activity" | "emergency" | "other";
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  reportedBy: string;
  reportedDate: string;
  status: "open" | "investigating" | "resolved" | "closed";
  assignedTo?: string;
  resolution?: string;
}

const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "guards" | "incidents" | "schedule"
  >("guards");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [guards] = useState<SecurityGuard[]>([
    {
      id: "1",
      name: "Ramesh Sharma",
      phone: "+91 98765 43220",
      email: "ramesh.sharma@security.com",
      shift: "morning",
      location: "Main Gate",
      status: "on_duty",
      joinDate: "2023-01-15",
      emergencyContact: "+91 98765 43221",
      licenseNumber: "SEC001234",
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "2",
      name: "Suresh Kumar",
      phone: "+91 98765 43222",
      email: "suresh.kumar@security.com",
      shift: "evening",
      location: "Parking Area",
      status: "on_duty",
      joinDate: "2023-03-20",
      emergencyContact: "+91 98765 43223",
      licenseNumber: "SEC001235",
    },
    {
      id: "3",
      name: "Mahesh Singh",
      phone: "+91 98765 43224",
      email: "mahesh.singh@security.com",
      shift: "night",
      location: "Patrol",
      status: "off_duty",
      joinDate: "2022-11-10",
      emergencyContact: "+91 98765 43225",
      licenseNumber: "SEC001236",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "4",
      name: "Rajesh Gupta",
      phone: "+91 98765 43226",
      email: "rajesh.gupta@security.com",
      shift: "morning",
      location: "Back Gate",
      status: "on_leave",
      joinDate: "2023-06-01",
      emergencyContact: "+91 98765 43227",
      licenseNumber: "SEC001237",
    },
  ]);

  const [incidents] = useState<SecurityIncident[]>([
    {
      id: "1",
      title: "Suspicious person near parking",
      description:
        "Unknown person seen loitering around the parking area for extended period",
      type: "suspicious_activity",
      severity: "medium",
      location: "Parking Area, Block B",
      reportedBy: "Ramesh Sharma (Security)",
      reportedDate: "2024-02-12",
      status: "investigating",
      assignedTo: "Security Team Lead",
    },
    {
      id: "2",
      title: "Bicycle theft reported",
      description: "Resident reported bicycle stolen from parking area",
      type: "theft",
      severity: "high",
      location: "Bicycle Parking, Block A",
      reportedBy: "Priya Sharma (A-205)",
      reportedDate: "2024-02-10",
      status: "open",
      assignedTo: "Local Police",
    },
    {
      id: "3",
      title: "Vandalism in garden area",
      description: "Plants damaged and garden furniture overturned",
      type: "vandalism",
      severity: "medium",
      location: "Garden Area",
      reportedBy: "Maintenance Staff",
      reportedDate: "2024-02-08",
      status: "resolved",
      assignedTo: "Security Team",
      resolution:
        "CCTV footage reviewed. Incident was caused by strong winds during storm.",
    },
    {
      id: "4",
      title: "Medical emergency",
      description: "Elderly resident fell in lobby area",
      type: "emergency",
      severity: "critical",
      location: "Lobby, Block C",
      reportedBy: "Suresh Kumar (Security)",
      reportedDate: "2024-02-05",
      status: "closed",
      assignedTo: "Emergency Services",
      resolution:
        "Ambulance called. Resident taken to hospital and recovered fully.",
    },
  ]);

  const filteredGuards = guards.filter((guard) => {
    const matchesSearch =
      guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guard.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guard.shift.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || guard.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || incident.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_duty":
        return "bg-green-100 text-green-800";
      case "off_duty":
        return "bg-gray-100 text-gray-800";
      case "on_leave":
        return "bg-yellow-100 text-yellow-800";
      case "open":
        return "bg-red-100 text-red-800";
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "morning":
        return "bg-yellow-100 text-yellow-800";
      case "evening":
        return "bg-orange-100 text-orange-800";
      case "night":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    totalGuards: guards.length,
    onDuty: guards.filter((g) => g.status === "on_duty").length,
    openIncidents: incidents.filter(
      (i) => i.status === "open" || i.status === "investigating"
    ).length,
    resolvedIncidents: incidents.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Security Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage security guards and incidents
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Guard
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Guards</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalGuards}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Duty</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {stats.onDuty}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Open Incidents
              </p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                {stats.openIncidents}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {stats.resolvedIncidents}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("guards")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "guards"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Security Guards
            </button>
            <button
              onClick={() => setActiveTab("incidents")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "incidents"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Security Incidents
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "schedule"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Duty Schedule
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
              {activeTab === "guards" ? (
                <>
                  <option value="on_duty">On Duty</option>
                  <option value="off_duty">Off Duty</option>
                  <option value="on_leave">On Leave</option>
                </>
              ) : (
                <>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </>
              )}
            </select>
          </div>

          {/* Content */}
          {activeTab === "guards" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredGuards.map((guard) => (
                <div
                  key={guard.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={
                          guard.avatar ||
                          "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150"
                        }
                        alt={guard.name}
                        className="h-12 w-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {guard.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          License: {guard.licenseNumber}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        guard.status
                      )}`}
                    >
                      {guard.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{guard.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{guard.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getShiftColor(
                          guard.shift
                        )}`}
                      >
                        {guard.shift} shift
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        Since {new Date(guard.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Emergency: {guard.emergencyContact}
                    </div>
                    <div className="flex items-center space-x-2">
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
          ) : activeTab === "incidents" ? (
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {incident.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {incident.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                              incident.severity
                            )}`}
                          >
                            {incident.severity}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              incident.status
                            )}`}
                          >
                            {incident.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{incident.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{incident.reportedBy}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {new Date(
                              incident.reportedDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {incident.assignedTo && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-600">
                            Assigned to:{" "}
                            <span className="font-medium text-gray-900">
                              {incident.assignedTo}
                            </span>
                          </span>
                        </div>
                      )}

                      {incident.resolution && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-green-800">
                            <strong>Resolution:</strong> {incident.resolution}
                          </p>
                        </div>
                      )}
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
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Duty Schedule
              </h3>
              <p className="text-gray-500 mb-4">
                Security guard duty schedule and shift management
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Manage Schedule
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Security;
