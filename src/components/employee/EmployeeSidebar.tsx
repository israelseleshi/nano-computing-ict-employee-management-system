import { LayoutDashboard, FileText, Menu, LogOut, Target, Calendar, Bell } from 'lucide-react';
import { useState } from 'react';

type EmployeeViewType = 'dashboard' | 'timesheet' | 'goals' | 'calendar' | 'notifications';

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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} py-3 transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } ${isCollapsed ? 'px-4 rounded-lg' : 'px-0 ml-0 mr-0'}`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600'} ${isCollapsed ? '' : 'ml-4'}`} />
                {!isCollapsed && (
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>{item.label}</span>
                )}
              </button>
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
