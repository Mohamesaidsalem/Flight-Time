import React, { useState } from 'react';
import { Plane, TrendingUp, Clock, Wrench, CheckCircle, AlertTriangle } from 'lucide-react';
import { useFlights } from '../../hooks/useFlights';
import { aircraftFleet } from '../../data/aircraftData';
import { OptimalAircraftRecommendation } from '../../types/flight';

export const OptimalAircraftPage: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [flightDuration, setFlightDuration] = useState(2);
  const [priority, setPriority] = useState<'efficiency' | 'availability' | 'cost'>('efficiency');
  
  const { flights, getAircraftStats } = useFlights();
  const aircraftStats = getAircraftStats();

  const getOptimalAircraft = (): OptimalAircraftRecommendation[] => {
    return aircraftStats
      .filter(aircraft => {
        const aircraftData = aircraftFleet.find(a => a.registration === aircraft.registration);
        return aircraftData?.status === 'operational';
      })
      .map(aircraft => {
        const aircraftData = aircraftFleet.find(a => a.registration === aircraft.registration);
        let score = 0;
        const reasons: string[] = [];

        // Efficiency scoring (0-40 points)
        const efficiencyScore = (aircraft.efficiency / 100) * 40;
        score += efficiencyScore;
        if (aircraft.efficiency >= 90) {
          reasons.push('High efficiency rating (90%+)');
        }

        // Utilization scoring (0-30 points) - lower utilization is better
        const maxUtilization = Math.max(...aircraftStats.map(a => a.utilizationRate));
        const utilizationScore = ((maxUtilization - aircraft.utilizationRate) / maxUtilization) * 30;
        score += utilizationScore;
        if (aircraft.utilizationRate < 7) {
          reasons.push('Low current utilization - available for more flights');
        }

        // Maintenance status scoring (0-20 points)
        const nextMaintenanceDays = Math.ceil(
          (new Date(aircraftData?.nextMaintenanceDate || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        if (nextMaintenanceDays > 30) {
          score += 20;
          reasons.push('Maintenance not due for 30+ days');
        } else if (nextMaintenanceDays > 14) {
          score += 15;
          reasons.push('Maintenance not due for 2+ weeks');
        } else if (nextMaintenanceDays > 7) {
          score += 10;
        }

        // Route experience scoring (0-10 points)
        if (selectedRoute && aircraft.mostUsedRoute === selectedRoute) {
          score += 10;
          reasons.push(`Experienced on ${selectedRoute} route`);
        }

        // Issues penalty
        const issueCount = aircraftData?.issues.length || 0;
        score -= issueCount * 5;
        if (issueCount === 0) {
          reasons.push('No active maintenance issues');
        }

        return {
          registration: aircraft.registration,
          score: Math.round(score),
          reasons,
          utilizationRate: aircraft.utilizationRate,
          maintenanceStatus: `${nextMaintenanceDays} days until maintenance`,
          availability: aircraftData?.status === 'operational'
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  const recommendations = getOptimalAircraft();
  const routes = Array.from(new Set(flights.map(f => `${f.from}-${f.to}`))).sort();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRecommendationBadge = (index: number) => {
    if (index === 0) return { text: 'BEST CHOICE', color: 'bg-green-500 text-white' };
    if (index === 1) return { text: 'GOOD OPTION', color: 'bg-blue-500 text-white' };
    if (index === 2) return { text: 'ALTERNATIVE', color: 'bg-gray-500 text-white' };
    return { text: 'AVAILABLE', color: 'bg-gray-400 text-white' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Optimal Aircraft Selection</h2>
          <p className="text-gray-600 mt-1">AI-powered recommendations for flight assignments</p>
        </div>
      </div>

      {/* Selection Criteria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Route</option>
              {routes.map(route => (
                <option key={route} value={route}>{route}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Flight Duration (hours)
            </label>
            <input
              type="number"
              value={flightDuration}
              onChange={(e) => setFlightDuration(Number(e.target.value))}
              min="0.5"
              max="12"
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="efficiency">Efficiency</option>
              <option value="availability">Availability</option>
              <option value="cost">Cost Optimization</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Aircraft Recommendations</h3>
        
        {recommendations.map((recommendation, index) => {
          const badge = getRecommendationBadge(index);
          const aircraftData = aircraftFleet.find(a => a.registration === recommendation.registration);
          
          return (
            <div key={recommendation.registration} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="text-xl font-bold text-gray-900">{recommendation.registration}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-gray-600">{aircraftData?.model}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(recommendation.score)}`}>
                    {recommendation.score}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Optimization Score</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Current Utilization</p>
                    <p className="font-semibold text-gray-900">{recommendation.utilizationRate}h/day</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Wrench className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Maintenance Status</p>
                    <p className="font-semibold text-gray-900">{recommendation.maintenanceStatus}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Availability</p>
                    <p className="font-semibold text-green-600">Available</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Why This Aircraft?</span>
                </h5>
                <ul className="space-y-1">
                  {recommendation.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {index === 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Recommended: This aircraft offers the best balance of efficiency, availability, and maintenance status for your requirements.
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fleet Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {aircraftFleet.filter(a => a.status === 'operational').length}
            </p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {aircraftFleet.filter(a => a.status === 'maintenance').length}
            </p>
            <p className="text-sm text-gray-600">In Maintenance</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {aircraftFleet.filter(a => a.status === 'grounded').length}
            </p>
            <p className="text-sm text-gray-600">Grounded</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(aircraftStats.reduce((sum, a) => sum + a.utilizationRate, 0) / aircraftStats.length * 10) / 10}
            </p>
            <p className="text-sm text-gray-600">Avg Utilization</p>
          </div>
        </div>
      </div>
    </div>
  );
};