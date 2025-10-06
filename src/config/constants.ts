/**
 * Application Constants
 */

// App Info
export const APP_NAME = 'Nano Computing ICT Employee Management System';
export const APP_VERSION = '1.0.0';
export const COMPANY_NAME = 'Nano Computing ICT Solutions';

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRY_ATTEMPTS = 3;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Date Formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

// Work Hours
export const WORK_START_TIME = '09:00';
export const WORK_END_TIME = '18:00';
export const LUNCH_BREAK_DURATION = 60; // minutes

// Leave Management
export const DEFAULT_VACATION_DAYS = 22;
export const DEFAULT_SICK_DAYS = 10;
export const DEFAULT_PERSONAL_DAYS = 5;
export const MAX_CONSECUTIVE_LEAVE_DAYS = 15;
export const LEAVE_ADVANCE_NOTICE_DAYS = 7;

// Payroll
export const CURRENCY = 'ETB';
export const TAX_RATE = 0.15; // 15%
export const INSURANCE_RATE = 0.05; // 5%

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Session
export const SESSION_TIMEOUT = 3600000; // 1 hour in milliseconds
export const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

// Validation
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

// Status
export const TICKET_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
} as const;

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on-leave',
  TERMINATED: 'terminated'
} as const;

// Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  LEAVE: '/leave',
  TICKETS: '/tickets',
  PAYROLL: '/payroll',
  REPORTS: '/reports',
  SETTINGS: '/settings'
} as const;
