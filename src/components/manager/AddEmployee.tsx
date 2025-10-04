import { useState } from 'react';
import { User, Mail, Building2, CheckCircle2 } from 'lucide-react';
import { Employee } from '../../lib/types';

interface AddEmployeeProps {
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
}

export default function AddEmployee({ onAddEmployee }: AddEmployeeProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hourlyRate: '',
    department: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const departments = [
    'Development',
    'Design',
    'Project Management',
    'QA Testing',
    'DevOps',
    'Marketing',
    'Sales',
    'Human Resources'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEmployee = {
      name: formData.name,
      email: formData.email,
      hourlyRate: parseFloat(formData.hourlyRate),
      department: formData.department
    };

    onAddEmployee(newEmployee);

    setFormData({
      name: '',
      email: '',
      hourlyRate: '',
      department: ''
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isFormValid = formData.name && formData.email && formData.hourlyRate && formData.department;

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Employee</h2>
        <p className="text-gray-600">Enter employee details to add them to the system</p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Employee Added Successfully!</p>
            <p className="text-sm text-green-700">The new employee has been added to the system.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter employee's full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="employee@nanocomputing.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hourly Rate (ETB)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">ETB</span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="1200.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                isFormValid
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02]'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Add Employee
            </button>
          </div>
      </form>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Note:</span> In production, this form will integrate with your backend API
          to store employee data in the database. Currently using mock data for demonstration.
        </p>
      </div>
    </div>
  );
}
