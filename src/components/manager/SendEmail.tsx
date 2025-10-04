import { useState } from 'react';
import { Calendar, Mail, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { Employee, WorkTicket } from '../../lib/types';

interface SendEmailProps {
  employees: Employee[];
  tickets: WorkTicket[];
}

export default function SendEmail({ employees, tickets }: SendEmailProps) {
  const [selectedDate, setSelectedDate] = useState('2024-05-21');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredTickets = tickets.filter(ticket => ticket.date === selectedDate);

  const handleSendEmail = () => {
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 2000);
  };

  const groupedData = filteredTickets.reduce((acc, ticket) => {
    const employee = employees.find(e => e.id === ticket.employeeId);
    if (!employee) return acc;

    if (!acc[ticket.employeeId]) {
      acc[ticket.employeeId] = {
        employee,
        totalHours: 0,
        totalAmount: 0
      };
    }

    const start = new Date(`2000-01-01T${ticket.startTime}`);
    const end = new Date(`2000-01-01T${ticket.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const amount = hours * employee.hourlyRate;

    acc[ticket.employeeId].totalHours += hours;
    acc[ticket.employeeId].totalAmount += amount;

    return acc;
  }, {} as Record<string, { employee: Employee; totalHours: number; totalAmount: number }>);

  const reportData = Object.values(groupedData);

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Daily Email Report</h2>
        <p className="text-gray-600">Generate and send daily work reports via email</p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Email Sent Successfully!</p>
            <p className="text-sm text-green-700">
              Daily report has been sent to all recipients for {selectedDate}.
            </p>
          </div>
        </div>
      )}

      <div className="p-6 mb-6">
        <div className="mb-6">
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

        {filteredTickets.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">No Data Available</p>
              <p className="text-sm text-yellow-700">
                There are no work tickets for {selectedDate}. Please select a different date or create work tickets first.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-cyan-600" />
                Email Preview
              </h3>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Subject:</p>
                  <p className="font-semibold text-gray-900">
                    Daily Work Report - {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-900 mb-4">
                    Dear Team,
                  </p>
                  <p className="text-sm text-gray-900 mb-4">
                    Please find below the daily work report for {selectedDate}:
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {reportData.map((data) => (
                      <div key={data.employee.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{data.employee.name}</p>
                          <p className="text-sm text-gray-600">{data.employee.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{data.totalHours.toFixed(2)} hours</p>
                          <p className="text-sm text-gray-600">ETB {data.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900">Total:</p>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {reportData.reduce((sum, d) => sum + d.totalHours, 0).toFixed(2)} hours
                          </p>
                          <p className="font-bold text-gray-900">
                            ETB {reportData.reduce((sum, d) => sum + d.totalAmount, 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-900 mt-4">
                    Best regards,
                    <br />
                    Nano Computing ICT Management System
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Recipients</p>
                <p className="text-sm text-gray-600">
                  Management team and department heads ({reportData.length} employees included)
                </p>
              </div>
              <button
                onClick={handleSendEmail}
                disabled={isSending}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isSending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02]'
                }`}
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Email Report</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 mb-2">
          <span className="font-semibold">Production Integration:</span>
        </p>
        <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
          <li>Connect to email service provider (SendGrid, AWS SES, etc.)</li>
          <li>Configure recipient email addresses in settings</li>
          <li>Set up automated daily email scheduling</li>
          <li>Add PDF attachment generation for detailed reports</li>
        </ul>
      </div>
    </div>
  );
}
