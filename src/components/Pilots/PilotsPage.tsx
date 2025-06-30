import React, { useState } from 'react';
import { Users, Plus, Search, Filter, User, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { pilotsData } from '../../data/pilotsData';
import { PilotForm } from './PilotForm';
import { PilotDetails } from './PilotDetails';
import { Pilot } from '../../types/flight';

export const PilotsPage: React.FC = () => {
  const [pilots, setPilots] = useState(pilotsData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPilots = pilots.filter(pilot => {
    const matchesSearch = 
      pilot.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pilot.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pilot.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pilot.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pilot.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'medical-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Captain': return 'bg-gold-100 text-gold-800 border-gold-200';
      case 'First Officer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Second Officer': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Flight Engineer': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90;
  };

  const getStatusCounts = () => {
    return {
      active: pilots.filter(p => p.status === 'active').length,
      inactive: pilots.filter(p => p.status === 'inactive').length,
      training: pilots.filter(p => p.status === 'training').length,
      medicalLeave: pilots.filter(p => p.status === 'medical-leave').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pilots Management</h2>
          <p className="text-gray-600 mt-1">Manage pilot information, licenses, and flight hours</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Pilot</span>
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Pilots</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">In Training</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.training}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Medical Leave</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.medicalLeave}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search pilots by name, employee ID, or license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="training">Training</option>
          <option value="medical-leave">Medical Leave</option>
        </select>
      </div>

      {/* Pilots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPilots.map(pilot => (
          <div
            key={pilot.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedPilot(pilot)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {pilot.firstName} {pilot.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{pilot.employeeId}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(pilot.status)}`}>
                {pilot.status}
              </span>
            </div>

            {/* Rank */}
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRankColor(pilot.rank)}`}>
                {pilot.rank}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{pilot.totalFlightHours.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Hours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{pilot.monthlyHours}</p>
                <p className="text-sm text-gray-600">Monthly Hours</p>
              </div>
            </div>

            {/* License Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">License</span>
                <span className="font-medium text-gray-900">{pilot.licenseNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">License Expiry</span>
                <div className="flex items-center space-x-1">
                  {isLicenseExpiringSoon(pilot.licenseExpiry) && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                  <span className={`font-medium ${
                    isLicenseExpiringSoon(pilot.licenseExpiry) ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {new Date(pilot.licenseExpiry).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Flight</span>
                <span className="font-medium text-gray-900">
                  {new Date(pilot.lastFlightDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Aircraft Ratings */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Aircraft Ratings:</p>
              <div className="flex flex-wrap gap-1">
                {pilot.aircraftRatings.map(rating => (
                  <span key={rating} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {rating}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Forms and Modals */}
      <PilotForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={(pilotData) => {
          const newPilot: Pilot = {
            ...pilotData,
            id: `pilot-${Date.now()}`,
          };
          setPilots([...pilots, newPilot]);
          setIsFormOpen(false);
        }}
      />

      {selectedPilot && (
        <PilotDetails
          pilot={selectedPilot}
          isOpen={!!selectedPilot}
          onClose={() => setSelectedPilot(null)}
          onEdit={() => {
            setSelectedPilot(null);
            setIsFormOpen(true);
          }}
        />
      )}
    </div>
  );
};