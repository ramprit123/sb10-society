import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Send,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import GenerateBillModal from "../components/modals/GenerateBillModal";

interface Bill {
  id: string;
  flatNumber: string;
  residentName: string;
  billType: string;
  amount: number;
  dueDate: string;
  generatedDate: string;
  status: "paid" | "pending" | "overdue";
  description: string;
  paidDate?: string;
  lateFee?: number;
}

const MaintenanceBills: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [generateBillOpen, setGenerateBillOpen] = useState(false);

  const [bills] = useState<Bill[]>([
    {
      id: "1",
      flatNumber: "A-101",
      residentName: "Rajesh Kumar",
      billType: "Maintenance",
      amount: 5000,
      dueDate: "2024-02-15",
      generatedDate: "2024-01-15",
      status: "paid",
      description: "Monthly maintenance charges",
      paidDate: "2024-02-10",
    },
    {
      id: "2",
      flatNumber: "B-205",
      residentName: "Priya Sharma",
      billType: "Maintenance",
      amount: 5000,
      dueDate: "2024-02-15",
      generatedDate: "2024-01-15",
      status: "pending",
      description: "Monthly maintenance charges",
    },
    {
      id: "3",
      flatNumber: "C-302",
      residentName: "Amit Patel",
      billType: "Parking",
      amount: 1500,
      dueDate: "2024-02-10",
      generatedDate: "2024-01-10",
      status: "overdue",
      description: "Monthly parking charges",
      lateFee: 150,
    },
    {
      id: "4",
      flatNumber: "A-405",
      residentName: "Sneha Gupta",
      billType: "Amenity",
      amount: 2000,
      dueDate: "2024-02-20",
      generatedDate: "2024-01-20",
      status: "pending",
      description: "Gym and pool access fee",
    },
    {
      id: "5",
      flatNumber: "B-103",
      residentName: "Vikram Singh",
      billType: "Special Assessment",
      amount: 10000,
      dueDate: "2024-02-25",
      generatedDate: "2024-01-25",
      status: "paid",
      description: "Elevator maintenance fund",
      paidDate: "2024-02-20",
    },
  ]);

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.billType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || bill.status === filterStatus;
    const matchesType =
      filterType === "all" ||
      bill.billType.toLowerCase().includes(filterType.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: bills.reduce(
      (sum, bill) => sum + bill.amount + (bill.lateFee || 0),
      0
    ),
    paid: bills
      .filter((b) => b.status === "paid")
      .reduce((sum, bill) => sum + bill.amount, 0),
    pending: bills
      .filter((b) => b.status === "pending")
      .reduce((sum, bill) => sum + bill.amount, 0),
    overdue: bills
      .filter((b) => b.status === "overdue")
      .reduce((sum, bill) => sum + bill.amount + (bill.lateFee || 0), 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
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
            Maintenance & Bills
          </h1>
          <p className="text-gray-600 mt-1">
            Manage billing and maintenance charges
          </p>
        </div>
        <button
          onClick={() => setGenerateBillOpen(true)}
          className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Generate Bill
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{stats.total.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ₹{stats.paid.toLocaleString()}
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                ₹{stats.pending.toLocaleString()}
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
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ₹{stats.overdue.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
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
              placeholder="Search bills..."
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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="maintenance">Maintenance</option>
              <option value="parking">Parking</option>
              <option value="amenity">Amenity</option>
              <option value="special">Special Assessment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Bill Details
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Resident
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Amount
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Due Date
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
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        {bill.billType}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bill.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Generated:{" "}
                        {new Date(bill.generatedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">
                        {bill.residentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bill.flatNumber}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">
                        ₹{bill.amount.toLocaleString()}
                      </div>
                      {bill.lateFee && (
                        <div className="text-sm text-red-600">
                          + ₹{bill.lateFee} late fee
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span
                        className={`text-sm ${
                          new Date(bill.dueDate) < new Date() &&
                          bill.status !== "paid"
                            ? "text-red-600 font-medium"
                            : "text-gray-900"
                        }`}
                      >
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {bill.paidDate && (
                      <div className="text-xs text-green-600 mt-1">
                        Paid: {new Date(bill.paidDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {getStatusIcon(bill.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          bill.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : bill.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bill.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Download className="h-4 w-4" />
                      </button>
                      {bill.status === "pending" && (
                        <button className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-gray-100">
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <GenerateBillModal
        isOpen={generateBillOpen}
        onClose={() => setGenerateBillOpen(false)}
      />
    </div>
  );
};

export default MaintenanceBills;
