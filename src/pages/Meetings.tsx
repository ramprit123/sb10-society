import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Search,
  Users,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  FileText,
  User,
} from "lucide-react";
import ScheduleMeetingModal from "@/components/modals/ScheduleMeetingModal";

interface Meeting {
  id: string;
  title: string;
  description: string;
  type: "general" | "emergency" | "committee" | "annual" | "maintenance";
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  organizer: string;
  agenda: string[];
  attendees: {
    invited: number;
    confirmed: number;
    declined: number;
  };
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  documents: string[];
  minutes?: string;
  recordingUrl?: string;
}

const Meetings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);

  const [meetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Annual General Meeting 2024",
      description:
        "Annual general meeting to discuss budget, projects, and elect new committee members for the upcoming year.",
      type: "annual",
      date: "2024-07-28",
      startTime: "18:00",
      endTime: "20:00",
      location: "Community Hall",
      isVirtual: false,
      organizer: "Society Secretary",
      agenda: [
        "Review of previous year's activities",
        "Financial report and budget approval",
        "New project proposals",
        "Committee member elections",
        "Q&A session",
      ],
      attendees: {
        invited: 120,
        confirmed: 85,
        declined: 12,
      },
      status: "scheduled",
      documents: [
        "AGM_Agenda_2024.pdf",
        "Financial_Report_2023.pdf",
        "Budget_Proposal_2024.pdf",
      ],
    },
    {
      id: "2",
      title: "Maintenance Committee Meeting",
      description:
        "Monthly meeting to discuss ongoing maintenance issues and upcoming repair work.",
      type: "committee",
      date: "2024-07-25",
      startTime: "19:00",
      endTime: "20:30",
      location: "Committee Room",
      isVirtual: true,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      organizer: "Maintenance Head",
      agenda: [
        "Lift maintenance status",
        "Water pump replacement",
        "Painting work schedule",
        "Pest control arrangements",
      ],
      attendees: {
        invited: 8,
        confirmed: 6,
        declined: 1,
      },
      status: "scheduled",
      documents: ["Maintenance_Report_July.pdf"],
    },
    {
      id: "3",
      title: "Emergency Security Meeting",
      description:
        "Emergency meeting to address recent security concerns and implement new safety measures.",
      type: "emergency",
      date: "2024-07-22",
      startTime: "20:00",
      endTime: "21:00",
      location: "Community Hall",
      isVirtual: false,
      organizer: "Security Committee",
      agenda: [
        "Recent security incidents review",
        "CCTV upgrade proposal",
        "New security protocols",
        "Visitor management system",
      ],
      attendees: {
        invited: 45,
        confirmed: 38,
        declined: 3,
      },
      status: "completed",
      documents: ["Security_Assessment.pdf", "CCTV_Proposal.pdf"],
      minutes:
        "Meeting concluded with approval for CCTV upgrade and new visitor protocols.",
      recordingUrl: "https://recordings.example.com/security-meeting-july22",
    },
    {
      id: "4",
      title: "Monthly Society Meeting",
      description:
        "Regular monthly meeting to discuss society matters and resident concerns.",
      type: "general",
      date: "2024-07-15",
      startTime: "19:30",
      endTime: "21:00",
      location: "Community Hall",
      isVirtual: false,
      organizer: "Society President",
      agenda: [
        "Resident complaints review",
        "Festival celebration planning",
        "Parking issue discussion",
        "Maintenance updates",
      ],
      attendees: {
        invited: 80,
        confirmed: 62,
        declined: 8,
      },
      status: "completed",
      documents: ["Monthly_Report_July.pdf"],
      minutes:
        "Discussed parking solutions and approved Diwali celebration budget.",
    },
    {
      id: "5",
      title: "Garden Renovation Planning",
      description:
        "Meeting to plan the renovation of society garden and landscaping improvements.",
      type: "committee",
      date: "2024-08-05",
      startTime: "17:00",
      endTime: "18:30",
      location: "Garden Area",
      isVirtual: false,
      organizer: "Garden Committee",
      agenda: [
        "Current garden assessment",
        "Landscaping proposals review",
        "Budget allocation",
        "Timeline planning",
      ],
      attendees: {
        invited: 15,
        confirmed: 10,
        declined: 2,
      },
      status: "scheduled",
      documents: ["Garden_Renovation_Proposal.pdf"],
    },
  ]);

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || meeting.type === filterType;
    const matchesStatus =
      filterStatus === "all" || meeting.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: meetings.length,
    scheduled: meetings.filter((m) => m.status === "scheduled").length,
    completed: meetings.filter((m) => m.status === "completed").length,
    thisMonth: meetings.filter((m) => {
      const meetingDate = new Date(m.date);
      const now = new Date();
      return (
        meetingDate.getMonth() === now.getMonth() &&
        meetingDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "annual":
        return "bg-purple-100 text-purple-800";
      case "committee":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      case "ongoing":
        return <Video className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isUpcoming = (date: string) => {
    const meetingDate = new Date(date);
    const now = new Date();
    return meetingDate > now;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-1">
            Manage society meetings and track attendance
          </p>
        </div>
        <button
          onClick={() => setScheduleMeetingOpen(true)}
          className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule Meeting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Meetings
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.scheduled}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.completed}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.thisMonth}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
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
              placeholder="Search meetings..."
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
              <option value="general">General</option>
              <option value="emergency">Emergency</option>
              <option value="committee">Committee</option>
              <option value="annual">Annual</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .map((meeting) => (
            <div
              key={meeting.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow ${
                isUpcoming(meeting.date) && meeting.status === "scheduled"
                  ? "ring-2 ring-blue-200"
                  : ""
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {meeting.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                        meeting.type
                      )}`}
                    >
                      {meeting.type}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusColor(
                        meeting.status
                      )}`}
                    >
                      {getStatusIcon(meeting.status)}
                      <span className="ml-1">{meeting.status}</span>
                    </span>
                    {meeting.isVirtual && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
                        <Video className="h-3 w-3 mr-1" />
                        Virtual
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    {meeting.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(meeting.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {formatTime(meeting.startTime)} -{" "}
                      {formatTime(meeting.endTime)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {meeting.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {meeting.organizer}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      {meeting.attendees.confirmed}/{meeting.attendees.invited}{" "}
                      attending
                    </div>
                    {meeting.documents.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        {meeting.documents.length} document(s)
                      </div>
                    )}
                  </div>

                  {meeting.agenda.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Agenda:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {meeting.agenda.slice(0, 3).map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                        {meeting.agenda.length > 3 && (
                          <li className="text-purple-600 text-xs">
                            +{meeting.agenda.length - 3} more items
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {meeting.minutes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Meeting Minutes:
                      </h4>
                      <p className="text-sm text-gray-600">{meeting.minutes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    {meeting.documents.map((doc, index) => (
                      <button
                        key={index}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 flex items-center"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {doc}
                      </button>
                    ))}
                    {meeting.recordingUrl && (
                      <button className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 flex items-center">
                        <Video className="h-3 w-3 mr-1" />
                        Recording
                      </button>
                    )}
                    {meeting.meetingLink && meeting.status === "scheduled" && (
                      <button className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded hover:bg-purple-100 flex items-center">
                        <Video className="h-3 w-3 mr-1" />
                        Join Meeting
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

        {filteredMeetings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No meetings found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      <ScheduleMeetingModal
        isOpen={scheduleMeetingOpen}
        onClose={() => setScheduleMeetingOpen(false)}
      />
    </div>
  );
};

export default Meetings;
