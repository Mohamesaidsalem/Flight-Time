import React from 'react';
import { Plane, Clock, RotateCcw, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { AircraftStats } from '../../types/flight';

interface AircraftCardProps {
  aircraft: AircraftStats;
}

export const AircraftCard: React.FC<AircraftCardProps> = ({ aircraft }) => {
  const getUtilizationColor = (rate: number) => {
    if (rate >= 8) return 'text-green-600 bg-green-100';
    if (rate >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (lastFlight: string) => {
    const daysSinceLastFlight = Math.floor(
      (new Date().getTime() - new Date(lastFlight).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastFlight <= 1) return 'bg-green-500';
    if (daysSinceLastFlight <= 7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{aircraft.registration}</h3>
              <p className="text-blue-100 text-sm">Aircraft Registration</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(aircraft.lastFlight)}`}></div>
            <span className="text-sm text-blue-100">
              {aircraft.lastFlight ? new Date(aircraft.lastFlight).toLocaleDateString() : 'No flights'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="bg-blue-50 p-3 rounded-lg mb-2">
              <Clock className="h-6 w-6 text-blue-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{aircraft.totalFlightHours}h</p>
            <p className="text-sm text-gray-600">Total Hours</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-50 p-3 rounded-lg mb-2">
              <RotateCcw className="h-6 w-6 text-orange-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{aircraft.totalCycles}</p>
            <p className="text-sm text-gray-600">Total Cycles</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-50 p-3 rounded-lg mb-2">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{aircraft.avgFlightTime}h</p>
            <p className="text-sm text-gray-600">Avg Flight</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-50 p-3 rounded-lg mb-2">
              <Plane className="h-6 w-6 text-purple-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{aircraft.totalFlights}</p>
            <p className="text-sm text-gray-600">Total Flights</p>
          </div>
        </div>

        {/* Current Month Stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="h-4 w-4 text-gray-600" />
            <h4 className="font-semibold text-gray-900">Current Month</h4>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-blue-600">{aircraft.currentMonth.flights}</p>
              <p className="text-xs text-gray-600">Flights</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">{aircraft.currentMonth.hours}h</p>
              <p className="text-xs text-gray-600">Hours</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-600">{aircraft.currentMonth.cycles}</p>
              <p className="text-xs text-gray-600">Cycles</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Most Used Route</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{aircraft.mostUsedRoute}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Utilization Rate</span>
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded ${getUtilizationColor(aircraft.utilizationRate)}`}>
              {aircraft.utilizationRate}h/day
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};