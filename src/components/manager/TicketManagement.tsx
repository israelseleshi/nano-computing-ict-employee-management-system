import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, FileText, Filter } from 'lucide-react';
import { Employee, WorkTicket } from '../../lib/types';

interface TicketManagementProps {
  employees: Employee[];
  tickets: WorkTicket[];
  onUpdateTicketStatus: (ticketId: string, status: 'pending' | 'approved' | 'rejected', comment?: string) => void;
}

export default function TicketManagement({ employees, tickets, onUpdateTicketStatus }: TicketManagementProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedTicket, setSelectedTicket] = useState<WorkTicket | null>(null);
  const [comment, setComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  // Filter tickets based on status
  const filteredTickets = tickets.filter(ticket => 
    statusFilter === 'all' || ticket.status === statusFilter
  );

  // Calculate hours for a ticket
  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours > 0 ? hours : 0;
  };

  // Calculate amount for a ticket
  const calculateAmount = (ticket: WorkTicket) => {
    const employee = employees.find(e => e.id === ticket.employeeId);
    const hours = calculateHours(ticket.startTime, ticket.endTime);
    return hours * (employee?.hourlyRate || 0);
  };

  // Handle status update
  const handleStatusUpdate = (ticket: WorkTicket, action: 'approve' | 'reject') => {
    setSelectedTicket(ticket);
    setActionType(action);
    setShowModal(true);
    setComment('');
  };

  // Confirm status update
  const confirmStatusUpdate = () => {
    if (selectedTicket) {
      const newStatus = actionType === 'approve' ? 'approved' : 'rejected';
      onUpdateTicketStatus(selectedTicket.id, newStatus, comment);
      setShowModal(false);
      setSelectedTicket(null);
      setComment('');
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Statistics
  const totalTickets = tickets.length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;
  const approvedTickets = tickets.filter(t => t.status === 'approved').length;
  const rejectedTickets = tickets.filter(t => t.status === 'rejected').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
          <p className="text-gray-600 mt-2">Review and manage employee work tickets</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Tickets</p>
              <p className="text-2xl font-bold text-blue-900">{totalTickets}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingTickets}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-900">{approvedTickets}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{rejectedTickets}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <Filter className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter by status:</span>
        <div className="flex space-x-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => {
                const employee = employees.find(e => e.id === ticket.employeeId);
                const hours = calculateHours(ticket.startTime, ticket.endTime);
                const amount = calculateAmount(ticket);

                return (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {employee?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{employee?.name}</p>
                          <p className="text-sm text-gray-500">{employee?.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ticket.date}</p>
                          <p className="text-xs text-gray-500">{ticket.startTime} - {ticket.endTime}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 max-w-xs truncate">{ticket.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{hours.toFixed(2)}h</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">ETB {amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        <span>{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(ticket, 'approve')}
                            className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(ticket, 'reject')}
                            className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for status update confirmation */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Work Ticket
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Employee: <span className="font-medium">{selectedTicket.employeeName}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Date: <span className="font-medium">{selectedTicket.date}</span>
              </p>
              <p className="text-sm text-gray-600">
                Hours: <span className="font-medium">{calculateHours(selectedTicket.startTime, selectedTicket.endTime).toFixed(2)}h</span>
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Add a comment for ${actionType === 'approve' ? 'approval' : 'rejection'}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={confirmStatusUpdate}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
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
