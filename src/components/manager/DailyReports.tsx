import { useState } from 'react';
import { Calendar, Download, FileText, DollarSign, Clock } from 'lucide-react';
import { Employee, WorkTicket } from '../../lib/types';

interface DailyReportsProps {
  employees: Employee[];
  tickets: WorkTicket[];
}

export default function DailyReports({ employees, tickets }: DailyReportsProps) {
  const [selectedDate, setSelectedDate] = useState('2024-05-21');

  const filteredTickets = tickets.filter(ticket => ticket.date === selectedDate);

  const groupedData = filteredTickets.reduce((acc, ticket) => {
    const employee = employees.find(e => e.id === ticket.employeeId);
    if (!employee) return acc;

    if (!acc[ticket.employeeId]) {
      acc[ticket.employeeId] = {
        employee,
        tickets: [],
        totalHours: 0,
        totalAmount: 0
      };
    }

    const start = new Date(`2000-01-01T${ticket.startTime}`);
    const end = new Date(`2000-01-01T${ticket.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const amount = hours * employee.hourlyRate;

    acc[ticket.employeeId].tickets.push(ticket);
    acc[ticket.employeeId].totalHours += hours;
    acc[ticket.employeeId].totalAmount += amount;

    return acc;
  }, {} as Record<string, { employee: Employee; tickets: WorkTicket[]; totalHours: number; totalAmount: number }>);

  const reportData = Object.values(groupedData);

  const grandTotalHours = reportData.reduce((sum, data) => sum + data.totalHours, 0);
  const grandTotalAmount = reportData.reduce((sum, data) => sum + data.totalAmount, 0);

  const handleExport = () => {
    alert(`Exporting report for ${selectedDate}...\n\nIn production, this will generate a PDF or CSV file with all the report data.`);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Daily Reports</h2>
        <p className="text-gray-600">View and export daily work reports by date</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Report Date
            </label>
            <div className="relative max-w-xs">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 hover:scale-[1.02]"
            >
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {reportData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">
            No work tickets found for {selectedDate}. Try selecting a different date.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100">Total Employees</p>
                <FileText className="w-5 h-5 text-blue-100" />
              </div>
              <p className="text-3xl font-bold">{reportData.length}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100">Total Hours</p>
                <Clock className="w-5 h-5 text-green-100" />
              </div>
              <p className="text-3xl font-bold">{grandTotalHours.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-orange-100">Total Amount</p>
                <DollarSign className="w-5 h-5 text-orange-100" />
              </div>
              <p className="text-3xl font-bold">ETB {grandTotalAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tasks</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hours</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.map((data) => (
                    <tr key={data.employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                            {data.employee.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{data.employee.name}</p>
                            <p className="text-sm text-gray-600">{data.employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {data.employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{data.totalHours.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">ETB {data.employee.hourlyRate}/hr</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">ETB {data.totalAmount.toFixed(2)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right font-bold text-gray-900">
                      Grand Total:
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {grandTotalHours.toFixed(2)}
                    </td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-lg">
                      ETB {grandTotalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Note:</span> Reports are dynamically generated from work ticket data.
          In production, you can export these reports as PDF or CSV files for accounting and payroll purposes.
        </p>
      </div>
    </div>
  );
}
