import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building,
  DollarSign,
  Download,
  Filter,
  PieChart,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";

interface AnalyticsData {
  period: string;
  residents: number;
  revenue: number;
  expenses: number;
  complaints: number;
  satisfaction: number;
  occupancy: number;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<any>;
  color: string;
}

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("this_year");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const analyticsData: AnalyticsData[] = [
    {
      period: "Jan",
      residents: 1250,
      revenue: 2850000,
      expenses: 1890000,
      complaints: 45,
      satisfaction: 4.2,
      occupancy: 92,
    },
    {
      period: "Feb",
      residents: 1275,
      revenue: 2920000,
      expenses: 1950000,
      complaints: 38,
      satisfaction: 4.3,
      occupancy: 94,
    },
    {
      period: "Mar",
      residents: 1290,
      revenue: 2980000,
      expenses: 2010000,
      complaints: 42,
      satisfaction: 4.1,
      occupancy: 95,
    },
    {
      period: "Apr",
      residents: 1310,
      revenue: 3050000,
      expenses: 2080000,
      complaints: 35,
      satisfaction: 4.4,
      occupancy: 96,
    },
    {
      period: "May",
      residents: 1325,
      revenue: 3120000,
      expenses: 2150000,
      complaints: 40,
      satisfaction: 4.2,
      occupancy: 97,
    },
    {
      period: "Jun",
      residents: 1340,
      revenue: 3180000,
      expenses: 2200000,
      complaints: 33,
      satisfaction: 4.5,
      occupancy: 98,
    },
  ];

  const currentData = analyticsData[analyticsData.length - 1];
  const previousData = analyticsData[analyticsData.length - 2];

  const calculateChange = (
    current: number,
    previous: number
  ): { value: string; trend: "up" | "down" } => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      trend: change >= 0 ? "up" : "down",
    };
  };

  const metricCards: MetricCard[] = [
    {
      title: "Total Revenue",
      value: `₹${(currentData.revenue / 100000).toFixed(1)}L`,
      change: `+${
        calculateChange(currentData.revenue, previousData.revenue).value
      }%`,
      trend: calculateChange(currentData.revenue, previousData.revenue).trend,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Residents",
      value: currentData.residents.toLocaleString(),
      change: `+${
        calculateChange(currentData.residents, previousData.residents).value
      }%`,
      trend: calculateChange(currentData.residents, previousData.residents)
        .trend,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Occupancy Rate",
      value: `${currentData.occupancy}%`,
      change: `+${
        calculateChange(currentData.occupancy, previousData.occupancy).value
      }%`,
      trend: calculateChange(currentData.occupancy, previousData.occupancy)
        .trend,
      icon: Building,
      color: "bg-purple-500",
    },
    {
      title: "Satisfaction Score",
      value: `${currentData.satisfaction}/5`,
      change: `+${
        calculateChange(currentData.satisfaction, previousData.satisfaction)
          .value
      }%`,
      trend: calculateChange(
        currentData.satisfaction,
        previousData.satisfaction
      ).trend,
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  const societyPerformance = [
    {
      name: "Green Valley Apartments",
      residents: 342,
      revenue: 1250000,
      satisfaction: 4.5,
      occupancy: 98,
    },
    {
      name: "Sunrise Heights",
      residents: 234,
      revenue: 890000,
      satisfaction: 4.3,
      occupancy: 96,
    },
    {
      name: "Ocean View Residency",
      residents: 555,
      revenue: 1980000,
      satisfaction: 4.2,
      occupancy: 94,
    },
    {
      name: "Garden City Complex",
      residents: 189,
      revenue: 720000,
      satisfaction: 4.1,
      occupancy: 92,
    },
    {
      name: "Royal Palms",
      residents: 298,
      revenue: 1150000,
      satisfaction: 4.4,
      occupancy: 97,
    },
  ];

  const expenseBreakdown = [
    {
      category: "Maintenance",
      amount: 850000,
      percentage: 38.6,
      color: "bg-blue-500",
    },
    {
      category: "Utilities",
      amount: 550000,
      percentage: 25.0,
      color: "bg-green-500",
    },
    {
      category: "Security",
      amount: 320000,
      percentage: 14.5,
      color: "bg-purple-500",
    },
    {
      category: "Administration",
      amount: 280000,
      percentage: 12.7,
      color: "bg-orange-500",
    },
    {
      category: "Others",
      amount: 200000,
      percentage: 9.1,
      color: "bg-gray-500",
    },
  ];

  const getMaxValue = (data: AnalyticsData[], key: keyof AnalyticsData) => {
    return Math.max(...data.map((d) => d[key] as number));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights and performance metrics
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
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {metric.value}
                </p>
                <div className="flex items-center mt-2">
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.change} from last month
                  </span>
                </div>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:none focus:ring-purple-500 focus:border-transparent"
            >
              <option value="revenue">Revenue</option>
              <option value="expenses">Expenses</option>
              <option value="residents">Residents</option>
              <option value="satisfaction">Satisfaction</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.map((data, index) => {
              const value = data[
                selectedMetric as keyof AnalyticsData
              ] as number;
              const maxValue = getMaxValue(
                analyticsData,
                selectedMetric as keyof AnalyticsData
              );
              const height = (value / maxValue) * 200;

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-purple-500 rounded-t w-full transition-all duration-300 hover:bg-purple-600 cursor-pointer"
                    style={{ height: `${height}px` }}
                    title={`${data.period}: ${
                      selectedMetric === "revenue" ||
                      selectedMetric === "expenses"
                        ? "₹" + (value / 100000).toFixed(1) + "L"
                        : value
                    }`}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">
                    {data.period}
                  </span>
                </div>
              );
            })}
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
            {expenseBreakdown.map((expense, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div
                    className={`w-4 h-4 ${expense.color} rounded mr-3`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {expense.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {expense.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`${expense.color} h-2 rounded-full`}
                        style={{ width: `${expense.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ₹{(expense.amount / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Society Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Society Performance
          </h3>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Filter className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <BarChart3 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Society Name
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Residents
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Revenue
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Satisfaction
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Occupancy
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {societyPerformance.map((society, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">
                      {society.name}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">{society.residents}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-900">
                      ₹{(society.revenue / 100000).toFixed(1)}L
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span className="text-gray-900 mr-2">
                        {society.satisfaction}/5
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${(society.satisfaction / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span className="text-gray-900 mr-2">
                        {society.occupancy}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${society.occupancy}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {society.satisfaction >= 4.3 &&
                      society.occupancy >= 95 ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600 text-sm font-medium">
                            Excellent
                          </span>
                        </>
                      ) : society.satisfaction >= 4.0 &&
                        society.occupancy >= 90 ? (
                        <>
                          <Activity className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="text-blue-600 text-sm font-medium">
                            Good
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="text-orange-600 text-sm font-medium">
                            Needs Attention
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Revenue Growth</h4>
                <p className="text-sm text-gray-600">
                  11.6% increase this quarter
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Resident Satisfaction
                </h4>
                <p className="text-sm text-gray-600">4.3/5 average rating</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Occupancy Rate</h4>
                <p className="text-sm text-gray-600">
                  96% across all societies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
