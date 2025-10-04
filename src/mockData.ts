import { Employee, WorkTicket } from './types';

export const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'John Doe',
    email: 'john@nanocomputing.com',
    hourlyRate: 1250,
    department: 'Development'
  },
  {
    id: 'emp-2',
    name: 'Sarah Johnson',
    email: 'sarah@nanocomputing.com',
    hourlyRate: 1500,
    department: 'Design'
  },
  {
    id: 'emp-3',
    name: 'Michael Chen',
    email: 'michael@nanocomputing.com',
    hourlyRate: 1400,
    department: 'Development'
  },
  {
    id: 'emp-4',
    name: 'Emily Rodriguez',
    email: 'emily@nanocomputing.com',
    hourlyRate: 1600,
    department: 'Project Management'
  },
  {
    id: 'emp-5',
    name: 'David Thompson',
    email: 'david@nanocomputing.com',
    hourlyRate: 1350,
    department: 'QA Testing'
  }
];

export const mockTickets: WorkTicket[] = [
  {
    id: 'ticket-1',
    employeeId: 'emp-1',
    date: '2024-05-21',
    startTime: '09:00',
    endTime: '12:00',
    taskDescription: 'Implemented authentication module for client portal'
  },
  {
    id: 'ticket-2',
    employeeId: 'emp-1',
    date: '2024-05-21',
    startTime: '13:00',
    endTime: '17:00',
    taskDescription: 'Code review and bug fixes for payment integration'
  },
  {
    id: 'ticket-3',
    employeeId: 'emp-2',
    date: '2024-05-21',
    startTime: '09:00',
    endTime: '13:00',
    taskDescription: 'Designed UI mockups for dashboard redesign project'
  },
  {
    id: 'ticket-4',
    employeeId: 'emp-3',
    date: '2024-05-21',
    startTime: '10:00',
    endTime: '15:00',
    taskDescription: 'Database optimization and query performance improvements'
  },
  {
    id: 'ticket-5',
    employeeId: 'emp-4',
    date: '2024-05-21',
    startTime: '09:00',
    endTime: '11:30',
    taskDescription: 'Sprint planning and stakeholder meeting coordination'
  },
  {
    id: 'ticket-6',
    employeeId: 'emp-5',
    date: '2024-05-21',
    startTime: '09:30',
    endTime: '16:00',
    taskDescription: 'Comprehensive testing of new feature releases'
  }
];
