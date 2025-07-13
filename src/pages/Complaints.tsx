import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Tag,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  submittedBy: string;
  flatNumber: string;
  submittedDate: string;
  assignedTo?: string;
  resolvedDate?: string;
  response?: string;
}

const Complaints: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const [complaints] = useState<Complaint[]>([
    {
      id: "1",
      title: "Water leakage in bathroom",
      description:
        "There is a continuous water leakage from the bathroom ceiling. It has been going on for 3 days now.",
      category: "Plumbing",
      priority: "high",
      status: "in_progress",
      submittedBy: "Rajesh Kumar",
      flatNumber: "A-101",
      submittedDate: "2024-02-10",
      assignedTo: "Maintenance Team",
    },
    {
      id: "2",
      title: "Elevator not working",
      description:
        "The elevator in Block B has been out of order since yesterday. Residents are facing difficulty.",
      category: "Maintenance",
      priority: "urgent",
      status: "open",
      submittedBy: "Priya Sharma",
      flatNumber: "B-205",
      submittedDate: "2024-02-12",
    },
    {
      id: "3",
      title: "Noise complaint from neighbor",
      description:
        "Loud music and noise from the flat above during night hours. This has been happening regularly.",
      category: "Noise",
      priority: "medium",
      status: "resolved",
      submittedBy: "Amit Patel",
      flatNumber: "C-302",
      submittedDate: "2024-02-08",
      assignedTo: "Security Team",
      resolvedDate: "2024-02-11",
      response:
        "Spoke with the resident. They have agreed to keep noise levels down after 10 PM.",
    },
    {
      id: "4",
      title: "Parking space occupied",
      description:
        "Someone has been parking in my designated parking spot for the past week.",
      category: "Parking",
      priority: "medium",
      status: "in_progress",
      submittedBy: "Sneha Gupta",
      flatNumber: "A-405",
      submittedDate: "2024-02-09",
      assignedTo: "Security Team",
    },
    {
      id: "5",
      title: "Garbage not collected",
      description:
        "Garbage has not been collected from our floor for 2 days. It is creating hygiene issues.",
      category: "Sanitation",
      priority: "high",
      status: "resolved",
      submittedBy: "Vikram Singh",
      flatNumber: "B-103",
      submittedDate: "2024-02-07",
      assignedTo: "Housekeeping",
      resolvedDate: "2024-02-08",
      response: "Garbage collection schedule has been updated. Issue resolved.",
    },
  ]);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.flatNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || complaint.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || complaint.priority === filterPriority;
    const matchesCategory =
      filterCategory === "all" ||
      complaint.category.toLowerCase().includes(filterCategory.toLowerCase());

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Complaints Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage resident complaints
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          New Complaint
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Complaints
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {stats.open}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {stats.inProgress}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {stats.resolved}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="plumbing">Plumbing</option>
              <option value="maintenance">Maintenance</option>
              <option value="noise">Noise</option>
              <option value="parking">Parking</option>
              <option value="sanitation">Sanitation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {complaint.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {complaint.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority}
                    </span>
                    <div className="flex items-center">
                      {getStatusIcon(complaint.status)}
                      <span
                        className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        {complaint.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      {complaint.submittedBy} ({complaint.flatNumber})
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      Submitted:{" "}
                      {new Date(complaint.submittedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{complaint.category}</span>
                  </div>
                </div>

                {complaint.assignedTo && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">
                      Assigned to:{" "}
                      <span className="font-medium text-gray-900">
                        {complaint.assignedTo}
                      </span>
                    </span>
                  </div>
                )}

                {complaint.response && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-green-800">
                      <strong>Response:</strong> {complaint.response}
                    </p>
                    {complaint.resolvedDate && (
                      <p className="text-xs text-green-600 mt-1">
                        Resolved on:{" "}
                        {new Date(complaint.resolvedDate).toLocaleDateString()}
                      </p>
                    )}
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
    </div>
  );
};

export default Complaints;
