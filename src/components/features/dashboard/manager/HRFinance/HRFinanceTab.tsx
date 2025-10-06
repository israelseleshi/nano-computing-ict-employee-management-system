import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Employee, WorkTicket } from '@types';
import PayrollManagement from '@features/payroll/PayrollList/PayrollManagement';
import AddEmployee from '@components/manager/AddEmployee';

interface HRFinanceTabProps {
  employees: Employee[];
  tickets: WorkTicket[];
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onGeneratePayroll: (entries: any[]) => void;
  onUpdatePayrollStatus: (entryId: string, status: string) => void;
}

export default function HRFinanceTab({
  employees,
  tickets,
  onAddEmployee,
  onGeneratePayroll,
  onUpdatePayrollStatus
}: HRFinanceTabProps) {
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  const handleAddEmployee = (employeeData: Omit<Employee, 'id'>) => {
    onAddEmployee(employeeData);
    setShowAddEmployeeModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Premium Header with Action Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">HR & Finance</h1>
          <p className="text-gray-600 mt-2">Manage employees and payroll operations</p>
        </div>
        
        {/* New Hire Button */}
        <button
          onClick={() => setShowAddEmployeeModal(true)}
          className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/30 transform hover:scale-105 transition-all duration-300"
        >
          <UserPlus className="w-5 h-5" />
          <span>+ New Hire</span>
        </button>
      </div>

      {/* Payroll Management - Free floating */}
      <div>
        <PayrollManagement
          employees={employees}
          tickets={tickets}
          onGeneratePayroll={onGeneratePayroll}
          onUpdatePayrollStatus={onUpdatePayrollStatus}
        />
      </div>

      {/* Employee Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            <p className="text-xs text-gray-500 mt-1">Active workforce</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 bg-green-50 rounded-lg flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 mb-1">Monthly Payroll</p>
            <p className="text-2xl font-bold text-gray-900">ETB 45,000</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 bg-purple-50 rounded-lg flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 mb-1">Avg. Hourly Rate</p>
            <p className="text-2xl font-bold text-gray-900">ETB 150</p>
            <p className="text-xs text-gray-500 mt-1">Per hour</p>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
                  <p className="text-sm text-gray-600">Create a new employee profile</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <AddEmployee onAddEmployee={handleAddEmployee} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
