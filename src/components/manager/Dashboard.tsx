import { Users, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { Employee, WorkTicket } from '../../lib/types';

interface DashboardProps {
  employees: Employee[];
  tickets: WorkTicket[];
}

export default function Dashboard({ employees, tickets }: DashboardProps) {
  const totalEmployees = employees.length;
  const totalTickets = tickets.length;

  const totalHoursWorked = tickets.reduce((sum, ticket) => {
    const start = new Date(`2000-01-01T${ticket.startTime}`);
    const end = new Date(`2000-01-01T${ticket.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  const totalRevenue = tickets.reduce((sum, ticket) => {
    const employee = employees.find(e => e.id === ticket.employeeId);
    if (!employee) return sum;

    const start = new Date(`2000-01-01T${ticket.startTime}`);
    const end = new Date(`2000-01-01T${ticket.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    return sum + (hours * employee.hourlyRate);
  }, 0);

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Work Tickets',
      value: totalTickets,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Hours',
      value: totalHoursWorked.toFixed(1),
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `ETB ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to Nano Computing ICT Employee Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Work Tickets</h3>
          <div className="space-y-3">
            {recentTickets.map((ticket) => {
              const employee = employees.find(e => e.id === ticket.employeeId);
              return (
                <div
                  key={ticket.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {employee?.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{employee?.name}</p>
                    <p className="text-sm text-gray-600">{ticket.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {ticket.date} • {ticket.startTime} - {ticket.endTime}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Department Overview</h3>
          <div className="space-y-4">
            {Array.from(new Set(employees.map(e => e.department))).map((dept) => {
              const deptEmployees = employees.filter(e => e.department === dept);
              const avgRate = deptEmployees.reduce((sum, e) => sum + e.hourlyRate, 0) / deptEmployees.length;

              return (
                <div key={dept} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{dept}</span>
                    <span className="text-sm text-gray-600">{deptEmployees.length} employees</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg. Rate</span>
                    <span className="font-medium text-gray-900">ETB {avgRate.toFixed(2)}/hr</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(deptEmployees.length / employees.length) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
