import { useState, useEffect } from 'react';
import { Bell, Send, Users, CheckCircle, AlertCircle, Info, X, Plus, Filter } from 'lucide-react';
import { Employee, WorkTicket } from '@types';

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


  // Calculate statistics
  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const highPriorityNotifications = notifications.filter(n => n.priority === 'high').length;

  return (
    <div className="p-6 space-y-6">
      {/* Clean Header with Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notification Center</h2>
          <p className="text-sm text-gray-600 mt-1">Manage and send notifications to employees</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create Notification</span>
        </button>
      </div>

      {/* Clean Statistics - Free floating style */}
      <div className="grid grid-cols-3 gap-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600">Total Notifications</p>
            <p className="text-2xl font-bold text-gray-900">{totalNotifications}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600">Unread</p>
            <p className="text-2xl font-bold text-gray-900">{unreadNotifications}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600">High Priority</p>
            <p className="text-2xl font-bold text-gray-900">{highPriorityNotifications}</p>
          </div>
        </div>
      </div>

      {/* Clean Filter Controls */}
      <div className="flex items-center space-x-4 py-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
        
        <div className="flex space-x-2">
          {['all', 'unread', 'high'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterType === filter
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
        >
          <option value="all">All Categories</option>
          <option value="system">System</option>
          <option value="work">Work</option>
          <option value="schedule">Schedule</option>
          <option value="achievement">Achievement</option>
          <option value="announcement">Announcement</option>
        </select>
      </div>

      {/* Clean Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No notifications found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or create a new notification</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`group relative p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                !notification.read 
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  notification.type === 'success' ? 'bg-green-100' :
                  notification.type === 'warning' ? 'bg-yellow-100' :
                  notification.type === 'error' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">{notification.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">To:</span>
                          <span>{notification.recipientNames.join(', ')}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">From:</span>
                          <span>{notification.sender}</span>
                        </span>
                        <span>{new Date(notification.timestamp).toLocaleDateString()} at {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="ml-4 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Notification Modal - Clean Design */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Create New Notification</h3>
                  <p className="text-sm text-gray-600">Send notifications to your team members</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    placeholder="Enter notification title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    placeholder="Enter your message..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                  <label className="block text-sm font-medium text-gray-700 mb-3">Recipients</label>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
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
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-900">All Employees</span>
                      </label>
                      <div className="border-t border-gray-200 pt-2">
                        {employees.map((employee) => (
                          <label key={employee.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
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
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                {employee.name.charAt(0)}
                              </div>
                              <div>
                                <span className="text-gray-900 font-medium">{employee.name}</span>
                                <span className="text-gray-500 text-sm ml-2">{employee.department}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCreateNotification}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Send className="w-4 h-4" />
                <span>Send Notification</span>
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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
