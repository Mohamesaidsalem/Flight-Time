import React, { useState } from 'react';
import { X, Save, Plane, Settings, Plus, Trash2 } from 'lucide-react';
import { Aircraft, Engine } from '../../types/flight';

interface AircraftRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (aircraft: Omit<Aircraft, 'id' | 'engineIds'>, engines: Omit<Engine, 'id' | 'aircraftId' | 'maintenanceHistory'>[]) => void;
}

export const AircraftRegistrationForm: React.FC<AircraftRegistrationFormProps> = ({ isOpen, onClose, onSave }) => {
  const [aircraftData, setAircraftData] = useState({
    registration: '',
    model: 'Boeing 737-800',
    serialNumber: '',
    status: 'operational' as Aircraft['status'],
    totalFlightHours: 0,
    totalCycles: 0,
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    maintenanceHours: 500,
    maintenanceCycles: 250,
    issues: [],
    utilizationRate: 0,
    efficiency: 85,
    initialHours: 0,
    initialCycles: 0,
    registrationDate: new Date().toISOString().split('T')[0],
    manufacturer: 'Boeing',
    yearOfManufacture: 2020,
    maxPassengers: 189
  });

  const [engines, setEngines] = useState([
    {
      serialNumber: '',
      model: 'CFM56-7B24',
      manufacturer: 'CFM International',
      position: 'left' as Engine['position'],
      totalHours: 0,
      totalCycles: 0,
      initialHours: 0,
      initialCycles: 0,
      installationDate: new Date().toISOString().split('T')[0],
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      status: 'operational' as Engine['status'],
      thrustRating: 24500,
      fuelConsumption: 650
    },
    {
      serialNumber: '',
      model: 'CFM56-7B24',
      manufacturer: 'CFM International',
      position: 'right' as Engine['position'],
      totalHours: 0,
      totalCycles: 0,
      initialHours: 0,
      initialCycles: 0,
      installationDate: new Date().toISOString().split('T')[0],
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      status: 'operational' as Engine['status'],
      thrustRating: 24500,
      fuelConsumption: 650
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(aircraftData, engines);
  };

  const handleAircraftChange = (field: string, value: any) => {
    setAircraftData(prev => ({
      ...prev,
      [field]: typeof value === 'string' && (field === 'totalFlightHours' || field === 'totalCycles' || field === 'initialHours' || field === 'initialCycles' || field === 'maintenanceHours' || field === 'maintenanceCycles' || field === 'utilizationRate' || field === 'efficiency' || field === 'yearOfManufacture' || field === 'maxPassengers')
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleEngineChange = (index: number, field: string, value: any) => {
    setEngines(prev => prev.map((engine, i) =>
      i === index ? {
        ...engine,
        [field]: typeof value === 'string' && (field === 'totalHours' || field === 'totalCycles' || field === 'initialHours' || field === 'initialCycles' || field === 'thrustRating' || field === 'fuelConsumption')
          ? parseInt(value) || 0
          : value
      } : engine
    ));
  };

  const addEngine = () => {
    setEngines(prev => [...prev, {
      serialNumber: '',
      model: 'CFM56-7B24',
      manufacturer: 'CFM International',
      position: `${prev.length + 1}` as Engine['position'],
      totalHours: 0,
      totalCycles: 0,
      initialHours: 0,
      initialCycles: 0,
      installationDate: new Date().toISOString().split('T')[0],
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      status: 'operational' as Engine['status'],
      thrustRating: 24500,
      fuelConsumption: 650
    }]);
  };

  const removeEngine = (index: number) => {
    if (engines.length > 1) {
      setEngines(prev => prev.filter((_, i) => i !== index));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Register New Aircraft</h2>
              <p className="text-gray-600">Enter aircraft details and engine configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Aircraft Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Aircraft Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration *
                </label>
                <input
                  type="text"
                  value={aircraftData.registration}
                  onChange={(e) => handleAircraftChange('registration', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="SME"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aircraft Model *
                </label>
                <select
                  value={aircraftData.model}
                  onChange={(e) => handleAircraftChange('model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Boeing 737-800">Boeing 737-800</option>
                  <option value="Boeing 737-900">Boeing 737-900</option>
                  <option value="Airbus A320">Airbus A320</option>
                  <option value="Airbus A321">Airbus A321</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number *
                </label>
                <input
                  type="text"
                  value={aircraftData.serialNumber}
                  onChange={(e) => handleAircraftChange('serialNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="B737-28358"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturer
                </label>
                <select
                  value={aircraftData.manufacturer}
                  onChange={(e) => handleAircraftChange('manufacturer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Boeing">Boeing</option>
                  <option value="Airbus">Airbus</option>
                  <option value="Embraer">Embraer</option>
                  <option value="Bombardier">Bombardier</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year of Manufacture
                </label>
                <input
                  type="number"
                  value={aircraftData.yearOfManufacture}
                  onChange={(e) => handleAircraftChange('yearOfManufacture', parseInt(e.target.value))}
                  min="1990"
                  max="2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Passengers
                </label>
                <input
                  type="number"
                  value={aircraftData.maxPassengers}
                  onChange={(e) => handleAircraftChange('maxPassengers', parseInt(e.target.value))}
                  min="50"
                  max="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Flight Hours
                </label>
                <input
                  type="number"
                  value={aircraftData.initialHours}
                  onChange={(e) => handleAircraftChange('initialHours', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Cycles
                </label>
                <input
                  type="number"
                  value={aircraftData.initialCycles}
                  onChange={(e) => handleAircraftChange('initialCycles', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Date
                </label>
                <input
                  type="date"
                  value={aircraftData.registrationDate}
                  onChange={(e) => handleAircraftChange('registrationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Engines Configuration */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Engines Configuration
              </h3>
              <button
                type="button"
                onClick={addEngine}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Engine</span>
              </button>
            </div>

            <div className="space-y-6">
              {engines.map((engine, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-gray-900">Engine {index + 1}</h4>
                    </div>
                    {engines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEngine(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Serial Number *
                      </label>
                      <input
                        type="text"
                        value={engine.serialNumber}
                        onChange={(e) => handleEngineChange(index, 'serialNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="CFM56-7B24-001"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Engine Model
                      </label>
                      <select
                        value={engine.model}
                        onChange={(e) => handleEngineChange(index, 'model', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="CFM56-7B24">CFM56-7B24</option>
                        <option value="CFM56-7B26">CFM56-7B26</option>
                        <option value="CFM56-7B27">CFM56-7B27</option>
                        <option value="V2500">V2500</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <select
                        value={engine.position}
                        onChange={(e) => handleEngineChange(index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                        <option value="center">Center</option>
                        <option value="1">Engine 1</option>
                        <option value="2">Engine 2</option>
                        <option value="3">Engine 3</option>
                        <option value="4">Engine 4</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thrust Rating (lbs)
                      </label>
                      <input
                        type="number"
                        value={engine.thrustRating}
                        onChange={(e) => handleEngineChange(index, 'thrustRating', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Initial Hours
                      </label>
                      <input
                        type="number"
                        value={engine.initialHours}
                        onChange={(e) => handleEngineChange(index, 'initialHours', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Initial Cycles
                      </label>
                      <input
                        type="number"
                        value={engine.initialCycles}
                        onChange={(e) => handleEngineChange(index, 'initialCycles', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Installation Date
                      </label>
                      <input
                        type="date"
                        value={engine.installationDate}
                        onChange={(e) => handleEngineChange(index, 'installationDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fuel Consumption (gph)
                      </label>
                      <input
                        type="number"
                        value={engine.fuelConsumption}
                        onChange={(e) => handleEngineChange(index, 'fuelConsumption', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Register Aircraft</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};