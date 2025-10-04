import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, FileText, AlertCircle, CheckCircle2, Plus, Filter } from 'lucide-react';
import { Profile, WorkTicketDB } from '../../lib/mockAuth';

interface CalendarProps {
  profile: Profile;
  tickets: WorkTicketDB[];
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tickets: WorkTicketDB[];
  totalHours: number;
}

export default function Calendar({ profile, tickets }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    // Add previous month's days
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i);
      const dayTickets = tickets.filter(ticket => 
        new Date(ticket.work_date).toDateString() === date.toDateString() &&
        (filterStatus === 'all' || ticket.status === filterStatus)
      );
      
      const totalHours = dayTickets.reduce((sum, ticket) => {
        const start = new Date(`2000-01-01T${ticket.start_time}`);
        const end = new Date(`2000-01-01T${ticket.end_time}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);

      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        tickets: dayTickets,
        totalHours
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayTickets = tickets.filter(ticket => 
        new Date(ticket.work_date).toDateString() === date.toDateString() &&
        (filterStatus === 'all' || ticket.status === filterStatus)
      );
      
      const totalHours = dayTickets.reduce((sum, ticket) => {
        const start = new Date(`2000-01-01T${ticket.start_time}`);
        const end = new Date(`2000-01-01T${ticket.end_time}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);

      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        tickets: dayTickets,
        totalHours
      });
    }

    // Add next month's days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      const dayTickets = tickets.filter(ticket => 
        new Date(ticket.work_date).toDateString() === date.toDateString() &&
        (filterStatus === 'all' || ticket.status === filterStatus)
      );
      
      const totalHours = dayTickets.reduce((sum, ticket) => {
        const start = new Date(`2000-01-01T${ticket.start_time}`);
        const end = new Date(`2000-01-01T${ticket.end_time}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);

      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        tickets: dayTickets,
        totalHours
      });
    }

    return days;
  }, [currentDate, tickets, filterStatus, currentMonth, currentYear, today]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getStatusColor = (status: WorkTicketDB['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: WorkTicketDB['status']) => {
    switch (status) {
      case 'approved': return CheckCircle2;
      case 'rejected': return AlertCircle;
      case 'pending': return Clock;
      default: return FileText;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDayTickets = selectedDate 
    ? tickets.filter(ticket => 
        new Date(ticket.work_date).toDateString() === selectedDate.toDateString() &&
        (filterStatus === 'all' || ticket.status === filterStatus)
      )
    : [];

  const monthlyStats = useMemo(() => {
    const monthTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.work_date);
      return ticketDate.getMonth() === currentMonth && ticketDate.getFullYear() === currentYear;
    });

    const totalHours = monthTickets.reduce((sum, ticket) => {
      const start = new Date(`2000-01-01T${ticket.start_time}`);
      const end = new Date(`2000-01-01T${ticket.end_time}`);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

    const workingDays = new Set(monthTickets.map(ticket => ticket.work_date)).size;
    const avgHoursPerDay = workingDays > 0 ? totalHours / workingDays : 0;

    return {
      totalTickets: monthTickets.length,
      totalHours,
      workingDays,
      avgHoursPerDay,
      earnings: profile.hourly_rate ? totalHours * profile.hourly_rate : 0
    };
  }, [tickets, currentMonth, currentYear, profile.hourly_rate]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Calendar & Schedule</h2>
          <p className="text-gray-600">Plan your work and track your schedule</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm"
          >
            Today
          </button>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">This Month</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{monthlyStats.totalTickets}</p>
          <p className="text-sm text-blue-600">Total Tickets</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">This Month</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{monthlyStats.totalHours.toFixed(1)}</p>
          <p className="text-sm text-green-600">Total Hours</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <CalendarIcon className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">This Month</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{monthlyStats.workingDays}</p>
          <p className="text-sm text-purple-600">Working Days</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">Average</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{monthlyStats.avgHoursPerDay.toFixed(1)}</p>
          <p className="text-sm text-orange-600">Hours/Day</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  className={`
                    p-2 min-h-[80px] border border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50
                    ${!day.isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''}
                    ${day.isToday ? 'bg-cyan-50 border-cyan-200' : ''}
                    ${selectedDate?.toDateString() === day.date.toDateString() ? 'bg-cyan-100 border-cyan-300' : ''}
                  `}
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-sm font-medium ${day.isToday ? 'text-cyan-600' : ''}`}>
                      {day.date.getDate()}
                    </span>
                    
                    {day.tickets.length > 0 && (
                      <div className="flex-1 mt-1 space-y-1">
                        {day.tickets.slice(0, 2).map((ticket, ticketIndex) => {
                          const StatusIcon = getStatusIcon(ticket.status);
                          return (
                            <div
                              key={ticketIndex}
                              className={`text-xs px-1 py-0.5 rounded border ${getStatusColor(ticket.status)} flex items-center`}
                            >
                              <StatusIcon className="w-2 h-2 mr-1" />
                              <span className="truncate">{ticket.task_description.slice(0, 10)}...</span>
                            </div>
                          );
                        })}
                        {day.tickets.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{day.tickets.length - 2} more
                          </div>
                        )}
                      </div>
                    )}

                    {day.totalHours > 0 && (
                      <div className="text-xs text-gray-600 mt-1 flex items-center">
                        <Clock className="w-2 h-2 mr-1" />
                        {day.totalHours.toFixed(1)}h
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="space-y-6">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {selectedDate 
                ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
                : 'Select a date'
              }
            </h3>

            {selectedDate && selectedDayTickets.length > 0 ? (
              <div className="space-y-3">
                {selectedDayTickets.map((ticket) => {
                  const StatusIcon = getStatusIcon(ticket.status);
                  const start = new Date(`2000-01-01T${ticket.start_time}`);
                  const end = new Date(`2000-01-01T${ticket.end_time}`);
                  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                  
                  return (
                    <div key={ticket.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{ticket.task_description}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)} flex items-center`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {ticket.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {ticket.start_time} - {ticket.end_time}
                        </span>
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {hours.toFixed(1)} hours
                        </span>
                      </div>
                      {profile.hourly_rate && (
                        <div className="mt-2 text-sm font-medium text-green-600">
                          ETB {(hours * profile.hourly_rate).toFixed(2)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : selectedDate ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No tickets scheduled for this day</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Click on a date to view details</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                <Plus className="w-4 h-4" />
                <span>Schedule Task</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <CalendarIcon className="w-4 h-4" />
                <span>View Full Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
