import { Aircraft, MaintenanceRecord, AircraftIssue } from '../types/flight';

export const aircraftFleet: Aircraft[] = [
  {
    id: 'sme-001',
    registration: 'SME',
    model: 'Boeing 737-800',
    serialNumber: 'B737-28358',
    status: 'operational',
    totalFlightHours: 16968,
    totalCycles: 20530,
    lastMaintenanceDate: '2025-05-15',
    nextMaintenanceDate: '2025-07-15',
    maintenanceHours: 500,
    maintenanceCycles: 250,
    utilizationRate: 8.5,
    efficiency: 92,
    issues: []
  },
  {
    id: 'smd-001',
    registration: 'SMD',
    model: 'Boeing 737-800',
    serialNumber: 'B737-28359',
    status: 'operational',
    totalFlightHours: 15420,
    totalCycles: 18650,
    lastMaintenanceDate: '2025-06-01',
    nextMaintenanceDate: '2025-08-01',
    maintenanceHours: 500,
    maintenanceCycles: 250,
    utilizationRate: 7.2,
    efficiency: 89,
    issues: [
      {
        id: 'issue-001',
        type: 'minor',
        description: 'Navigation light intermittent',
        reportedDate: '2025-06-25',
        status: 'open',
        priority: 'low'
      }
    ]
  },
  {
    id: 'smc-001',
    registration: 'SMC',
    model: 'Boeing 737-800',
    serialNumber: 'B737-28360',
    status: 'maintenance',
    totalFlightHours: 18200,
    totalCycles: 22100,
    lastMaintenanceDate: '2025-06-20',
    nextMaintenanceDate: '2025-07-05',
    maintenanceHours: 1000,
    maintenanceCycles: 500,
    utilizationRate: 6.8,
    efficiency: 85,
    issues: [
      {
        id: 'issue-002',
        type: 'major',
        description: 'Engine compressor blade inspection required',
        reportedDate: '2025-06-20',
        status: 'in-progress',
        priority: 'high'
      }
    ]
  },
  {
    id: 'sma-001',
    registration: 'SMA',
    model: 'Boeing 737-800',
    serialNumber: 'B737-28361',
    status: 'operational',
    totalFlightHours: 14800,
    totalCycles: 17900,
    lastMaintenanceDate: '2025-04-10',
    nextMaintenanceDate: '2025-08-10',
    maintenanceHours: 500,
    maintenanceCycles: 250,
    utilizationRate: 9.1,
    efficiency: 94,
    issues: []
  },
  {
    id: 'smb-001',
    registration: 'SMB',
    model: 'Boeing 737-800',
    serialNumber: 'B737-28362',
    status: 'grounded',
    totalFlightHours: 19500,
    totalCycles: 24200,
    lastMaintenanceDate: '2025-06-15',
    nextMaintenanceDate: '2025-07-30',
    maintenanceHours: 1500,
    maintenanceCycles: 750,
    utilizationRate: 0,
    efficiency: 0,
    issues: [
      {
        id: 'issue-003',
        type: 'critical',
        description: 'Hydraulic system failure - major overhaul required',
        reportedDate: '2025-06-15',
        status: 'in-progress',
        priority: 'critical'
      },
      {
        id: 'issue-004',
        type: 'major',
        description: 'Landing gear actuator replacement needed',
        reportedDate: '2025-06-16',
        status: 'open',
        priority: 'high'
      }
    ]
  }
];

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'maint-001',
    aircraftId: 'sme-001',
    type: 'scheduled',
    description: 'A-Check - 500 flight hours inspection',
    scheduledDate: '2025-07-15',
    status: 'planned',
    cost: 25000,
    technician: 'Ahmed Hassan',
    duration: 24,
    parts: ['Filters', 'Fluids', 'Brake pads']
  },
  {
    id: 'maint-002',
    aircraftId: 'smd-001',
    type: 'unscheduled',
    description: 'Navigation light replacement',
    scheduledDate: '2025-06-30',
    status: 'planned',
    cost: 1500,
    technician: 'Mohamed Ali',
    duration: 4,
    parts: ['Navigation light assembly']
  },
  {
    id: 'maint-003',
    aircraftId: 'smc-001',
    type: 'inspection',
    description: 'Engine compressor blade inspection',
    scheduledDate: '2025-06-28',
    completedDate: '2025-06-28',
    status: 'in-progress',
    cost: 45000,
    technician: 'Khaled Mahmoud',
    duration: 72,
    parts: ['Compressor blades', 'Gaskets', 'Seals']
  },
  {
    id: 'maint-004',
    aircraftId: 'sma-001',
    type: 'scheduled',
    description: 'B-Check - 1000 flight hours inspection',
    scheduledDate: '2025-08-10',
    status: 'planned',
    cost: 75000,
    technician: 'Omar Farouk',
    duration: 120,
    parts: ['Multiple components', 'Fluids', 'Filters', 'Tires']
  },
  {
    id: 'maint-005',
    aircraftId: 'smb-001',
    type: 'overhaul',
    description: 'Hydraulic system overhaul',
    scheduledDate: '2025-06-15',
    status: 'in-progress',
    cost: 150000,
    technician: 'Mahmoud Saeed',
    duration: 240,
    parts: ['Hydraulic pumps', 'Actuators', 'Hoses', 'Filters']
  }
];