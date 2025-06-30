import React, { useState } from 'react';
import { Settings, Plus, Search, Filter, Wrench, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { enginesData } from '../../data/enginesData';
import { aircraftFleet } from '../../data/aircraftData';
import { EngineForm } from './EngineForm';
import { EngineDetails } from './EngineDetails';
import { Engine } from '../../types/flight';

export const EnginesPage: React.FC = () => {
  const [engines, setEngines] = useState(enginesData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<Engine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [aircraftFilter, setAircraftFilter] = useState('all');

  const filteredEngines = engines.filter(engine => {
    const aircraft = aircraftFleet.find(a => a.id === engine.aircraftId);
    const matchesSearch = 
      engine.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft?.registration.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || engine.status === statusFilter;
    const matchesAircraft = aircraftFilter === 'all' || aircraft?.registration === aircraftFilter;
    
    return matchesSearch && matchesStatus && matchesAircraft;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'removed': return 'bg-gray-100 text-gray-800';
      case 'overhaul': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusCounts = () => {
    return {
      operational: engines.filter(e => e.status === 'operational').length,
      maintenance: engines.filter(e => e.status === 'maintenance').length,
      removed: engines.filter(e => e.status === 'removed').length,
      overhaul: engines.filter(e => e.status === 'overhaul').length
    };
  };

  const statusCounts = getStatusCounts();
  const aircraftRegistrations = Array.from(new Set(aircraftFleet.map(a => a.registration))).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Engine Management</h2>
          <p className="text-gray-600 mt-1">Monitor and manage aircraft engines</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Engine</span>
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
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.maintenance}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Overhaul</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.overhaul}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Removed</p>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.removed}</p>
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
            placeholder="Search engines by serial number, model, or aircraft..."
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
          <option value="operational">Operational</option>
          <option value="maintenance">Maintenance</option>
          <option value="overhaul">Overhaul</option>
          <option value="removed">Removed</option>
        </select>
        <select
          value={aircraftFilter}
          onChange={(e) => setAircraftFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Aircraft</option>
          {aircraftRegistrations.map(reg => (
            <option key={reg} value={reg}>{reg}</option>
          ))}
        </select>
      </div>

      {/* Engines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEngines.map(engine => {
          const aircraft = aircraftFleet.find(a => a.id === engine.aircraftId);
          return (
            <div
              key={engine.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedEngine(engine)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{engine.serialNumber}</h3>
                    <p className="text-sm text-gray-600">{engine.model}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(engine.status)}`}>
                  {engine.status}
                </span>
              </div>

              {/* Aircraft Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Aircraft</span>
                  <span className="font-medium text-gray-900">{aircraft?.registration}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600">Position</span>
                  <span className="font-medium text-gray-900 capitalize">{engine.position}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{engine.totalHours.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{engine.totalCycles.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Cycles</p>
                </div>
              </div>

              {/* Engine Specs */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Thrust Rating</span>
                  <span className="font-medium text-gray-900">{engine.thrustRating.toLocaleString()} lbs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Fuel Consumption</span>
                  <span className="font-medium text-gray-900">{engine.fuelConsumption} gph</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Installation Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date(engine.installationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Maintenance Status */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Next Maintenance</span>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(engine.nextMaintenanceDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Forms and Modals */}
      <EngineForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={(engineData) => {
          const newEngine: Engine = {
            ...engineData,
            id: `eng-${Date.now()}`,
            maintenanceHistory: []
          };
          setEngines([...engines, newEngine]);
          setIsFormOpen(false);
        }}
      />

      {selectedEngine && (
        <EngineDetails
          engine={selectedEngine}
          isOpen={!!selectedEngine}
          onClose={() => setSelectedEngine(null)}
          onEdit={() => {
            setSelectedEngine(null);
            setIsFormOpen(true);
          }}
        />
      )}
    </div>
  );
};