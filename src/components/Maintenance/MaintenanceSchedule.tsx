import React, { useState } from 'react';
import { Calendar, Clock, Wrench, AlertCircle } from 'lucide-react';
import { maintenanceRecords, aircraftFleet } from '../../data/aircraftData';

export const MaintenanceSchedule: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-07');

  const getScheduleForMonth = (month: string) => {
    return maintenanceRecords.filter(record => 
      record.scheduledDate.startsWith(month)
    ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  };

  const scheduleData = getScheduleForMonth(selectedMonth);

  const getDaysInMonth = (month: string) => {
    const [year, monthNum] = month.split('-').map(Number);
    return new Date(year, monthNum, 0).getDate();
  };

  const getMaintenanceForDay = (day: number) => {
    const dateStr = `${selectedMonth}-${day.toString().padStart(2, '0')}`;
    return scheduleData.filter(record => record.scheduledDate === dateStr);
  };

  const daysInMonth = getDaysInMonth(selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Maintenance Schedule</h3>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {days.map(day => {
            const dayMaintenance = getMaintenanceForDay(day);
            const hasOverdue = dayMaintenance.some(m => m.status === 'overdue');
            const hasScheduled = dayMaintenance.length > 0;
            
            return (
              <div
                key={day}
                className={`min-h-[100px] p-2 border rounded-lg ${
                  hasOverdue ? 'bg-red-50 border-red-200' :
                  hasScheduled ? 'bg-blue-50 border-blue-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="font-medium text-gray-900 mb-2">{day}</div>
                <div className="space-y-1">
                  {dayMaintenance.map(maintenance => {
                    const aircraft = aircraftFleet.find(a => a.id === maintenance.aircraftId);
                    return (
                      <div
                        key={maintenance.id}
                        className={`text-xs p-1 rounded ${
                          maintenance.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          maintenance.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <div className="font-medium">{aircraft?.registration}</div>
                        <div className="truncate">{maintenance.type}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Maintenance List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Scheduled Maintenance for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h4>
        
        <div className="space-y-4">
          {scheduleData.map(maintenance => {
            const aircraft = aircraftFleet.find(a => a.id === maintenance.aircraftId);
            const isOverdue = new Date(maintenance.scheduledDate) < new Date() && maintenance.status !== 'completed';
            
            return (
              <div key={maintenance.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    isOverdue ? 'bg-red-100' :
                    maintenance.status === 'in-progress' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <Wrench className={`h-4 w-4 ${
                      isOverdue ? 'text-red-600' :
                      maintenance.status === 'in-progress' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{aircraft?.registration}</span>
                      {isOverdue && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                    <p className="text-sm text-gray-600">{maintenance.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(maintenance.scheduledDate).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{maintenance.duration}h</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    maintenance.status === 'completed' ? 'bg-green-100 text-green-800' :
                    maintenance.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    isOverdue ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {isOverdue ? 'Overdue' : maintenance.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">${maintenance.cost.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};