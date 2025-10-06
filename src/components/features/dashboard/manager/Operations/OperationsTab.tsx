import { useState } from 'react';
import { Plus, FileText, Clock, Plane, X } from 'lucide-react';
import { Employee, WorkTicket, LeaveRequest, OperationsSubView } from '@types';
import TicketManagement from '@features/tickets/TicketList/TicketManagement';
import TimeTracking from './TimeTracking';
import LeaveManagement from '@features/leave/LeaveRequest/LeaveManagement';
import CreateTicket from '@components/manager/CreateTicket';

interface OperationsTabProps {
  employees: Employee[];
  tickets: WorkTicket[];
  leaveRequests: LeaveRequest[];
  onCreateTicket: (ticketData: any) => void;
  onCreateTimeEntry: (entry: any) => void;
  onUpdateTimeEntry: (entryId: string, updates: any) => void;
  onUpdateLeaveStatus: (requestId: string, status: 'approved' | 'rejected', comment?: string) => void;
}

export default function OperationsTab({
  employees,
  tickets,
  leaveRequests,
  onCreateTicket,
  onCreateTimeEntry,
  onUpdateTimeEntry,
  onUpdateLeaveStatus
}: OperationsTabProps) {
  const [activeSubView, setActiveSubView] = useState<OperationsSubView>('work-tickets');
  const [showCreateTicketPanel, setShowCreateTicketPanel] = useState(false);

  const subNavItems = [
    {
      id: 'work-tickets' as OperationsSubView,
      label: 'Work Tickets',
      icon: FileText,
      description: 'Manage and review work tickets'
    },
    {
      id: 'time-tracking' as OperationsSubView,
      label: 'Time Tracking',
      icon: Clock,
      description: 'Monitor employee time entries'
    },
    {
      id: 'leave-requests' as OperationsSubView,
      label: 'Leave Requests',
      icon: Plane,
      description: 'Review leave applications'
    }
  ];

  const handleCreateTicket = (ticketData: any) => {
    onCreateTicket(ticketData);
    setShowCreateTicketPanel(false);
  };

  const renderContent = () => {
    switch (activeSubView) {
      case 'work-tickets':
        return (
          <TicketManagement
            employees={employees}
            tickets={tickets}
          />
        );
      case 'time-tracking':
        return (
          <TimeTracking
            employees={employees}
            tickets={tickets}
            onCreateTimeEntry={onCreateTimeEntry}
            onUpdateTimeEntry={onUpdateTimeEntry}
          />
        );
      case 'leave-requests':
        return (
          <LeaveManagement
            leaveRequests={leaveRequests}
            employees={employees}
            onUpdateLeaveStatus={onUpdateLeaveStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Mobile: Compact Header, Desktop: Full Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Operations Center</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage tickets, time tracking, and leave requests</p>
        </div>
        
        {/* Desktop Log New Work Button - Hidden on mobile */}
        <button
          onClick={() => setShowCreateTicketPanel(true)}
          className="hidden sm:flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Log New Work</span>
        </button>
      </div>

      {/* Mobile: Fixed Segmented Control, Desktop: Free Navigation */}
      <div>
        {/* Mobile Segmented Control - Not sticky, positioned at top */}
        <div className="pb-3 mb-4 sm:pb-0 sm:mb-6">
          <div className="flex bg-gray-100 rounded-xl p-1 sm:hidden">
            {subNavItems.map((item) => {
              const isActive = activeSubView === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubView(item.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Navigation - Free floating */}
          <div className="hidden sm:block">
            <nav className="flex space-x-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {subNavItems.map((item) => {
                const isActive = activeSubView === item.id;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSubView(item.id)}
                    className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-300 relative ${
                      isActive
                        ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"></div>
                    )}
                    
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30' 
                        : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    
                    <div className="text-left">
                      <div className={`font-semibold ${isActive ? 'text-blue-900' : 'text-gray-800'}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area - Free floating */}
        <div>
          {renderContent()}
        </div>
      </div>

      {/* Mobile FAB - Fixed Floating Action Button */}
      <button
        onClick={() => setShowCreateTicketPanel(true)}
        className="fixed bottom-6 right-6 z-50 sm:hidden w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/40 transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Log New Work"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Ticket Center Modal */}
      {showCreateTicketPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Create Work Ticket</h2>
                    <p className="text-sm text-gray-600">Log new work for team members</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateTicketPanel(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <CreateTicket
                employees={employees}
                onCreateTicket={handleCreateTicket}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
