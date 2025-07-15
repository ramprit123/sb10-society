import React, { useState } from "react";
import { Plus, Edit, Trash2, Car, Bike, Zap, CircleDot } from "lucide-react";
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from "@/services/vehiclesService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleManagementProps {
  residentId: string;
  residentName: string;
  isOpen: boolean;
  onClose: () => void;
}

const VehicleManagement: React.FC<VehicleManagementProps> = ({
  residentId,
  residentName,
  isOpen,
  onClose,
}) => {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [formData, setFormData] = useState({
    vehicle_number: "",
    vehicle_type: "car" as "car" | "bike" | "scooter" | "bicycle" | "other",
    model: "",
    color: "",
    is_primary: false,
  });

  const { data: vehicles = [], isLoading } = useVehicles(residentId);
  const createVehicle = useCreateVehicle(residentId);
  const updateVehicle = useUpdateVehicle(residentId);
  const deleteVehicle = useDeleteVehicle(residentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await updateVehicle.mutateAsync({
          id: editingVehicle.id,
          updates: formData,
        });
      } else {
        await createVehicle.mutateAsync({
          resident_id: residentId,
          ...formData,
        });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      vehicle_number: "",
      vehicle_type: "car",
      model: "",
      color: "",
      is_primary: false,
    });
    setIsAddingVehicle(false);
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle: any) => {
    setFormData({
      vehicle_number: vehicle.vehicle_number,
      vehicle_type: vehicle.vehicle_type,
      model: vehicle.model || "",
      color: vehicle.color || "",
      is_primary: vehicle.is_primary,
    });
    setEditingVehicle(vehicle);
    setIsAddingVehicle(true);
  };

  const handleDelete = async (vehicleId: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle.mutateAsync(vehicleId);
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "car":
        return <Car className="h-4 w-4" />;
      case "bike":
        return <Bike className="h-4 w-4" />;
      case "scooter":
        return <Zap className="h-4 w-4" />;
      case "bicycle":
        return <CircleDot className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Vehicles - {residentName}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              ×
            </button>
          </div>

          {/* Vehicle List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">Loading vehicles...</div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No vehicles registered
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`p-4 border rounded-lg ${
                    vehicle.is_primary
                      ? "border-purple-200 bg-purple-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-500">
                        {getVehicleIcon(vehicle.vehicle_type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {vehicle.vehicle_number}
                          </span>
                          {vehicle.is_primary && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.vehicle_type.charAt(0).toUpperCase() +
                            vehicle.vehicle_type.slice(1)}
                          {vehicle.model && ` • ${vehicle.model}`}
                          {vehicle.color && ` • ${vehicle.color}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add/Edit Vehicle Form */}
          {isAddingVehicle && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      value={formData.vehicle_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle_number: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., MH01AB1234"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type
                    </label>
                    <Select
                      value={formData.vehicle_type}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          vehicle_type: value as any,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="bicycle">Bicycle</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Honda City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Silver"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_primary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_primary: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Set as primary vehicle
                    </span>
                  </label>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createVehicle.isPending || updateVehicle.isPending
                    }
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {createVehicle.isPending || updateVehicle.isPending
                      ? "Saving..."
                      : editingVehicle
                      ? "Update Vehicle"
                      : "Add Vehicle"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setIsAddingVehicle(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
