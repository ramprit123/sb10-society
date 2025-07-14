import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Eye,
  FileText,
  PieChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

interface FinancialData {
  month: string;
  income: number;
  expenses: number;
  maintenance: number;
  utilities: number;
  repairs: number;
  other: number;
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const FinancialReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("this_year");
  const [reportType, setReportType] = useState("summary");

  const financialData: FinancialData[] = [
    {
      month: "Jan",
      income: 145000,
      expenses: 89000,
      maintenance: 45000,
      utilities: 25000,
      repairs: 12000,
      other: 7000,
    },
    {
      month: "Feb",
      income: 152000,
      expenses: 95000,
      maintenance: 48000,
      utilities: 27000,
      repairs: 15000,
      other: 5000,
    },
    {
      month: "Mar",
      income: 148000,
      expenses: 92000,
      maintenance: 46000,
      utilities: 26000,
      repairs: 13000,
      other: 7000,
    },
    {
      month: "Apr",
      income: 155000,
      expenses: 98000,
      maintenance: 50000,
      utilities: 28000,
      repairs: 14000,
      other: 6000,
    },
    {
      month: "May",
      income: 149000,
      expenses: 91000,
      maintenance: 47000,
      utilities: 25000,
      repairs: 12000,
      other: 7000,
    },
    {
      month: "Jun",
      income: 158000,
      expenses: 102000,
      maintenance: 52000,
      utilities: 30000,
      repairs: 16000,
      other: 4000,
    },
  ];

  const expenseCategories: ExpenseCategory[] = [
    {
      category: "Maintenance",
      amount: 288000,
      percentage: 48.5,
      color: "bg-blue-500",
    },
    {
      category: "Utilities",
      amount: 161000,
      percentage: 27.1,
      color: "bg-green-500",
    },
    {
      category: "Repairs",
      amount: 82000,
      percentage: 13.8,
      color: "bg-orange-500",
    },
    {
      category: "Administration",
      amount: 45000,
      percentage: 7.6,
      color: "bg-purple-500",
    },
    { category: "Other", amount: 18000, percentage: 3.0, color: "bg-gray-500" },
  ];

  const totalIncome = financialData.reduce((sum, data) => sum + data.income, 0);
  const totalExpenses = financialData.reduce(
    (sum, data) => sum + data.expenses,
    0
  );
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = ((netProfit / totalIncome) * 100).toFixed(1);

  const currentMonth = financialData[financialData.length - 1];
  const previousMonth = financialData[financialData.length - 2];
  const incomeGrowth = (
    ((currentMonth.income - previousMonth.income) / previousMonth.income) *
    100
  ).toFixed(1);
  const expenseGrowth = (
    ((currentMonth.expenses - previousMonth.expenses) /
      previousMonth.expenses) *
    100
  ).toFixed(1);

  const reports = [
    {
      id: "income_statement",
      title: "Income Statement",
      description: "Detailed income and expense breakdown",
      period: "Monthly/Quarterly/Yearly",
      format: "PDF, Excel",
    },
    {
      id: "balance_sheet",
      title: "Balance Sheet",
      description: "Assets, liabilities, and equity overview",
      period: "As of date",
      format: "PDF, Excel",
    },
    {
      id: "cash_flow",
      title: "Cash Flow Statement",
      description: "Cash inflows and outflows tracking",
      period: "Monthly/Quarterly",
      format: "PDF, Excel",
    },
    {
      id: "budget_variance",
      title: "Budget vs Actual",
      description: "Compare budgeted vs actual expenses",
      period: "Monthly/Quarterly",
      format: "PDF, Excel",
    },
    {
      id: "collection_report",
      title: "Collection Report",
      description: "Maintenance fee collection analysis",
      period: "Monthly",
      format: "PDF, Excel",
    },
    {
      id: "expense_analysis",
      title: "Expense Analysis",
      description: "Category-wise expense breakdown",
      period: "Monthly/Quarterly",
      format: "PDF, Excel",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive financial analysis and reporting
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
          >
            <option value="this_month">This Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
            <option value="last_year">Last Year</option>
          </select>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export All
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ₹{totalIncome.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  +{incomeGrowth}% from last month
                </span>
              </div>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ₹{totalExpenses.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">
                  +{expenseGrowth}% from last month
                </span>
              </div>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                ₹{netProfit.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">
                  {profitMargin}% margin
                </span>
              </div>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Collection Rate
              </p>
              <p className="text-2xl font-bold text-purple-600 mt-2">94.2%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: "94.2%" }}
                ></div>
              </div>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <PieChart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Income vs Expenses
            </h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-end justify-between space-x-2">
            {financialData.map((data, index) => {
              const maxValue = Math.max(
                ...financialData.map((d) => Math.max(d.income, d.expenses))
              );
              const incomeHeight = (data.income / maxValue) * 180;
              const expensesHeight = (data.expenses / maxValue) * 180;
              const diff = data.income - data.expenses;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 group"
                >
                  <div className="w-full flex flex-col space-y-1 relative">
                    {/* Income Bar */}
                    <div
                      className="bg-green-500 rounded-t w-full transition-all duration-300 hover:bg-green-600 cursor-pointer"
                      style={{
                        height: `${incomeHeight}px`,
                        zIndex: 2,
                        position: "relative",
                      }}
                      title={`Income: ₹${data.income.toLocaleString()}`}
                    >
                      <span className="absolute left-1/2 -top-6 -translate-x-1/2 text-xs text-green-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 rounded shadow">
                        ₹{data.income.toLocaleString()}
                      </span>
                    </div>
                    {/* Expenses Bar */}
                    <div
                      className="bg-red-500 rounded-b w-full transition-all duration-300 hover:bg-red-600 cursor-pointer"
                      style={{
                        height: `${expensesHeight}px`,
                        marginTop: "2px",
                        zIndex: 1,
                        position: "relative",
                      }}
                      title={`Expenses: ₹${data.expenses.toLocaleString()}`}
                    >
                      <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-red-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 rounded shadow">
                        ₹{data.expenses.toLocaleString()}
                      </span>
                    </div>
                    {/* Difference Indicator */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 text-xs font-semibold ${
                        diff >= 0 ? "text-green-600" : "text-red-600"
                      } opacity-0 group-hover:opacity-100 transition-opacity`}
                      style={{
                        top: `${Math.min(incomeHeight, expensesHeight) + 10}px`,
                      }}
                    >
                      {diff >= 0 ? "+" : ""}₹{Math.abs(diff).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Expense Breakdown
            </h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {/* Pie Chart Visualization */}
            <div className="flex justify-center mb-6">
              <svg width="120" height="120" viewBox="0 0 120 120">
                {(() => {
                  let cumulative = 0;
                  return expenseCategories.map((cat, i) => {
                    const r = 50;
                    const cx = 60;
                    const cy = 60;
                    const angle = (cat.percentage / 100) * 360;
                    const startAngle = cumulative;
                    const endAngle = cumulative + angle;
                    const largeArc = angle > 180 ? 1 : 0;
                    const start = {
                      x: cx + r * Math.cos((Math.PI * startAngle) / 180),
                      y: cy + r * Math.sin((Math.PI * startAngle) / 180),
                    };
                    const end = {
                      x: cx + r * Math.cos((Math.PI * endAngle) / 180),
                      y: cy + r * Math.sin((Math.PI * endAngle) / 180),
                    };
                    const pathData = `
              M ${cx} ${cy}
              L ${start.x} ${start.y}
              A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}
              Z
            `;
                    cumulative += angle;
                    // Map tailwind color to hex for SVG
                    const colorMap: Record<string, string> = {
                      "bg-blue-500": "#3b82f6",
                      "bg-green-500": "#22c55e",
                      "bg-orange-500": "#f97316",
                      "bg-purple-500": "#a21caf",
                      "bg-gray-500": "#6b7280",
                    };
                    return (
                      <path
                        key={i}
                        d={pathData}
                        fill={colorMap[cat.color] || "#ccc"}
                        stroke="#fff"
                        strokeWidth="2"
                      >
                        <title>
                          {cat.category}: {cat.percentage}% (₹
                          {cat.amount.toLocaleString()})
                        </title>
                      </path>
                    );
                  });
                })()}
              </svg>
            </div>
            {/* Category List */}
            {expenseCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div
                    className={`w-4 h-4 ${category.color} rounded mr-3`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {category.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {category.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`${category.color} h-2 rounded-full`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ₹{category.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Available Reports
          </h3>
          <div className="flex space-x-3">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            >
              <option value="summary">Summary Reports</option>
              <option value="detailed">Detailed Reports</option>
              <option value="custom">Custom Reports</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {report.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Period:</span>
                  <span className="text-gray-900">{report.period}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Format:</span>
                  <span className="text-gray-900">{report.format}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Generate
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Monthly Closing</h4>
                <p className="text-sm text-gray-600">
                  Generate month-end reports
                </p>
              </div>
            </div>
          </button>

          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Budget Planning</h4>
                <p className="text-sm text-gray-600">
                  Create next period budget
                </p>
              </div>
            </div>
          </button>

          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Trend Analysis</h4>
                <p className="text-sm text-gray-600">
                  Analyze financial trends
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
