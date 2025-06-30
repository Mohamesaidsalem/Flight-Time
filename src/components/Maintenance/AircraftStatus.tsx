import React from 'react';
import { Plane, AlertTriangle, CheckCircle, XCircle, Wrench, Clock, Calendar } from 'lucide-react';
import { aircraftFleet } from '../../data/aircraftData';

export const AircraftStatus: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'maintenance':
        return <Wrench className="h-5 w-5 text-yellow-600" />;
      case 'grounded':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'inspection':
        return <AlertTriangle className="h-5 w-5 text-blue-600" />;
      default:
        return <Plane className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-50 border-green-200';
      case 'maintenance':
        return 'bg-yellow-50 border-yellow-200';
      case 'grounded':
        return 'bg-red-50 border-red-200';
      case 'inspection':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getNextMaintenanceDays = (nextDate: string) => {
    const today = new Date();
    const next = new Date(nextDate);
    const diffTime = next.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aircraftFleet.map(aircraft => {
          const nextMaintenanceDays = getNextMaintenanceDays(aircraft.nextMaintenanceDate);
          const isMaintenanceDue = nextMaintenanceDays <= 7;
          
          return (
            <div
              key={aircraft.id}
              className={`rounded-xl border-2 p-6 ${getStatusColor(aircraft.status)}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded-lg">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{aircraft.registration}</h3>
                    <p className="text-sm text-gray-600">{aircraft.model}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(aircraft.status)}
                  <span className="text-sm font-medium capitalize text-gray-700">
                    {aircraft.status}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {aircraft.totalFlightHours.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {aircraft.totalCycles.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Cycles</p>
                </div>
              </div>

              {/* Efficiency Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Efficiency</span>
                  <span className="text-sm font-bold text-gray-900">{aircraft.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      aircraft.efficiency >= 90 ? 'bg-green-500' :
                      aircraft.efficiency >= 75 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${aircraft.efficiency}%` }}
                  ></div>
                </div>
              </div>

              {/* Maintenance Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Maintenance</span>
                  <span className="font-medium text-gray-900">
                    {new Date(aircraft.lastMaintenanceDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next Maintenance</span>
                  <div className="flex items-center space-x-2">
                    {isMaintenanceDue && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    <span className={`font-medium ${isMaintenanceDue ? 'text-orange-600' : 'text-gray-900'}`}>
                      {nextMaintenanceDays > 0 ? `${nextMaintenanceDays} days` : 'Overdue'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Utilization</span>
                  <span className="font-medium text-gray-900">{aircraft.utilizationRate}h/day</span>
                </div>
              </div>

              {/* Issues */}
              {aircraft.issues.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {aircraft.issues.length} Active Issue{aircraft.issues.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {aircraft.issues.slice(0, 2).map(issue => (
                      <div key={issue.id} className="text-xs text-gray-600">
                        <span className={`px-1 py-0.5 rounded text-xs font-medium mr-2 ${
                          issue.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          issue.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {issue.priority}
                        </span>
                        {issue.description}
                      </div>
                    ))}
                    {aircraft.issues.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{aircraft.issues.length - 2} more issues
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};