import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, Clock, DollarSign, Award, Calendar, BarChart3 } from 'lucide-react';
import { Employee, WorkTicket } from '../../lib/types';

interface PerformanceAnalyticsProps {
  employees: Employee[];
  tickets: WorkTicket[];
}

type EmployeePerformance = {
  employee: Employee;
  totalHours: number;
  totalEarnings: number;
  ticketCount: number;
  avgHoursPerTicket: number;
  approvedTickets: number;
  rejectedTickets: number;
  approvalRate: number;
  productivity: 'high' | 'medium' | 'low';
};

export default function PerformanceAnalytics({ employees, tickets }: PerformanceAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Calculate hours for a ticket
  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours > 0 ? hours : 0;
  };

  // Calculate employee performance metrics
  const employeePerformance: EmployeePerformance[] = useMemo(() => {
    return employees.map(employee => {
      const employeeTickets = tickets.filter(ticket => ticket.employeeId === employee.id);
      const totalHours = employeeTickets.reduce((sum, ticket) => 
        sum + calculateHours(ticket.startTime, ticket.endTime), 0
      );
      const totalEarnings = totalHours * employee.hourlyRate;
      const approvedTickets = employeeTickets.filter(t => t.status === 'approved').length;
      const rejectedTickets = employeeTickets.filter(t => t.status === 'rejected').length;
      const approvalRate = employeeTickets.length > 0 ? (approvedTickets / employeeTickets.length) * 100 : 0;
      const avgHoursPerTicket = employeeTickets.length > 0 ? totalHours / employeeTickets.length : 0;

      // Determine productivity level
      let productivity: 'high' | 'medium' | 'low' = 'low';
      if (totalHours >= 40 && approvalRate >= 80) productivity = 'high';
      else if (totalHours >= 20 && approvalRate >= 60) productivity = 'medium';

      return {
        employee,
        totalHours,
        totalEarnings,
        ticketCount: employeeTickets.length,
        avgHoursPerTicket,
        approvedTickets,
        rejectedTickets,
        approvalRate,
        productivity
      };
    });
  }, [employees, tickets]);

  // Filter by department
  const filteredPerformance = selectedDepartment === 'all' 
    ? employeePerformance 
    : employeePerformance.filter(p => p.employee.department === selectedDepartment);

  // Calculate overall statistics
  const totalEmployees = filteredPerformance.length;
  const totalHours = filteredPerformance.reduce((sum, p) => sum + p.totalHours, 0);
  const totalEarnings = filteredPerformance.reduce((sum, p) => sum + p.totalEarnings, 0);
  const avgProductivity = totalEmployees > 0 ? totalHours / totalEmployees : 0;

  // Top performers
  const topPerformers = [...filteredPerformance]
    .sort((a, b) => b.totalHours - a.totalHours)
    .slice(0, 3);

  // Department breakdown
  const departments = Array.from(new Set(employees.map(e => e.department)));
  const departmentStats = departments.map(dept => {
    const deptEmployees = employeePerformance.filter(p => p.employee.department === dept);
    const deptHours = deptEmployees.reduce((sum, p) => sum + p.totalHours, 0);
    const deptEarnings = deptEmployees.reduce((sum, p) => sum + p.totalEarnings, 0);
    return {
      department: dept,
      employees: deptEmployees.length,
      totalHours: deptHours,
      totalEarnings: deptEarnings,
      avgHours: deptEmployees.length > 0 ? deptHours / deptEmployees.length : 0
    };
  });

  // Get productivity badge styling
  const getProductivityBadge = (productivity: string) => {
    switch (productivity) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  // Get productivity icon
  const getProductivityIcon = (productivity: string) => {
    switch (productivity) {
      case 'high':
        return <TrendingUp className="w-4 h-4" />;
      case 'medium':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <TrendingDown className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Performance Analytics</h1>
          <p className="text-gray-600 mt-2">Track employee productivity and performance metrics</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Department:</span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-blue-900">{totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-green-600 text-sm font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-green-900">{totalHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Earnings</p>
              <p className="text-2xl font-bold text-purple-900">ETB {totalEarnings.toFixed(0)}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-orange-600 text-sm font-medium">Avg Hours/Employee</p>
              <p className="text-2xl font-bold text-orange-900">{avgProductivity.toFixed(1)}h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Top Performers</h3>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.employee.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full text-white font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{performer.employee.name}</p>
                  <p className="text-sm text-gray-600">{performer.employee.department}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{performer.totalHours.toFixed(1)}h</p>
                  <p className="text-sm text-gray-600">{performer.approvalRate.toFixed(0)}% approval</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Department Performance</h3>
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{dept.department}</span>
                  <span className="text-sm text-gray-600">{dept.employees} employees</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total: {dept.totalHours.toFixed(1)}h</span>
                  <span className="text-gray-600">Avg: {dept.avgHours.toFixed(1)}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((dept.avgHours / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Employee Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tickets
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval Rate
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productivity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPerformance.map((performance) => (
                <tr key={performance.employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {performance.employee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{performance.employee.name}</p>
                        <p className="text-sm text-gray-500">{performance.employee.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{performance.totalHours.toFixed(1)}h</p>
                    <p className="text-xs text-gray-500">Avg: {performance.avgHoursPerTicket.toFixed(1)}h/ticket</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{performance.ticketCount}</p>
                    <p className="text-xs text-gray-500">
                      {performance.approvedTickets}A / {performance.rejectedTickets}R
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${performance.approvalRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {performance.approvalRate.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      ETB {performance.totalEarnings.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      ETB {performance.employee.hourlyRate}/hr
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getProductivityBadge(performance.productivity)}`}>
                      {getProductivityIcon(performance.productivity)}
                      <span>{performance.productivity.charAt(0).toUpperCase() + performance.productivity.slice(1)}</span>
                    </span>
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
