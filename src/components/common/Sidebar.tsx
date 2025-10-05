import { Menu, Home, Settings, Users, LogOut, TrendingUp } from 'lucide-react';
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
    { 
      id: 'overview' as ViewType, 
      label: 'Overview', 
      icon: Home,
      description: 'Dashboard & Notifications'
    },
    { 
      id: 'operations' as ViewType, 
      label: 'Operations', 
      icon: Settings,
      description: 'Tickets, Time & Leave'
    },
    { 
      id: 'hr-finance' as ViewType, 
      label: 'HR & Finance', 
      icon: Users,
      description: 'Employees & Payroll'
    },
    { 
      id: 'intelligence' as ViewType, 
      label: 'Intelligence', 
      icon: TrendingUp,
      description: 'Reports & Analytics'
    }
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

        {/* Premium Navigation Menu */}
        <nav className="flex-1 py-6 px-0 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeView === item.id;
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center text-left transition-all duration-300 ease-out group ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg py-4 px-4'
                    : 'text-gray-700 hover:bg-gray-100 py-4 px-4'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'}`} />
                  {!isCollapsed && (
                    <div className="ml-3 flex-1">
                      <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-800 group-hover:text-gray-900'}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-600'}`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Premium Logout Button */}
        <div className="border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center py-4 px-4 bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
            title={isCollapsed ? 'Logout' : ''}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <LogOut className="w-5 h-5 flex-shrink-0 text-white" />
              {!isCollapsed && (
                <span className="ml-3 font-medium text-sm">Logout</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
