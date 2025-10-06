import { Bell, Search, Clock, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Profile } from '../../lib/mockAuth';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  profile: Profile;
}

export default function Header({ profile }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Ticket Approved',
      message: 'Work ticket #WT-001 has been approved successfully',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'info',
      title: 'New Employee Added',
      message: 'Sarah Johnson joined the Design department',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'warning',
      title: 'Payroll Reminder',
      message: 'Monthly payroll processing due in 2 days',
      time: '3 hours ago',
      unread: false
    },
    {
      id: 4,
      type: 'info',
      title: 'System Update',
      message: 'Application updated to version 1.2.0',
      time: '1 day ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // Handle click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show notifications on hover or click
  const shouldShowNotifications = showNotifications || isHovering;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all duration-200"
            />
          </div>
          
          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:shadow-md"
              onClick={() => setShowNotifications(!showNotifications)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {shouldShowNotifications && (
              <div 
                className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Header */}
                <div className="bg-blue-600 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Notifications</h3>
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2">
                            <Clock className="w-3 h-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{profile?.full_name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{profile?.role || 'Manager'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
