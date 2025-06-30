import React, { useState } from 'react';
import { Search, Plus, Edit3, Trash2, Download, Filter, Plane } from 'lucide-react';
import { Flight } from '../../types/flight';

interface FlightTableProps {
  flights: Flight[];
  onEdit: (flight: Flight) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const FlightTable: React.FC<FlightTableProps> = ({
  flights,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Flight>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedAircraft, setSelectedAircraft] = useState<string>('all');

  const aircraftRegistrations = Array.from(new Set(flights.map(f => f.registration))).sort();

  const filteredFlights = flights.filter(flight => {
    const matchesSearch = 
      flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.date.includes(searchTerm) ||
      flight.ser.toString().includes(searchTerm) ||
      flight.registration.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAircraft = selectedAircraft === 'all' || flight.registration === selectedAircraft;
    
    return matchesSearch && matchesAircraft;
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Flight) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getAircraftColor = (registration: string) => {
    const colors = {
      'SME': 'bg-blue-100 text-blue-800',
      'SMD': 'bg-green-100 text-green-800',
      'SMC': 'bg-purple-100 text-purple-800',
      'SMA': 'bg-orange-100 text-orange-800',
      'SMB': 'bg-red-100 text-red-800',
    };
    return colors[registration as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flight Logs</h2>
          <p className="text-gray-600 mt-1">Comprehensive flight operations data with auto-calculations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Flight</span>
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search flights by route, date, serial, or aircraft..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedAircraft}
          onChange={(e) => setSelectedAircraft(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Aircraft</option>
          {aircraftRegistrations.map(reg => (
            <option key={reg} value={reg}>{reg}</option>
          ))}
        </select>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <span className="text-blue-700 font-medium">Showing Flights</span>
            <p className="text-2xl font-bold text-blue-900">{sortedFlights.length}</p>
          </div>
          <div className="text-center">
            <span className="text-blue-700 font-medium">Total Hours</span>
            <p className="text-2xl font-bold text-blue-900">
              {sortedFlights.reduce((sum, f) => sum + f.flightHours + (f.flightMinutes / 60), 0).toFixed(1)}h
            </p>
          </div>
          <div className="text-center">
            <span className="text-blue-700 font-medium">Total Cycles</span>
            <p className="text-2xl font-bold text-blue-900">
              {sortedFlights.reduce((sum, f) => sum + f.cycles, 0)}
            </p>
          </div>
          <div className="text-center">
            <span className="text-blue-700 font-medium">Aircraft</span>
            <p className="text-2xl font-bold text-blue-900">
              {selectedAircraft === 'all' ? aircraftRegistrations.length : 1}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('ser')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Serial
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Date
                </th>
                <th
                  onClick={() => handleSort('registration')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Aircraft
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flight Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Landing Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FWI Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cycles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TLB #
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedFlights.map((flight) => (
                <tr key={flight.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {flight.ser}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(flight.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getAircraftColor(flight.registration)}`}>
                      <Plane className="h-3 w-3 inline mr-1" />
                      {flight.registration}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {flight.from}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        {flight.to}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(flight.flightHours, flight.flightMinutes)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(flight.landingHours, flight.landingMinutes)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(flight.fwiHours, flight.fwiMinutes)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                      {flight.cycles}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {flight.totalHours.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {flight.tlbNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(flight)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-150"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(flight.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedFlights.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
          <p className="text-gray-500">Try adjusting your search terms or add a new flight</p>
        </div>
      )}
    </div>
  );
};