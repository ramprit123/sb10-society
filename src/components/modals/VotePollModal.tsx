import React, { useState } from "react";
import { X, Vote, CheckCircle, Clock, Users } from "lucide-react";
import { votePoll, submitSurvey } from "@/services/pollsService";
import type { PollWithOptions } from "@/services/pollsService";

interface VotePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  poll: PollWithOptions | null;
  onVoteSubmitted: () => void;
}

const VotePollModal: React.FC<VotePollModalProps> = ({
  isOpen,
  onClose,
  poll,
  onVoteSubmitted,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [surveyResponses, setSurveyResponses] = useState<{
    [questionId: string]: {
      responseText?: string;
      selectedOptions?: string[];
      rating?: number;
    };
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  if (!isOpen || !poll) return null;

  const handlePollVote = async () => {
    if (!selectedOption) {
      setError("Please select an option");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await votePoll({
        pollId: poll.id,
        optionId: selectedOption,
      });
      onVoteSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSurveySubmit = async () => {
    if (!poll.survey_questions) return;

    // Validate required questions
    const requiredQuestions = poll.survey_questions.filter((q) => q.required);
    const missingResponses = requiredQuestions.filter((q) => {
      const response = surveyResponses[q.id];
      if (!response) return true;

      if (q.question_type === "text") {
        return !response.responseText?.trim();
      } else if (q.question_type === "rating") {
        return !response.rating;
      } else if (q.question_type === "single_choice") {
        return !response.selectedOptions?.length;
      } else if (q.question_type === "multiple_choice") {
        return !response.selectedOptions?.length;
      }
      return false;
    });

    if (missingResponses.length > 0) {
      setError("Please answer all required questions");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const responses = Object.entries(surveyResponses).map(
        ([questionId, response]) => ({
          questionId,
          ...response,
        })
      );

      await submitSurvey({
        pollId: poll.id,
        responses,
      });
      onVoteSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit survey");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSurveyResponseChange = (
    questionId: string,
    type: string,
    value: any
  ) => {
    setSurveyResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: value,
      },
    }));
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

  const isExpired = new Date(poll.end_date) < new Date();
  const canVote =
    poll.status === "active" && !isExpired && !poll.user_has_voted;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Vote className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {poll.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Ends: {formatDate(poll.end_date)}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {poll.total_responses} responses
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">{poll.description}</p>

          {poll.user_has_voted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  You have already participated in this {poll.type}
                </span>
              </div>
            </div>
          )}

          {isExpired && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">
                  This {poll.type} has expired
                </span>
              </div>
            </div>
          )}

          {poll.status === "closed" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <X className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-800 font-medium">
                  This {poll.type} has been closed
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {/* Poll Options */}
          {poll.type === "poll" && poll.poll_options && (
            <div className="space-y-3">
              {poll.poll_options
                .sort((a, b) => a.option_order - b.option_order)
                .map((option) => (
                  <label
                    key={option.id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === option.id
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${!canVote ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="pollOption"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        disabled={!canVote}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-3 text-gray-900">
                        {option.option_text}
                      </span>
                    </div>
                  </label>
                ))}
            </div>
          )}

          {/* Survey Questions */}
          {poll.type === "survey" && poll.survey_questions && (
            <div className="space-y-6">
              {poll.survey_questions
                .sort((a, b) => a.question_order - b.question_order)
                .map((question) => (
                  <div key={question.id} className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {question.question_text}
                      {question.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    {question.question_type === "text" && (
                      <textarea
                        rows={3}
                        placeholder="Enter your response..."
                        value={surveyResponses[question.id]?.responseText || ""}
                        onChange={(e) =>
                          handleSurveyResponseChange(
                            question.id,
                            "responseText",
                            e.target.value
                          )
                        }
                        disabled={!canVote}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    )}

                    {question.question_type === "rating" && (
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() =>
                              handleSurveyResponseChange(
                                question.id,
                                "rating",
                                rating
                              )
                            }
                            disabled={!canVote}
                            className={`w-10 h-10 rounded-full border-2 font-medium transition-colors ${
                              surveyResponses[question.id]?.rating === rating
                                ? "border-purple-500 bg-purple-500 text-white"
                                : "border-gray-300 text-gray-700 hover:border-purple-300"
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    )}

                    {(question.question_type === "single_choice" ||
                      question.question_type === "multiple_choice") &&
                      question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, index) => (
                            <label
                              key={index}
                              className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                                surveyResponses[
                                  question.id
                                ]?.selectedOptions?.includes(option)
                                  ? "border-purple-300 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              } ${
                                !canVote ? "cursor-not-allowed opacity-60" : ""
                              }`}
                            >
                              <div className="flex items-center">
                                <input
                                  type={
                                    question.question_type === "single_choice"
                                      ? "radio"
                                      : "checkbox"
                                  }
                                  name={`question_${question.id}`}
                                  value={option}
                                  checked={
                                    surveyResponses[
                                      question.id
                                    ]?.selectedOptions?.includes(option) ||
                                    false
                                  }
                                  onChange={(e) => {
                                    const currentOptions =
                                      surveyResponses[question.id]
                                        ?.selectedOptions || [];
                                    let newOptions;

                                    if (
                                      question.question_type === "single_choice"
                                    ) {
                                      newOptions = [option];
                                    } else {
                                      if (e.target.checked) {
                                        newOptions = [
                                          ...currentOptions,
                                          option,
                                        ];
                                      } else {
                                        newOptions = currentOptions.filter(
                                          (opt) => opt !== option
                                        );
                                      }
                                    }

                                    handleSurveyResponseChange(
                                      question.id,
                                      "selectedOptions",
                                      newOptions
                                    );
                                  }}
                                  disabled={!canVote}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                />
                                <span className="ml-3 text-gray-900">
                                  {option}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
            </div>
          )}

          {/* Show results if user has voted or poll is closed */}
          {(poll.user_has_voted || poll.status === "closed" || isExpired) &&
            poll.type === "poll" &&
            poll.results && (
              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900">Results</h4>
                {poll.results.map((result) => (
                  <div key={result.option_id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {result.option_text}
                      </span>
                      <span className="text-gray-500">
                        {result.vote_count} votes ({result.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${result.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {canVote && (
          <div className="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={
                poll.type === "poll" ? handlePollVote : handleSurveySubmit
              }
              disabled={
                isSubmitting ||
                (poll.type === "poll" && !selectedOption) ||
                (poll.type === "survey" &&
                  Object.keys(surveyResponses).length === 0)
              }
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                `Submit ${poll.type === "poll" ? "Vote" : "Survey"}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePollModal;
