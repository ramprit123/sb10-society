import React, { useState } from "react";
import {
  BarChart3,
  Plus,
  Search,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Vote,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import CreatePollSurveyModal from "@/components/modals/CreatePollSurveyModal";

interface Poll {
  id: string;
  title: string;
  description: string;
  type: "poll" | "survey";
  status: "draft" | "active" | "closed";
  createdBy: string;
  createdAt: string;
  endDate: string;
  options?: string[];
  questions?: Question[];
  totalResponses: number;
  targetAudience: "all" | "owners" | "tenants" | "specific";
  results?: PollResult[] | SurveyResult[];
}

interface Question {
  id: string;
  text: string;
  type: "single_choice" | "multiple_choice" | "text" | "rating";
  options?: string[];
  required: boolean;
}

interface PollResult {
  option: string;
  votes: number;
  percentage: number;
}

interface SurveyResult {
  questionId: string;
  responses: any[];
}

const PollsSurveys: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [pollsAndSurveys] = useState<Poll[]>([
    {
      id: "1",
      title: "Society Gym Equipment Upgrade",
      description:
        "Which gym equipment should we prioritize for our next upgrade?",
      type: "poll",
      status: "active",
      createdBy: "Society Management",
      createdAt: "2024-07-10T10:00:00Z",
      endDate: "2024-07-25T23:59:59Z",
      options: [
        "Treadmill",
        "Weight Training Set",
        "Yoga Mats",
        "Stationary Bikes",
      ],
      totalResponses: 45,
      targetAudience: "all",
      results: [
        { option: "Treadmill", votes: 18, percentage: 40 },
        { option: "Weight Training Set", votes: 15, percentage: 33.3 },
        { option: "Stationary Bikes", votes: 8, percentage: 17.8 },
        { option: "Yoga Mats", votes: 4, percentage: 8.9 },
      ],
    },
    {
      id: "2",
      title: "Resident Satisfaction Survey",
      description: "Help us improve our services by sharing your feedback",
      type: "survey",
      status: "active",
      createdBy: "Society Secretary",
      createdAt: "2024-07-08T14:30:00Z",
      endDate: "2024-07-30T23:59:59Z",
      questions: [
        {
          id: "q1",
          text: "How satisfied are you with the cleanliness of common areas?",
          type: "rating",
          required: true,
        },
        {
          id: "q2",
          text: "Rate the security services",
          type: "rating",
          required: true,
        },
        {
          id: "q3",
          text: "Any suggestions for improvement?",
          type: "text",
          required: false,
        },
      ],
      totalResponses: 32,
      targetAudience: "all",
    },
    {
      id: "3",
      title: "Parking Policy Changes",
      description: "Should we implement paid visitor parking?",
      type: "poll",
      status: "closed",
      createdBy: "Management Committee",
      createdAt: "2024-06-15T09:00:00Z",
      endDate: "2024-06-30T23:59:59Z",
      options: [
        "Yes, implement paid parking",
        "No, keep it free",
        "Implement time limits only",
      ],
      totalResponses: 78,
      targetAudience: "all",
      results: [
        { option: "Yes, implement paid parking", votes: 35, percentage: 44.9 },
        { option: "No, keep it free", votes: 28, percentage: 35.9 },
        { option: "Implement time limits only", votes: 15, percentage: 19.2 },
      ],
    },
    {
      id: "4",
      title: "Annual Event Planning",
      description: "What type of annual event would you prefer?",
      type: "poll",
      status: "draft",
      createdBy: "Events Committee",
      createdAt: "2024-07-12T16:20:00Z",
      endDate: "2024-07-28T23:59:59Z",
      options: [
        "Cultural Festival",
        "Sports Day",
        "Family Picnic",
        "Dance Night",
      ],
      totalResponses: 0,
      targetAudience: "all",
    },
  ]);

  const filteredPolls = pollsAndSurveys.filter((poll) => {
    const matchesSearch =
      poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || poll.type === filterType;
    const matchesStatus =
      filterStatus === "all" || poll.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: pollsAndSurveys.length,
    active: pollsAndSurveys.filter((p) => p.status === "active").length,
    totalResponses: pollsAndSurveys.reduce(
      (sum, p) => sum + p.totalResponses,
      0
    ),
    polls: pollsAndSurveys.filter((p) => p.type === "poll").length,
    surveys: pollsAndSurveys.filter((p) => p.type === "survey").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "poll":
        return "bg-blue-100 text-blue-800";
      case "survey":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpiringSoon = (endDate: string) => {
    const expiry = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 3 && diffDays > 0;
  };

  const renderPollResults = (poll: Poll) => {
    if (poll.type === "poll" && poll.results) {
      return (
        <div className="mt-4 space-y-3">
          <h4 className="font-medium text-gray-900">Poll Results</h4>
          {(poll.results as PollResult[]).map((result, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">{result.option}</span>
                <span className="text-gray-500">
                  {result.votes} votes ({result.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${result.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleCreatePollSurvey = (data: any) => {
    console.log("Creating poll/survey:", data);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Polls & Surveys</h1>
          <p className="text-gray-600 mt-1">
            Gather resident opinions and feedback on society matters
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Poll/Survey
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Vote className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.active}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Polls</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.polls}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Surveys</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.surveys}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Responses</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalResponses}
              </p>
            </div>
            <div className="bg-teal-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search polls and surveys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="poll">Polls</option>
              <option value="survey">Surveys</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Polls and Surveys List */}
      <div className="space-y-4">
        {filteredPolls
          .sort((a, b) => {
            if (a.status === "active" && b.status !== "active") return -1;
            if (a.status !== "active" && b.status === "active") return 1;
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .map((poll) => (
            <div
              key={poll.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {poll.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                        poll.type
                      )}`}
                    >
                      {poll.type}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        poll.status
                      )}`}
                    >
                      {poll.status}
                    </span>
                    {isExpiringSoon(poll.endDate) &&
                      poll.status === "active" && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Ending Soon
                        </span>
                      )}
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
                    {poll.description}
                  </p>

                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
                    <span>By {poll.createdBy}</span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created: {formatDate(poll.createdAt)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Ends: {formatDate(poll.endDate)}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {poll.totalResponses} responses
                    </span>
                  </div>

                  {poll.status !== "draft" && renderPollResults(poll)}
                </div>

                <div className="flex items-center space-x-2 mt-4 sm:mt-0 sm:ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100">
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

        {filteredPolls.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No polls or surveys found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria, or create a new
              poll/survey.
            </p>
          </div>
        )}
      </div>

      {/* Create Poll/Survey Modal */}
      <CreatePollSurveyModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreatePollSurvey}
      />
    </div>
  );
};

export default PollsSurveys;
