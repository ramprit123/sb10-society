import React, { useState } from "react";
import { X, Building, MapPin, Users, DollarSign } from "lucide-react";
import { useSocietyStore } from "../../stores/societyStore";

interface AddSocietyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSocietyModal: React.FC<AddSocietyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addSociety } = useSocietyStore();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    totalUnits: "",
    occupiedUnits: "",
    totalResidents: "",
    pendingDues: "",
    status: "active" as "active" | "inactive" | "maintenance",
    currency: "INR",
    timezone: "Asia/Kolkata",
    maintenanceDay: "1",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSociety = {
      name: formData.name,
      address: formData.address,
      totalUnits: parseInt(formData.totalUnits),
      occupiedUnits: parseInt(formData.occupiedUnits),
      totalResidents: parseInt(formData.totalResidents),
      pendingDues: parseFloat(formData.pendingDues),
      status: formData.status,
      settings: {
        currency: formData.currency,
        timezone: formData.timezone,
        maintenanceDay: parseInt(formData.maintenanceDay),
      },
    };

    addSociety(newSociety);
    onClose();

    // Reset form
    setFormData({
      name: "",
      address: "",
      totalUnits: "",
      occupiedUnits: "",
      totalResidents: "",
      pendingDues: "",
      status: "active",
      currency: "INR",
      timezone: "Asia/Kolkata",
      maintenanceDay: "1",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Add New Society
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Society Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter society name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter complete address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Units
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="totalUnits"
                    value={formData.totalUnits}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupied Units
                </label>
                <input
                  type="number"
                  name="occupiedUnits"
                  value={formData.occupiedUnits}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Residents
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="totalResidents"
                    value={formData.totalResidents}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pending Dues (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="pendingDues"
                    value={formData.pendingDues}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Day
                </label>
                <select
                  name="maintenanceDay"
                  value={formData.maintenanceDay}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  {Array.from({ length: 28 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                      {i + 1 === 1
                        ? "st"
                        : i + 1 === 2
                        ? "nd"
                        : i + 1 === 3
                        ? "rd"
                        : "th"}{" "}
                      of month
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Society
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSocietyModal;
