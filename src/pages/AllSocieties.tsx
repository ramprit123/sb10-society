import React, { useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  Users,
  Building,
  DollarSign,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useSocietyStore } from "../stores/societyStore";
import { useNavigate } from "react-router-dom";
import AddSocietyModal from "../components/modals/AddSocietyModal";

const AllSocieties: React.FC = () => {
  const { societies, deleteSociety } = useSocietyStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [addSocietyOpen, setAddSocietyOpen] = useState(false);
  const navigate = useNavigate();

  const filteredTenants = societies.filter(
    (society) =>
      society.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      society.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    totalSocieties: societies.length,
    totalUnits: societies.reduce((sum, society) => sum + society.totalUnits, 0),
    totalResidents: societies.reduce(
      (sum, society) => sum + society.totalResidents,
      0
    ),
    totalPendingDues: societies.reduce(
      (sum, society) => sum + society.pendingDues,
      0
    ),
  };

  const handleViewSociety = (societyId: string) => {
    navigate(`/society/${societyId}/dashboard`);
  };

  const handleDeleteSociety = (societyId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this society? This action cannot be undone."
      )
    ) {
      deleteSociety(societyId);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Societies</h1>
          <p className="text-gray-600 mt-1">
            Manage all your society properties from one place
          </p>
        </div>
        <button
          onClick={() => setAddSocietyOpen(true)}
          className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Society
        </button>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Societies
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalStats.totalSocieties}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Units</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalStats.totalUnits.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Residents
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalStats.totalResidents.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Pending Dues
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{totalStats.totalPendingDues.toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search societies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Societies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((society) => (
          <div
            key={society.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {society.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate">{society.address}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    society.status === "active"
                      ? "bg-green-100 text-green-800"
                      : society.status === "inactive"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {society.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Total Units</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {society.totalUnits}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupied</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {society.occupiedUnits}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Residents</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {society.totalResidents}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Dues</p>
                  <p className="text-lg font-semibold text-orange-600">
                    ₹{society.pendingDues.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewSociety(society.id)}
                  className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteSociety(society.id)}
                  className="px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No societies found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by adding your first society"}
          </p>
          <button
            onClick={() => setAddSocietyOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Society
          </button>
        </div>
      )}

      <AddSocietyModal
        isOpen={addSocietyOpen}
        onClose={() => setAddSocietyOpen(false)}
      />
    </div>
  );
};

export default AllSocieties;
