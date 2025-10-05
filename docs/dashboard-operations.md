# Dashboard Operations Documentation

## Overview
This document provides a comprehensive guide to all operations available in the Nano Computing ICT Employee Management System, covering both Manager and Employee dashboards with detailed implementation information.

---

## 🏢 Manager Dashboard Operations

### 1. Dashboard Overview
**Location**: `src/components/manager/Dashboard.tsx`
**Route**: `/dashboard` (default view)

#### Features:
- **Statistics Cards**: Real-time metrics display
- **Recent Work Tickets**: Latest 5 employee submissions
- **Department Overview**: Employee distribution and average rates

#### Implementation:
```typescript
interface DashboardProps {
  employees: Employee[];
  tickets: WorkTicket[];
}

// Key calculations
const totalEmployees = employees.length;
const totalTickets = tickets.length;
const totalHours = tickets.reduce((sum, ticket) => {
  const hours = calculateHours(ticket.startTime, ticket.endTime);
  return sum + hours;
}, 0);
const totalRevenue = tickets.reduce((sum, ticket) => {
  const employee = employees.find(e => e.id === ticket.employeeId);
  const hours = calculateHours(ticket.startTime, ticket.endTime);
  return sum + (hours * (employee?.hourlyRate || 0));
}, 0);
```

#### Data Flow:
1. **App.tsx** passes `employees` and `tickets` props
2. **Dashboard.tsx** calculates statistics in real-time
3. **Recent tickets** filtered with `tickets.slice(0, 5)`
4. **Department overview** groups employees by department

---

### 2. Add Employee
**Location**: `src/components/manager/AddEmployee.tsx`
**Route**: Accessed via sidebar navigation

#### Features:
- **Employee Registration Form**: Name, email, hourly rate, department
- **Department Selection**: 8 predefined departments
- **Form Validation**: Required fields and email format
- **Success Feedback**: Confirmation message after creation

#### Implementation:
```typescript
interface AddEmployeeProps {
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
}

// Form submission handler
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const newEmployee = {
    name: formData.name,
    email: formData.email,
    hourlyRate: parseFloat(formData.hourlyRate),
    department: formData.department
  };
  onAddEmployee(newEmployee);
  // Reset form and show success message
};
```

#### Data Flow:
1. **Form submission** → `handleSubmit`
2. **AddEmployee** calls `onAddEmployee` prop
3. **App.tsx** `handleAddEmployee` creates new employee with unique ID
4. **State update** triggers re-render across all components

#### Departments Available:
- Development
- Design
- Project Management
- QA Testing
- DevOps
- Marketing
- Sales
- Human Resources

---

### 3. Create Work Ticket
**Location**: `src/components/manager/CreateTicket.tsx`
**Route**: Accessed via sidebar navigation

#### Features:
- **Employee Selection**: Dropdown of all employees
- **Date & Time Picker**: Work date, start time, end time
- **Task Description**: Detailed work description
- **Hours Calculation**: Automatic calculation based on time range
- **Amount Calculation**: Hours × Employee hourly rate
- **Real-time Preview**: Shows calculated hours and amount

#### Implementation:
```typescript
interface CreateTicketProps {
  employees: Employee[];
  onCreateTicket: (ticketData: {
    employeeId: string;
    date: string;
    startTime: string;
    endTime: string;
    taskDescription: string;
  }) => void;
}

// Time calculations
const calculateHours = () => {
  if (formData.startTime && formData.endTime) {
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours > 0 ? hours.toFixed(2) : '0.00';
  }
  return '0.00';
};

const calculateAmount = () => {
  if (selectedEmployee && formData.startTime && formData.endTime) {
    const hours = parseFloat(calculateHours());
    return (hours * selectedEmployee.hourlyRate).toFixed(2);
  }
  return '0.00';
};
```

#### Data Flow:
1. **Form submission** → `handleSubmit`
2. **CreateTicket** calls `onCreateTicket` prop with form data
3. **App.tsx** `handleCreateTicket` creates WorkTicket object:
   - Generates unique ID
   - Looks up employee name
   - Sets status to 'pending'
   - Maps `taskDescription` to `description`
4. **State update** triggers dashboard refresh

---

### 4. Daily Reports
**Location**: `src/components/manager/DailyReports.tsx`
**Route**: Accessed via sidebar navigation

#### Features:
- **Date Selection**: Filter reports by specific date
- **Employee Work Summary**: Hours worked, tasks completed, earnings
- **Tabular Display**: Organized data presentation
- **Grand Totals**: Sum of all hours and earnings
- **Export Functionality**: Download reports (placeholder)

#### Implementation:
```typescript
interface DailyReportsProps {
  employees: Employee[];
  tickets: WorkTicket[];
}

// Filter tickets by selected date
const filteredTickets = tickets.filter(ticket => ticket.date === selectedDate);

// Generate report data
const reportData = filteredTickets.map(ticket => {
  const employee = employees.find(e => e.id === ticket.employeeId);
  const hours = calculateHours(ticket.startTime, ticket.endTime);
  const amount = hours * (employee?.hourlyRate || 0);
  
  return {
    ticket,
    employee: employee!,
    totalHours: hours,
    totalAmount: amount
  };
});

// Calculate grand totals
const grandTotalHours = reportData.reduce((sum, data) => sum + data.totalHours, 0);
const grandTotalAmount = reportData.reduce((sum, data) => sum + data.totalAmount, 0);
```

#### Data Flow:
1. **Date selection** updates `selectedDate` state
2. **Tickets filtered** by selected date
3. **Report data calculated** with employee lookup and time calculations
4. **Table rendered** with individual and grand totals

---

### 5. Send Daily Email
**Location**: `src/components/manager/SendEmail.tsx`
**Route**: Accessed via sidebar navigation

#### Features:
- **Date Selection**: Choose date for email report
- **Email Preview**: Shows formatted email content
- **Employee Summary**: Work hours and earnings per employee
- **Send Functionality**: Email dispatch (simulated)
- **Success Confirmation**: Feedback after sending

---

### 6. Ticket Management ✅
**Location**: `src/components/manager/TicketManagement.tsx`
**Route**: Accessed via sidebar navigation

#### Features:
- **Status Management**: Approve/reject work tickets with comments
- **Filter Controls**: Filter tickets by status (all, pending, approved, rejected)
- **Statistics Overview**: Real-time counts of ticket statuses
- **Detailed Table View**: Employee info, hours, amounts, and actions
- **Modal Confirmation**: Confirm approval/rejection with optional comments

#### Implementation:
```typescript
interface TicketManagementProps {
  employees: Employee[];
  tickets: WorkTicket[];
  onUpdateTicketStatus: (ticketId: string, status: 'pending' | 'approved' | 'rejected', comment?: string) => void;
}

// Status update handler
const handleStatusUpdate = (ticket: WorkTicket, action: 'approve' | 'reject') => {
  setSelectedTicket(ticket);
  setActionType(action);
  setShowModal(true);
};

// Confirm status update
const confirmStatusUpdate = () => {
  if (selectedTicket) {
    const newStatus = actionType === 'approve' ? 'approved' : 'rejected';
    onUpdateTicketStatus(selectedTicket.id, newStatus, comment);
  }
};
```

#### Data Flow:
1. **Filter Selection** updates displayed tickets
2. **Status Actions** open confirmation modal
3. **Modal Confirmation** calls `onUpdateTicketStatus` prop
4. **App.tsx** updates ticket status in state
5. **Dashboard Updates** reflect new status counts

---

### 7. Performance Analytics ✅
**Location**: `src/components/manager/PerformanceAnalytics.tsx`
**Route**: Accessed via sidebar navigation

#### Features:
- **Employee Performance Metrics**: Hours, earnings, productivity levels
- **Top Performers**: Ranking by total hours worked
- **Department Analysis**: Performance breakdown by department
- **Filter Controls**: Period and department filtering
- **Productivity Classification**: High/Medium/Low productivity levels

#### Implementation:
```typescript
interface EmployeePerformance {
  employee: Employee;
  totalHours: number;
  totalEarnings: number;
  ticketCount: number;
  avgHoursPerTicket: number;
  approvedTickets: number;
  rejectedTickets: number;
  approvalRate: number;
  productivity: 'high' | 'medium' | 'low';
}

// Calculate employee performance metrics
const employeePerformance = useMemo(() => {
  return employees.map(employee => {
    const employeeTickets = tickets.filter(ticket => ticket.employeeId === employee.id);
    const totalHours = employeeTickets.reduce((sum, ticket) => 
      sum + calculateHours(ticket.startTime, ticket.endTime), 0
    );
    // ... additional calculations
  });
}, [employees, tickets]);
```

#### Data Flow:
1. **Filter Selection** updates displayed data
interface SendEmailProps {
  employees: Employee[];
  tickets: WorkTicket[];
  selectedDate: string;

// Generate email content
const generateEmailContent = () => {
  const filteredTickets = tickets.filter(ticket => ticket.date === selectedDate);
  const reportData = filteredTickets.map(ticket => {
    const employee = employees.find(e => e.id === ticket.employeeId);
    const hours = calculateHours(ticket.startTime, ticket.endTime);
    const amount = hours * (employee?.hourlyRate || 0);
    return { employee: employee!, hours, amount };
  });

  return {
    subject: `Daily Work Report - ${selectedDate}`,
    body: `Daily work summary for ${selectedDate}...`,
    totalHours: reportData.reduce((sum, data) => sum + data.hours, 0),
    totalAmount: reportData.reduce((sum, data) => sum + data.amount, 0)
  };
};

// Send email handler
const handleSendEmail = async () => {
  setIsSending(true);
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 2000));
  setIsSending(false);
  setShowSuccess(true);
};
```

#### Data Flow:
1. **Date selection** triggers email content generation
2. **Email preview** updates with calculated data
3. **Send button** triggers simulated email dispatch
4. **Success state** shows confirmation message

---

## 👨‍💻 Employee Dashboard Operations

### 1. Employee Dashboard Overview
**Location**: `src/components/employee/EmployeeDashboard.tsx`
**Route**: Default view for employee login

#### Features:
- **Personal Statistics**: Hours worked, earnings, goals progress
- **Recent Activities**: Personal work tickets and updates
- **Quick Actions**: Shortcuts to common tasks
- **Performance Metrics**: Personal productivity indicators

#### Implementation:
```typescript
interface EmployeeDashboardProps {
  profile: Profile;
  tickets: WorkTicketDB[];
}

// Filter tickets for current employee
const myTickets = tickets.filter(ticket => ticket.employeeId === profile.id);

// Calculate personal statistics
const totalHours = myTickets.reduce((sum, ticket) => {
  return sum + calculateHours(ticket.startTime, ticket.endTime);
}, 0);

const totalEarnings = totalHours * profile.hourlyRate;
const thisWeekHours = myTickets
  .filter(ticket => isThisWeek(ticket.date))
  .reduce((sum, ticket) => sum + calculateHours(ticket.startTime, ticket.endTime), 0);
```

#### Data Flow:
1. **Profile data** from authentication context
2. **Personal tickets** filtered from all tickets
3. **Statistics calculated** based on personal data
4. **Dashboard rendered** with employee-specific metrics

---

### 2. Employee Timesheet
**Location**: `src/components/employee/EmployeeTimesheet.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **Time Entry Form**: Log work hours and tasks
- **Timesheet History**: View past entries
- **Hours Calculation**: Automatic time calculations
- **Earnings Display**: Show calculated earnings
- **Status Tracking**: Pending/Approved status

#### Implementation:
```typescript
interface EmployeeTimesheetProps {
  profile: Profile;
  tickets: WorkTicketDB[];
  onSubmitTimesheet: (entry: TimesheetEntry) => void;
}

// Timesheet entry form
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const entry = {
    employeeId: profile.id,
    date: formData.date,
    startTime: formData.startTime,
    endTime: formData.endTime,
    description: formData.description,
    status: 'pending'
  };
  onSubmitTimesheet(entry);
};

// Calculate earnings
const calculateEarnings = (startTime: string, endTime: string) => {
  const hours = calculateHours(startTime, endTime);
  return hours * profile.hourlyRate;
};
```

#### Data Flow:
1. **Form submission** creates timesheet entry
2. **Entry validation** ensures required fields
3. **Callback to parent** component for state management
4. **Timesheet list** updates with new entry

---

### 3. Personal Goals
**Location**: `src/components/employee/PersonalGoals.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **Goal Setting**: Create personal work objectives
- **Progress Tracking**: Monitor goal completion
- **Goal Categories**: Different types of goals (hours, projects, skills)
- **Achievement System**: Mark goals as completed
- **Goal History**: View past achievements

#### Implementation:
```typescript
interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'hours' | 'projects' | 'skills';
  target: number;
  current: number;
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
}

// Goal progress calculation
const calculateProgress = (goal: Goal) => {
  return Math.min((goal.current / goal.target) * 100, 100);
};

// Update goal progress
const updateGoalProgress = (goalId: string, progress: number) => {
  setGoals(goals.map(goal => 
    goal.id === goalId 
      ? { ...goal, current: progress }
      : goal
  ));
};
```

#### Data Flow:
1. **Goal creation** adds to personal goals list
2. **Progress updates** modify current values
3. **Status calculation** based on progress and deadlines
4. **Achievement tracking** marks completed goals

---

### 4. Calendar
**Location**: `src/components/employee/Calendar.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **Monthly Calendar View**: Visual schedule display
- **Work Schedule**: Show assigned work days
- **Event Management**: Add/edit calendar events
- **Time Off Requests**: Request vacation/sick days
- **Schedule Conflicts**: Highlight scheduling issues

#### Implementation:
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'work' | 'meeting' | 'timeoff' | 'personal';
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Calendar rendering
const renderCalendarDay = (date: Date) => {
  const dayEvents = events.filter(event => 
    isSameDay(new Date(event.date), date)
  );
  
  return (
    <div className="calendar-day">
      <span className="day-number">{date.getDate()}</span>
      {dayEvents.map(event => (
        <div key={event.id} className={`event event-${event.type}`}>
          {event.title}
        </div>
      ))}
    </div>
  );
};
```

#### Data Flow:
1. **Calendar data** loaded from employee schedule
2. **Event rendering** based on date filtering
3. **Event interactions** allow editing/viewing details
4. **Schedule updates** sync with work tickets

---

### 5. Notifications
**Location**: `src/components/employee/Notifications.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **System Notifications**: Important system messages
- **Work Updates**: Ticket approvals, rejections, comments
- **Schedule Changes**: Shift modifications, meeting updates
- **Achievement Alerts**: Goal completions, milestones
- **Read/Unread Status**: Track notification status

#### Implementation:
```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Notification management
const markAsRead = (notificationId: string) => {
  setNotifications(notifications.map(notification =>
    notification.id === notificationId
      ? { ...notification, read: true }
      : notification
  ));
};

// Filter notifications
const unreadNotifications = notifications.filter(n => !n.read);
const recentNotifications = notifications
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .slice(0, 10);
```

#### Data Flow:
1. **Notifications generated** by system events
2. **Real-time updates** via state management
3. **Read status** tracked per notification
4. **Action handling** for clickable notifications

---

### 6. Employee Profile Management
**Location**: `src/components/employee/ProfileManagement.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **Personal Information**: View and edit personal details
- **Profile Picture**: Upload and manage profile photo
- **Contact Information**: Update phone, address, emergency contacts
- **Skills & Certifications**: Manage professional qualifications
- **Password Change**: Secure password updates
- **Account Settings**: Notification preferences, language settings

#### Implementation:
```typescript
interface ProfileManagementProps {
  profile: Profile;
  onUpdateProfile: (updates: Partial<Profile>) => void;
}

// Profile update handler
const handleProfileUpdate = (field: keyof Profile, value: any) => {
  const updates = { [field]: value };
  onUpdateProfile(updates);
  setShowSuccess(true);
};

// Skills management
const addSkill = (skill: string) => {
  const updatedSkills = [...(profile.skills || []), skill];
  handleProfileUpdate('skills', updatedSkills);
};
```

#### Data Flow:
1. **Profile data** loaded from authentication context
2. **Form updates** trigger validation
3. **Profile updates** saved to database
4. **Success feedback** confirms changes

---

### 7. Leave Management
**Location**: `src/components/employee/LeaveManagement.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **Leave Requests**: Submit vacation, sick leave, personal time off
- **Leave Balance**: View available leave days by type
- **Request History**: Track past leave requests and approvals
- **Leave Calendar**: Visual representation of approved leave
- **Manager Approval**: Request routing to managers
- **Emergency Leave**: Quick emergency leave submission

#### Implementation:
```typescript
interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  managerComment?: string;
  submittedAt: string;
}

// Leave request submission
const submitLeaveRequest = (requestData: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
  const newRequest: LeaveRequest = {
    ...requestData,
    id: `leave-${Date.now()}`,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  onSubmitLeaveRequest(newRequest);
};
```

#### Data Flow:
1. **Leave request** submitted by employee
2. **Manager notification** sent for approval
3. **Status updates** reflected in employee dashboard
4. **Leave balance** automatically updated upon approval

---

### 8. Performance Dashboard
**Location**: `src/components/employee/PerformanceDashboard.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **Performance Metrics**: Personal KPIs and productivity scores
- **Goal Progress**: Visual progress tracking for set objectives
- **Skill Development**: Track learning and certification progress
- **Feedback History**: View manager feedback and reviews
- **Achievement Badges**: Gamified achievement system
- **Performance Trends**: Historical performance analytics

#### Implementation:
```typescript
interface PerformanceMetrics {
  employeeId: string;
  period: string;
  hoursWorked: number;
  tasksCompleted: number;
  qualityScore: number;
  punctualityScore: number;
  collaborationScore: number;
  overallRating: number;
  goals: Goal[];
  achievements: Achievement[];
}

// Performance calculation
const calculatePerformanceScore = (metrics: PerformanceMetrics) => {
  const weights = {
    quality: 0.3,
    punctuality: 0.2,
    collaboration: 0.2,
    productivity: 0.3
  };
  
  return (
    metrics.qualityScore * weights.quality +
    metrics.punctualityScore * weights.punctuality +
    metrics.collaborationScore * weights.collaboration +
    (metrics.hoursWorked / 40) * 100 * weights.productivity
  );
};
```

#### Data Flow:
1. **Performance data** aggregated from work tickets and time entries
2. **Metrics calculated** based on predefined formulas
3. **Visual charts** rendered for trend analysis
4. **Goal progress** updated based on achievements

---

### 9. Team Collaboration
**Location**: `src/components/employee/TeamCollaboration.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **Team Directory**: View team members and contact information
- **Project Collaboration**: Shared project workspaces
- **Message Center**: Internal team messaging system
- **File Sharing**: Document and resource sharing
- **Team Calendar**: Shared team events and meetings
- **Collaboration Tools**: Real-time document editing, comments

#### Implementation:
```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'file' | 'system';
}

// Message sending
const sendMessage = (receiverId: string, content: string) => {
  const message: Message = {
    id: `msg-${Date.now()}`,
    senderId: profile.id,
    receiverId,
    content,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'text'
  };
  onSendMessage(message);
};
```

#### Data Flow:
1. **Team data** loaded from employee directory
2. **Real-time messaging** via WebSocket connections
3. **File uploads** handled with cloud storage
4. **Collaboration events** tracked for analytics

---

### 10. Training & Development
**Location**: `src/components/employee/TrainingDevelopment.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **Course Catalog**: Available training courses and materials
- **Learning Paths**: Structured skill development programs
- **Progress Tracking**: Monitor course completion and scores
- **Certifications**: Manage professional certifications
- **Skill Assessments**: Self-assessment and manager evaluations
- **Learning Goals**: Set and track learning objectives

#### Implementation:
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  modules: CourseModule[];
  certification: boolean;
}

interface LearningProgress {
  employeeId: string;
  courseId: string;
  progress: number; // percentage
  completedModules: string[];
  startDate: string;
  completionDate?: string;
  score?: number;
  certificate?: string;
}

// Course enrollment
const enrollInCourse = (courseId: string) => {
  const enrollment: LearningProgress = {
    employeeId: profile.id,
    courseId,
    progress: 0,
    completedModules: [],
    startDate: new Date().toISOString()
  };
  onEnrollCourse(enrollment);
};
```

#### Data Flow:
1. **Course catalog** loaded from training database
2. **Enrollment tracking** managed per employee
3. **Progress updates** saved as modules are completed
4. **Certificates generated** upon course completion

---

### 11. Expense Management
**Location**: `src/components/employee/ExpenseManagement.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **Expense Submission**: Submit business expenses with receipts
- **Expense Categories**: Categorize expenses (travel, meals, supplies, etc.)
- **Receipt Upload**: Photo capture and file upload for receipts
- **Expense Reports**: Generate expense reports by period
- **Approval Tracking**: Monitor expense approval status
- **Reimbursement Status**: Track payment processing

#### Implementation:
```typescript
interface Expense {
  id: string;
  employeeId: string;
  category: 'travel' | 'meals' | 'supplies' | 'software' | 'other';
  amount: number;
  currency: string;
  date: string;
  description: string;
  receipt?: string; // file URL
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  submittedAt?: string;
  approvedAt?: string;
  managerComment?: string;
}

// Expense submission
const submitExpense = (expenseData: Omit<Expense, 'id' | 'status' | 'submittedAt'>) => {
  const expense: Expense = {
    ...expenseData,
    id: `exp-${Date.now()}`,
    status: 'submitted',
    submittedAt: new Date().toISOString()
  };
  onSubmitExpense(expense);
};
```

#### Data Flow:
1. **Expense entry** with receipt upload
2. **Manager approval** workflow
3. **Finance processing** for reimbursement
4. **Status updates** throughout the process

---

### 12. Document Center
**Location**: `src/components/employee/DocumentCenter.tsx`
**Route**: Accessed via employee sidebar

#### Features:
- **Personal Documents**: Store personal work documents
- **Company Policies**: Access company handbook and policies
- **Forms & Templates**: Download common forms and templates
- **Document Sharing**: Share documents with team members
- **Version Control**: Track document versions and changes
- **Document Search**: Search through document library

#### Implementation:
```typescript
interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xlsx' | 'ppt' | 'image' | 'other';
  category: 'personal' | 'policy' | 'form' | 'template' | 'shared';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  url: string;
  tags: string[];
  shared: boolean;
  sharedWith: string[];
}

// Document upload
const uploadDocument = async (file: File, category: string) => {
  const document: Document = {
    id: `doc-${Date.now()}`,
    name: file.name,
    type: file.type.split('/')[1] as any,
    category: category as any,
    size: file.size,
    uploadedBy: profile.id,
    uploadedAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    url: await uploadFile(file),
    tags: [],
    shared: false,
    sharedWith: []
  };
  onUploadDocument(document);
};
```

#### Data Flow:
1. **File upload** to cloud storage
2. **Document metadata** saved to database
3. **Search indexing** for document discovery
4. **Access control** based on sharing settings

---

## 🔄 Shared Operations & Data Flow

### Authentication System
**Location**: `src/lib/authService.ts`, `src/lib/mockAuth.ts`

#### Features:
- **Role-based Access**: Manager vs Employee permissions
- **Session Management**: Login/logout functionality
- **Profile Management**: User profile data
- **Demo Credentials**: Testing accounts

#### Implementation:
```typescript
// Authentication flow
const handleLogin = async (email: string, password: string) => {
  const session = await authService.signIn(email, password);
  if (session?.user) {
    const profile = await authService.getProfile(session.user.id);
    setSession(session);
    setProfile(profile);
  }
};

// Role-based routing
const renderDashboard = () => {
  if (profile?.role === 'manager') {
    return <ManagerDashboard />;
  } else {
    return <EmployeeLayout />;
  }
};
```

### State Management
**Location**: `src/App.tsx`

#### Global State:
- **Employees**: All employee records
- **Work Tickets**: All work ticket records
- **Authentication**: Session and profile data
- **UI State**: Active views, loading states

#### State Updates:
```typescript
// Employee management
const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
  const newEmployee = { ...employee, id: `emp-${Date.now()}` };
  setEmployees([...employees, newEmployee]);
};

// Ticket management
const [tickets, setTickets] = useState<WorkTicket[]>(mockTickets);
const handleCreateTicket = (ticketData) => {
  const newTicket = { /* ticket creation logic */ };
  setTickets([...tickets, newTicket]);
};
```

### Data Persistence
**Current**: In-memory state (resets on refresh)
**Future**: Firebase/Database integration

#### Mock Data Structure:
```typescript
// Employee mock data
const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'John Doe',
    email: 'john@nanocomputing.com',
    department: 'Development',
    hourlyRate: 1500 // ETB
  }
];

// Work ticket mock data
const mockTickets: WorkTicket[] = [
  {
    id: 'ticket-1',
    employeeId: 'emp-1',
    employeeName: 'John Doe',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '17:00',
    description: 'Working on authentication module',
    status: 'pending'
  }
];
```

---

## 🚀 Implementation Guidelines

### Adding New Operations

#### 1. Create Component
```typescript
// src/components/manager/NewFeature.tsx
interface NewFeatureProps {
  // Define props
}

export default function NewFeature({ ...props }: NewFeatureProps) {
  // Component implementation
}
```

#### 2. Add to Navigation
```typescript
// Update Sidebar.tsx menuItems
const menuItems = [
  // existing items...
  { id: 'new-feature' as ViewType, label: 'New Feature', icon: NewIcon }
];
```

#### 3. Update App.tsx
```typescript
// Add to ViewType
export type ViewType = 'dashboard' | 'new-feature' | /* existing types */;

// Add to renderView switch
case 'new-feature':
  return <NewFeature />;
```

#### 4. Add State Management (if needed)
```typescript
// Add state
const [newFeatureData, setNewFeatureData] = useState([]);

// Add handlers
const handleNewFeatureAction = (data) => {
  // Handle the action
  setNewFeatureData([...newFeatureData, data]);
};
```

### Best Practices

#### Component Structure:
1. **Props Interface**: Define clear prop types
2. **State Management**: Use useState for local state
3. **Event Handlers**: Prefix with 'handle'
4. **Styling**: Use Tailwind CSS classes
5. **Accessibility**: Include ARIA labels and keyboard navigation

#### Data Flow:
1. **Props Down**: Pass data via props
2. **Events Up**: Use callbacks for actions
3. **State Lifting**: Manage shared state in parent components
4. **Immutable Updates**: Always create new objects/arrays
#### Error Handling:
1. **Form Validation**: Validate inputs before submission
2. **Loading States**: Show loading indicators
3. **Error Messages**: Display user-friendly error messages
4. **Fallback UI**: Handle missing data gracefully

### 🔄 Partially Implemented:
- **Employee Timesheet**: Basic structure, needs integration
- **Personal Goals**: UI components, needs data persistence

### 📋 Future Enhancements:
- **Database Integration**: Replace mock data with Firebase
- **Real-time Updates**: WebSocket connections
- **File Uploads**: Document attachments
- **Mobile Responsiveness**: Touch-friendly interfaces
- **Offline Support**: PWA capabilities

---

## 🔧 Development Commands

### Start Development Server:
```bash
npm run dev
```

### Build for Production:
```bash
npm run build
```

### Type Checking:
```bash
npm run type-check
```

### Linting:
```bash
npm run lint
```

---

## 📝 Testing Credentials

### Manager Account:
- **Email**: manager@nanocomputing.com
- **Password**: demo123
- **Access**: All manager operations

### Employee Accounts:
- **Email**: john@nanocomputing.com
- **Password**: demo123
- **Department**: Development
- **Rate**: ETB 1500/hr

- **Email**: sarah@nanocomputing.com
- **Password**: demo123
- **Department**: Design
- **Rate**: ETB 1600/hr

---

*This documentation is maintained alongside the codebase and should be updated when new features are added or existing functionality is modified.*
