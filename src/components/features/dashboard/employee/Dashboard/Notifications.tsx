import { useState, useMemo, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Clock, FileText, Settings, Trash2, Mail, Filter, Search, Calendar } from 'lucide-react';
import { Profile, WorkTicketDB } from '@services/api/mock.service';
import { firebaseService } from '@services/firebase/consolidated.service';

interface Notification {
  id: string;
  type: 'ticket_assigned' | 'ticket_approved' | 'ticket_rejected' | 'deadline_reminder' | 'system_update' | 'achievement' | 'leave_request_update';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  relatedTicketId?: string;
}

interface NotificationsProps {
  profile: Profile;
  tickets: WorkTicketDB[];
}

export default function Notifications({ profile }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [profile.id]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const fetchedNotifications = await firebaseService.getNotifications(profile.id);
      
      // Map Firebase notifications to component format
      const mappedNotifications: Notification[] = fetchedNotifications.map(notif => ({
        id: notif.id,
        type: notif.type as any || 'system_update',
        title: notif.title,
        message: notif.message,
        timestamp: notif.created_at,
        isRead: notif.is_read,
        priority: notif.priority || 'medium'
      }));
      
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // If no notifications from Firebase, show empty state
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'medium' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply filter
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter !== 'all') {
      filtered = filtered.filter(n => n.priority === filter);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notifications, filter, searchTerm]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAsUnread = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: false } : n)
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredNotifications.map(n => n.id);
    setSelectedNotifications(visibleIds);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ticket_assigned': return FileText;
      case 'ticket_approved': return CheckCircle2;
      case 'ticket_rejected': return AlertCircle;
      case 'deadline_reminder': return Clock;
      case 'system_update': return Settings;
      case 'achievement': return CheckCircle2;
      case 'leave_request_update': return Calendar;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'border-red-200 bg-red-50';
    if (priority === 'medium') return 'border-yellow-200 bg-yellow-50';
    
    switch (type) {
      case 'ticket_approved':
      case 'achievement':
        return 'border-green-200 bg-green-50';
      case 'ticket_rejected':
        return 'border-red-200 bg-red-50';
      case 'deadline_reminder':
        return 'border-orange-200 bg-orange-50';
      case 'system_update':
        return 'border-blue-200 bg-blue-50';
      case 'leave_request_update':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getIconColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'text-red-600';
    if (priority === 'medium') return 'text-yellow-600';
    
    switch (type) {
      case 'ticket_approved':
      case 'achievement':
        return 'text-green-600';
      case 'ticket_rejected':
        return 'text-red-600';
      case 'deadline_reminder':
        return 'text-orange-600';
      case 'system_update':
        return 'text-blue-600';
      case 'leave_request_update':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return colors[priority];
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-cyan-600" />
            Notifications & Alerts
            {unreadCount > 0 && (
              <span className="ml-3 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-gray-600">Stay updated with your work progress and system alerts</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedNotifications.length > 0 && (
            <button
              onClick={deleteSelected}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected</span>
            </button>
          )}
          
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          {filteredNotifications.length > 0 && (
            <button
              onClick={selectAllVisible}
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Select All Visible
            </button>
          )}
        </div>
        
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const isSelected = selectedNotifications.includes(notification.id);
            
            return (
              <div
                key={notification.id}
                className={`
                  p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 cursor-pointer
                  ${notification.isRead ? '' : getNotificationColor(notification.type, notification.priority)}
                  ${isSelected ? 'ring-2 ring-cyan-500' : ''}
                `}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectNotification(notification.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-lg ${notification.isRead ? 'bg-gray-100' : 'bg-white'}`}>
                      <Icon className={`w-5 h-5 ${getIconColor(notification.type, notification.priority)}`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                        {!notification.isRead && (
                          <span className="ml-2 w-2 h-2 bg-cyan-500 rounded-full inline-block"></span>
                        )}
                      </h4>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 ${notification.isRead ? 'text-gray-600' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {notification.actionUrl && (
                          <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                            View Details
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Settings */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-600" />
          Notification Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Work Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" />
                <span className="ml-3 text-sm text-gray-700">New ticket assignments</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" />
                <span className="ml-3 text-sm text-gray-700">Ticket status updates</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" />
                <span className="ml-3 text-sm text-gray-700">Deadline reminders</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">System Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" />
                <span className="ml-3 text-sm text-gray-700">Goal achievements</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" />
                <span className="ml-3 text-sm text-gray-700">System maintenance</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" />
                <span className="ml-3 text-sm text-gray-700">Performance updates</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
