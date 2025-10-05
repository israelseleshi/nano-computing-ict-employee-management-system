import { useState } from 'react';
import { Bell, Users, FileText, Clock, ChevronRight, X } from 'lucide-react';
import { Employee, WorkTicket } from '../../lib/types';
import Dashboard from './Dashboard';
import NotificationCenter from './NotificationCenter';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  read: boolean;
}

interface OverviewTabProps {
  employees: Employee[];
  tickets: WorkTicket[];
  onSendNotification: (notification: any) => void;
  onMarkAsRead: (notificationId: string) => void;
}

export default function OverviewTab({ 
  employees, 
  tickets, 
  onSendNotification, 
  onMarkAsRead 
}: OverviewTabProps) {
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Mock recent notifications
  const recentNotifications: Notification[] = [
    {
      id: 'notif-1',
      title: 'Work Ticket Approved',
      message: 'John Doe\'s timesheet for Jan 15 has been approved',
      type: 'success',
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: 'notif-2', 
      title: 'New Employee Added',
      message: 'Sarah Wilson joined the Development team',
      type: 'info',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Payroll Generated',
      message: 'Monthly payroll has been processed successfully',
      type: 'success',
      timestamp: '3 hours ago',
      read: true
    }
  ];

  const unreadCount = recentNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Mobile: Stacked layout, Desktop: Grid layout */}
      <div className="space-y-6 sm:space-y-8 xl:grid xl:grid-cols-4 xl:gap-8 xl:space-y-0">
        {/* Main Dashboard Content - Moved left with more spacing */}
        <div className="xl:col-span-3 xl:pr-8">
          <Dashboard employees={employees} tickets={tickets} />
        </div>

        {/* Live Notification Feed Widget - Full width on mobile */}
        <div className="xl:col-span-1 w-full">
          <div className="relative w-full">
            {/* Left border line - Hidden on mobile, shown on desktop */}
            <div className="hidden xl:block absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full"></div>
            
            <div className="xl:pl-6 w-full">
              {/* Widget Header */}
              <div 
                className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-all duration-300 rounded-lg"
                onClick={() => setShowNotificationModal(true)}
              >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-600 font-medium">{unreadCount} unread</span>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>

              {/* Recent Notifications - Compact for mobile */}
              <div className="space-y-1 sm:space-y-2 mt-3 sm:mt-4">
                {recentNotifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 sm:p-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => setShowNotificationModal(true)}
                  >
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="text-sm sm:text-lg flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs sm:text-sm font-medium truncate ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-tight">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-4">
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors py-2"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards - Mobile responsive */}
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-6">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg flex-shrink-0">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 font-medium mb-0.5 sm:mb-1">Active Employees</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 font-medium mb-0.5 sm:mb-1">Work Tickets</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">{tickets.length}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg flex-shrink-0">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 font-medium mb-0.5 sm:mb-1">Total Hours</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">168</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Notification Center</h2>
                  <p className="text-sm text-gray-600">Manage all your notifications</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <NotificationCenter 
                employees={employees} 
                tickets={tickets} 
                onSendNotification={onSendNotification}
                onMarkAsRead={onMarkAsRead}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
