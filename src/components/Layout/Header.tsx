import React from 'react';
import { Plane, BarChart3, Settings, FileText, Wrench, Target, Users } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'flights', label: 'Flight Logs', icon: Plane },
    // { id: 'pilots', label: 'Pilots', icon: Users },
    { id: 'engines', label: 'Engines', icon: Settings },
    { id: 'registration', label: 'Aircraft Registration', icon: Plane },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'optimal', label: 'Optimal Aircraft', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Smart Aviation Management System</h1>
              <p className="text-blue-200 text-sm">inspection and quality</p>
            </div>
          </div>
          
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};