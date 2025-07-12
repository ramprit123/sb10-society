import React, { useState } from 'react';
import { X, Megaphone, Calendar, Users, AlertCircle } from 'lucide-react';

interface CreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'normal',
    targetAudience: 'all',
    expiryDate: '',
    sendEmail: true,
    sendSMS: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating notice:', formData);
    onClose();
    setFormData({
      title: '',
      message: '',
      priority: 'normal',
      targetAudience: 'all',
      expiryDate: '',
      sendEmail: true,
      sendSMS: false
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
            <h3 className="text-lg font-semibold text-gray-900">Create Notice</h3>
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
                Notice Title
              </label>
              <div className="relative">
                <Megaphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter notice title"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your message..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="relative">
                <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="all">All Residents</option>
                  <option value="owners">Owners Only</option>
                  <option value="tenants">Tenants Only</option>
                  <option value="committee">Committee Members</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Notification Methods
              </label>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="sendEmail"
                  checked={formData.sendEmail}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Send Email Notification
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="sendSMS"
                  checked={formData.sendSMS}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Send SMS Notification
                </label>
              </div>
            </div>

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
                Send Notice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNoticeModal;