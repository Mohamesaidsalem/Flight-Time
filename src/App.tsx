import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { FlightTable } from './components/FlightTable/FlightTable';
import { FlightForm } from './components/FlightForm/FlightForm';
import { ReportsPage } from './components/Reports/ReportsPage';
import { MaintenancePage } from './components/Maintenance/MaintenancePage';
import { OptimalAircraftPage } from './components/OptimalAircraft/OptimalAircraftPage';
import { PilotsPage } from './components/Pilots/PilotsPage';
import { EnginesPage } from './components/Engines/EnginesPage';
import { AircraftRegistrationPage } from './components/AircraftRegistration/AircraftRegistrationPage';
import { useFlights } from './hooks/useFlights';
import { Flight } from './types/flight';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | undefined>(undefined);
  
  const { flights, loading, addFlight, updateFlight, deleteFlight, getFlightStats, getAircraftStats } = useFlights();

  const handleAddFlight = () => {
    setEditingFlight(undefined);
    setIsFormOpen(true);
  };

  const handleEditFlight = (flight: Flight) => {
    setEditingFlight(flight);
    setIsFormOpen(true);
  };

  const handleSaveFlight = (flightData: Omit<Flight, 'id'>) => {
    if (editingFlight) {
      updateFlight(editingFlight.id, flightData);
    } else {
      addFlight(flightData);
    }
    setIsFormOpen(false);
    setEditingFlight(undefined);
  };

  const handleDeleteFlight = (id: string) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      deleteFlight(id);
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingFlight(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading aviation management system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            stats={getFlightStats()} 
            aircraftStats={getAircraftStats()}
          />
        )}
        
        {activeTab === 'flights' && (
          <FlightTable
            flights={flights}
            onAdd={handleAddFlight}
            onEdit={handleEditFlight}
            onDelete={handleDeleteFlight}
          />
        )}

        {activeTab === 'pilots' && <PilotsPage />}
        
        {activeTab === 'engines' && <EnginesPage />}
        
        {activeTab === 'registration' && <AircraftRegistrationPage />}

        {activeTab === 'reports' && <ReportsPage />}
        
        {activeTab === 'maintenance' && <MaintenancePage />}
        
        {activeTab === 'optimal' && <OptimalAircraftPage />}
        
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">System Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aircraft Fleet Management</h3>
                <p className="text-gray-600 mb-4">Manage your aircraft registrations, maintenance schedules, and operational status.</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {getAircraftStats().map(aircraft => (
                    <div key={aircraft.registration} className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="font-semibold text-blue-900">{aircraft.registration}</p>
                      <p className="text-sm text-blue-600">{aircraft.totalFlights} flights</p>
                      <p className="text-xs text-gray-600">{aircraft.status}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">System Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Automated Calculations</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✓ Automatic time calculations</li>
                      <li>✓ Cumulative totals tracking</li>
                      <li>✓ Monthly statistics</li>
                      <li>✓ Aircraft utilization rates</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Advanced Features</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ Pilot management system</li>
                      <li>✓ Engine tracking & monitoring</li>
                      <li>✓ Aircraft registration system</li>
                      <li>✓ Maintenance scheduling</li>
                      <li>✓ Performance analytics</li>
                      <li>✓ Optimal aircraft selection</li>
                      <li>✓ Comprehensive reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <FlightForm
        flight={editingFlight}
        isOpen={isFormOpen}
        onSave={handleSaveFlight}
        onCancel={handleCancelForm}
      />
    </div>
  );
}

export default App;