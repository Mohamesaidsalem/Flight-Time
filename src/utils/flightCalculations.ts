import { Flight } from '../types/flight';

export const calculateFlightTime = (hours: number, minutes: number): number => {
  return hours * 60 + minutes;
};

export const formatTimeFromMinutes = (totalMinutes: number): { hours: number; minutes: number } => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
};

export const calculateCumulativeStats = (flights: Flight[], currentFlightIndex: number) => {
  const previousFlights = flights.slice(0, currentFlightIndex);
  
  let totalHours = 0;
  let totalCycles = 0;
  
  previousFlights.forEach(flight => {
    totalHours += calculateFlightTime(flight.flightHours, flight.flightMinutes);
    totalCycles += flight.cycles;
  });
  
  return {
    totalHours: Math.floor(totalHours / 60), // Convert back to hours
    totalCycles
  };
};

export const calculateMonthlyStats = (flights: Flight[], year: number, month: number) => {
  const monthFlights = flights.filter(flight => {
    const flightDate = new Date(flight.date);
    return flightDate.getFullYear() === year && flightDate.getMonth() === month - 1;
  });
  
  const totalHours = monthFlights.reduce((sum, flight) => 
    sum + calculateFlightTime(flight.flightHours, flight.flightMinutes), 0
  );
  
  const totalCycles = monthFlights.reduce((sum, flight) => sum + flight.cycles, 0);
  
  return {
    flights: monthFlights.length,
    hours: Math.floor(totalHours / 60),
    cycles: totalCycles
  };
};

export const getAircraftRegistrations = (flights: Flight[]): string[] => {
  const registrations = new Set(flights.map(flight => flight.registration));
  return Array.from(registrations).sort();
};

export const calculateUtilizationRate = (flights: Flight[], days: number): number => {
  const totalMinutes = flights.reduce((sum, flight) => 
    sum + calculateFlightTime(flight.flightHours, flight.flightMinutes), 0
  );
  const totalHours = totalMinutes / 60;
  return days > 0 ? totalHours / days : 0;
};