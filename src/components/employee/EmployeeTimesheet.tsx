import { useState } from 'react';
import { Calendar, Clock, Filter, FileText } from 'lucide-react';
import { Profile, WorkTicketDB } from '../../lib/mockAuth';

interface EmployeeTimesheetProps {
  profile: Profile;
  tickets: WorkTicketDB[];
}

export default function EmployeeTimesheet({ profile, tickets }: EmployeeTimesheetProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredTickets = tickets.filter(ticket => {
    const ticketMonth = ticket.work_date.slice(0, 7);
    const matchesMonth = ticketMonth === selectedMonth;
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesMonth && matchesStatus;
  });

  const sortedTickets = [...filteredTickets].sort(
    (a, b) => new Date(b.work_date).getTime() - new Date(a.work_date).getTime()
  );

  const totalHours = filteredTickets.reduce((sum, ticket) => {
    const start = new Date(`2000-01-01T${ticket.start_time}`);
    const end = new Date(`2000-01-01T${ticket.end_time}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  const totalEarnings = profile.hourly_rate ? totalHours * profile.hourly_rate : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Timesheet</h2>
        <p className="text-gray-600">View your work history and hours logged</p>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Month
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Status
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Tickets</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100">Total Hours</p>
              <Clock className="w-5 h-5 text-blue-100" />
            </div>
            <p className="text-3xl font-bold">{totalHours.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100">Total Earnings</p>
              <FileText className="w-5 h-5 text-green-100" />
            </div>
            <p className="text-3xl font-bold">ETB {totalEarnings.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100">Total Tickets</p>
              <FileText className="w-5 h-5 text-purple-100" />
            </div>
            <p className="text-3xl font-bold">{filteredTickets.length}</p>
          </div>
        </div>

        {sortedTickets.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tickets Found</h3>
            <p className="text-gray-600">
              No work tickets found for the selected period and filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Task Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hours</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedTickets.map((ticket) => {
                  const start = new Date(`2000-01-01T${ticket.start_time}`);
                  const end = new Date(`2000-01-01T${ticket.end_time}`);
                  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                  const amount = profile.hourly_rate ? hours * profile.hourly_rate : 0;

                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {new Date(ticket.work_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{ticket.task_description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{ticket.start_time} - {ticket.end_time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{hours.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">ETB {amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'approved' ? 'bg-green-100 text-green-800' :
                          ticket.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Note:</span> Your manager logs work tickets on your behalf.
          Contact your manager if you notice any discrepancies in your timesheet.
        </p>
      </div>
    </div>
  );
}
