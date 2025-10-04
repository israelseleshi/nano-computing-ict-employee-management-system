import { useState, useMemo } from 'react';
import { DollarSign, Calendar, Download, Calculator, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Employee, WorkTicket } from '../../lib/types';

interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeRate: number;
  grossPay: number;
  deductions: {
    tax: number;
    pension: number;
    insurance: number;
  };
  netPay: number;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
  payDate?: string;
}

interface PayrollManagementProps {
  employees: Employee[];
  tickets: WorkTicket[];
  onGeneratePayroll: (entries: PayrollEntry[]) => void;
  onUpdatePayrollStatus: (entryId: string, status: PayrollEntry['status']) => void;
}

export default function PayrollManagement({ employees, tickets, onGeneratePayroll, onUpdatePayrollStatus }: PayrollManagementProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([]);
  const [showCalculations, setShowCalculations] = useState(false);

  // Tax and deduction rates (Ethiopian context)
  const TAX_RATES = {
    bracket1: { min: 0, max: 600, rate: 0 },
    bracket2: { min: 600, max: 1650, rate: 0.1 },
    bracket3: { min: 1650, max: 3200, rate: 0.15 },
    bracket4: { min: 3200, max: 5250, rate: 0.2 },
    bracket5: { min: 5250, max: 7800, rate: 0.25 },
    bracket6: { min: 7800, max: 10900, rate: 0.3 },
    bracket7: { min: 10900, max: Infinity, rate: 0.35 }
  };

  const PENSION_RATE = 0.07; // 7% employee contribution
  const INSURANCE_RATE = 0.03; // 3% health insurance

  // Calculate hours for a ticket
  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours > 0 ? hours : 0;
  };

  // Calculate progressive tax
  const calculateTax = (grossPay: number) => {
    let tax = 0;
    let remainingIncome = grossPay;

    Object.values(TAX_RATES).forEach(bracket => {
      if (remainingIncome > 0) {
        const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
        if (taxableInThisBracket > 0 && grossPay > bracket.min) {
          tax += taxableInThisBracket * bracket.rate;
          remainingIncome -= taxableInThisBracket;
        }
      }
    });

    return tax;
  };

  // Generate payroll for selected period
  const generatePayroll = () => {
    const [year, month] = selectedPeriod.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const periodTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.date);
      return ticketDate >= startDate && ticketDate <= endDate && ticket.status === 'approved';
    });

    const newPayrollEntries: PayrollEntry[] = employees.map(employee => {
      const employeeTickets = periodTickets.filter(t => t.employeeId === employee.id);
      
      const totalHours = employeeTickets.reduce((sum, ticket) => 
        sum + calculateHours(ticket.startTime, ticket.endTime), 0
      );

      const regularHours = Math.min(totalHours, 160); // 160 hours per month standard
      const overtimeHours = Math.max(totalHours - 160, 0);
      const regularRate = employee.hourlyRate;
      const overtimeRate = employee.hourlyRate * 1.5; // 1.5x for overtime

      const grossPay = (regularHours * regularRate) + (overtimeHours * overtimeRate);
      
      const tax = calculateTax(grossPay);
      const pension = grossPay * PENSION_RATE;
      const insurance = grossPay * INSURANCE_RATE;
      
      const totalDeductions = tax + pension + insurance;
      const netPay = grossPay - totalDeductions;

      return {
        id: `payroll-${employee.id}-${selectedPeriod}`,
        employeeId: employee.id,
        employeeName: employee.name,
        period: selectedPeriod,
        regularHours,
        overtimeHours,
        regularRate,
        overtimeRate,
        grossPay,
        deductions: {
          tax,
          pension,
          insurance
        },
        netPay,
        status: 'calculated' as const
      };
    });

    setPayrollEntries(newPayrollEntries);
    onGeneratePayroll(newPayrollEntries);
    setShowCalculations(true);
  };

  // Update payroll status
  const updateStatus = (entryId: string, status: PayrollEntry['status']) => {
    setPayrollEntries(entries => 
      entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, status, payDate: status === 'paid' ? new Date().toISOString().split('T')[0] : entry.payDate }
          : entry
      )
    );
    onUpdatePayrollStatus(entryId, status);
  };

  // Calculate totals
  const totals = useMemo(() => {
    return payrollEntries.reduce((acc, entry) => ({
      grossPay: acc.grossPay + entry.grossPay,
      netPay: acc.netPay + entry.netPay,
      totalDeductions: acc.totalDeductions + (entry.deductions.tax + entry.deductions.pension + entry.deductions.insurance),
      totalHours: acc.totalHours + entry.regularHours + entry.overtimeHours
    }), { grossPay: 0, netPay: 0, totalDeductions: 0, totalHours: 0 });
  }, [payrollEntries]);

  // Get status styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'calculated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paid':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'calculated':
        return <Calculator className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'paid':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-2">Calculate and manage employee payments with Ethiopian tax compliance</p>
        </div>
      </div>

      {/* Period Selection & Generation */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Generate Payroll</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Pay Period:</label>
              <input
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button
              onClick={generatePayroll}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              <span>Generate Payroll</span>
            </button>
          </div>
        </div>

        {/* Tax Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Ethiopian Tax & Deduction Rates</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-800">Income Tax:</p>
              <p className="text-blue-700">Progressive rates: 0% - 35%</p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Pension Contribution:</p>
              <p className="text-blue-700">7% of gross salary</p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Health Insurance:</p>
              <p className="text-blue-700">3% of gross salary</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Summary */}
      {showCalculations && payrollEntries.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Gross Pay</p>
                  <p className="text-2xl font-bold text-blue-900">ETB {totals.grossPay.toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Total Deductions</p>
                  <p className="text-2xl font-bold text-red-900">ETB {totals.totalDeductions.toFixed(0)}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Net Pay</p>
                  <p className="text-2xl font-bold text-green-900">ETB {totals.netPay.toFixed(0)}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Hours</p>
                  <p className="text-2xl font-bold text-purple-900">{totals.totalHours.toFixed(1)}h</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Payroll Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Payroll Details - {selectedPeriod}</h3>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve All</span>
                </button>
              </div>
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
                      Gross Pay
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Pay
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
                  {payrollEntries.map(entry => {
                    const totalDeductions = entry.deductions.tax + entry.deductions.pension + entry.deductions.insurance;
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {entry.employeeName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{entry.employeeName}</p>
                              <p className="text-sm text-gray-500">ETB {entry.regularRate}/hr</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Regular: {entry.regularHours.toFixed(1)}h
                            </p>
                            {entry.overtimeHours > 0 && (
                              <p className="text-sm text-orange-600">
                                Overtime: {entry.overtimeHours.toFixed(1)}h
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            ETB {entry.grossPay.toFixed(0)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-900">ETB {totalDeductions.toFixed(0)}</p>
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>Tax: ETB {entry.deductions.tax.toFixed(0)}</p>
                              <p>Pension: ETB {entry.deductions.pension.toFixed(0)}</p>
                              <p>Insurance: ETB {entry.deductions.insurance.toFixed(0)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-green-600">
                            ETB {entry.netPay.toFixed(0)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(entry.status)}`}>
                            {getStatusIcon(entry.status)}
                            <span>{entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            {entry.status === 'calculated' && (
                              <button
                                onClick={() => updateStatus(entry.id, 'approved')}
                                className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {entry.status === 'approved' && (
                              <button
                                onClick={() => updateStatus(entry.id, 'paid')}
                                className="px-3 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-colors"
                              >
                                Mark Paid
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
