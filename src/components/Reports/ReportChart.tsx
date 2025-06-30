import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ReportChartProps {
  title: string;
  data: any;
  type: 'hours' | 'cycles';
  selectedAircraft: string;
}

export const ReportChart: React.FC<ReportChartProps> = ({ title, data, type, selectedAircraft }) => {
  const getChartData = () => {
    const aircraftData = selectedAircraft === 'all' 
      ? ['SME', 'SMD', 'SMC', 'SMA', 'SMB']
      : [selectedAircraft];

    return aircraftData.map(registration => {
      const currentFlights = data.current.filter((f: any) => f.registration === registration);
      const comparisonFlights = data.comparison.filter((f: any) => f.registration === registration);
      
      const currentValue = type === 'hours' 
        ? currentFlights.reduce((sum: number, f: any) => sum + f.flightHours + (f.flightMinutes / 60), 0)
        : currentFlights.reduce((sum: number, f: any) => sum + f.cycles, 0);
        
      const comparisonValue = type === 'hours'
        ? comparisonFlights.reduce((sum: number, f: any) => sum + f.flightHours + (f.flightMinutes / 60), 0)
        : comparisonFlights.reduce((sum: number, f: any) => sum + f.cycles, 0);

      return {
        registration,
        current: Math.round(currentValue * 100) / 100,
        comparison: Math.round(comparisonValue * 100) / 100,
        change: comparisonValue > 0 ? ((currentValue - comparisonValue) / comparisonValue * 100) : 0
      };
    });
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.flatMap(d => [d.current, d.comparison]));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <BarChart3 className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {chartData.map(item => (
          <div key={item.registration} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{item.registration}</span>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-blue-600">Current: {item.current}{type === 'hours' ? 'h' : ''}</span>
                <span className="text-gray-500">Previous: {item.comparison}{type === 'hours' ? 'h' : ''}</span>
                <span className={`font-medium ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex space-x-2 h-8">
                <div className="flex-1 bg-gray-200 rounded">
                  <div 
                    className="bg-blue-500 h-full rounded transition-all duration-500"
                    style={{ width: `${(item.current / maxValue) * 100}%` }}
                  ></div>
                </div>
                <div className="flex-1 bg-gray-200 rounded">
                  <div 
                    className="bg-gray-400 h-full rounded transition-all duration-500"
                    style={{ width: `${(item.comparison / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};