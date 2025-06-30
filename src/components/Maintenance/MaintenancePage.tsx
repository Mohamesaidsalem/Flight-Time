import React, { useState } from 'react';
import { Wrench, AlertTriangle, Calendar, Clock, CheckCircle, XCircle, Plus, Filter } from 'lucide-react';
import { aircraftFleet, maintenanceRecords } from '../../data/aircraftData';
import { MaintenanceSchedule } from './MaintenanceSchedule';
import { AircraftStatus } from './AircraftStatus';
import { MaintenanceForm } from './MaintenanceForm';

export const MaintenancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'status'>('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState('all');

  const getStatusCounts = () => {
    return {
      operational: aircraftFleet.filter(a => a.status === 'operational').length,
      maintenance: aircraftFleet.filter(a => a.status === 'maintenance').length,
      grounded: aircraftFleet.filter(a => a.status === 'grounded').length,
      inspection: aircraftFleet.filter(a => a.status === 'inspection').length
    };
  };

  const getUpcomingMaintenance = () => {
    const today = new Date();
    const upcoming = maintenanceRecords.filter(record => {
      const scheduledDate = new Date(record.scheduledDate);
      const daysUntil = Math.ceil((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 30 && daysUntil >= 0 && record.status === 'planned';
    });
    return upcoming.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  };

  const getOverdueMaintenance = () => {
    const today = new Date();
    return maintenanceRecords.filter(record => {
      const scheduledDate = new Date(record.scheduledDate);
      return scheduledDate < today && record.status !== 'completed';
    });
  };

  const statusCounts = getStatusCounts();
  const upcomingMaintenance = getUpcomingMaintenance();
  const overdueMaintenance = getOverdueMaintenance();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Maintenance Management</h2>
          <p className="text-gray-600 mt-1">Aircraft maintenance scheduling and tracking</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Operational</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.operational}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">In Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.maintenance}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Grounded</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.grounded}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Inspection</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.inspection}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(upcomingMaintenance.length > 0 || overdueMaintenance.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {overdueMaintenance.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">Overdue Maintenance</h3>
              </div>
              <div className="space-y-3">
                {overdueMaintenance.slice(0, 3).map(record => {
                  const aircraft = aircraftFleet.find(a => a.id === record.aircraftId);
                  return (
                    <div key={record.id} className="bg-white p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{aircraft?.registration}</p>
                          <p className="text-sm text-gray-600">{record.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-red-600">Overdue</p>
                          <p className="text-xs text-gray-500">{record.scheduledDate}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {upcomingMaintenance.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-900">Upcoming Maintenance</h3>
              </div>
              <div className="space-y-3">
                {upcomingMaintenance.slice(0, 3).map(record => {
                  const aircraft = aircraftFleet.find(a => a.id === record.aircraftId);
                  const daysUntil = Math.ceil((new Date(record.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={record.id} className="bg-white p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{aircraft?.registration}</p>
                          <p className="text-sm text-gray-600">{record.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-yellow-600">{daysUntil} days</p>
                          <p className="text-xs text-gray-500">{record.scheduledDate}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'schedule'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Schedule
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'status'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Aircraft Status
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Maintenance Overview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aircraft</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {maintenanceRecords.map(record => {
                  const aircraft = aircraftFleet.find(a => a.id === record.aircraftId);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {aircraft?.registration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          record.type === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          record.type === 'unscheduled' ? 'bg-yellow-100 text-yellow-800' :
                          record.type === 'inspection' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{record.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.scheduledDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          record.status === 'completed' ? 'bg-green-100 text-green-800' :
                          record.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          record.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${record.cost.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && <MaintenanceSchedule />}
      {activeTab === 'status' && <AircraftStatus />}

      <MaintenanceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};