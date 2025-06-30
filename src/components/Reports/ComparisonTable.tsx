import React from 'react';
import { TrendingUp, TrendingDown, Minus, Plane } from 'lucide-react';
import { AircraftStats } from '../../types/flight';

interface ComparisonTableProps {
  aircraftStats: AircraftStats[];
  currentPeriod: string;
  comparisonPeriod: string;
  selectedAircraft: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  aircraftStats,
  currentPeriod,
  comparisonPeriod,
  selectedAircraft
}) => {
  const filteredStats = selectedAircraft === 'all' 
    ? aircraftStats 
    : aircraftStats.filter(a => a.registration === selectedAircraft);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Detailed Comparison: {currentPeriod} vs {comparisonPeriod}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aircraft
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previous Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Cycles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previous Cycles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cycles Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStats.map((aircraft) => (
              <tr key={aircraft.registration} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900">{aircraft.registration}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {aircraft.currentMonth.hours}h
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {aircraft.comparison.lastYear.hours}h
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(aircraft.comparison.lastYear.change)}
                    <span className={`text-sm font-medium ${getTrendColor(aircraft.comparison.lastYear.change)}`}>
                      {aircraft.comparison.lastYear.change >= 0 ? '+' : ''}{aircraft.comparison.lastYear.change.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {aircraft.currentMonth.cycles}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {aircraft.comparison.lastYear.cycles}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(aircraft.comparison.lastYear.change)}
                    <span className={`text-sm font-medium ${getTrendColor(aircraft.comparison.lastYear.change)}`}>
                      {aircraft.comparison.lastYear.change >= 0 ? '+' : ''}{aircraft.comparison.lastYear.change.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(aircraft.utilizationRate * 10, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{aircraft.utilizationRate}h/day</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    aircraft.status === 'operational' ? 'bg-green-100 text-green-800' :
                    aircraft.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {aircraft.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};