import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@lib/firebase/config';
import { firebaseService } from '@services/firebase/consolidated.service';
import { Eye, EyeOff, Mail, Lock, User, Building2, AlertCircle, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  error: string | null;
}

export default function Login({ onLogin, error: externalError }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [error, setError] = useState<string | null>(externalError);

  const demoCredentials = [
    {
      role: 'Manager',
      email: 'manager@nanocomputing.com',
      password: 'demo123',
      description: 'Full access to all features'
    },
    {
      role: 'Employee',
      email: 'john@nanocomputing.com',
      password: 'demo123',
      description: 'View personal timesheet and tickets'
    }
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Handle sign up
        if (password !== confirmPassword) {
          setError('Passwords do not match!');
          setIsLoading(false);
          return;
        }
        if (!fullName || !department) {
          setError('Please fill in all fields!');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
        
        // Create user profile in Firestore
        const userDoc = {
          id: userId,
          email: email,
          role: 'employee' as const,
          createdAt: new Date().toISOString(),
          profile: {
            fullName: fullName,
            department: department,
            position: 'Employee',
            hourlyRate: 1500,
            hireDate: new Date().toISOString(),
            phone: '',
            address: '',
            skills: [],
            emergencyContact: {
              name: '',
              phone: '',
              relationship: ''
            },
            avatar: '',
            bio: '',
            status: 'active' as const
          },
          leaveBalance: {
            year: new Date().getFullYear(),
            vacation: { total: 22, used: 0, available: 22 },
            sick: { total: 10, used: 0, available: 10 },
            personal: { total: 5, used: 0, available: 5 }
          }
        };
        
        // Save to Firestore
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@lib/firebase/config');
        await setDoc(doc(db, 'users', userId), userDoc);
        
        console.log('User created successfully');
      } else {
        // Handle sign in
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      
      // Handle Firebase auth errors
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="text-gray-800 space-y-6 animate-fade-in">
          <div className="flex items-center space-x-4 mb-8">
            <img 
              src="/logo.jpg" 
              alt="Nano Computing Logo" 
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Nano Computing</h1>
              <p className="text-gray-600 text-sm sm:text-base">ICT Employee Management</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Streamline your workforce management with our comprehensive employee tracking system.
              Manage timesheets, generate reports, and monitor productivity all in one place.
            </p>
          </div>

        </div>

        <div className="p-8 animate-scale-in">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{isSignUp ? 'Create Your Account' : 'Sign In to Your Account'}</h3>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-slide-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Authentication Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {isSignUp && (
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 appearance-none bg-white text-gray-900"
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
            )}

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
            
            {!isSignUp && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                  onClick={() => alert('Forgot password functionality would be implemented here')}
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>

          {!isSignUp && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Quick Demo Access</span>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <button
                  type="button"
                  onClick={() => setShowDemo(!showDemo)}
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                >
                  {showDemo ? 'Hide' : 'Show'} Demo Credentials
                </button>
              </div>
            </>
          )}

          {!isSignUp && showDemo && (
            <div className="space-y-3 mb-6">
              {demoCredentials.map((demo, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDemoLogin(demo.email, demo.password)}
                  className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:from-gray-100 hover:to-gray-200 hover:shadow-lg transition-all duration-200 text-left hover:scale-[1.02] group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 text-lg">{demo.role}</span>
                    <span className="text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full font-medium group-hover:shadow-md transition-all">
                      Try Demo
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1 font-medium">{demo.email}</div>
                  <div className="text-xs text-gray-600">{demo.description}</div>
                </button>
              ))}
            </div>
          )}

          {!isSignUp && showDemo && (
            <p className="text-center text-sm text-gray-500 mb-6">
              Demo password for all accounts: <span className="font-semibold text-cyan-600">demo123</span>
            </p>
          )}
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
