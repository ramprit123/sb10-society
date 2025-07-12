import React, { useState } from 'react';
import { X, CreditCard, Calendar, DollarSign, FileText } from 'lucide-react';

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateBillModal: React.FC<GenerateBillModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    billType: 'maintenance',
    amount: '',
    dueDate: '',
    description: '',
    flatNumbers: '',
    includeLateFee: false,
    lateFeeAmount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating bill:', formData);
    onClose();
    setFormData({
      billType: 'maintenance',
      amount: '',
      dueDate: '',
      description: '',
      flatNumbers: '',
      includeLateFee: false,
      lateFeeAmount: ''
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
            <h3 className="text-lg font-semibold text-gray-900">Generate Bill</h3>
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
                Bill Type
              </label>
              <select
                name="billType"
                value={formData.billType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="maintenance">Maintenance</option>
                <option value="parking">Parking</option>
                <option value="amenity">Amenity Fee</option>
                <option value="special">Special Assessment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="Bill description..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flat Numbers
              </label>
              <input
                type="text"
                name="flatNumbers"
                value={formData.flatNumbers}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 101,102,103 or leave empty for all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to send to all residents, or specify flat numbers separated by commas
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="includeLateFee"
                checked={formData.includeLateFee}
                onChange={handleChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Include late fee for overdue payments
              </label>
            </div>

            {formData.includeLateFee && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Late Fee Amount (₹)
                </label>
                <input
                  type="number"
                  name="lateFeeAmount"
                  value={formData.lateFeeAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
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
                Generate Bill
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateBillModal;