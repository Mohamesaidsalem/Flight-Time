import React, { useState } from 'react';
import { Plane, Clock, RotateCcw, TrendingUp, MapPin, Calendar, BarChart3 } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { AircraftCard } from './AircraftCard';
import { FlightStats, AircraftStats } from '../../types/flight';

interface DashboardProps {
  stats: FlightStats;
  aircraftStats: AircraftStats[];
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, aircraftStats }) => {
  const [viewMode, setViewMode] = useState<'overview' | 'aircraft'>('overview');

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flight Operations Dashboard</h2>
          <p className="text-gray-600 mt-1">Real-time flight operations overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'overview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Fleet Overview
            </button>
            <button
              onClick={() => setViewMode('aircraft')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'aircraft'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plane className="h-4 w-4 inline mr-2" />
              By Aircraft
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {viewMode === 'overview' ? (
        <>
          {/* Fleet Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Flights"
              value={stats.totalFlights.toLocaleString()}
              subtitle="All fleet operations"
              icon={Plane}
              color="blue"
              trend={{ value: 12, label: "this month" }}
            />
            <StatsCard
              title="Flight Hours"
              value={`${stats.totalFlightHours.toLocaleString()}h`}
              subtitle="Total operational time"
              icon={Clock}
              color="green"
              trend={{ value: 8, label: "this month" }}
            />
            <StatsCard
              title="Total Cycles"
              value={stats.totalCycles.toLocaleString()}
              subtitle="Landing cycles"
              icon={RotateCcw}
              color="orange"
              trend={{ value: 15, label: "this month" }}
            />
            <StatsCard
              title="Avg Flight Time"
              value={`${stats.avgFlightTime}h`}
              subtitle="Per flight average"
              icon={TrendingUp}
              color="purple"
            />
          </div>

          {/* Fleet Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Most Used Route</h3>
              </div>
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-blue-600 mb-2">{stats.mostUsedRoute}</p>
                <p className="text-gray-600">Primary flight corridor</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Current Month</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Flights</span>
                  <span className="font-semibold text-gray-900">{stats.currentMonth.flights}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hours</span>
                  <span className="font-semibold text-gray-900">{stats.currentMonth.hours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cycles</span>
                  <span className="font-semibold text-gray-900">{stats.currentMonth.cycles}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Fleet Status</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Active Aircraft</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="font-semibold">{aircraftStats.length}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Data Sync</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="font-semibold">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Last Backup</span>
                  <span className="font-semibold">2 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Aircraft Individual Stats */}
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">
                  Fleet Size: {aircraftStats.length} Aircraft
                </span>
                <span className="text-blue-700">
                  Total Fleet Hours: {aircraftStats.reduce((sum, a) => sum + a.totalFlightHours, 0).toLocaleString()}h
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aircraftStats.map((aircraft) => (
              <AircraftCard key={aircraft.registration} aircraft={aircraft} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};