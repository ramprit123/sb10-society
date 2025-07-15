import React, { useState, useEffect } from "react";
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
  Clock,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import CreatePollSurveyModal from "@/components/modals/CreatePollSurveyModal";
import VotePollModal from "@/components/modals/VotePollModal";
import { useSocietyStore } from "@/stores/societyStore";
import {
  fetchPollsSurveys,
  createPollSurvey,
  deletePollSurvey,
  subscribeToPollsSurveys,
  type PollWithOptions,
  type CreatePollData,
} from "@/services/pollsService";

const PollsSurveys: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<PollWithOptions | null>(
    null
  );
  const [pollsAndSurveys, setPollsAndSurveys] = useState<PollWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const { currentSociety } = useSocietyStore();

  // Load polls and surveys
  const loadPollsSurveys = async () => {
    if (!currentSociety?.id) return;

    try {
      setLoading(true);
      setError("");
      const data = await fetchPollsSurveys(currentSociety.id);
      setPollsAndSurveys(data);
    } catch (err: any) {
      setError(err.message || "Failed to load polls and surveys");
      console.error("Error loading polls/surveys:", err);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!currentSociety?.id) return;

    loadPollsSurveys();

    // Subscribe to real-time updates
    const subscription = subscribeToPollsSurveys(currentSociety.id, () => {
      loadPollsSurveys(); // Reload data when changes occur
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentSociety?.id]);

  const handleCreatePollSurvey = async (data: CreatePollData) => {
    if (!currentSociety?.id) return;

    try {
      await createPollSurvey(currentSociety.id, data);
      setCreateModalOpen(false);
      // Data will be updated via real-time subscription
    } catch (err: any) {
      console.error("Error creating poll/survey:", err);
      throw err; // Let the modal handle the error
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm("Are you sure you want to delete this poll/survey?")) return;

    try {
      await deletePollSurvey(pollId);
      // Data will be updated via real-time subscription
    } catch (err: any) {
      console.error("Error deleting poll/survey:", err);
    }
  };

  const handleVotePoll = (poll: PollWithOptions) => {
    setSelectedPoll(poll);
    setVoteModalOpen(true);
  };

  const handleVoteSubmitted = () => {
    // Data will be updated via real-time subscription
    setVoteModalOpen(false);
    setSelectedPoll(null);
  };

  const filteredPolls = pollsAndSurveys.filter((poll) => {
    const matchesSearch =
      poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.created_by.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || poll.type === filterType;
    const matchesStatus =
      filterStatus === "all" || poll.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: pollsAndSurveys.length,
    active: pollsAndSurveys.filter((p) => p.status === "active").length,
    totalResponses: pollsAndSurveys.reduce(
      (sum, p) => sum + (p.total_responses || 0),
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

  const getTypeIcon = (type: string) => {
    return type === "poll" ? (
      <Vote className="h-4 w-4" />
    ) : (
      <MessageSquare className="h-4 w-4" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpiringSoon = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 3 && daysDiff > 0;
  };

  const renderPollResults = (poll: PollWithOptions) => {
    if (
      poll.type === "poll" &&
      poll.poll_options &&
      poll.poll_options.length > 0
    ) {
      const totalVotes = poll.poll_options.reduce(
        (sum: number, option: any) => sum + (option.vote_count || 0),
        0
      );

      return (
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium text-gray-700">Results:</div>
          {poll.poll_options.map((option: any, index: number) => {
            const percentage =
              totalVotes > 0
                ? ((option.vote_count || 0) / totalVotes) * 100
                : 0;
            return (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex-1">{option.option_text}</span>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-xs text-gray-600">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Polls & Surveys
              </h1>
              <p className="text-gray-600 mt-1">
                Conduct polls and surveys to gather resident feedback
              </p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.active}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Responses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalResponses}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <Vote className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Polls</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.polls}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Surveys</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.surveys}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search polls and surveys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="poll">Polls</option>
                  <option value="survey">Surveys</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Polls & Surveys List */}
          <div className="space-y-4">
            {filteredPolls.length > 0 ? (
              filteredPolls
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((poll) => (
                  <div
                    key={poll.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(poll.type)}
                            <h3 className="text-lg font-semibold text-gray-900">
                              {poll.title}
                            </h3>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              poll.status
                            )}`}
                          >
                            {poll.status.charAt(0).toUpperCase() +
                              poll.status.slice(1)}
                          </span>
                          {isExpiringSoon(poll.end_date) &&
                            poll.status === "active" && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Expiring Soon
                              </span>
                            )}
                        </div>
                        <p className="text-gray-600 mb-3">{poll.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>By {poll.created_by}</span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Created: {formatDate(poll.created_at)}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Ends: {formatDate(poll.end_date)}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {poll.total_responses || 0} responses
                          </span>
                        </div>
                        {poll.status !== "draft" && renderPollResults(poll)}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {poll.status === "active" && (
                          <button
                            onClick={() => handleVotePoll(poll)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Vote className="h-4 w-4 mr-1" />
                            Vote
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePoll(poll.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
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
        </>
      )}

      {/* Vote Poll Modal */}
      {selectedPoll && (
        <VotePollModal
          isOpen={voteModalOpen}
          onClose={() => setVoteModalOpen(false)}
          poll={selectedPoll}
          onVoteSubmitted={handleVoteSubmitted}
        />
      )}

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
