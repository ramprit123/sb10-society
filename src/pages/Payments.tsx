import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Building,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface Payment {
  id: string;
  transactionId: string;
  flatNumber: string;
  residentName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: "online" | "cash" | "cheque" | "bank_transfer";
  status: "completed" | "pending" | "failed" | "refunded";
  billType: string;
  description: string;
  reference?: string;
  gateway?: string;
}

interface PaymentSummary {
  totalCollected: number;
  pendingAmount: number;
  monthlyTarget: number;
  collectionRate: number;
}

const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [dateRange, setDateRange] = useState("this_month");

  const [payments] = useState<Payment[]>([
    {
      id: "1",
      transactionId: "TXN001234567",
      flatNumber: "A-101",
      residentName: "Rajesh Kumar",
      amount: 5000,
      paymentDate: "2024-02-15",
      paymentMethod: "online",
      status: "completed",
      billType: "Maintenance",
      description: "Monthly maintenance charges - February 2024",
      reference: "MAINT_FEB_2024",
      gateway: "Razorpay",
    },
    {
      id: "2",
      transactionId: "TXN001234568",
      flatNumber: "B-205",
      residentName: "Priya Sharma",
      amount: 1500,
      paymentDate: "2024-02-14",
      paymentMethod: "bank_transfer",
      status: "completed",
      billType: "Parking",
      description: "Monthly parking charges - February 2024",
      reference: "PARK_FEB_2024",
    },
    {
      id: "3",
      transactionId: "TXN001234569",
      flatNumber: "C-302",
      residentName: "Amit Patel",
      amount: 2000,
      paymentDate: "2024-02-13",
      paymentMethod: "online",
      status: "pending",
      billType: "Amenity",
      description: "Gym and pool access fee - February 2024",
      reference: "AMEN_FEB_2024",
      gateway: "PayU",
    },
    {
      id: "4",
      transactionId: "TXN001234570",
      flatNumber: "A-405",
      residentName: "Sneha Gupta",
      amount: 10000,
      paymentDate: "2024-02-12",
      paymentMethod: "cheque",
      status: "completed",
      billType: "Special Assessment",
      description: "Elevator maintenance fund contribution",
      reference: "ELEV_MAINT_2024",
    },
    {
      id: "5",
      transactionId: "TXN001234571",
      flatNumber: "B-103",
      residentName: "Vikram Singh",
      amount: 5000,
      paymentDate: "2024-02-11",
      paymentMethod: "online",
      status: "failed",
      billType: "Maintenance",
      description: "Monthly maintenance charges - February 2024",
      reference: "MAINT_FEB_2024",
      gateway: "Razorpay",
    },
    {
      id: "6",
      transactionId: "TXN001234572",
      flatNumber: "C-201",
      residentName: "Anita Desai",
      amount: 3000,
      paymentDate: "2024-02-10",
      paymentMethod: "cash",
      status: "completed",
      billType: "Late Fee",
      description: "Late payment charges for January maintenance",
      reference: "LATE_JAN_2024",
    },
  ]);

  const summary: PaymentSummary = {
    totalCollected: payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0),
    monthlyTarget: 150000,
    collectionRate: 85.5,
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.billType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;
    const matchesMethod =
      filterMethod === "all" || payment.paymentMethod === filterMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "online":
        return "bg-blue-100 text-blue-800";
      case "cash":
        return "bg-green-100 text-green-800";
      case "cheque":
        return "bg-purple-100 text-purple-800";
      case "bank_transfer":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
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
            Payment Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage all society payments
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Collected
              </p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ₹{summary.totalCollected.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  +12% from last month
                </span>
              </div>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Amount
              </p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                ₹{summary.pendingAmount.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">
                  -5% from last month
                </span>
              </div>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Target
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                ₹{summary.monthlyTarget.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">
                  {summary.collectionRate}% achieved
                </span>
              </div>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Collection Rate
              </p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {summary.collectionRate}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${summary.collectionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
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
              placeholder="Search payments..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="online">Online</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Transaction Details
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Resident
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Amount
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Payment Method
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Date
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900 flex items-center">
                        <Receipt className="h-4 w-4 mr-2 text-gray-400" />
                        {payment.transactionId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.billType}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {payment.description}
                      </div>
                      {payment.gateway && (
                        <div className="text-xs text-blue-600 mt-1">
                          via {payment.gateway}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900 flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {payment.residentName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Building className="h-3 w-3 mr-1 text-gray-400" />
                        {payment.flatNumber}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">
                      ₹{payment.amount.toLocaleString()}
                    </div>
                    {payment.reference && (
                      <div className="text-xs text-gray-500">
                        Ref: {payment.reference}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getMethodColor(
                        payment.paymentMethod
                      )}`}
                    >
                      {payment.paymentMethod.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
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
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Receipt className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
