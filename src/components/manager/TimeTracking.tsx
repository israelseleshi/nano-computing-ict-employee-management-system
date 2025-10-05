import { useState, useEffect } from 'react';
import { Clock, Play, Square, Calendar, User, Timer } from 'lucide-react';
import { Employee, WorkTicket } from '../../lib/types';

interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  clockIn: string;
  clockOut?: string;
  date: string;
  status: 'active' | 'completed';
  location?: string;
  notes?: string;
  totalHours?: number;
}

interface TimeTrackingProps {
  employees: Employee[];
  tickets: WorkTicket[];
  onCreateTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  onUpdateTimeEntry: (entryId: string, updates: Partial<TimeEntry>) => void;
}

export default function TimeTracking({ employees, onCreateTimeEntry, onUpdateTimeEntry }: TimeTrackingProps) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate hours between two times
  const calculateHours = (clockIn: string, clockOut: string) => {
    const start = new Date(`${selectedDate}T${clockIn}`);
    const end = new Date(`${selectedDate}T${clockOut}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours > 0 ? hours : 0;
  };

  // Get active time entry for employee
  const getActiveEntry = (employeeId: string) => {
    return timeEntries.find(entry => 
      entry.employeeId === employeeId && 
      entry.status === 'active' && 
      entry.date === selectedDate
    );
  };

  // Clock in employee
  const handleClockIn = () => {
    if (!selectedEmployee) return;

    const employee = employees.find(e => e.id === selectedEmployee);
    if (!employee) return;

    const activeEntry = getActiveEntry(selectedEmployee);
    if (activeEntry) {
      alert('Employee is already clocked in!');
      return;
    }

    const newEntry: Omit<TimeEntry, 'id'> = {
      employeeId: selectedEmployee,
      employeeName: employee.name,
      clockIn: currentTime.toTimeString().slice(0, 5),
      date: selectedDate,
      status: 'active',
      location: 'Office' // Default location
    };

    const entryWithId = { ...newEntry, id: `time-${Date.now()}` };
    setTimeEntries([...timeEntries, entryWithId]);
    onCreateTimeEntry(newEntry);
  };

  // Clock out employee
  const handleClockOut = (entryId: string) => {
    const entry = timeEntries.find(e => e.id === entryId);
    if (!entry) return;

    const clockOut = currentTime.toTimeString().slice(0, 5);
    const totalHours = calculateHours(entry.clockIn, clockOut);

    const updates = {
      clockOut,
      status: 'completed' as const,
      totalHours
    };

    setTimeEntries(timeEntries.map(e => 
      e.id === entryId ? { ...e, ...updates } : e
    ));
    onUpdateTimeEntry(entryId, updates);
  };

  // Filter entries by selected date
  const todayEntries = timeEntries.filter(entry => entry.date === selectedDate);
  const activeEntries = todayEntries.filter(entry => entry.status === 'active');
  const completedEntries = todayEntries.filter(entry => entry.status === 'completed');

  // Calculate daily statistics
  const totalHoursToday = completedEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
  const totalEmployeesWorked = new Set(completedEntries.map(e => e.employeeId)).size;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Time Tracking</h1>
          <p className="text-gray-600 mt-2">Monitor employee clock in/out times and working hours</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Time</p>
          <p className="text-2xl font-bold text-gray-900">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Play className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-blue-600 text-sm font-medium">Active Now</p>
              <p className="text-2xl font-bold text-blue-900">{activeEntries.length}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Square className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-green-600 text-sm font-medium">Completed Today</p>
              <p className="text-2xl font-bold text-green-900">{completedEntries.length}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Timer className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-purple-900">{totalHoursToday.toFixed(1)}h</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-orange-600 text-sm font-medium">Employees Worked</p>
              <p className="text-2xl font-bold text-orange-900">{totalEmployeesWorked}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clock In/Out Controls */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Clock In/Out</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Choose an employee...</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleClockIn}
              disabled={!selectedEmployee}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              <span>Clock In</span>
            </button>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Active Sessions</h3>
          
          {activeEntries.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeEntries.map(entry => {
                const currentHours = calculateHours(entry.clockIn, currentTime.toTimeString().slice(0, 5));
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {entry.employeeName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{entry.employeeName}</p>
                        <p className="text-sm text-gray-600">Started: {entry.clockIn}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{currentHours.toFixed(2)}h</p>
                      <button
                        onClick={() => handleClockOut(entry.id)}
                        className="mt-1 flex items-center space-x-1 px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Square className="w-3 h-3" />
                        <span>Clock Out</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Today's Time Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Today's Time Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock In
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock Out
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
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
              {todayEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {entry.employeeName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{entry.employeeName}</p>
                        <p className="text-sm text-gray-500">{entry.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{entry.clockIn}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {entry.clockOut || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {entry.totalHours ? `${entry.totalHours.toFixed(2)}h` : 
                       entry.status === 'active' ? `${calculateHours(entry.clockIn, currentTime.toTimeString().slice(0, 5)).toFixed(2)}h` : '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      entry.status === 'active' 
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {entry.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {entry.status === 'active' && (
                      <button
                        onClick={() => handleClockOut(entry.id)}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Square className="w-3 h-3" />
                        <span>Clock Out</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
