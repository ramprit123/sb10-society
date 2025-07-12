import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    agenda: '',
    attendees: 'all',
    sendReminder: true,
    reminderTime: '24'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Scheduling meeting:', formData);
    onClose();
    setFormData({
      title: '',
      date: '',
      time: '',
      duration: '60',
      location: '',
      agenda: '',
      attendees: 'all',
      sendReminder: true,
      reminderTime: '24'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Schedule Meeting</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Title
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Monthly Society Meeting"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Community Hall"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendees
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="all">All Residents</option>
                  <option value="owners">Owners Only</option>
                  <option value="committee">Committee Members</option>
                  <option value="custom">Custom Selection</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agenda
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="Meeting agenda and topics to discuss..."
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="sendReminder"
                checked={formData.sendReminder}
                onChange={handleChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Send reminder notifications
              </label>
            </div>

            {formData.sendReminder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Time
                </label>
                <select
                  name="reminderTime"
                  value={formData.reminderTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="1">1 hour before</option>
                  <option value="24">24 hours before</option>
                  <option value="48">48 hours before</option>
                  <option value="168">1 week before</option>
                </select>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Schedule Meeting
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;