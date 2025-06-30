import React, { useState } from 'react';
import { Calendar, TrendingUp, BarChart3, PieChart, Download, Filter, Plane, Clock, RotateCcw } from 'lucide-react';
import { useFlights } from '../../hooks/useFlights';
import { ReportChart } from './ReportChart';
import { ComparisonTable } from './ComparisonTable';
import { PerformanceMetrics } from './PerformanceMetrics';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState('2025-06');
  const [selectedAircraft, setSelectedAircraft] = useState('all');
  const [comparisonPeriod, setComparisonPeriod] = useState('2024-06');
  
  const { flights, getAircraftStats } = useFlights();
  const aircraftStats = getAircraftStats();

  const generateReportData = () => {
    const currentPeriodFlights = flights.filter(flight => 
      flight.date.startsWith(selectedPeriod)
    );
    
    const comparisonFlights = flights.filter(flight => 
      flight.date.startsWith(comparisonPeriod)
    );

    return {
      current: currentPeriodFlights,
      comparison: comparisonFlights,
      aircraftStats
    };
  };

  const reportData = generateReportData();

  const getReportTitle = () => {
    const periodMap = {
      daily: 'Daily Report',
      weekly: 'Weekly Report', 
      monthly: 'Monthly Report',
      yearly: 'Annual Report'
    };
    return periodMap[reportType];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flight Operations Reports</h2>
          <p className="text-gray-600 mt-1">Comprehensive analytics and performance insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Period</label>
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compare With</label>
            <input
              type="month"
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft</label>
            <select
              value={selectedAircraft}
              onChange={(e) => setSelectedAircraft(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Aircraft</option>
              {aircraftStats.map(aircraft => (
                <option key={aircraft.registration} value={aircraft.registration}>
                  {aircraft.registration}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <PerformanceMetrics 
        currentData={reportData.current}
        comparisonData={reportData.comparison}
        selectedPeriod={selectedPeriod}
        comparisonPeriod={comparisonPeriod}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportChart 
          title="Flight Hours Comparison"
          data={reportData}
          type="hours"
          selectedAircraft={selectedAircraft}
        />
        <ReportChart 
          title="Flight Cycles Comparison"
          data={reportData}
          type="cycles"
          selectedAircraft={selectedAircraft}
        />
      </div>

      {/* Detailed Comparison Table */}
      <ComparisonTable 
        aircraftStats={aircraftStats}
        currentPeriod={selectedPeriod}
        comparisonPeriod={comparisonPeriod}
        selectedAircraft={selectedAircraft}
      />

      {/* Aircraft Performance Ranking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Aircraft Performance Ranking</h3>
        </div>
        
        <div className="space-y-4">
          {aircraftStats
            .sort((a, b) => b.efficiency - a.efficiency)
            .map((aircraft, index) => (
              <div key={aircraft.registration} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Plane className="h-4 w-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">{aircraft.registration}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Efficiency</p>
                    <p className="font-bold text-green-600">{aircraft.efficiency}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Utilization</p>
                    <p className="font-bold text-blue-600">{aircraft.utilizationRate}h/day</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      aircraft.status === 'operational' ? 'bg-green-100 text-green-800' :
                      aircraft.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {aircraft.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};