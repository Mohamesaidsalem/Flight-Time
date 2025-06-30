import React from 'react';
import { X, Edit, Settings, Calendar, Clock, Wrench, TrendingUp } from 'lucide-react';
import { Engine } from '../../types/flight';
import { aircraftFleet } from '../../data/aircraftData';

interface EngineDetailsProps {
  engine: Engine;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const EngineDetails: React.FC<EngineDetailsProps> = ({ engine, isOpen, onClose, onEdit }) => {
  if (!isOpen) return null;

  const aircraft = aircraftFleet.find(a => a.id === engine.aircraftId);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'removed': return 'bg-gray-100 text-gray-800';
      case 'overhaul': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hoursOnEngine = engine.totalHours - engine.initialHours;
  const cyclesOnEngine = engine.totalCycles - engine.initialCycles;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{engine.serialNumber}</h2>
              <p className="text-gray-600">{engine.model} - {engine.manufacturer}</p>
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
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(engine.status)}`}>
                      {engine.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Aircraft</label>
                  <p className="text-lg font-semibold text-gray-900">{aircraft?.registration}</p>
                  <p className="text-sm text-gray-500">{aircraft?.model}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Position</label>
                  <p className="text-gray-900 capitalize">{engine.position}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Installation Date</label>
                  <p className="text-gray-900">{new Date(engine.installationDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Operating Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Operating Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Total Hours</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{engine.totalHours.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Hours on this engine: {hoursOnEngine.toLocaleString()}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Total Cycles</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{engine.totalCycles.toLocaleString()}</p>
                  <p className="text-sm text-green-700">Cycles on this engine: {cyclesOnEngine.toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-purple-600">{engine.initialHours.toLocaleString()}</p>
                    <p className="text-sm text-purple-700">Initial Hours</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-orange-600">{engine.initialCycles.toLocaleString()}</p>
                    <p className="text-sm text-orange-700">Initial Cycles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engine Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Engine Specifications
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Model</label>
                  <p className="text-gray-900 font-mono">{engine.model}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Manufacturer</label>
                  <p className="text-gray-900">{engine.manufacturer}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Thrust Rating</label>
                  <p className="text-gray-900">{engine.thrustRating.toLocaleString()} lbs</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Fuel Consumption</label>
                  <p className="text-gray-900">{engine.fuelConsumption} gph</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Serial Number</label>
                  <p className="text-gray-900 font-mono">{engine.serialNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Maintenance</label>
                  <p className="text-gray-900">{new Date(engine.lastMaintenanceDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Wrench className="h-5 w-5 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Next Maintenance</label>
                  <p className="text-gray-900">{new Date(engine.nextMaintenanceDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {hoursOnEngine > 0 ? (cyclesOnEngine / hoursOnEngine).toFixed(2) : '0.00'}
                </p>
                <p className="text-sm text-blue-700">Cycles per Hour</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {cyclesOnEngine > 0 ? (hoursOnEngine / cyclesOnEngine).toFixed(2) : '0.00'}
                </p>
                <p className="text-sm text-green-700">Hours per Cycle</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {((new Date().getTime() - new Date(engine.installationDate).getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)}
                </p>
                <p className="text-sm text-purple-700">Years in Service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};