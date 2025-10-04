import { Menu, Home, Users, FileText, BarChart3, Mail, LogOut, CheckSquare, TrendingUp, Clock, DollarSign, Bell, PieChart } from 'lucide-react';
import { ViewType } from '../../lib/types';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export default function Sidebar({ activeView, onViewChange, onLogout, isCollapsed, onToggleCollapse }: SidebarProps) {

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: Home },
    { id: 'add-employee' as ViewType, label: 'Add Employee', icon: Users },
    { id: 'create-ticket' as ViewType, label: 'Create Work Ticket', icon: FileText },
    { id: 'ticket-management' as ViewType, label: 'Ticket Management', icon: CheckSquare },
    { id: 'time-tracking' as ViewType, label: 'Time Tracking', icon: Clock },
    { id: 'payroll-management' as ViewType, label: 'Payroll Management', icon: DollarSign },
    { id: 'notification-center' as ViewType, label: 'Notification Center', icon: Bell },
    { id: 'advanced-reports' as ViewType, label: 'Advanced Reports', icon: PieChart },
    { id: 'performance-analytics' as ViewType, label: 'Performance Analytics', icon: TrendingUp },
    { id: 'reports' as ViewType, label: 'Daily Reports', icon: BarChart3 },
    { id: 'send-email' as ViewType, label: 'Send Daily Email', icon: Mail }
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
                  <p className="text-xs text-gray-500">ICT Management</p>
                </div>
              )}
            </div>
            <button
              onClick={() => onToggleCollapse(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 space-y-2 overflow-y-auto sidebar-scrollbar">
          {menuItems.map((item) => {
            const isActive = activeView === item.id;
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg py-3'
                    : 'text-gray-700 hover:bg-gray-100 py-3 px-4'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white ml-4' : 'text-gray-600'} ${isCollapsed && !isActive ? 'ml-0' : ''}`} />
                {!isCollapsed && (
                  <span className={`font-medium ml-3 ${isActive ? 'text-white' : 'text-gray-700'}`}>{item.label}</span>
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
