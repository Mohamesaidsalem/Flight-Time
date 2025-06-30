import React, { useState } from 'react';
import { X, Save, Settings, Calendar } from 'lucide-react';
import { Engine } from '../../types/flight';
import { aircraftFleet } from '../../data/aircraftData';

interface EngineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (engine: Omit<Engine, 'id' | 'maintenanceHistory'>) => void;
  engine?: Engine;
}

export const EngineForm: React.FC<EngineFormProps> = ({ isOpen, onClose, onSave, engine }) => {
  const [formData, setFormData] = useState({
    serialNumber: engine?.serialNumber || '',
    model: engine?.model || 'CFM56-7B24',
    manufacturer: engine?.manufacturer || 'CFM International',
    aircraftId: engine?.aircraftId || '',
    position: engine?.position || 'left' as Engine['position'],
    totalHours: engine?.totalHours || 0,
    totalCycles: engine?.totalCycles || 0,
    initialHours: engine?.initialHours || 0,
    initialCycles: engine?.initialCycles || 0,
    installationDate: engine?.installationDate || '',
    lastMaintenanceDate: engine?.lastMaintenanceDate || '',
    nextMaintenanceDate: engine?.nextMaintenanceDate || '',
    status: engine?.status || 'operational' as Engine['status'],
    thrustRating: engine?.thrustRating || 24500,
    fuelConsumption: engine?.fuelConsumption || 650
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {engine ? 'Edit Engine' : 'Add New Engine'}
              </h2>
              <p className="text-gray-600">Enter engine specifications and details</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Engine Model
                </label>
                <select
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="CFM56-7B24">CFM56-7B24</option>
                  <option value="CFM56-7B26">CFM56-7B26</option>
                  <option value="CFM56-7B27">CFM56-7B27</option>
                  <option value="V2500">V2500</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturer
                </label>
                <select
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="CFM International">CFM International</option>
                  <option value="International Aero Engines">International Aero Engines</option>
                  <option value="Pratt & Whitney">Pratt & Whitney</option>
                  <option value="Rolls-Royce">Rolls-Royce</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aircraft
                </label>
                <select
                  value={formData.aircraftId}
                  onChange={(e) => handleInputChange('aircraftId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Aircraft</option>
                  {aircraftFleet.map(aircraft => (
                    <option key={aircraft.id} value={aircraft.id}>
                      {aircraft.registration} - {aircraft.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Engine Position
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
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
            </div>

            {/* Operating Hours & Cycles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Operating Hours & Cycles
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Hours (at installation)
                </label>
                <input
                  type="number"
                  value={formData.initialHours}
                  onChange={(e) => handleInputChange('initialHours', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Cycles (at installation)
                </label>
                <input
                  type="number"
                  value={formData.initialCycles}
                  onChange={(e) => handleInputChange('initialCycles', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Total Hours
                </label>
                <input
                  type="number"
                  value={formData.totalHours}
                  onChange={(e) => handleInputChange('totalHours', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Total Cycles
                </label>
                <input
                  type="number"
                  value={formData.totalCycles}
                  onChange={(e) => handleInputChange('totalCycles', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="operational">Operational</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="overhaul">Overhaul</option>
                  <option value="removed">Removed</option>
                </select>
              </div>
            </div>

            {/* Specifications & Maintenance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Specifications & Maintenance
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thrust Rating (lbs)
                </label>
                <input
                  type="number"
                  value={formData.thrustRating}
                  onChange={(e) => handleInputChange('thrustRating', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Consumption (gph)
                </label>
                <input
                  type="number"
                  value={formData.fuelConsumption}
                  onChange={(e) => handleInputChange('fuelConsumption', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Installation Date
                </label>
                <input
                  type="date"
                  value={formData.installationDate}
                  onChange={(e) => handleInputChange('installationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Last Maintenance Date
                </label>
                <input
                  type="date"
                  value={formData.lastMaintenanceDate}
                  onChange={(e) => handleInputChange('lastMaintenanceDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Next Maintenance Date
                </label>
                <input
                  type="date"
                  value={formData.nextMaintenanceDate}
                  onChange={(e) => handleInputChange('nextMaintenanceDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
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
              <span>{engine ? 'Update Engine' : 'Add Engine'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};