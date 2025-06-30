import { useState, useEffect } from 'react';
import { Flight, FlightStats, AircraftStats } from '../types/flight';
import { mockFlights } from '../data/mockFlights';
import { aircraftFleet } from '../data/aircraftData';
import { 
  calculateFlightTime, 
  formatTimeFromMinutes, 
  calculateMonthlyStats,
  getAircraftRegistrations,
  calculateUtilizationRate
} from '../utils/flightCalculations';

export const useFlights = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data and auto-calculate totals
    setTimeout(() => {
      const processedFlights = processFlightsWithCalculations(mockFlights);
      setFlights(processedFlights);
      setLoading(false);
    }, 500);
  }, []);

  const processFlightsWithCalculations = (flightData: Flight[]): Flight[] => {
    // Sort flights by date and serial number
    const sortedFlights = [...flightData].sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.ser - b.ser;
    });

    // Calculate cumulative totals for each aircraft
    const aircraftTotals: { [key: string]: { hours: number; cycles: number; fwiHours: number; fwiMinutes: number } } = {};

    return sortedFlights.map((flight, index) => {
      const registration = flight.registration;
      
      // Initialize aircraft totals if not exists
      if (!aircraftTotals[registration]) {
        aircraftTotals[registration] = { hours: 0, cycles: 0, fwiHours: 0, fwiMinutes: 0 };
      }

      // Add current flight to totals
      const flightTimeMinutes = calculateFlightTime(flight.flightHours, flight.flightMinutes);
      const fwiTimeMinutes = calculateFlightTime(flight.fwiHours, flight.fwiMinutes);
      
      aircraftTotals[registration].hours += flightTimeMinutes;
      aircraftTotals[registration].cycles += flight.cycles;
      aircraftTotals[registration].fwiMinutes += fwiTimeMinutes;
      
      // Handle FWI hours overflow
      if (aircraftTotals[registration].fwiMinutes >= 60) {
        aircraftTotals[registration].fwiHours += Math.floor(aircraftTotals[registration].fwiMinutes / 60);
        aircraftTotals[registration].fwiMinutes = aircraftTotals[registration].fwiMinutes % 60;
      }

      // Calculate monthly stats
      const currentDate = new Date(flight.date);
      const monthlyStats = calculateMonthlyStats(
        sortedFlights.filter(f => f.registration === registration),
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );

      return {
        ...flight,
        totalHours: Math.floor(aircraftTotals[registration].hours / 60),
        totalCycles: aircraftTotals[registration].cycles,
        totalFwiHours: aircraftTotals[registration].fwiHours,
        totalFwiMinutes: aircraftTotals[registration].fwiMinutes,
        hrsPerMonth: monthlyStats.hours,
        cycPerMonth: monthlyStats.cycles,
      };
    });
  };

  const addFlight = (flight: Omit<Flight, 'id'>) => {
    const newFlight: Flight = {
      ...flight,
      id: Date.now().toString(),
    };
    
    const updatedFlights = [...flights, newFlight];
    const processedFlights = processFlightsWithCalculations(updatedFlights);
    setFlights(processedFlights);
  };

  const updateFlight = (id: string, updatedFlight: Partial<Flight>) => {
    const updatedFlights = flights.map(flight => 
      flight.id === id ? { ...flight, ...updatedFlight } : flight
    );
    const processedFlights = processFlightsWithCalculations(updatedFlights);
    setFlights(processedFlights);
  };

  const deleteFlight = (id: string) => {
    const updatedFlights = flights.filter(flight => flight.id !== id);
    const processedFlights = processFlightsWithCalculations(updatedFlights);
    setFlights(processedFlights);
  };

  const getFlightStats = (): FlightStats => {
    const totalFlights = flights.length;
    const totalFlightHours = flights.reduce((sum, flight) => 
      sum + flight.flightHours + (flight.flightMinutes / 60), 0
    );
    const totalCycles = flights.reduce((sum, flight) => sum + flight.cycles, 0);
    const avgFlightTime = totalFlights > 0 ? totalFlightHours / totalFlights : 0;
    
    // Find most used route
    const routeCounts: { [key: string]: number } = {};
    flights.forEach(flight => {
      const route = `${flight.from}-${flight.to}`;
      routeCounts[route] = (routeCounts[route] || 0) + 1;
    });
    const mostUsedRoute = Object.keys(routeCounts).reduce((a, b) => 
      routeCounts[a] > routeCounts[b] ? a : b, 'N/A'
    );

    // Current month stats
    const currentMonthFlights = flights.filter(flight => 
      flight.date.startsWith('2025-06')
    );
    
    return {
      totalFlights,
      totalFlightHours: Math.round(totalFlightHours * 100) / 100,
      totalCycles,
      avgFlightTime: Math.round(avgFlightTime * 100) / 100,
      mostUsedRoute,
      currentMonth: {
        flights: currentMonthFlights.length,
        hours: Math.round(currentMonthFlights.reduce((sum, flight) => 
          sum + flight.flightHours + (flight.flightMinutes / 60), 0
        ) * 100) / 100,
        cycles: currentMonthFlights.reduce((sum, flight) => sum + flight.cycles, 0)
      }
    };
  };

  const getAircraftStats = (): AircraftStats[] => {
    const registrations = getAircraftRegistrations(flights);
    
    return registrations.map(registration => {
      const aircraftFlights = flights.filter(f => f.registration === registration);
      const aircraftData = aircraftFleet.find(a => a.registration === registration);
      const totalFlights = aircraftFlights.length;
      
      const totalFlightHours = aircraftFlights.reduce((sum, flight) => 
        sum + flight.flightHours + (flight.flightMinutes / 60), 0
      );
      
      const totalCycles = aircraftFlights.reduce((sum, flight) => sum + flight.cycles, 0);
      const avgFlightTime = totalFlights > 0 ? totalFlightHours / totalFlights : 0;
      
      // Find most used route for this aircraft
      const routeCounts: { [key: string]: number } = {};
      aircraftFlights.forEach(flight => {
        const route = `${flight.from}-${flight.to}`;
        routeCounts[route] = (routeCounts[route] || 0) + 1;
      });
      const mostUsedRoute = Object.keys(routeCounts).reduce((a, b) => 
        routeCounts[a] > routeCounts[b] ? a : b, 'N/A'
      );

      // Last flight date
      const lastFlight = aircraftFlights.length > 0 
        ? aircraftFlights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
        : '';

      // Current month stats
      const currentMonthFlights = aircraftFlights.filter(flight => 
        flight.date.startsWith('2025-06')
      );

      // Previous year stats for comparison
      const lastYearFlights = aircraftFlights.filter(flight => 
        flight.date.startsWith('2024-06')
      );

      const lastYearHours = lastYearFlights.reduce((sum, flight) => 
        sum + flight.flightHours + (flight.flightMinutes / 60), 0
      );
      const lastYearCycles = lastYearFlights.reduce((sum, flight) => sum + flight.cycles, 0);

      // Utilization rate (hours per day in current month)
      const daysInMonth = 30;
      const utilizationRate = calculateUtilizationRate(currentMonthFlights, daysInMonth);

      // Calculate year-over-year change
      const hoursChange = lastYearHours > 0 
        ? ((currentMonthFlights.reduce((sum, flight) => sum + flight.flightHours + (flight.flightMinutes / 60), 0) - lastYearHours) / lastYearHours) * 100
        : 0;

      return {
        registration,
        totalFlights,
        totalFlightHours: Math.round(totalFlightHours * 100) / 100,
        totalCycles,
        avgFlightTime: Math.round(avgFlightTime * 100) / 100,
        lastFlight,
        mostUsedRoute,
        status: aircraftData?.status || 'operational',
        efficiency: aircraftData?.efficiency || 85,
        currentMonth: {
          flights: currentMonthFlights.length,
          hours: Math.round(currentMonthFlights.reduce((sum, flight) => 
            sum + flight.flightHours + (flight.flightMinutes / 60), 0
          ) * 100) / 100,
          cycles: currentMonthFlights.reduce((sum, flight) => sum + flight.cycles, 0)
        },
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        comparison: {
          lastMonth: {
            hours: lastYearHours,
            cycles: lastYearCycles,
            change: hoursChange
          },
          lastYear: {
            hours: lastYearHours,
            cycles: lastYearCycles,
            change: hoursChange
          }
        }
      };
    });
  };

  return {
    flights,
    loading,
    addFlight,
    updateFlight,
    deleteFlight,
    getFlightStats,
    getAircraftStats,
  };
};