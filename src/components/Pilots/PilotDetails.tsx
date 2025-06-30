import React from 'react';
import { X, Edit, User, Calendar, Clock, Phone, Mail, MapPin, Award } from 'lucide-react';
import { Pilot } from '../../types/flight';

interface PilotDetailsProps {
  pilot: Pilot;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const PilotDetails: React.FC<PilotDetailsProps> = ({ pilot, isOpen, onClose, onEdit }) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'medical-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {pilot.firstName} {pilot.lastName}
              </h2>
              <p className="text-gray-600">{pilot.employeeId} - {pilot.rank}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(pilot.status)}`}>
                      {pilot.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Rank</label>
                  <p className="text-lg font-semibold text-gray-900">{pilot.rank}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Employee ID</label>
                  <p className="text-gray-900">{pilot.employeeId}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Hire Date</label>
                  <p className="text-gray-900">{new Date(pilot.hireDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Flight Hours & Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Flight Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Total Flight Hours</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{pilot.totalFlightHours.toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-green-600">{pilot.monthlyHours}</p>
                    <p className="text-sm text-green-700">Monthly Hours</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-purple-600">{pilot.yearlyHours}</p>
                    <p className="text-sm text-purple-700">Yearly Hours</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Last Flight Date</label>
                  <p className="text-gray-900">{new Date(pilot.lastFlightDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Licenses & Certifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Licenses & Certifications
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">License Number</label>
                  <p className="text-gray-900 font-mono">{pilot.licenseNumber}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">License Expiry</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900">{new Date(pilot.licenseExpiry).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Medical Expiry</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900">{new Date(pilot.medicalExpiry).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    <Award className="h-4 w-4 inline mr-1" />
                    Aircraft Ratings
                  </label>
                  <div className="space-y-1">
                    {pilot.aircraftRatings.map(rating => (
                      <span key={rating} className="block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {rating}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{pilot.contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{pilot.contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{pilot.contactInfo.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};