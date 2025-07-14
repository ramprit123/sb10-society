import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface CreatePollSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const CreatePollSurveyModal: React.FC<CreatePollSurveyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    type: "poll",
    title: "",
    description: "",
    endDate: "",
    targetAudience: "all",
    options: ["", ""],
    questions: [],
  });

  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  if (!isOpen) return null;

  const handleAddOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      options:
        formData.type === "poll"
          ? pollOptions.filter((option) => option.trim() !== "")
          : undefined,
    };

    if (onSubmit) {
      onSubmit(submitData);
    }

    // Reset form
    setFormData({
      type: "poll",
      title: "",
      description: "",
      endDate: "",
      targetAudience: "all",
      options: ["", ""],
      questions: [],
    });
    setPollOptions(["", ""]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create {formData.type === "poll" ? "Poll" : "Survey"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="poll"
                  checked={formData.type === "poll"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "poll" | "survey",
                    })
                  }
                  className="mr-2"
                />
                Poll (Quick vote)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="survey"
                  checked={formData.type === "survey"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "poll" | "survey",
                    })
                  }
                  className="mr-2"
                />
                Survey (Detailed feedback)
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Provide details about the poll/survey"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({ ...formData, targetAudience: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Residents</option>
                <option value="owners">Owners Only</option>
                <option value="tenants">Tenants Only</option>
                <option value="specific">Specific Groups</option>
              </select>
            </div>
          </div>

          {/* Poll Options */}
          {formData.type === "poll" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Poll Options *
                </label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-purple-600 hover:text-purple-700 flex items-center text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </button>
              </div>
              <div className="space-y-3">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      required
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Survey Questions */}
          {formData.type === "survey" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Survey Questions
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Survey questions can be configured after creating the survey.
                  You can add various question types including multiple choice,
                  text responses, and ratings.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create {formData.type === "poll" ? "Poll" : "Survey"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePollSurveyModal;
