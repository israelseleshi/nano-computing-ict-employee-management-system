import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  Plane,
  Heart,
  Coffee,
  Zap,
  User,
  Search,
  Eye,
  Check,
  X
} from 'lucide-react';
import { LeaveRequest, Employee } from '@types';

interface LeaveManagementProps {
  leaveRequests: LeaveRequest[];
  employees: Employee[];
  onUpdateLeaveStatus: (requestId: string, status: 'approved' | 'rejected', comment?: string) => void;
}

export default function LeaveManagement({ 
  leaveRequests, 
  employees, 
  onUpdateLeaveStatus 
}: LeaveManagementProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterType, setFilterType] = useState<'all' | 'vacation' | 'sick' | 'personal' | 'emergency'>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [comment, setComment] = useState('');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Export leave requests to Excel
  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredRequests.map(request => ({
        'Employee Name': request.employeeName,
        'Department': request.employeeDepartment,
        'Leave Type': request.type.charAt(0).toUpperCase() + request.type.slice(1),
        'Start Date': request.startDate,
        'End Date': request.endDate,
        'Days': request.days,
        'Reason': request.reason,
        'Status': request.status.charAt(0).toUpperCase() + request.status.slice(1),
        'Submitted Date': request.submittedAt,
        'Reviewed Date': request.reviewedAt || 'Not reviewed',
        'Reviewed By': request.reviewedBy || 'Not reviewed',
        'Manager Comment': request.managerComment || 'No comment'
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Employee Name
        { wch: 15 }, // Department
        { wch: 12 }, // Leave Type
        { wch: 12 }, // Start Date
        { wch: 12 }, // End Date
        { wch: 8 },  // Days
        { wch: 30 }, // Reason
        { wch: 10 }, // Status
        { wch: 15 }, // Submitted Date
        { wch: 15 }, // Reviewed Date
        { wch: 15 }, // Reviewed By
        { wch: 25 }  // Manager Comment
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Leave Requests');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `Leave_Requests_Report_${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      console.log('✅ Leave requests exported successfully');
    } catch (error) {
      console.error('❌ Error exporting leave requests:', error);
      alert('Failed to export leave requests. Please try again.');
    }
  };

  // Get unique departments
  const departments = useMemo(() => {
    const depts = Array.from(new Set(employees.map(emp => emp.department)));
    return depts.sort();
  }, [employees]);

  // Filter leave requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter(request => {
      const statusMatch = filterStatus === 'all' || request.status === filterStatus;
      const typeMatch = filterType === 'all' || request.type === filterType;
      const departmentMatch = filterDepartment === 'all' || request.employeeDepartment === filterDepartment;
      const searchMatch = searchTerm === '' || 
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && typeMatch && departmentMatch && searchMatch;
    });
  }, [leaveRequests, filterStatus, filterType, filterDepartment, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = leaveRequests.length;
    const pending = leaveRequests.filter(r => r.status === 'pending').length;
    const approved = leaveRequests.filter(r => r.status === 'approved').length;
    const rejected = leaveRequests.filter(r => r.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  }, [leaveRequests]);

  // Handle status update
  const handleStatusUpdate = (request: LeaveRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setComment('');
    setShowModal(true);
  };

  // Confirm status update
  const confirmStatusUpdate = () => {
    if (selectedRequest) {
      const status = actionType === 'approve' ? 'approved' : 'rejected';
      onUpdateLeaveStatus(selectedRequest.id, status, comment);
      setShowModal(false);
      setSelectedRequest(null);
      setComment('');
    }
  };

  // Get leave type info
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
          <p className="text-gray-600 mt-2">Review and manage employee leave requests</p>
        </div>
        <button 
          onClick={exportToExcel}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Statistics - Match Time Tracking alignment/design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 rounded-full">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total Requests</span>
          </div>
          <p className="mt-1 text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-yellow-50 rounded-full">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Pending</span>
          </div>
          <p className="mt-1 text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-50 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Approved</span>
          </div>
          <p className="mt-1 text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-50 rounded-full">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Rejected</span>
          </div>
          <p className="mt-1 text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters - Free floating */}
      <div className="py-2">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'vacation' | 'sick' | 'personal' | 'emergency')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal</option>
            <option value="emergency">Emergency</option>
          </select>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Leave Requests ({filteredRequests.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                            <div className="text-sm text-gray-500">{request.employeeDepartment}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                            <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                          </div>
                          <span className="text-sm font-medium text-gray-900 capitalize">{request.type}</span>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${statusInfo.bg}`}>
                            <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
                          </div>
                          <span className={`text-sm font-medium capitalize ${statusInfo.color}`}>
                            {request.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowDetails(showDetails === request.id ? null : request.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(request, 'approve')}
                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(request, 'reject')}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details */}
      {showDetails && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {(() => {
            const request = filteredRequests.find(r => r.id === showDetails);
            if (!request) return null;

            return (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Employee Information</h4>
                    <p><strong>Name:</strong> {request.employeeName}</p>
                    <p><strong>Department:</strong> {request.employeeDepartment}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Leave Information</h4>
                    <p><strong>Type:</strong> {request.type}</p>
                    <p><strong>Duration:</strong> {request.days} days</p>
                    <p><strong>Dates:</strong> {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-2">Reason</h4>
                    <p className="text-gray-700">{request.reason}</p>
                  </div>
                  {request.managerComment && (
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-2">Manager Comment</h4>
                      <p className="text-gray-700">{request.managerComment}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Approval/Rejection Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request
              </h3>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Employee:</strong> {selectedRequest.employeeName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Leave Type:</strong> {selectedRequest.type}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Duration:</strong> {selectedRequest.days} days
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Add a comment for ${actionType === 'approve' ? 'approval' : 'rejection'}...`}
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusUpdate}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    actionType === 'approve' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
