import React, { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Users,
  MapPin,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Dumbbell,
  Waves,
  Car,
  TreePine,
  Building,
  Gamepad2,
} from "lucide-react";

interface Facility {
  id: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  location: string;
  status: "available" | "occupied" | "maintenance" | "closed";
  amenities: string[];
  operatingHours: {
    start: string;
    end: string;
  };
  bookingRequired: boolean;
  currentOccupancy: number;
  maintenanceSchedule?: string;
  contactPerson?: string;
  rules: string[];
}

interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  residentName: string;
  flatNumber: string;
  date: string;
  timeSlot: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled";
  purpose: string;
}

const Facilities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"facilities" | "bookings">(
    "facilities"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [facilities] = useState<Facility[]>([
    {
      id: "1",
      name: "Swimming Pool",
      type: "Recreation",
      description: "Olympic size swimming pool with separate kids pool",
      capacity: 50,
      location: "Ground Floor, Block A",
      status: "available",
      amenities: ["Changing Rooms", "Shower", "Pool Equipment", "Lifeguard"],
      operatingHours: { start: "06:00", end: "22:00" },
      bookingRequired: false,
      currentOccupancy: 12,
      contactPerson: "Pool Manager - 9876543210",
      rules: [
        "Children under 12 must be accompanied by adults",
        "No diving in shallow end",
        "Swimming attire mandatory",
        "No food or drinks in pool area",
      ],
    },
    {
      id: "2",
      name: "Gymnasium",
      type: "Fitness",
      description: "Fully equipped gym with modern fitness equipment",
      capacity: 25,
      location: "First Floor, Block B",
      status: "available",
      amenities: [
        "Cardio Equipment",
        "Weight Training",
        "Personal Trainer",
        "AC",
      ],
      operatingHours: { start: "05:00", end: "23:00" },
      bookingRequired: false,
      currentOccupancy: 8,
      contactPerson: "Fitness Trainer - 9876543211",
      rules: [
        "Proper gym attire required",
        "Clean equipment after use",
        "No loud music",
        "Maximum 2 hours per session",
      ],
    },
    {
      id: "3",
      name: "Community Hall",
      type: "Event Space",
      description: "Large hall for events, meetings, and celebrations",
      capacity: 200,
      location: "Ground Floor, Block C",
      status: "available",
      amenities: [
        "Sound System",
        "Projector",
        "AC",
        "Kitchen Access",
        "Parking",
      ],
      operatingHours: { start: "08:00", end: "23:00" },
      bookingRequired: true,
      currentOccupancy: 0,
      contactPerson: "Event Coordinator - 9876543212",
      rules: [
        "Advance booking required",
        "Security deposit mandatory",
        "No alcohol without permission",
        "Clean up after event",
      ],
    },
    {
      id: "4",
      name: "Children's Play Area",
      type: "Recreation",
      description: "Safe play area with modern playground equipment",
      capacity: 30,
      location: "Garden Area, Block A",
      status: "available",
      amenities: ["Slides", "Swings", "Climbing Frame", "Soft Play", "Seating"],
      operatingHours: { start: "06:00", end: "20:00" },
      bookingRequired: false,
      currentOccupancy: 5,
      rules: [
        "Children under 12 only",
        "Adult supervision required",
        "No food in play area",
        "Shoes must be removed",
      ],
    },
    {
      id: "5",
      name: "Tennis Court",
      type: "Sports",
      description: "Professional tennis court with night lighting",
      capacity: 4,
      location: "Rooftop, Block B",
      status: "maintenance",
      amenities: [
        "Night Lighting",
        "Equipment Storage",
        "Seating",
        "Water Fountain",
      ],
      operatingHours: { start: "06:00", end: "22:00" },
      bookingRequired: true,
      currentOccupancy: 0,
      maintenanceSchedule: "Under maintenance until Feb 20, 2024",
      contactPerson: "Sports Coordinator - 9876543213",
      rules: [
        "Booking required",
        "Maximum 2 hours per booking",
        "Proper sports attire required",
        "No street shoes allowed",
      ],
    },
    {
      id: "6",
      name: "Parking Garage",
      type: "Parking",
      description: "Covered parking with security surveillance",
      capacity: 150,
      location: "Basement Level 1 & 2",
      status: "available",
      amenities: [
        "CCTV",
        "Security Guard",
        "Electric Charging",
        "Bike Parking",
      ],
      operatingHours: { start: "00:00", end: "23:59" },
      bookingRequired: false,
      currentOccupancy: 120,
      contactPerson: "Security Office - 9876543214",
      rules: [
        "Valid parking sticker required",
        "No overnight guest parking",
        "Speed limit 10 km/h",
        "Report any incidents to security",
      ],
    },
  ]);

  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      facilityId: "3",
      facilityName: "Community Hall",
      residentName: "Rajesh Kumar",
      flatNumber: "A-101",
      date: "2024-02-20",
      timeSlot: "18:00 - 22:00",
      duration: 4,
      status: "confirmed",
      purpose: "Birthday Party",
    },
    {
      id: "2",
      facilityId: "5",
      facilityName: "Tennis Court",
      residentName: "Priya Sharma",
      flatNumber: "B-205",
      date: "2024-02-18",
      timeSlot: "07:00 - 09:00",
      duration: 2,
      status: "pending",
      purpose: "Morning Practice",
    },
    {
      id: "3",
      facilityId: "3",
      facilityName: "Community Hall",
      residentName: "Amit Patel",
      flatNumber: "C-302",
      date: "2024-02-25",
      timeSlot: "10:00 - 14:00",
      duration: 4,
      status: "confirmed",
      purpose: "Society Meeting",
    },
  ]);

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || facility.status === filterStatus;
    const matchesType =
      filterType === "all" ||
      facility.type.toLowerCase().includes(filterType.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flatNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getFacilityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "fitness":
        return <Dumbbell className="h-6 w-6" />;
      case "recreation":
        return <Gamepad2 className="h-6 w-6" />;
      case "sports":
        return <Users className="h-6 w-6" />;
      case "event space":
        return <Building className="h-6 w-6" />;
      case "parking":
        return <Car className="h-6 w-6" />;
      default:
        return <Building className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: facilities.length,
    available: facilities.filter((f) => f.status === "available").length,
    occupied: facilities.filter((f) => f.status === "occupied").length,
    maintenance: facilities.filter((f) => f.status === "maintenance").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Facilities Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage society facilities and bookings
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Facility
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Facilities
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.total}
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
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {stats.available}
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
              <p className="text-sm font-medium text-gray-600">In Use</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {stats.occupied}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                {stats.maintenance}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("facilities")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "facilities"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Facilities
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "bookings"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Bookings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
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

            {activeTab === "facilities" && (
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="recreation">Recreation</option>
                  <option value="fitness">Fitness</option>
                  <option value="sports">Sports</option>
                  <option value="event">Event Space</option>
                  <option value="parking">Parking</option>
                </select>
              </div>
            )}
          </div>

          {/* Content */}
          {activeTab === "facilities" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-3 rounded-lg mr-4">
                        {getFacilityIcon(facility.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {facility.name}
                        </h3>
                        <p className="text-sm text-gray-500">{facility.type}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        facility.status
                      )}`}
                    >
                      {facility.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{facility.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {facility.currentOccupancy}/{facility.capacity}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{facility.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {facility.operatingHours.start} -{" "}
                        {facility.operatingHours.end}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {facility.bookingRequired
                          ? "Booking Required"
                          : "Walk-in"}
                      </span>
                    </div>
                  </div>

                  {facility.maintenanceSchedule && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-orange-800">
                        {facility.maintenanceSchedule}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {facility.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {facility.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{facility.amenities.length - 3} more
                        </span>
                      )}
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">
                      Facility
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">
                      Resident
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">
                      Date & Time
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">
                      Duration
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">
                      Purpose
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
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {booking.facilityName}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.residentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.flatNumber}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.timeSlot}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">
                          {booking.duration} hours
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900">{booking.purpose}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getBookingStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Facilities;
