import { Pilot } from '../types/flight';

export const pilotsData: Pilot[] = [
  {
    id: 'pilot-001',
    employeeId: 'EMP001',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    rank: 'Captain',
    licenseNumber: 'ATPL-EG-001',
    licenseExpiry: '2026-12-31',
    medicalExpiry: '2025-12-31',
    totalFlightHours: 8500,
    aircraftRatings: ['Boeing 737-800', 'Airbus A320'],
    status: 'active',
    hireDate: '2015-03-15',
    lastFlightDate: '2025-06-28',
    monthlyHours: 85,
    yearlyHours: 520,
    contactInfo: {
      phone: '+20-10-1234-5678',
      email: 'ahmed.hassan@airline.com',
      address: 'Cairo, Egypt'
    }
  },
  {
    id: 'pilot-002',
    employeeId: 'EMP002',
    firstName: 'Mohamed',
    lastName: 'Ali',
    rank: 'Captain',
    licenseNumber: 'ATPL-EG-002',
    licenseExpiry: '2027-06-30',
    medicalExpiry: '2025-11-30',
    totalFlightHours: 7200,
    aircraftRatings: ['Boeing 737-800'],
    status: 'active',
    hireDate: '2017-08-20',
    lastFlightDate: '2025-06-27',
    monthlyHours: 78,
    yearlyHours: 485,
    contactInfo: {
      phone: '+20-10-2345-6789',
      email: 'mohamed.ali@airline.com',
      address: 'Alexandria, Egypt'
    }
  },
  {
    id: 'pilot-003',
    employeeId: 'EMP003',
    firstName: 'Omar',
    lastName: 'Farouk',
    rank: 'First Officer',
    licenseNumber: 'CPL-EG-003',
    licenseExpiry: '2026-09-15',
    medicalExpiry: '2025-10-15',
    totalFlightHours: 3500,
    aircraftRatings: ['Boeing 737-800'],
    status: 'active',
    hireDate: '2020-01-10',
    lastFlightDate: '2025-06-26',
    monthlyHours: 65,
    yearlyHours: 380,
    contactInfo: {
      phone: '+20-10-3456-7890',
      email: 'omar.farouk@airline.com',
      address: 'Giza, Egypt'
    }
  },
  {
    id: 'pilot-004',
    employeeId: 'EMP004',
    firstName: 'Khaled',
    lastName: 'Mahmoud',
    rank: 'First Officer',
    licenseNumber: 'CPL-EG-004',
    licenseExpiry: '2025-12-20',
    medicalExpiry: '2025-08-20',
    totalFlightHours: 2800,
    aircraftRatings: ['Boeing 737-800'],
    status: 'active',
    hireDate: '2021-06-01',
    lastFlightDate: '2025-06-25',
    monthlyHours: 58,
    yearlyHours: 320,
    contactInfo: {
      phone: '+20-10-4567-8901',
      email: 'khaled.mahmoud@airline.com',
      address: 'Mansoura, Egypt'
    }
  },
  {
    id: 'pilot-005',
    employeeId: 'EMP005',
    firstName: 'Mahmoud',
    lastName: 'Saeed',
    rank: 'Second Officer',
    licenseNumber: 'CPL-EG-005',
    licenseExpiry: '2026-03-10',
    medicalExpiry: '2025-09-10',
    totalFlightHours: 1200,
    aircraftRatings: ['Boeing 737-800'],
    status: 'training',
    hireDate: '2023-02-15',
    lastFlightDate: '2025-06-20',
    monthlyHours: 45,
    yearlyHours: 180,
    contactInfo: {
      phone: '+20-10-5678-9012',
      email: 'mahmoud.saeed@airline.com',
      address: 'Aswan, Egypt'
    }
  }
];