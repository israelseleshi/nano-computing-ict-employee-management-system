import { useState, useEffect } from 'react';
import { Bell, Send, Users, CheckCircle, AlertCircle, Info, X, Plus, Filter } from 'lucide-react';
import { Employee, WorkTicket } from '../../lib/types';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  recipients: string[]; // employee IDs
  recipientNames: string[];
  sender: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'system' | 'work' | 'schedule' | 'achievement' | 'announcement';
}

interface NotificationCenterProps {
  employees: Employee[];
  tickets: WorkTicket[];
  onSendNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  onMarkAsRead: (notificationId: string) => void;
}

export default function NotificationCenter({ employees, tickets, onSendNotification, onMarkAsRead }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'high'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Create notification form state
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    recipients: [] as string[],
    priority: 'medium' as const,
    category: 'announcement' as const
  });

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        title: 'Work Ticket Approved',
        message: 'Your work ticket for "Authentication Module" has been approved.',
        type: 'success',
        recipients: ['emp-1'],
        recipientNames: ['John Doe'],
        sender: 'System',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium',
        category: 'work'
      },
      {
        id: 'notif-2',
        title: 'Payroll Processed',
        message: 'Monthly payroll has been processed. Check your earnings in the dashboard.',
        type: 'info',
        recipients: ['emp-1', 'emp-2'],
        recipientNames: ['John Doe', 'Sarah Johnson'],
        sender: 'HR Department',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        priority: 'high',
        category: 'system'
      },
      {
        id: 'notif-3',
        title: 'Goal Achievement',
        message: 'Congratulations! You have completed your monthly hours goal.',
        type: 'success',
        recipients: ['emp-2'],
        recipientNames: ['Sarah Johnson'],
        sender: 'System',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        priority: 'low',
        category: 'achievement'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'unread' && notification.read) return false;
    if (filterType === 'high' && notification.priority !== 'high') return false;
    if (selectedCategory !== 'all' && notification.category !== selectedCategory) return false;
    return true;
  });

  // Handle create notification
  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message || newNotification.recipients.length === 0) {
      alert('Please fill in all required fields and select at least one recipient.');
      return;
    }

    const recipientNames = employees
      .filter(emp => newNotification.recipients.includes(emp.id))
      .map(emp => emp.name);

    const notification: Omit<Notification, 'id' | 'timestamp'> = {
      ...newNotification,
      recipientNames,
      sender: 'Manager',
      read: false
    };

    const notificationWithId = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setNotifications([notificationWithId, ...notifications]);
    onSendNotification(notification);

    // Reset form
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      recipients: [],
      priority: 'medium',
      category: 'announcement'
    });
    setShowCreateModal(false);
  };

  // Handle mark as read
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
    onMarkAsRead(notificationId);
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // Get notification styling
  const getNotificationStyling = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  // Calculate statistics
  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const highPriorityNotifications = notifications.filter(n => n.priority === 'high').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
          <p className="text-gray-600 mt-2">Manage and send notifications to employees</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Notification</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Notifications</p>
              <p className="text-2xl font-bold text-blue-900">{totalNotifications}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Unread</p>
              <p className="text-2xl font-bold text-orange-900">{unreadNotifications}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">High Priority</p>
              <p className="text-2xl font-bold text-red-900">{highPriorityNotifications}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <Filter className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
        
        <div className="flex space-x-2">
          {['all', 'unread', 'high'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === filter
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Categories</option>
          <option value="system">System</option>
          <option value="work">Work</option>
          <option value="schedule">Schedule</option>
          <option value="achievement">Achievement</option>
          <option value="announcement">Announcement</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notifications found</p>
            <p className="text-gray-400">Try adjusting your filters or create a new notification</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-l-4 rounded-lg shadow-sm transition-all hover:shadow-md ${
                getNotificationStyling(notification.type)
              } ${!notification.read ? 'ring-2 ring-blue-100' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                        notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.priority}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>To: {notification.recipientNames.join(', ')}</span>
                      <span>From: {notification.sender}</span>
                      <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      <span className="capitalize">{notification.category}</span>
                    </div>
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="ml-4 px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Notification</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="Notification title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Notification message..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({ ...newNotification, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newNotification.category}
                    onChange={(e) => setNewNotification({ ...newNotification, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="system">System</option>
                    <option value="work">Work</option>
                    <option value="schedule">Schedule</option>
                    <option value="achievement">Achievement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newNotification.recipients.length === employees.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewNotification({ ...newNotification, recipients: employees.map(emp => emp.id) });
                        } else {
                          setNewNotification({ ...newNotification, recipients: [] });
                        }
                      }}
                      className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="font-medium">All Employees</span>
                  </label>
                  {employees.map((employee) => (
                    <label key={employee.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newNotification.recipients.includes(employee.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewNotification({
                              ...newNotification,
                              recipients: [...newNotification.recipients, employee.id]
                            });
                          } else {
                            setNewNotification({
                              ...newNotification,
                              recipients: newNotification.recipients.filter(id => id !== employee.id)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span>{employee.name} - {employee.department}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateNotification}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>Send Notification</span>
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
