import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Users, Clock, DollarSign } from 'lucide-react';
import { Employee, WorkTicket } from '../../lib/types';

interface AdvancedReportsProps {
  employees: Employee[];
  tickets: WorkTicket[];
}

interface ChartData {
  name: string;
  value: number;
  hours?: number;
  earnings?: number;
  color?: string;
}

export default function AdvancedReports({ employees, tickets }: AdvancedReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'department' | 'employee' | 'productivity'>('overview');

  // Calculate hours for a ticket
  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours > 0 ? hours : 0;
  };

  // Filter tickets by period
  const getFilteredTickets = () => {
    const now = new Date();
    const startDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return tickets.filter(ticket => new Date(ticket.date) >= startDate);
  };

  const filteredTickets = getFilteredTickets();

  // Department performance data
  const departmentData = useMemo(() => {
    const departments = Array.from(new Set(employees.map(e => e.department)));
    return departments.map(dept => {
      const deptEmployees = employees.filter(e => e.department === dept);
      const deptTickets = filteredTickets.filter(ticket => 
        deptEmployees.some(emp => emp.id === ticket.employeeId)
      );
      
      const totalHours = deptTickets.reduce((sum, ticket) => 
        sum + calculateHours(ticket.startTime, ticket.endTime), 0
      );
      
      const totalEarnings = deptTickets.reduce((sum, ticket) => {
        const employee = employees.find(e => e.id === ticket.employeeId);
        const hours = calculateHours(ticket.startTime, ticket.endTime);
        return sum + (hours * (employee?.hourlyRate || 0));
      }, 0);

      return {
        name: dept,
        value: deptEmployees.length,
        hours: totalHours,
        earnings: totalEarnings,
        color: getRandomColor(dept)
      };
    });
  }, [employees, filteredTickets]);

  // Employee performance data
  const employeePerformanceData = useMemo(() => {
    return employees.map(employee => {
      const employeeTickets = filteredTickets.filter(t => t.employeeId === employee.id);
      const totalHours = employeeTickets.reduce((sum, ticket) => 
        sum + calculateHours(ticket.startTime, ticket.endTime), 0
      );
      const totalEarnings = totalHours * employee.hourlyRate;
      const approvedTickets = employeeTickets.filter(t => t.status === 'approved').length;
      const approvalRate = employeeTickets.length > 0 ? (approvedTickets / employeeTickets.length) * 100 : 0;

      return {
        name: employee.name,
        department: employee.department,
        value: totalHours,
        hours: totalHours,
        earnings: totalEarnings,
        tickets: employeeTickets.length,
        approvalRate,
        color: getRandomColor(employee.name)
      };
    }).sort((a, b) => b.value - a.value);
  }, [employees, filteredTickets]);

  // Productivity trends (mock data for demo)
  const productivityTrends = useMemo(() => {
    const periods = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return periods.map((period) => ({
      name: period,
      value: 75 + Math.random() * 25, // Mock productivity percentage
      hours: 150 + Math.random() * 50,
      earnings: 200000 + Math.random() * 100000
    }));
  }, [selectedPeriod]);

  // Ticket status distribution
  const ticketStatusData = useMemo(() => {
    const statusCounts = {
      pending: filteredTickets.filter(t => t.status === 'pending').length,
      approved: filteredTickets.filter(t => t.status === 'approved').length,
      rejected: filteredTickets.filter(t => t.status === 'rejected').length
    };

    return [
      { name: 'Pending', value: statusCounts.pending, color: '#fbbf24' },
      { name: 'Approved', value: statusCounts.approved, color: '#10b981' },
      { name: 'Rejected', value: statusCounts.rejected, color: '#ef4444' }
    ];
  }, [filteredTickets]);

  // Get random color for charts
  function getRandomColor(seed: string) {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
      '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  // Simple bar chart component
  const BarChart = ({ data, title, valueKey = 'value' }: { data: ChartData[], title: string, valueKey?: string }) => {
    const maxValue = Math.max(...data.map(d => d[valueKey as keyof ChartData] as number));
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, itemIndex) => (
            <div key={itemIndex} className="flex items-center space-x-3">
              <div className="w-20 text-sm font-medium text-gray-700 truncate">
                {item.name}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className="h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${((item[valueKey as keyof ChartData] as number) / maxValue) * 100}%`,
                    backgroundColor: item.color || '#3b82f6'
                  }}
                />
              </div>
              <div className="w-16 text-sm font-bold text-gray-900 text-right">
                {typeof item[valueKey as keyof ChartData] === 'number' 
                  ? (item[valueKey as keyof ChartData] as number).toFixed(1)
                  : item[valueKey as keyof ChartData]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple pie chart component (using CSS)
  const PieChart = ({ data, title }: { data: ChartData[], title: string }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center space-x-6">
          <div className="relative w-32 h-32">
            <div className="w-32 h-32 rounded-full" style={{
              background: `conic-gradient(${data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const prevPercentage = data.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 100, 0);
                return `${item.color} ${prevPercentage}% ${prevPercentage + percentage}%`;
              }).join(', ')})`
            }}>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">{total}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {data.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-sm font-medium text-gray-900">({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Export functionality
  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    // Mock export functionality
    const data = {
      period: selectedPeriod,
      report: selectedReport,
      totalTickets: filteredTickets.length,
      totalHours: filteredTickets.reduce((sum, ticket) => sum + calculateHours(ticket.startTime, ticket.endTime), 0),
      totalEarnings: filteredTickets.reduce((sum, ticket) => {
        const employee = employees.find(e => e.id === ticket.employeeId);
        const hours = calculateHours(ticket.startTime, ticket.endTime);
        return sum + (hours * (employee?.hourlyRate || 0));
      }, 0),
      departments: departmentData,
      employees: employeePerformanceData
    };

    // Create downloadable file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${selectedReport}-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate overview statistics
  const overviewStats = {
    totalHours: filteredTickets.reduce((sum, ticket) => sum + calculateHours(ticket.startTime, ticket.endTime), 0),
    totalEarnings: filteredTickets.reduce((sum, ticket) => {
      const employee = employees.find(e => e.id === ticket.employeeId);
      const hours = calculateHours(ticket.startTime, ticket.endTime);
      return sum + (hours * (employee?.hourlyRate || 0));
    }, 0),
    avgHoursPerEmployee: employees.length > 0 ? filteredTickets.reduce((sum, ticket) => sum + calculateHours(ticket.startTime, ticket.endTime), 0) / employees.length : 0,
    productivityRate: filteredTickets.length > 0 ? (filteredTickets.filter(t => t.status === 'approved').length / filteredTickets.length) * 100 : 0
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Advanced Reports</h1>
          <p className="text-gray-600 mt-2">Comprehensive analytics and business intelligence</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
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
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Report Type:</span>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value as any)}
            className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="overview">Overview</option>
            <option value="department">Department Analysis</option>
            <option value="employee">Employee Performance</option>
            <option value="productivity">Productivity Trends</option>
          </select>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-blue-900">{overviewStats.totalHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-green-600 text-sm font-medium">Total Earnings</p>
              <p className="text-2xl font-bold text-green-900">ETB {overviewStats.totalEarnings.toFixed(0)}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-purple-600 text-sm font-medium">Avg Hours/Employee</p>
              <p className="text-2xl font-bold text-purple-900">{overviewStats.avgHoursPerEmployee.toFixed(1)}h</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-orange-600 text-sm font-medium">Productivity Rate</p>
              <p className="text-2xl font-bold text-orange-900">{overviewStats.productivityRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedReport === 'overview' && (
          <>
            <BarChart data={departmentData} title="Department Performance (Hours)" valueKey="hours" />
            <PieChart data={ticketStatusData} title="Ticket Status Distribution" />
          </>
        )}

        {selectedReport === 'department' && (
          <>
            <BarChart data={departmentData} title="Department Hours" valueKey="hours" />
            <BarChart data={departmentData} title="Department Earnings (ETB)" valueKey="earnings" />
          </>
        )}

        {selectedReport === 'employee' && (
          <>
            <BarChart data={employeePerformanceData.slice(0, 10)} title="Top 10 Employees (Hours)" valueKey="hours" />
            <BarChart data={employeePerformanceData.slice(0, 10)} title="Top 10 Employees (Earnings)" valueKey="earnings" />
          </>
        )}

        {selectedReport === 'productivity' && (
          <>
            <BarChart data={productivityTrends} title="Productivity Trends (%)" valueKey="value" />
            <BarChart data={productivityTrends} title="Hours Trends" valueKey="hours" />
          </>
        )}
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {selectedReport === 'department' ? 'Department Details' :
             selectedReport === 'employee' ? 'Employee Details' :
             selectedReport === 'productivity' ? 'Productivity Details' :
             'Overview Details'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {selectedReport === 'employee' ? 'Employee' : 'Department'}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings (ETB)
                </th>
                {selectedReport === 'employee' && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tickets
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval Rate
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(selectedReport === 'employee' ? employeePerformanceData : departmentData).map((item, itemIndex) => (
                <tr key={itemIndex} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        {selectedReport === 'employee' && 'department' in item && (
                          <p className="text-sm text-gray-500">{(item as any).department}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{(item.hours || 0).toFixed(1)}h</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">ETB {(item.earnings || 0).toFixed(0)}</p>
                  </td>
                  {selectedReport === 'employee' && 'tickets' in item && (
                    <>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{(item as any).tickets}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(item as any).approvalRate || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {((item as any).approvalRate || 0).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
