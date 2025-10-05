import { useState, useEffect } from 'react';
import { MockSession, Profile, WorkTicketDB, mockDb } from './lib/mockAuth';
import { authService } from './lib/authService';
import { Employee, WorkTicket, ViewType, LeaveRequest } from './lib/types';
import Login from './components/auth/Login';
// Premium 4-Tab Layout Components
import OverviewTab from './components/manager/OverviewTab';
import OperationsTab from './components/manager/OperationsTab';
import HRFinanceTab from './components/manager/HRFinanceTab';
import IntelligenceTab from './components/manager/IntelligenceTab';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import EmployeeLayout from './components/employee/EmployeeLayout';

// Mock data
const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'John Doe',
    email: 'john@nanocomputing.com',
    department: 'Development',
    position: 'Senior Developer',
    hourlyRate: 1500
  }
];

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

// Mock leave requests data
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-001',
    employeeId: 'emp-1',
    employeeName: 'John Doe',
    employeeDepartment: 'Development',
    type: 'vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-20',
    days: 6,
    reason: 'Family vacation to Bahir Dar',
    status: 'pending',
    submittedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'leave-002',
    employeeId: 'emp-1',
    employeeName: 'John Doe',
    employeeDepartment: 'Development',
    type: 'sick',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    days: 3,
    reason: 'Flu symptoms and recovery',
    status: 'approved',
    managerComment: 'Get well soon. Take care of your health.',
    submittedAt: '2024-01-09T08:00:00Z',
    approvedAt: '2024-01-09T09:15:00Z'
  }
];

function App() {
  const [session, setSession] = useState<MockSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [tickets, setTickets] = useState<WorkTicket[]>(mockTickets);
  const [dbTickets, setDbTickets] = useState<WorkTicketDB[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    authService.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = authService.onAuthStateChange((session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (profile) {
      fetchTickets();
    }
  }, [profile]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await authService.getProfile(userId);

      if (error) {
        console.warn('Profile not found, user may need to complete setup:', error);
        // Don't throw error, just set profile to null and continue
        setProfile(null);
        return;
      }
      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      // Don't set error state for missing profiles in demo mode
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const { data, error } = await mockDb.getWorkTickets();

      if (error) throw error;
      setDbTickets(data || []);
    } catch (err: any) {
      console.error('Error fetching tickets:', err);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await authService.signIn(email, password);

      if ('error' in result && result.error) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Login failed');
      }
      if (!result.data.session) {
        throw new Error('Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
      throw err;
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    setProfile(null);
    setDbTickets([]);
  };

  const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: `emp-${Date.now()}`
    };
    setEmployees([...employees, newEmployee]);
  };

  const handleCreateTicket = (ticketData: {
    employeeId: string;
    date: string;
    startTime: string;
    endTime: string;
    taskDescription: string;
  }) => {
    const employee = employees.find(e => e.id === ticketData.employeeId);
    const newTicket: WorkTicket = {
      id: `ticket-${Date.now()}`,
      employeeId: ticketData.employeeId,
      employeeName: employee?.name || 'Unknown',
      date: ticketData.date,
      startTime: ticketData.startTime,
      endTime: ticketData.endTime,
      description: ticketData.taskDescription,
      status: 'pending'
    };
    setTickets([...tickets, newTicket]);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: 'pending' | 'approved' | 'rejected', comment?: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status, comment }
        : ticket
    ));
  };

  // Time tracking handlers
  const handleCreateTimeEntry = (entry: any) => {
    console.log('Time entry created:', entry);
    // In a real app, this would save to database
  };

  const handleUpdateTimeEntry = (entryId: string, updates: any) => {
    console.log('Time entry updated:', entryId, updates);
    // In a real app, this would update in database
  };

  // Payroll handlers
  const handleGeneratePayroll = (entries: any[]) => {
    console.log('Payroll generated:', entries);
    // In a real app, this would save to database
  };

  const handleUpdatePayrollStatus = (entryId: string, status: string) => {
    console.log('Payroll status updated:', entryId, status);
    // In a real app, this would update in database
  };

  // Notification handlers
  const handleSendNotification = (notification: any) => {
    console.log('Notification sent:', notification);
    // In a real app, this would save to database and send real-time notifications
  };

  const handleMarkAsRead = (notificationId: string) => {
    console.log('Notification marked as read:', notificationId);
    // In a real app, this would update in database
  };

  // Leave management handlers
  const handleUpdateLeaveStatus = (requestId: string, status: 'approved' | 'rejected', comment?: string) => {
    setLeaveRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              status, 
              managerComment: comment,
              approvedAt: status === 'approved' ? new Date().toISOString() : request.approvedAt,
              rejectedAt: status === 'rejected' ? new Date().toISOString() : request.rejectedAt
            }
          : request
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login onLogin={handleLogin} error={error} />;
  }

  // If logged in but no profile, show a basic dashboard
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  if (profile.role === 'employee') {
    return (
      <EmployeeLayout
        profile={profile}
        tickets={dbTickets.filter(t => t.employee_id === profile.id)}
        onLogout={handleLogout}
      />
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <OverviewTab
            employees={employees}
            tickets={tickets}
            onSendNotification={handleSendNotification}
            onMarkAsRead={handleMarkAsRead}
          />
        );
      case 'operations':
        return (
          <OperationsTab
            employees={employees}
            tickets={tickets}
            leaveRequests={leaveRequests}
            onCreateTicket={handleCreateTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onCreateTimeEntry={handleCreateTimeEntry}
            onUpdateTimeEntry={handleUpdateTimeEntry}
            onUpdateLeaveStatus={handleUpdateLeaveStatus}
          />
        );
      case 'hr-finance':
        return (
          <HRFinanceTab
            employees={employees}
            tickets={tickets}
            onAddEmployee={handleAddEmployee}
            onGeneratePayroll={handleGeneratePayroll}
            onUpdatePayrollStatus={handleUpdatePayrollStatus}
          />
        );
      case 'intelligence':
        return (
          <IntelligenceTab
            employees={employees}
            tickets={tickets}
          />
        );
      default:
        return (
          <OverviewTab
            employees={employees}
            tickets={tickets}
            onSendNotification={handleSendNotification}
            onMarkAsRead={handleMarkAsRead}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        onLogout={handleLogout}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header profile={profile} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex justify-center">
          <div className="w-full max-w-7xl">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
