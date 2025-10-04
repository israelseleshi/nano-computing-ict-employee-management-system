export interface Employee {
  id: string;
  name: string;
  email: string;
  hourlyRate: number;
  department: string;
}

export interface WorkTicket {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
}

export interface DailyReport {
  date: string;
  employeeName: string;
  tasks: string[];
  hoursWorked: number;
  amountEarned: number;
}

export type ViewType = 'dashboard' | 'add-employee' | 'create-ticket' | 'reports' | 'send-email' | 'ticket-management' | 'performance-analytics' | 'time-tracking' | 'payroll-management' | 'notification-center' | 'advanced-reports';
