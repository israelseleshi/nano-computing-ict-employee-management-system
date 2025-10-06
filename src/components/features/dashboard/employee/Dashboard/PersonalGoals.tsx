import { useState, useMemo } from 'react';
import { Target, TrendingUp, Calendar, Clock, DollarSign, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Profile, WorkTicketDB } from '@services/api/mock.service';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: 'hours' | 'tickets' | 'earnings';
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
  createdAt: string;
  progress?: number;
}

interface PersonalGoalsProps {
  profile: Profile;
  tickets: WorkTicketDB[];
}

export default function PersonalGoals({ profile, tickets }: PersonalGoalsProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Monthly Hours Target',
      description: 'Complete 160 hours of work this month',
      targetValue: 160,
      currentValue: 0,
      unit: 'hours',
      deadline: '2024-01-31',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      title: 'Task Completion Goal',
      description: 'Complete 25 work tickets this month',
      targetValue: 25,
      currentValue: 0,
      unit: 'tickets',
      deadline: '2024-01-31',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      title: 'Earnings Milestone',
      description: 'Earn ETB 240,000 this month',
      targetValue: 240000,
      currentValue: 0,
      unit: 'earnings',
      deadline: '2024-01-31',
      status: 'active',
      createdAt: '2024-01-01'
    }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: '',
    unit: 'hours' as Goal['unit'],
    deadline: ''
  });

  // Calculate current progress based on tickets
  const currentMonthTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.work_date);
    const currentDate = new Date();
    return ticketDate.getMonth() === currentDate.getMonth() && 
           ticketDate.getFullYear() === currentDate.getFullYear();
  });

  const currentStats = useMemo(() => {
    const totalHours = currentMonthTickets.reduce((sum, ticket) => {
      const start = new Date(`2000-01-01T${ticket.start_time}`);
      const end = new Date(`2000-01-01T${ticket.end_time}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    const totalTickets = currentMonthTickets.length;
    const totalEarnings = profile.hourly_rate ? totalHours * profile.hourly_rate : 0;

    return { totalHours, totalTickets, totalEarnings };
  }, [currentMonthTickets, profile.hourly_rate]);

  // Update goals with current progress
  const updatedGoals = goals.map(goal => {
    let currentValue = 0;
    switch (goal.unit) {
      case 'hours':
        currentValue = currentStats.totalHours;
        break;
      case 'tickets':
        currentValue = currentStats.totalTickets;
        break;
      case 'earnings':
        currentValue = currentStats.totalEarnings;
        break;
    }

    const progress = Math.min((currentValue / goal.targetValue) * 100, 100);
    const isOverdue = new Date(goal.deadline) < new Date() && progress < 100;
    const isCompleted = progress >= 100;

    return {
      ...goal,
      currentValue,
      progress,
      status: (isCompleted ? 'completed' : isOverdue ? 'overdue' : 'active') as Goal['status']
    };
  });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.deadline) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetValue: parseFloat(newGoal.targetValue),
      currentValue: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', targetValue: '', unit: 'hours', deadline: '' });
    setShowAddGoal(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getUnitIcon = (unit: Goal['unit']) => {
    switch (unit) {
      case 'hours': return Clock;
      case 'tickets': return CheckCircle2;
      case 'earnings': return DollarSign;
    }
  };


  const formatValue = (value: number, unit: Goal['unit']) => {
    switch (unit) {
      case 'hours': return `${value.toFixed(1)} hours`;
      case 'tickets': return `${Math.floor(value)} tickets`;
      case 'earnings': return `ETB ${value.toFixed(2)}`;
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'active': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getProgressColor = (progress: number, status: Goal['status']) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'overdue') return 'bg-red-500';
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Goals & Performance</h2>
          <p className="text-gray-600">Track your progress and achieve your targets</p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-sm font-medium text-blue-600 mb-1">Hours This Month</h3>
          <p className="text-2xl font-bold text-blue-900">{currentStats.totalHours.toFixed(1)}</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-sm font-medium text-purple-600 mb-1">Tickets Completed</h3>
          <p className="text-2xl font-bold text-purple-900">{currentStats.totalTickets}</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-green-600 mb-1">Earnings This Month</h3>
          <p className="text-2xl font-bold text-green-900">ETB {currentStats.totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-cyan-600" />
          Active Goals
        </h3>

        {updatedGoals.map((goal) => {
          const UnitIcon = getUnitIcon(goal.unit);
          return (
            <div key={goal.id} className="p-6 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <UnitIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{goal.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                        {goal.status === 'completed' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                        {goal.status === 'overdue' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                        {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    {formatValue(goal.currentValue, goal.unit)} / {formatValue(goal.targetValue, goal.unit)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(goal.progress || 0, goal.status as Goal['status'])}`}
                    style={{ width: `${Math.min(goal.progress || 0, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span className="font-medium">{(goal.progress || 0).toFixed(1)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Goal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter goal title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows={3}
                  placeholder="Describe your goal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                  <input
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value as Goal['unit'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="hours">Hours</option>
                    <option value="tickets">Tickets</option>
                    <option value="earnings">Earnings (ETB)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddGoal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
