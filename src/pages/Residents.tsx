import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Phone,
  Mail,
  Home,
  User,
  Calendar,
  Car,
  MoreVertical,
} from "lucide-react";
import AddResidentModal from "../components/modals/AddResidentModal";

interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  flatNumber: string;
  moveInDate: string;
  status: "active" | "inactive" | "pending";
  type: "owner" | "tenant";
  emergencyContact: string;
  vehicleNumber?: string;
  avatar?: string;
}

const Residents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [addResidentOpen, setAddResidentOpen] = useState(false);

  const [residents] = useState<Resident[]>([
    {
      id: "1",
      firstName: "Rajesh",
      lastName: "Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
      flatNumber: "A-101",
      moveInDate: "2023-01-15",
      status: "active",
      type: "owner",
      emergencyContact: "+91 98765 43211",
      vehicleNumber: "MH01AB1234",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "2",
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 98765 43212",
      flatNumber: "B-205",
      moveInDate: "2023-03-20",
      status: "active",
      type: "tenant",
      emergencyContact: "+91 98765 43213",
      vehicleNumber: "MH01CD5678",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "3",
      firstName: "Amit",
      lastName: "Patel",
      email: "amit.patel@email.com",
      phone: "+91 98765 43214",
      flatNumber: "C-302",
      moveInDate: "2022-11-10",
      status: "active",
      type: "owner",
      emergencyContact: "+91 98765 43215",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "4",
      firstName: "Sneha",
      lastName: "Gupta",
      email: "sneha.gupta@email.com",
      phone: "+91 98765 43216",
      flatNumber: "A-405",
      moveInDate: "2024-01-05",
      status: "pending",
      type: "tenant",
      emergencyContact: "+91 98765 43217",
      vehicleNumber: "MH01EF9012",
    },
    {
      id: "5",
      firstName: "Vikram",
      lastName: "Singh",
      email: "vikram.singh@email.com",
      phone: "+91 98765 43218",
      flatNumber: "B-103",
      moveInDate: "2023-08-15",
      status: "inactive",
      type: "owner",
      emergencyContact: "+91 98765 43219",
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
  ]);

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch =
      resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.flatNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || resident.status === filterStatus;
    const matchesType = filterType === "all" || resident.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: residents.length,
    active: residents.filter((r) => r.status === "active").length,
    owners: residents.filter((r) => r.type === "owner").length,
    tenants: residents.filter((r) => r.type === "tenant").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Residents Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all residents in your society
          </p>
        </div>
        <button
          onClick={() => setAddResidentOpen(true)}
          className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Resident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Residents
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.active}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Owners</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.owners}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tenants</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.tenants}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search residents..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="owner">Owners</option>
              <option value="tenant">Tenants</option>
            </select>
          </div>
        </div>
      </div>

      {/* Residents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Resident
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Contact
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Flat
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Status
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Move-in Date
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResidents.map((resident) => (
                <tr key={resident.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <img
                        src={
                          resident.avatar ||
                          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
                        }
                        alt={`${resident.firstName} ${resident.lastName}`}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {resident.firstName} {resident.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resident.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {resident.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {resident.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{resident.flatNumber}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        resident.type === "owner"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {resident.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        resident.status === "active"
                          ? "bg-green-100 text-green-800"
                          : resident.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {resident.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(resident.moveInDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddResidentModal
        isOpen={addResidentOpen}
        onClose={() => setAddResidentOpen(false)}
      />
    </div>
  );
};

export default Residents;
