import { Clock, Calendar, DollarSign, FileText } from 'lucide-react';
import { Profile, WorkTicketDB } from '@services/api/mock.service';

interface EmployeeDashboardProps {
  profile: Profile;
  tickets: WorkTicketDB[];
}

export default function EmployeeDashboard({ profile, tickets }: EmployeeDashboardProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.work_date);
    return ticketDate.getMonth() === currentMonth && ticketDate.getFullYear() === currentYear;
  });

  const totalHours = monthlyTickets.reduce((sum, ticket) => {
    const start = new Date(`2000-01-01T${ticket.start_time}`);
    const end = new Date(`2000-01-01T${ticket.end_time}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  const totalEarnings = profile.hourly_rate ? totalHours * profile.hourly_rate : 0;

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.work_date).getTime() - new Date(a.work_date).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Hours This Month',
      value: totalHours.toFixed(1),
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Tickets',
      value: tickets.length,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Earnings This Month',
      value: `ETB ${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Hourly Rate',
      value: `ETB ${profile.hourly_rate?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {profile.full_name}</h2>
        <p className="text-gray-600">{profile.department} Department</p>
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
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-cyan-600" />
            Recent Work Tickets
          </h3>
          <div className="space-y-3">
            {recentTickets.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No work tickets yet</p>
                <p className="text-sm text-gray-500">Your manager will create tickets for your work</p>
              </div>
            ) : (
              recentTickets.map((ticket) => {
                const start = new Date(`2000-01-01T${ticket.start_time}`);
                const end = new Date(`2000-01-01T${ticket.end_time}`);
                const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

                return (
                  <div
                    key={ticket.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{ticket.task_description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(ticket.work_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {hours.toFixed(1)} hrs
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'approved' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {ticket.start_time} - {ticket.end_time}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ETB {profile.hourly_rate ? (hours * profile.hourly_rate).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-cyan-600" />
            Monthly Summary
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
              <p className="text-sm text-gray-600 mb-2">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <p className="text-3xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">ETB {totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Working Days</span>
                <span className="font-semibold text-gray-900">
                  {new Set(monthlyTickets.map(t => t.work_date)).size}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Average Hours/Day</span>
                <span className="font-semibold text-gray-900">
                  {monthlyTickets.length > 0 ? (totalHours / new Set(monthlyTickets.map(t => t.work_date)).size).toFixed(1) : '0.0'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Department</span>
                <span className="font-semibold text-gray-900">{profile.department}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
