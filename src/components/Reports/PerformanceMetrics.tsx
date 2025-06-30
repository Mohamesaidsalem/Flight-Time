import React from 'react';
import { TrendingUp, TrendingDown, Plane, Clock, RotateCcw, Activity } from 'lucide-react';
import { Flight } from '../../types/flight';

interface PerformanceMetricsProps {
  currentData: Flight[];
  comparisonData: Flight[];
  selectedPeriod: string;
  comparisonPeriod: string;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  currentData,
  comparisonData,
  selectedPeriod,
  comparisonPeriod
}) => {
  const calculateMetrics = (data: Flight[]) => {
    const totalFlights = data.length;
    const totalHours = data.reduce((sum, f) => sum + f.flightHours + (f.flightMinutes / 60), 0);
    const totalCycles = data.reduce((sum, f) => sum + f.cycles, 0);
    const avgFlightTime = totalFlights > 0 ? totalHours / totalFlights : 0;
    
    return { totalFlights, totalHours, totalCycles, avgFlightTime };
  };

  const current = calculateMetrics(currentData);
  const comparison = calculateMetrics(comparisonData);

  const getChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const metrics = [
    {
      title: 'Total Flights',
      current: current.totalFlights,
      previous: comparison.totalFlights,
      change: getChange(current.totalFlights, comparison.totalFlights),
      icon: Plane,
      color: 'blue'
    },
    {
      title: 'Flight Hours',
      current: current.totalHours.toFixed(1),
      previous: comparison.totalHours.toFixed(1),
      change: getChange(current.totalHours, comparison.totalHours),
      icon: Clock,
      color: 'green',
      suffix: 'h'
    },
    {
      title: 'Total Cycles',
      current: current.totalCycles,
      previous: comparison.totalCycles,
      change: getChange(current.totalCycles, comparison.totalCycles),
      icon: RotateCcw,
      color: 'orange'
    },
    {
      title: 'Avg Flight Time',
      current: current.avgFlightTime.toFixed(1),
      previous: comparison.avgFlightTime.toFixed(1),
      change: getChange(current.avgFlightTime, comparison.avgFlightTime),
      icon: Activity,
      color: 'purple',
      suffix: 'h'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = metric.change >= 0;
        
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colorClasses[metric.color as keyof typeof colorClasses]} bg-opacity-10`}>
                <Icon className={`h-6 w-6 ${colorClasses[metric.color as keyof typeof colorClasses].replace('bg-', 'text-')}`} />
              </div>
              <div className="flex items-center space-x-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{metric.change.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {metric.current}{metric.suffix || ''}
                </span>
                <span className="text-sm text-gray-500">
                  vs {metric.previous}{metric.suffix || ''}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {selectedPeriod} vs {comparisonPeriod}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};