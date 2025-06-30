export interface Flight {
  id: string;
  ser: number;
  date: string;
  registration: string; // Aircraft registration (SME, SMD, etc.)
  from: string;
  to: string;
  flightHours: number;
  flightMinutes: number;
  landingHours: number;
  landingMinutes: number;
  fwiHours: number;
  fwiMinutes: number;
  cycles: number;
  totalFwiHours: number;
  totalFwiMinutes: number;
  totalCycles: number;
  tlbNumber: string;
  lastDate: string;
  totalHours: number;
  totalCyc: number;
  hrsPerMonth: number;
  cycPerMonth: number;
  pilotId?: string;
  coPilotId?: string;
}

export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  serialNumber: string;
  status: 'operational' | 'maintenance' | 'grounded' | 'inspection';
  totalFlightHours: number;
  totalCycles: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceHours: number;
  maintenanceCycles: number;
  issues: AircraftIssue[];
  utilizationRate: number;
  efficiency: number;
  initialHours: number; // Starting hours when aircraft was registered
  initialCycles: number; // Starting cycles when aircraft was registered
  registrationDate: string;
  manufacturer: string;
  yearOfManufacture: number;
  maxPassengers: number;
  engineIds: string[]; // Array of engine IDs
}

export interface Engine {
  id: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  aircraftId: string;
  position: 'left' | 'right' | 'center' | '1' | '2' | '3' | '4';
  totalHours: number;
  totalCycles: number;
  initialHours: number; // Starting hours when engine was installed
  initialCycles: number; // Starting cycles when engine was installed
  installationDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  status: 'operational' | 'maintenance' | 'removed' | 'overhaul';
  maintenanceHistory: EngineMaintenanceRecord[];
  thrustRating: number; // in lbs
  fuelConsumption: number; // gallons per hour
}

export interface EngineMaintenanceRecord {
  id: string;
  date: string;
  type: 'inspection' | 'repair' | 'overhaul' | 'replacement';
  description: string;
  hoursAtMaintenance: number;
  cyclesAtMaintenance: number;
  cost: number;
  technician: string;
  partsReplaced: string[];
}

export interface Pilot {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  rank: 'Captain' | 'First Officer' | 'Second Officer' | 'Flight Engineer';
  licenseNumber: string;
  licenseExpiry: string;
  medicalExpiry: string;
  totalFlightHours: number;
  aircraftRatings: string[]; // Aircraft types pilot is rated for
  status: 'active' | 'inactive' | 'training' | 'medical-leave';
  hireDate: string;
  lastFlightDate: string;
  monthlyHours: number;
  yearlyHours: number;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

export interface AircraftRegistration {
  id: string;
  registration: string;
  aircraftData: Aircraft;
  engines: Engine[];
  registrationDate: string;
  registeredBy: string;
  initialConfiguration: {
    totalHours: number;
    totalCycles: number;
    condition: string;
    notes: string;
  };
}

export interface AircraftIssue {
  id: string;
  type: 'minor' | 'major' | 'critical';
  description: string;
  reportedDate: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface MaintenanceRecord {
  id: string;
  aircraftId: string;
  type: 'scheduled' | 'unscheduled' | 'inspection' | 'overhaul';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'overdue';
  cost: number;
  technician: string;
  duration: number; // in hours
  parts: string[];
}

export interface FlightStats {
  totalFlights: number;
  totalFlightHours: number;
  totalCycles: number;
  avgFlightTime: number;
  mostUsedRoute: string;
  currentMonth: {
    flights: number;
    hours: number;
    cycles: number;
  };
}

export interface AircraftStats {
  registration: string;
  totalFlights: number;
  totalFlightHours: number;
  totalCycles: number;
  avgFlightTime: number;
  lastFlight: string;
  mostUsedRoute: string;
  status: Aircraft['status'];
  efficiency: number;
  currentMonth: {
    flights: number;
    hours: number;
    cycles: number;
  };
  utilizationRate: number; // Hours per day
  comparison: {
    lastMonth: {
      hours: number;
      cycles: number;
      change: number;
    };
    lastYear: {
      hours: number;
      cycles: number;
      change: number;
    };
  };
}

export interface ReportData {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  aircraftData: {
    registration: string;
    flights: number;
    hours: number;
    cycles: number;
    utilization: number;
    efficiency: number;
  }[];
  fleetSummary: {
    totalFlights: number;
    totalHours: number;
    totalCycles: number;
    avgUtilization: number;
    operationalAircraft: number;
    maintenanceAircraft: number;
  };
}

export interface FlightCalculations {
  totalFlightTime: number; // in minutes
  totalLandingTime: number; // in minutes
  totalFwiTime: number; // in minutes
  cumulativeHours: number;
  cumulativeCycles: number;
}

export interface OptimalAircraftRecommendation {
  registration: string;
  score: number;
  reasons: string[];
  utilizationRate: number;
  maintenanceStatus: string;
  availability: boolean;
}