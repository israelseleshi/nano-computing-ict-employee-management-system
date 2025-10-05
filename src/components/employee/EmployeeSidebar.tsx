import { LayoutDashboard, FileText, Menu, LogOut, Target, Calendar, Bell, User, Plane } from 'lucide-react';
import { useState } from 'react';

type EmployeeViewType = 'dashboard' | 'timesheet' | 'goals' | 'calendar' | 'notifications' | 'profile' | 'leave';

interface EmployeeSidebarProps {
  activeView: EmployeeViewType;
  onViewChange: (view: EmployeeViewType) => void;
  onLogout: () => void;
}

export default function EmployeeSidebar({ activeView, onViewChange, onLogout }: EmployeeSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard' as EmployeeViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timesheet' as EmployeeViewType, label: 'My Timesheet', icon: FileText },
    { id: 'profile' as EmployeeViewType, label: 'Profile Management', icon: User },
    { id: 'leave' as EmployeeViewType, label: 'Leave Management', icon: Plane },
    { id: 'goals' as EmployeeViewType, label: 'Goals & Performance', icon: Target },
    { id: 'calendar' as EmployeeViewType, label: 'Calendar & Schedule', icon: Calendar },
    { id: 'notifications' as EmployeeViewType, label: 'Notifications', icon: Bell }
  ];

  return (
    <div
      className={`bg-white border-r border-gray-200 text-gray-800 transition-all duration-300 ease-in-out shadow-lg ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      <div className="flex flex-col h-screen">
        {/* Header with Logo and Hamburger */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.jpg" 
                alt="Nano Computing Logo" 
                className="w-16 h-16 rounded-lg object-cover"
              />
              {!isCollapsed && (
                <div>
                  <h1 className="text-base font-bold text-gray-800">Nano Computing</h1>
                  <p className="text-xs text-gray-500">Employee Portal</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <div key={item.id} className="relative">
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full shadow-lg shadow-blue-500/50"></div>
                )}
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg py-3'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 py-3 px-4'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white ml-4' : 'text-gray-600'} ${isCollapsed && !isActive ? 'ml-0' : ''}`} />
                  {!isCollapsed && (
                    <span className={`font-medium ml-3 ${isActive ? 'text-white' : 'text-gray-700'}`}>{item.label}</span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-4 rounded-lg' : 'space-x-3 px-0 ml-0 mr-0'} py-3 transition-all duration-200 bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/30`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'ml-4'}`} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
