import { useState } from 'react';
import { TrendingUp, BarChart3, FileText, Mail, Send } from 'lucide-react';
import { Employee, WorkTicket, IntelligenceSubView } from '../../lib/types';
import PerformanceAnalytics from './PerformanceAnalytics';
import AdvancedReports from './AdvancedReports';
import DailyReports from './DailyReports';
import SendEmail from './SendEmail';

interface IntelligenceTabProps {
  employees: Employee[];
  tickets: WorkTicket[];
}

export default function IntelligenceTab({ employees, tickets }: IntelligenceTabProps) {
  const [activeView, setActiveView] = useState<IntelligenceSubView>('performance');
  const [showEmailScheduler, setShowEmailScheduler] = useState(false);

  const viewOptions = [
    {
      id: 'performance' as IntelligenceSubView,
      label: 'Performance',
      description: 'Employee performance analytics',
      icon: TrendingUp
    },
    {
      id: 'advanced' as IntelligenceSubView,
      label: 'Advanced',
      description: 'Detailed reports and insights',
      icon: BarChart3
    },
    {
      id: 'daily-report' as IntelligenceSubView,
      label: 'Daily Report',
      description: 'Daily summaries and exports',
      icon: FileText
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'performance':
        return <PerformanceAnalytics employees={employees} tickets={tickets} />;
      case 'advanced':
        return <AdvancedReports employees={employees} tickets={tickets} />;
      case 'daily-report':
        return <DailyReports employees={employees} tickets={tickets} />;
      default:
        return <PerformanceAnalytics employees={employees} tickets={tickets} />;
    }
  };

  const getCurrentViewLabel = () => {
    const currentView = viewOptions.find(v => v.id === activeView);
    return currentView?.label || 'Performance';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Premium Header with View Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Intelligence Center</h1>
          <p className="text-gray-600 mt-2">Advanced analytics and reporting dashboard</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Email Scheduler Button (visible only in Daily Report view) */}
          {activeView === 'daily-report' && (
            <button
              onClick={() => setShowEmailScheduler(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
            >
              <Send className="w-4 h-4" />
              <span>Schedule/Send Email</span>
            </button>
          )}
          
          {/* Export Report Button */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium shadow-lg transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Premium View Switcher */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* View Selector */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Report Type</h2>
                <p className="text-sm text-gray-600">Select the type of analytics to view</p>
              </div>
            </div>
            
            {/* Segmented Control */}
            <div className="flex bg-white rounded-lg p-1 shadow-inner border border-gray-200">
              {viewOptions.map((option) => {
                const isActive = activeView === option.id;
                const Icon = option.icon;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveView(option.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current View Description */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-700 font-medium">
              Currently viewing: {getCurrentViewLabel()} - {viewOptions.find(v => v.id === activeView)?.description}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Email Scheduler Modal */}
      {showEmailScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Email Scheduler</h2>
                  <p className="text-sm text-gray-600">Schedule and send daily reports</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailScheduler(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <SendEmail employees={employees} tickets={tickets} />
            </div>
          </div>
        </div>
      )}

      {/* Intelligence Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Data Points</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">1,247</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Reports Generated</p>
              <p className="text-2xl font-bold text-green-900 mt-2">156</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Insights</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">23</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Accuracy</p>
              <p className="text-2xl font-bold text-orange-900 mt-2">98.5%</p>
            </div>
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
