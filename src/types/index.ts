export interface Employee {
  id: string;
  name: string;
  email: string;
  hourlyRate: number;
  department: string;
  position: string;
}

export interface WorkTicket {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface DailyReport {
  date: string;
  employeeName: string;
  tasks: string[];
  hoursWorked: number;
  amountEarned: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  managerComment?: string;
  submittedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  managerId?: string;
}

// New 4-Tab Premium Layout ViewTypes
export type ViewType = 'overview' | 'operations' | 'hr-finance' | 'intelligence';

// Sub-view types for Operations tab
export type OperationsSubView = 'work-tickets' | 'time-tracking' | 'leave-requests';

// Sub-view types for Intelligence tab  
export type IntelligenceSubView = 'performance' | 'advanced' | 'daily-report';
