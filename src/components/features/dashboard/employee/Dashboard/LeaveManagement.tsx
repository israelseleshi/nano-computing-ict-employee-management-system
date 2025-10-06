import React, { useState, useMemo } from 'react';
import { 
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Filter,
  Download,
  Plane,
  Heart,
  Coffee,
  Zap
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  managerComment?: string;
  submittedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
}

interface LeaveBalance {
  vacation: { used: number; available: number; total: number };
  sick: { used: number; available: number; total: number };
  personal: { used: number; available: number; total: number };
  emergency: { used: number; available: number; total: number };
}

interface Profile {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface LeaveManagementProps {
  profile: Profile;
  leaveRequests: LeaveRequest[];
  leaveBalance: LeaveBalance;
  onSubmitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt' | 'employeeName'>) => void;
}

export default function LeaveManagement({ 
  profile, 
  leaveRequests, 
  leaveBalance, 
  onSubmitLeaveRequest 
}: LeaveManagementProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterType, setFilterType] = useState<'all' | 'vacation' | 'sick' | 'personal' | 'emergency'>('all');
  const [showSuccess, setShowSuccess] = useState(false);

  // New leave request form state
  const [newRequest, setNewRequest] = useState({
    type: 'vacation' as const,
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Calculate days between dates
  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Filter leave requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter(request => {
      const statusMatch = filterStatus === 'all' || request.status === filterStatus;
      const typeMatch = filterType === 'all' || request.type === filterType;
      return statusMatch && typeMatch;
    });
  }, [leaveRequests, filterStatus, filterType]);

  // Handle form submission
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    const days = calculateDays(newRequest.startDate, newRequest.endDate);
    
    if (days <= 0) {
      alert('Please select valid dates');
      return;
    }

    const requestData = {
      employeeId: profile.id,
      type: newRequest.type,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      days,
      reason: newRequest.reason
    };

    onSubmitLeaveRequest(requestData);
    
    // Reset form
    setNewRequest({
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: ''
    });
    
    setShowRequestModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Get leave type icon and color
  const getLeaveTypeInfo = (type: string) => {
    switch (type) {
      case 'vacation':
        return { icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'sick':
        return { icon: Heart, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      case 'personal':
        return { icon: Coffee, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      case 'emergency':
        return { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
      default:
        return { icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Leave Management</h1>
          <p className="text-gray-600 mt-2">Manage your leave requests and view your leave balance</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Request Leave</span>
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Leave Request Submitted!</p>
            <p className="text-sm text-green-700">Your leave request has been sent to your manager for approval.</p>
          </div>
        </div>
      )}

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(leaveBalance).map(([type, balance]) => {
          const typeInfo = getLeaveTypeInfo(type);
          const Icon = typeInfo.icon;
          const usagePercentage = (balance.used / balance.total) * 100;
          
          return (
            <div key={type} className={`p-6 rounded-xl border ${typeInfo.bg} ${typeInfo.border}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-6 h-6 ${typeInfo.color}`} />
                  <h3 className="font-semibold text-gray-900 capitalize">{type}</h3>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium">{balance.used} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available</span>
                  <span className="font-medium">{balance.available} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      usagePercentage > 80 ? 'bg-red-500' : 
                      usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {usagePercentage.toFixed(0)}% used of {balance.total} total days
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <Filter className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="vacation">Vacation</option>
          <option value="sick">Sick Leave</option>
          <option value="personal">Personal</option>
          <option value="emergency">Emergency</option>
        </select>

        <div className="flex-1"></div>
        
        <button className="flex items-center space-x-2 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const typeInfo = getLeaveTypeInfo(request.type);
                  const statusInfo = getStatusInfo(request.status);
                  const TypeIcon = typeInfo.icon;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                            <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                          </div>
                          <span className="font-medium text-gray-900 capitalize">{request.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{request.days} days</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={request.reason}>
                          {request.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${statusInfo.bg}`}>
                            <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
                          </div>
                          <span className={`text-sm font-medium capitalize ${statusInfo.color}`}>
                            {request.status}
                          </span>
                        </div>
                        {request.managerComment && (
                          <div className="mt-1 flex items-center space-x-1 text-xs text-gray-500">
                            <MessageSquare className="w-3 h-3" />
                            <span className="truncate max-w-xs" title={request.managerComment}>
                              {request.managerComment}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Leave Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Request Leave</h3>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type
                </label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newRequest.startDate}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newRequest.endDate}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {newRequest.startDate && newRequest.endDate && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Duration:</strong> {calculateDays(newRequest.startDate, newRequest.endDate)} days
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
