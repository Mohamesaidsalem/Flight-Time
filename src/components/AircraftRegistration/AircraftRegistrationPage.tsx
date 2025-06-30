import React, { useState } from 'react';
import { Plane, Plus, Search, Calendar, FileText, Settings } from 'lucide-react';
import { aircraftFleet } from '../../data/aircraftData';
import { enginesData } from '../../data/enginesData';
import { AircraftRegistrationForm } from './AircraftRegistrationForm';
import { Aircraft, Engine } from '../../types/flight';

export const AircraftRegistrationPage: React.FC = () => {
  const [aircraft, setAircraft] = useState<Aircraft[]>(aircraftFleet);
  const [engines, setEngines] = useState<Engine[]>(enginesData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAircraft = aircraft.filter(ac =>
    ac.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ac.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ac.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAircraftEngines = (aircraftId: string) =>
    engines.filter(engine => engine.aircraftId === aircraftId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'grounded': return 'bg-red-100 text-red-800';
      case 'inspection': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aircraft Registration</h2>
          <p className="text-gray-600 mt-1">Register new aircraft and manage fleet configuration</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Register Aircraft</span>
        </button>
      </div>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Aircraft</p>
              <p className="text-2xl font-bold text-blue-600">{aircraft.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Engines</p>
              <p className="text-2xl font-bold text-green-600">{engines.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Age</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(aircraft.reduce((sum, ac) => sum + (2025 - ac.yearOfManufacture), 0) / aircraft.length)} years
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Fleet Hours</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(aircraft.reduce((sum, ac) => sum + ac.totalFlightHours, 0) / 1000)}K
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search aircraft by registration, model, or serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Aircraft List */}
      <div className="space-y-4">
        {filteredAircraft.map(ac => {
          const aircraftEngines = getAircraftEngines(ac.id);
          return (
            <div key={ac.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Plane className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{ac.registration}</h3>
                    <p className="text-gray-600">{ac.model}</p>
                    <p className="text-sm text-gray-500">S/N: {ac.serialNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ac.status)}`}>
                    {ac.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Registered: {new Date(ac.registrationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{ac.totalFlightHours.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Total Hours</p>
                  <p className="text-xs text-gray-500">Initial: {ac.initialHours.toLocaleString()}</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{ac.totalCycles.toLocaleString()}</p>
                  <p className="text-sm text-green-700">Total Cycles</p>
                  <p className="text-xs text-gray-500">Initial: {ac.initialCycles.toLocaleString()}</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{2025 - ac.yearOfManufacture}</p>
                  <p className="text-sm text-purple-700">Years Old</p>
                  <p className="text-xs text-gray-500">Mfg: {ac.yearOfManufacture}</p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{ac.maxPassengers}</p>
                  <p className="text-sm text-orange-700">Max Passengers</p>
                  <p className="text-xs text-gray-500">{ac.manufacturer}</p>
                </div>
              </div>

              {/* Engines */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Installed Engines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aircraftEngines.map(engine => (
                    <div key={engine.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{engine.serialNumber}</p>
                          <p className="text-sm text-gray-600">{engine.model}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-700 capitalize">{engine.position}</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(engine.status)}`}>
                            {engine.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Hours:</span>
                          <span className="ml-1 font-medium">{engine.totalHours.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cycles:</span>
                          <span className="ml-1 font-medium">{engine.totalCycles.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Thrust:</span>
                          <span className="ml-1 font-medium">{engine.thrustRating.toLocaleString()} lbs</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Installed:</span>
                          <span className="ml-1 font-medium">{new Date(engine.installationDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Form */}
      <AircraftRegistrationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={(aircraftData, engineData) => {
          const newAircraftId = `aircraft-${Date.now()}`;
          const newEngineIds = engineData.map(() => `eng-${Date.now()}-${Math.random()}`);

          const newAircraft: Aircraft = {
            ...aircraftData,
            id: newAircraftId,
            engineIds: newEngineIds,
          };

          const newEngines: Engine[] = engineData.map((engine, index) => ({
            ...engine,
            id: newEngineIds[index],
            aircraftId: newAircraftId,
            maintenanceHistory: [],
          }));

          setAircraft([...aircraft, newAircraft]);
          setEngines([...engines, ...newEngines]);
          setIsFormOpen(false);
        }}
      />
    </div>
  );
};
