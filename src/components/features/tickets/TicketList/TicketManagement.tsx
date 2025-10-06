import { Calendar, FileText, Clock } from 'lucide-react';
import { Employee, WorkTicket } from '@types';

interface TicketManagementProps {
  employees: Employee[];
  tickets: WorkTicket[];
}

export default function TicketManagement({ employees, tickets }: TicketManagementProps) {
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
    if (!employee) return 0;
    
    const hours = calculateHours(ticket.startTime, ticket.endTime);
    return hours * employee.hourlyRate;
  };

  // Calculate summary statistics
  const totalTickets = tickets.length;
  const totalHours = tickets.reduce((sum, ticket) => {
    return sum + calculateHours(ticket.startTime, ticket.endTime);
  }, 0);
  
  const totalAmount = tickets.reduce((sum, ticket) => {
    return sum + calculateAmount(ticket);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Work Tickets</h2>
          <p className="text-gray-600">Track and manage employee work tickets</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg flex-shrink-0">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">ETB {totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Work Tickets ({tickets.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {tickets.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No work tickets found</h3>
              <p className="text-gray-500">Work tickets will appear here once created.</p>
            </div>
          ) : (
            tickets.map((ticket) => {
              const employee = employees.find(e => e.id === ticket.employeeId);
              const hours = calculateHours(ticket.startTime, ticket.endTime);
              const amount = calculateAmount(ticket);

              return (
                <div key={ticket.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {employee?.name || 'Unknown Employee'}
                        </h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(ticket.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {ticket.startTime} - {ticket.endTime} ({hours.toFixed(1)}h)
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-green-600">ETB {amount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <p className="mt-2 text-gray-700">{ticket.description}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
