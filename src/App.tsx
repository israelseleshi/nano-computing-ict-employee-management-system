import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@lib/firebase/config';
import { firebaseService } from '@services/firebase/consolidated.service';
import { Employee, WorkTicket, ViewType, LeaveRequest } from '@types';
import Login from '@features/auth/Login/Login';
// Premium 4-Tab Layout Components
import OverviewTab from '@features/dashboard/manager/Overview/OverviewTab';
import OperationsTab from '@features/dashboard/manager/Operations/OperationsTab';
import HRFinanceTab from '@features/dashboard/manager/HRFinance/HRFinanceTab';
import IntelligenceTab from '@features/dashboard/manager/Intelligence/IntelligenceTab';
import Sidebar from '@components/common/Sidebar/Sidebar';
import Header from '@components/common/Header/Header';
import EmployeeLayout from '@features/dashboard/employee/Dashboard/EmployeeLayout';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tickets, setTickets] = useState<WorkTicket[]>([]);
  const [dbTickets, setDbTickets] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          await fetchProfile(firebaseUser.uid);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Separate useEffect to fetch data after profile is loaded
  useEffect(() => {
    if (profile) {
      console.log('📋 Profile loaded, fetching additional data...');
      Promise.all([
        fetchLeaveRequests(),
        fetchEmployees(),
        fetchTickets()
      ]).then(() => {
        console.log('✅ All additional data loaded');
      }).catch(error => {
        console.error('❌ Error loading additional data:', error);
      });
    }
  }, [profile]);

  const fetchProfile = async (userId: string) => {
    try {
      const userDoc = await firebaseService.getUser(userId);
      if (userDoc) {
        setProfile({
          id: userDoc.id,
          full_name: userDoc.profile.fullName,
          email: userDoc.email,
          role: userDoc.role,
          department: userDoc.profile.department,
          hourly_rate: userDoc.profile.hourlyRate,
          created_at: userDoc.createdAt
        });
      } else {
        console.error('User profile not found in database');
        setError('Account not found. Please contact administrator.');
        // Force logout if user doesn't exist in our database
        await auth.signOut();
        setUser(null);
        setProfile(null);
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError('Failed to load user profile. Please try again.');
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const requests = await firebaseService.getLeaveRequests();
      console.log('🔍 Raw leave requests from Firebase:', requests);
      
      const convertedRequests: LeaveRequest[] = requests.map((req: any) => {
        // Helper function to format dates properly
        const formatDate = (dateValue: any) => {
          if (!dateValue) return '';
          
          // If it's a Firebase Timestamp
          if (dateValue && typeof dateValue.toDate === 'function') {
            return dateValue.toDate().toISOString().split('T')[0];
          }
          
          // If it's already a string in YYYY-MM-DD format
          if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateValue;
          }
          
          // If it's a Date object
          if (dateValue instanceof Date) {
            return dateValue.toISOString().split('T')[0];
          }
          
          // Try to parse as date
          try {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
              return date.toISOString().split('T')[0];
            }
          } catch (e) {
            console.warn('Could not parse date:', dateValue);
          }
          
          return '';
        };

        return {
          id: req.id,
          employeeId: req.employeeId,
          employeeName: req.employeeName || 'Unknown Employee',
          employeeDepartment: req.employeeDepartment || 'Unknown Department',
          type: req.type,
          startDate: formatDate(req.startDate),
          endDate: formatDate(req.endDate),
          days: req.days || 0,
          reason: req.reason || '',
          status: req.status === 'cancelled' ? 'rejected' : req.status,
          submittedAt: formatDate(req.submittedAt),
          reviewedAt: formatDate(req.reviewedAt),
          reviewedBy: req.reviewedBy,
          managerComment: req.managerComment || ''
        };
      });
      
      console.log('✅ Converted leave requests:', convertedRequests);
      setLeaveRequests(convertedRequests);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      console.log('🔍 Fetching employees...');
      console.log('Current profile:', profile);
      
      // Only managers can fetch all users
      if (profile?.role === 'manager' || profile?.role === 'admin') {
        console.log('✅ Manager role confirmed, fetching users...');
        const users = await firebaseService.getAllUsers();
        console.log('📊 Raw users from Firebase:', users);
        
        const convertedEmployees: Employee[] = users
          .filter(u => u.role === 'employee') // Only get employees, not managers
          .map(u => ({
            id: u.id,
            name: u.profile?.fullName || u.email?.split('@')[0] || 'Unknown User',
            email: u.email || '',
            department: u.profile?.department || 'General',
            position: u.profile?.position || 'Employee',
            hourlyRate: u.profile?.hourlyRate || 1500
          }));
        
        console.log('👥 Converted employees:', convertedEmployees);
        setEmployees(convertedEmployees);
      } else {
        console.log('⚠️ Not a manager, cannot fetch employees. Role:', profile?.role);
      }
    } catch (err) {
      console.error('❌ Error fetching employees:', err);
    }
  };

  const fetchTickets = async () => {
    try {
      const workTickets = await firebaseService.getWorkTickets();
      const convertedTickets: WorkTicket[] = workTickets.map(t => ({
        id: t.id,
        employeeId: t.employee_id,
        employeeName: employees.find(e => e.id === t.employee_id)?.name || 'Unknown',
        date: t.work_date,
        startTime: t.start_time,
        endTime: t.end_time,
        description: t.task_description
      }));
      setTickets(convertedTickets);
      setDbTickets(workTickets);
    } catch (err: any) {
      console.error('Error fetching tickets:', err);
    }
  };

  // Authentication handlers
  const handleLogin = async (_email: string, _password: string): Promise<void> => {
    // This is handled by Firebase Auth now
  };

  const handleLogout = async () => {
    await auth.signOut();
    setProfile(null);
    setDbTickets([]);
    setEmployees([]);
    setTickets([]);
    setLeaveRequests([]);
  };

  // CRUD handlers

  const handleCreateTicket = async (ticketData: {
    employeeId: string;
    date: string;
    startTime: string;
    endTime: string;
    taskDescription: string;
  }) => {
    try {
      console.log('🎫 Creating ticket for employee ID:', ticketData.employeeId);
      const ticketToCreate = {
        employee_id: ticketData.employeeId,
        manager_id: user?.uid || null,
        work_date: ticketData.date,
        start_time: ticketData.startTime,
        end_time: ticketData.endTime,
        task_description: ticketData.taskDescription
      };
      
      console.log('📝 Ticket to create:', ticketToCreate);
      await firebaseService.createWorkTicket(ticketToCreate);
      console.log('✅ Ticket created, refreshing tickets...');
      await fetchTickets();
      console.log('🔄 Tickets refreshed');
      
      // Show success message
      const employeeName = employees.find(e => e.id === ticketData.employeeId)?.name || 'Employee';
      setSuccessMessage(`Work ticket created successfully for ${employeeName}!`);
      
      // Auto-hide success message after 4 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      
    } catch (err) {
      console.error('❌ Error creating ticket:', err);
      setError('Failed to create work ticket. Please try again.');
    }
  };


  // Time tracking handlers
  const handleCreateTimeEntry = async (entry: any) => {
    try {
      await firebaseService.createTimeEntry({
        employee_id: entry.employeeId || user?.uid || '',
        date: entry.date,
        clock_in: entry.clockIn,
        clock_out: entry.clockOut,
        break_duration: entry.breakDuration || 0,
        total_hours: entry.totalHours,
        status: 'completed'
      });
    } catch (err) {
      console.error('Error creating time entry:', err);
    }
  };

  const handleUpdateTimeEntry = async (entryId: string, updates: any) => {
    try {
      console.log('Updating time entry:', entryId, updates);
    } catch (err) {
      console.error('Error updating time entry:', err);
    }
  };

  const handleGeneratePayroll = async (entries: any[]) => {
    try {
      for (const entry of entries) {
        await firebaseService.createPayrollEntry(entry);
      }
    } catch (err) {
      console.error('Error generating payroll:', err);
    }
  };

  const handleUpdatePayrollStatus = async (entryId: string, status: string) => {
    try {
      console.log('Updating payroll status:', entryId, status);
    } catch (err) {
      console.error('Error updating payroll status:', err);
    }
  };

  // Notification handlers
  const handleSendNotification = async (notification: any) => {
    try {
      await firebaseService.createNotification({
        user_id: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority || 'medium',
        is_read: false
      });
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await firebaseService.markNotificationAsRead(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Leave management handlers
  const handleUpdateLeaveStatus = async (requestId: string, status: 'approved' | 'rejected', comment?: string) => {
    try {
      await firebaseService.updateLeaveRequestStatus(
        requestId,
        status,
        user?.uid || '',
        comment
      );
      await fetchLeaveRequests();
    } catch (err) {
      console.error('Error updating leave request status:', err);
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} error={error} />;
  }

  // Show error if profile couldn't be loaded
  if (!profile && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Account Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Unable to load your profile. Please contact administrator.'}</p>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Employee Layout
  if (profile.role === 'employee') {
    console.log('🔍 Employee Dashboard Debug:');
    console.log('Profile ID:', profile.id);
    console.log('All dbTickets:', dbTickets);
    console.log('Filtered tickets:', dbTickets.filter(t => t.employee_id === profile.id));
    
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
            onAddEmployee={(employee) => console.log('Add employee:', employee)}
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
        return null;
    }
  };

  // Manager Layout
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          profile={profile}
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Success Popup */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="flex-shrink-0 ml-4 text-green-200 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
