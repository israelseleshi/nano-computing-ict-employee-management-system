import { useState } from 'react';
import { User } from 'lucide-react';
import EmployeeDashboard from './EmployeeDashboard';
import EmployeeTimesheet from './EmployeeTimesheet';
import PersonalGoals from './PersonalGoals';
import Calendar from './Calendar';
import Notifications from './Notifications';
import { Profile, WorkTicketDB } from '../../lib/mockAuth';
import EmployeeSidebar from './EmployeeSidebar';

type EmployeeViewType = 'dashboard' | 'timesheet' | 'goals' | 'calendar' | 'notifications';

interface EmployeeLayoutProps {
  profile: Profile;
  tickets: WorkTicketDB[];
  onLogout: () => void;
}

export default function EmployeeLayout({ profile, tickets, onLogout }: EmployeeLayoutProps) {
  const [activeView, setActiveView] = useState<EmployeeViewType>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <EmployeeDashboard profile={profile} tickets={tickets} />;
      case 'timesheet':
        return <EmployeeTimesheet profile={profile} tickets={tickets} />;
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
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
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
