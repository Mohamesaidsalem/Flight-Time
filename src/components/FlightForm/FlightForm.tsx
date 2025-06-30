import React, { useState, useEffect } from 'react';
import { X, Save, Plane, Calculator } from 'lucide-react';
import { Flight } from '../../types/flight';
import { calculateFlightTime, formatTimeFromMinutes } from '../../utils/flightCalculations';

interface FlightFormProps {
  flight?: Flight;
  onSave: (flight: Omit<Flight, 'id'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const FlightForm: React.FC<FlightFormProps> = ({
  flight,
  onSave,
  onCancel,
  isOpen,
}) => {
  const [formData, setFormData] = useState({
    ser: 0,
    date: '',
    registration: '',
    from: '',
    to: '',
    flightHours: 0,
    flightMinutes: 0,
    landingHours: 0,
    landingMinutes: 0,
    fwiHours: 0,
    fwiMinutes: 0,
    cycles: 1,
    totalFwiHours: 0,
    totalFwiMinutes: 0,
    totalCycles: 0,
    tlbNumber: '',
    lastDate: '',
    totalHours: 0,
    totalCyc: 0,
    hrsPerMonth: 0,
    cycPerMonth: 0,
  });

  const [autoCalculate, setAutoCalculate] = useState(true);

  useEffect(() => {
    if (flight) {
      setFormData({
        ser: flight.ser,
        date: flight.date,
        registration: flight.registration,
        from: flight.from,
        to: flight.to,
        flightHours: flight.flightHours,
        flightMinutes: flight.flightMinutes,
        landingHours: flight.landingHours,
        landingMinutes: flight.landingMinutes,
        fwiHours: flight.fwiHours,
        fwiMinutes: flight.fwiMinutes,
        cycles: flight.cycles,
        totalFwiHours: flight.totalFwiHours,
        totalFwiMinutes: flight.totalFwiMinutes,
        totalCycles: flight.totalCycles,
        tlbNumber: flight.tlbNumber,
        lastDate: flight.lastDate,
        totalHours: flight.totalHours,
        totalCyc: flight.totalCyc,
        hrsPerMonth: flight.hrsPerMonth,
        cycPerMonth: flight.cycPerMonth,
      });
    } else {
      // Reset form for new flight
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        ser: Date.now(),
        date: today,
        registration: 'SME',
        from: '',
        to: '',
        flightHours: 0,
        flightMinutes: 0,
        landingHours: 0,
        landingMinutes: 0,
        fwiHours: 0,
        fwiMinutes: 0,
        cycles: 1,
        totalFwiHours: 0,
        totalFwiMinutes: 0,
        totalCycles: 0,
        tlbNumber: '',
        lastDate: today,
        totalHours: 0,
        totalCyc: 0,
        hrsPerMonth: 0,
        cycPerMonth: 0,
      });
    }
  }, [flight, isOpen]);

  // Auto-calculate landing time based on flight time + 1 hour 18 minutes
  useEffect(() => {
    if (autoCalculate && (formData.flightHours > 0 || formData.flightMinutes > 0)) {
      const flightTimeMinutes = calculateFlightTime(formData.flightHours, formData.flightMinutes);
      const landingTimeMinutes = flightTimeMinutes + 78; // Add 1 hour 18 minutes
      const landingTime = formatTimeFromMinutes(landingTimeMinutes);
      
      setFormData(prev => ({
        ...prev,
        landingHours: landingTime.hours,
        landingMinutes: landingTime.minutes,
      }));
    }
  }, [formData.flightHours, formData.flightMinutes, autoCalculate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const aircraftRegistrations = ['SME', 'SMD', 'SMC', 'SMA', 'SMB'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {flight ? 'Edit Flight' : 'Add New Flight'}
              </h2>
              <p className="text-gray-600">Enter flight details with automatic calculations</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Auto Calculate Toggle */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Auto Calculate Landing Time</span>
                <span className="text-sm text-blue-600">(Flight Time + 1:18)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCalculate}
                  onChange={(e) => setAutoCalculate(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

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
                  type="number"
                  value={formData.ser}
                  onChange={(e) => handleInputChange('ser', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aircraft Registration
                </label>
                <select
                  value={formData.registration}
                  onChange={(e) => handleInputChange('registration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {aircraftRegistrations.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  type="text"
                  value={formData.from}
                  onChange={(e) => handleInputChange('from', e.target.value.toUpperCase())}
                  placeholder="CAI"
                  maxLength={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="text"
                  value={formData.to}
                  onChange={(e) => handleInputChange('to', e.target.value.toUpperCase())}
                  placeholder="SSH"
                  maxLength={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Flight Times */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Flight Times
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flight Hours
                  </label>
                  <input
                    type="number"
                    value={formData.flightHours}
                    onChange={(e) => handleInputChange('flightHours', parseInt(e.target.value) || 0)}
                    min="0"
                    max="23"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flight Minutes
                  </label>
                  <input
                    type="number"
                    value={formData.flightMinutes}
                    onChange={(e) => handleInputChange('flightMinutes', parseInt(e.target.value) || 0)}
                    min="0"
                    max="59"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landing Hours
                  </label>
                  <input
                    type="number"
                    value={formData.landingHours}
                    onChange={(e) => handleInputChange('landingHours', parseInt(e.target.value) || 0)}
                    min="0"
                    max="23"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={autoCalculate}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landing Minutes
                  </label>
                  <input
                    type="number"
                    value={formData.landingMinutes}
                    onChange={(e) => handleInputChange('landingMinutes', parseInt(e.target.value) || 0)}
                    min="0"
                    max="59"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={autoCalculate}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FWI Hours
                  </label>
                  <input
                    type="number"
                    value={formData.fwiHours}
                    onChange={(e) => handleInputChange('fwiHours', parseInt(e.target.value) || 0)}
                    min="0"
                    max="23"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FWI Minutes
                  </label>
                  <input
                    type="number"
                    value={formData.fwiMinutes}
                    onChange={(e) => handleInputChange('fwiMinutes', parseInt(e.target.value) || 0)}
                    min="0"
                    max="59"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cycles
                </label>
                <input
                  type="number"
                  value={formData.cycles}
                  onChange={(e) => handleInputChange('cycles', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Additional Data */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Additional Data
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TLB Number
                </label>
                <input
                  type="text"
                  value={formData.tlbNumber}
                  onChange={(e) => handleInputChange('tlbNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Auto-Calculated Fields</h4>
                <p className="text-xs text-gray-600 mb-2">These fields will be automatically calculated based on flight data and aircraft history.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Hours:</span>
                    <span className="font-medium">Auto-calculated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cycles:</span>
                    <span className="font-medium">Auto-calculated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Stats:</span>
                    <span className="font-medium">Auto-calculated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Save className="h-4 w-4" />
              <span>{flight ? 'Update Flight' : 'Add Flight'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};