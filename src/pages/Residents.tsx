import {
  Calendar,
  Car,
  Edit,
  Home,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import React, { useState } from "react";
import AddResidentModal from "@/components/modals/AddResidentModal";
import EditResidentModal from "@/components/modals/EditResidentModal";
import VehicleManagement from "@/components/VehicleManagement";
import { useResidents, useDeleteResident } from "@/services/residentsService";
import { useTenant } from "@/contexts/TenantContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Residents: React.FC = () => {
  const { currentTenant } = useTenant();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [addResidentOpen, setAddResidentOpen] = useState(false);
  const [editResidentOpen, setEditResidentOpen] = useState(false);
  const [vehicleManagementOpen, setVehicleManagementOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  // Default to first society if no tenant is selected
  const societyId = currentTenant?.id || "society-1";

  // Use React Query to fetch residents
  const { data: residents = [], isLoading, error } = useResidents(societyId);
  const deleteResident = useDeleteResident(societyId);

  // Function to insert dummy data
  const handleInsertDummyData = async () => {
    try {
      // React Query will automatically refetch due to invalidation
    } catch (error) {
      console.error("Failed to insert dummy data:", error);
    }
  };

  // Function to open vehicle management modal
  const handleManageVehicles = (resident: any) => {
    setSelectedResident(resident);
    setVehicleManagementOpen(true);
  };

  // Function to open edit resident modal
  const handleEditResident = (resident: any) => {
    setSelectedResident(resident);
    setEditResidentOpen(true);
  };

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch =
      resident.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.flat_number.toLowerCase().includes(searchTerm.toLowerCase());

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

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

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
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={handleInsertDummyData}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors  items-center hidden"
          >
            <Plus className="h-5 w-5 mr-2" />
            Insert Dummy Data
          </button>
          <button
            onClick={() => setAddResidentOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Resident
          </button>
        </div>
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="owner">Owners</SelectItem>
                <SelectItem value="tenant">Tenants</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Responsive Residents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
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
                        alt={`${resident.first_name} ${resident.last_name}`}
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {resident.first_name} {resident.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resident.email}
                        </div>
                        {resident.type === "tenant" && resident.owner && (
                          <div className="text-xs text-blue-600 mt-1">
                            Linked to: {resident.owner.first_name}{" "}
                            {resident.owner.last_name}
                          </div>
                        )}
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
                      <span className="font-medium">
                        {resident.flat_number}
                      </span>
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditResident(resident)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Edit Resident"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleManageVehicles(resident)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                        title="Manage Vehicles"
                      >
                        <Car className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this resident?"
                            )
                          ) {
                            deleteResident.mutate(resident.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                        title="Delete Resident"
                        disabled={deleteResident.isPending}
                      >
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

        {/* Mobile/Tablet Cards */}
        <div className="block lg:hidden">
          <div className="divide-y divide-gray-200">
            {filteredResidents.map((resident) => (
              <div key={resident.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        resident.avatar ||
                        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
                      }
                      alt={`${resident.first_name} ${resident.last_name}`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 truncate">
                          {resident.first_name} {resident.last_name}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            resident.type === "owner"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {resident.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
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
                        <div className="flex items-center text-sm text-gray-500">
                          <Home className="h-4 w-4 mr-1" />
                          {resident.flat_number}
                        </div>
                      </div>
                      {resident.type === "tenant" && resident.owner && (
                        <div className="text-xs text-blue-600 mt-1">
                          Linked to: {resident.owner.first_name}{" "}
                          {resident.owner.last_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditResident(resident)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="Edit Resident"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleManageVehicles(resident)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                      title="Manage Vehicles"
                    >
                      <Car className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this resident?"
                          )
                        ) {
                          deleteResident.mutate(resident.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                      title="Delete Resident"
                      disabled={deleteResident.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center text-sm text-gray-900 mb-1">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {resident.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {resident.email}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center text-sm text-gray-900 mb-1">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(resident.move_in_date).toLocaleDateString()}
                    </div>
                    {resident.vehicles && resident.vehicles.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Car className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {resident.vehicles.length} vehicle
                          {resident.vehicles.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredResidents.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No residents found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all" || filterType !== "all"
                ? "Try adjusting your filters or search terms"
                : "Get started by adding your first resident"}
            </p>
          </div>
        )}
      </div>

      <AddResidentModal
        isOpen={addResidentOpen}
        onClose={() => setAddResidentOpen(false)}
      />

      <EditResidentModal
        isOpen={editResidentOpen}
        onClose={() => {
          setEditResidentOpen(false);
          setSelectedResident(null);
        }}
        resident={selectedResident}
      />

      {selectedResident && (
        <VehicleManagement
          residentId={selectedResident.id}
          residentName={`${selectedResident.first_name} ${selectedResident.last_name}`}
          isOpen={vehicleManagementOpen}
          onClose={() => {
            setVehicleManagementOpen(false);
            setSelectedResident(null);
          }}
        />
      )}
    </div>
  );
};

export default Residents;
