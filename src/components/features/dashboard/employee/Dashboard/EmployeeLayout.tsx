import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Profile, WorkTicketDB } from '@services/api/mock.service';
import { firebaseData } from '@services/firebase/db.service';
import EmployeeDashboard from './EmployeeDashboard';
import EmployeeSidebar from './EmployeeSidebar';
import LeaveManagement from './LeaveManagement';
import PersonalGoals from './PersonalGoals';
import Calendar from './Calendar';
import Notifications from './Notifications';
import EmployeeTimesheet from './EmployeeTimesheet';
import ProfileManagement from './ProfileManagement';

type EmployeeViewType = 'dashboard' | 'timesheet' | 'goals' | 'calendar' | 'notifications' | 'profile' | 'leave';
interface EmployeeLayoutProps {
  profile: Profile;
  tickets: WorkTicketDB[];
  onLogout: () => void;
}

export default function EmployeeLayout({ profile, tickets, onLogout }: EmployeeLayoutProps) {
  const [activeView, setActiveView] = useState<EmployeeViewType>('dashboard');
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<any>({
    vacation: { used: 0, available: 22, total: 22 },
    sick: { used: 0, available: 10, total: 10 },
    personal: { used: 0, available: 5, total: 5 },
    emergency: { used: 0, available: 3, total: 3 }
  });

  // Fetch leave data on component mount
  useEffect(() => {
    fetchLeaveData();
  }, [profile.id]);

  const fetchLeaveData = async () => {
    try {
      // Fetch leave requests for this employee
      const { data: requests, error: requestError } = await firebaseData.getLeaveRequests(profile.id);
      if (requestError) {
        console.error('Error fetching leave requests:', requestError);
      } else {
        setLeaveRequests(requests || []);
      }

      // Fetch leave balance for this employee
      const { data: balance, error: balanceError } = await firebaseData.getLeaveBalance(profile.id);
      if (balanceError) {
        console.error('Error fetching leave balance:', balanceError);
      } else if (balance) {
        setLeaveBalance(balance);
      }
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  };

  // Handlers for new features

  const handleSubmitLeaveRequest = async (request: any) => {
    try {
      const { data, error } = await firebaseData.createLeaveRequest({
        employeeId: request.employeeId,
        employeeName: profile.full_name,
        employeeDepartment: profile.department || 'Unknown Department',
        type: request.type,
        startDate: request.startDate,
        endDate: request.endDate,
        days: request.days,
        reason: request.reason
      });
      
      if (error) {
        console.error('Error submitting leave request:', error);
      } else {
        console.log('Leave request submitted successfully:', data);
        // Refresh leave requests
        fetchLeaveData();
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <EmployeeDashboard profile={profile} tickets={tickets} />;
      case 'timesheet':
        return <EmployeeTimesheet profile={profile} tickets={tickets} />;
      case 'profile':
        return <ProfileManagement 
          profile={{
            id: profile.id,
            name: profile.full_name,
            email: profile.email,
            phone: '',
            department: profile.department || 'General',
            position: profile.role || 'Employee',
            hourlyRate: profile.hourly_rate || 1500,
            hireDate: profile.created_at || new Date().toISOString(),
            address: '',
            avatar: '',
            skills: [],
            emergencyContact: {
              name: '',
              phone: '',
              relationship: ''
            },
            preferences: {
              notifications: true,
              language: 'en',
              theme: 'light'
            }
          }}
          onUpdateProfile={(updates) => {
            console.log('Profile updates:', updates);
            // TODO: Implement profile update functionality
          }}
        />;
      case 'leave':
        return <LeaveManagement 
          profile={{
            id: profile.id,
            name: profile.full_name,
            email: profile.email,
            department: profile.department || 'Unknown Department'
          }}
          leaveRequests={leaveRequests}
          leaveBalance={leaveBalance}
          onSubmitLeaveRequest={handleSubmitLeaveRequest}
        />;
      case 'goals':
        return <PersonalGoals profile={profile} tickets={tickets} />;
      case 'calendar':
        return <Calendar profile={profile} tickets={tickets} />;
      case 'notifications':
        return <Notifications profile={profile} tickets={tickets} />;
      default:
        return <EmployeeDashboard profile={profile} tickets={tickets} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EmployeeSidebar activeView={activeView} onViewChange={setActiveView} onLogout={onLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Portal</h1>
              <p className="text-sm text-gray-600">{profile.email}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 pr-4 border-r border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{profile.full_name}</p>
                  <p className="text-xs text-gray-500">{profile.department}</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>

            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 flex justify-center">
          <div className="w-full max-w-7xl">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
