import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Calendar,
  Clock,
  Phone,
  Home,
  Edit,
  Trash2,
  XCircle,
  AlertTriangle,
  Eye,
  UserCheck,
  UserX,
  Car,
} from "lucide-react";

interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  hostFlat: string;
  hostName: string;
  hostPhone: string;
  vehicleNumber?: string;
  entryTime: string;
  exitTime?: string;
  status: "checked-in" | "checked-out" | "denied" | "expired";
  approvalStatus: "pending" | "approved" | "rejected";
  securityNotes?: string;
  photo?: string;
  identityType: "aadhar" | "driving_license" | "passport" | "other";
  identityNumber: string;
  expectedDuration: string; // in hours
  isRecurring: boolean;
  category: "guest" | "delivery" | "service" | "contractor" | "other";
}

const VisitorLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [showAddVisitor, setShowAddVisitor] = useState(false);

  const [visitors] = useState<Visitor[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      purpose: "Family visit",
      hostFlat: "A-101",
      hostName: "Priya Sharma",
      hostPhone: "+91 98765 43211",
      vehicleNumber: "MH01AB1234",
      entryTime: "2024-07-14T14:30:00Z",
      exitTime: "2024-07-14T18:45:00Z",
      status: "checked-out",
      approvalStatus: "approved",
      securityNotes: "Verified ID, friendly visitor",
      photo:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      identityType: "aadhar",
      identityNumber: "1234-5678-9012",
      expectedDuration: "4",
      isRecurring: false,
      category: "guest",
    },
    {
      id: "2",
      name: "Amazon Delivery",
      phone: "+91 98765 43212",
      purpose: "Package delivery",
      hostFlat: "B-205",
      hostName: "Amit Patel",
      hostPhone: "+91 98765 43213",
      vehicleNumber: "MH02CD5678",
      entryTime: "2024-07-14T16:15:00Z",
      exitTime: "2024-07-14T16:25:00Z",
      status: "checked-out",
      approvalStatus: "approved",
      securityNotes: "Quick delivery, left package",
      identityType: "other",
      identityNumber: "DEL-123456",
      expectedDuration: "0.5",
      isRecurring: false,
      category: "delivery",
    },
    {
      id: "3",
      name: "Sneha Gupta",
      phone: "+91 98765 43214",
      purpose: "Birthday party",
      hostFlat: "C-302",
      hostName: "Vikram Singh",
      hostPhone: "+91 98765 43215",
      entryTime: "2024-07-14T19:00:00Z",
      status: "checked-in",
      approvalStatus: "approved",
      securityNotes: "Guest for birthday celebration",
      photo:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      identityType: "driving_license",
      identityNumber: "DL-987654321",
      expectedDuration: "5",
      isRecurring: false,
      category: "guest",
    },
    {
      id: "4",
      name: "AC Repair Service",
      phone: "+91 98765 43216",
      purpose: "AC maintenance",
      hostFlat: "A-405",
      hostName: "Meera Joshi",
      hostPhone: "+91 98765 43217",
      vehicleNumber: "MH03EF9012",
      entryTime: "2024-07-14T10:00:00Z",
      exitTime: "2024-07-14T12:30:00Z",
      status: "checked-out",
      approvalStatus: "approved",
      securityNotes: "Authorized service provider",
      identityType: "other",
      identityNumber: "SVC-789012",
      expectedDuration: "3",
      isRecurring: true,
      category: "service",
    },
    {
      id: "5",
      name: "Unknown Person",
      phone: "+91 98765 43218",
      purpose: "Delivery claim",
      hostFlat: "B-103",
      hostName: "Not verified",
      hostPhone: "",
      entryTime: "2024-07-14T13:00:00Z",
      status: "denied",
      approvalStatus: "rejected",
      securityNotes: "Could not verify identity, denied entry",
      identityType: "other",
      identityNumber: "N/A",
      expectedDuration: "1",
      isRecurring: false,
      category: "other",
    },
    {
      id: "6",
      name: "Painter Team",
      phone: "+91 98765 43219",
      purpose: "Wall painting work",
      hostFlat: "D-501",
      hostName: "Suresh Kumar",
      hostPhone: "+91 98765 43220",
      vehicleNumber: "MH04GH3456",
      entryTime: "2024-07-13T09:00:00Z",
      exitTime: "2024-07-13T17:00:00Z",
      status: "checked-out",
      approvalStatus: "approved",
      securityNotes: "Multi-day work project",
      identityType: "aadhar",
      identityNumber: "5678-9012-3456",
      expectedDuration: "8",
      isRecurring: true,
      category: "contractor",
    },
  ]);

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.includes(searchTerm) ||
      visitor.hostFlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || visitor.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || visitor.category === filterCategory;

    const matchesDate =
      !filterDate ||
      new Date(visitor.entryTime).toDateString() ===
        new Date(filterDate).toDateString();

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  const stats = {
    total: visitors.length,
    checkedIn: visitors.filter((v) => v.status === "checked-in").length,
    checkedOut: visitors.filter((v) => v.status === "checked-out").length,
    denied: visitors.filter((v) => v.status === "denied").length,
    today: visitors.filter((v) => {
      const today = new Date().toDateString();
      return new Date(v.entryTime).toDateString() === today;
    }).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "checked-out":
        return "bg-gray-100 text-gray-800";
      case "denied":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "guest":
        return "bg-blue-100 text-blue-800";
      case "delivery":
        return "bg-purple-100 text-purple-800";
      case "service":
        return "bg-orange-100 text-orange-800";
      case "contractor":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "checked-in":
        return <UserCheck className="h-4 w-4" />;
      case "checked-out":
        return <UserX className="h-4 w-4" />;
      case "denied":
        return <XCircle className="h-4 w-4" />;
      case "expired":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = (entryTime: string, exitTime?: string) => {
    const entry = new Date(entryTime);
    const exit = exitTime ? new Date(exitTime) : new Date();
    const diffInMinutes = Math.round(
      (exit.getTime() - entry.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitor Logs</h1>
          <p className="text-gray-600 mt-1">
            Track and manage visitor entries and exits
          </p>
        </div>
        <button
          onClick={() => setShowAddVisitor(true)}
          className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Visitor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Visitors
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Checked In</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.checkedIn}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Checked Out</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.checkedOut}
              </p>
            </div>
            <div className="bg-gray-500 p-3 rounded-lg">
              <UserX className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Denied</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.denied}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.today}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
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
              placeholder="Search visitors, hosts, flats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="denied">Denied</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="guest">Guest</option>
              <option value="delivery">Delivery</option>
              <option value="service">Service</option>
              <option value="contractor">Contractor</option>
              <option value="other">Other</option>
            </select>

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterCategory("all");
                setFilterDate("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Visitor Logs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Visitor
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Host Details
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Purpose & Vehicle
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Entry/Exit Time
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Status
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Duration
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVisitors
                .sort(
                  (a, b) =>
                    new Date(b.entryTime).getTime() -
                    new Date(a.entryTime).getTime()
                )
                .map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img
                          src={
                            visitor.photo ||
                            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
                          }
                          alt={visitor.name}
                          className="h-10 w-10 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {visitor.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {visitor.phone}
                          </div>
                          <div className="text-xs text-gray-400">
                            {visitor.identityType}: {visitor.identityNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Home className="h-4 w-4 mr-2 text-gray-400" />
                          {visitor.hostFlat}
                        </div>
                        <div className="text-sm text-gray-600">
                          {visitor.hostName}
                        </div>
                        {visitor.hostPhone && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {visitor.hostPhone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-900">
                          {visitor.purpose}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                              visitor.category
                            )}`}
                          >
                            {visitor.category}
                          </span>
                          {visitor.isRecurring && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              Recurring
                            </span>
                          )}
                        </div>
                        {visitor.vehicleNumber && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <Car className="h-3 w-3 mr-1" />
                            {visitor.vehicleNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDateTime(visitor.entryTime)}
                        </div>
                        {visitor.exitTime && (
                          <div className="text-sm text-gray-600 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDateTime(visitor.exitTime)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${getStatusColor(
                            visitor.status
                          )}`}
                        >
                          {getStatusIcon(visitor.status)}
                          <span className="ml-1">{visitor.status}</span>
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getApprovalColor(
                            visitor.approvalStatus
                          )}`}
                        >
                          {visitor.approvalStatus}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">
                        {calculateDuration(visitor.entryTime, visitor.exitTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Expected: {visitor.expectedDuration}h
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {visitor.status === "checked-in" && (
                          <button
                            className="p-2 text-blue-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            title="Check Out"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {filteredVisitors.length === 0 && (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No visitor logs found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions for Currently Checked-in Visitors */}
      {stats.checkedIn > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-green-900">
                {stats.checkedIn} visitor(s) currently checked in
              </h3>
              <p className="text-green-700 text-sm">
                Monitor active visitors in the society
              </p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
              Check Out All
            </button>
          </div>
        </div>
      )}

      {/* Add Visitor Modal would go here */}
      {showAddVisitor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowAddVisitor(false)}
            ></div>
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Visitor
              </h3>
              <p className="text-gray-600 mb-4">
                This would be a form to add new visitors
              </p>
              <button
                onClick={() => setShowAddVisitor(false)}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorLogs;
